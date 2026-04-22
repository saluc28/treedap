import type { LdapEntry, LdapFilter, LdapScope } from './types';
import { parseLdapFilter } from './ldapParser';

export interface Diagnostic {
  severity: 'hint' | 'warning';
  message: string;
}

interface Ctx {
  ast: LdapFilter;
  attrsUsed: Set<string>;
  directory: LdapEntry[];
  baseDN: string;
  scope: LdapScope;
  results: LdapEntry[];
  allResults: LdapEntry[];
  expectedCount?: number;
}

function collectAttrs(f: LdapFilter, out: Set<string>): void {
  if (f.type === 'and' || f.type === 'or') {
    f.filters.forEach((c) => collectAttrs(c, out));
  } else if (f.type === 'not') {
    collectAttrs(f.filter, out);
  } else {
    out.add(f.attr.toLowerCase());
  }
}

function directoryHasAttr(directory: LdapEntry[], attr: string): boolean {
  const lc = attr.toLowerCase();
  return directory.some((e) =>
    Object.keys(e.attributes).some((k) => k.toLowerCase() === lc)
  );
}

type Rule = (ctx: Ctx) => Diagnostic | null;

const rules: Rule[] = [
  // 1. uid used in a tree where sAMAccountName is the login attr (both exist).
  ({ attrsUsed, directory }) => {
    if (!attrsUsed.has('uid')) return null;
    if (!directoryHasAttr(directory, 'sAMAccountName')) return null;
    if (!directoryHasAttr(directory, 'uid')) {
      return {
        severity: 'hint',
        message:
          "You're filtering on `uid`, but no entry in this directory has a `uid` attribute. This looks like an AD-synced tree. Try `sAMAccountName` instead.",
      };
    }
    return null;
  },

  // 2. No objectClass in a broad filter - common anti-pattern.
  ({ ast, attrsUsed, results }) => {
    if (attrsUsed.has('objectclass')) return null;
    if (results.length <= 1) return null;
    if (ast.type === 'item' && ast.op === '=') {
      return {
        severity: 'hint',
        message:
          'Without an `(objectClass=...)` clause your filter may match entries of unrelated types. Combine it: `(&(objectClass=inetOrgPerson)(...))`.',
      };
    }
    return null;
  },

  // 3. Referenced attr not present anywhere in the directory (likely typo).
  ({ attrsUsed, directory }) => {
    for (const a of attrsUsed) {
      if (!directoryHasAttr(directory, a)) {
        return {
          severity: 'warning',
          message: `No entry in the directory has the attribute \`${a}\`. Check for a typo, a different naming convention (\`uid\` vs \`sAMAccountName\`, \`member\` vs \`memberOf\`), or a schema mismatch.`,
        };
      }
    }
    return null;
  },

  // 4. Zero results in scope but non-zero outside scope - scope/base mismatch.
  ({ results, allResults, baseDN, scope }) => {
    if (results.length > 0) return null;
    if (allResults.length === 0) return null;
    return {
      severity: 'warning',
      message: `Your filter matches ${allResults.length} entries globally but 0 within baseDN \`${baseDN}\` at scope \`${scope}\`. The matches are elsewhere in the tree - recheck baseDN or widen the scope.`,
    };
  },

  // 5. scope=base returns exactly 0/1 - remind that base only looks at the baseDN itself.
  ({ results, scope }) => {
    if (scope !== 'base') return null;
    if (results.length > 1) return null;
    return {
      severity: 'hint',
      message:
        'Scope `base` only evaluates the baseDN entry itself, not its children. If you expected to traverse the subtree, switch scope to `sub`.',
    };
  },

  // 6. Filter matches a LOT more than expected - missing AND clause.
  ({ results, expectedCount }) => {
    if (expectedCount == null) return null;
    if (results.length <= expectedCount) return null;
    if (results.length < expectedCount * 2) return null;
    return {
      severity: 'hint',
      message: `Your filter returns ${results.length} entries but the task expects ${expectedCount}. You probably need an additional AND clause to narrow the set.`,
    };
  },

  // 7. Expected > actual - filter too narrow, maybe wrong op or wildcard missing.
  ({ results, expectedCount, ast }) => {
    if (expectedCount == null) return null;
    if (results.length >= expectedCount) return null;
    if (results.length === 0) return null;
    const hasWildcard = JSON.stringify(ast).includes('*');
    if (!hasWildcard) {
      return {
        severity: 'hint',
        message: `Only ${results.length} of ${expectedCount} expected entries match. If you're matching an exact value, a wildcard (e.g., \`cn=ws-*\`) may be needed.`,
      };
    }
    return null;
  },
];

export function diagnose(opts: {
  filter: string;
  directory: LdapEntry[];
  baseDN: string;
  scope: LdapScope;
  results: LdapEntry[];
  allResults: LdapEntry[];
  expectedCount?: number;
}): Diagnostic | null {
  let ast: LdapFilter;
  try {
    ast = parseLdapFilter(opts.filter);
  } catch {
    return null;
  }
  const attrsUsed = new Set<string>();
  collectAttrs(ast, attrsUsed);
  const ctx: Ctx = {
    ast,
    attrsUsed,
    directory: opts.directory,
    baseDN: opts.baseDN,
    scope: opts.scope,
    results: opts.results,
    allResults: opts.allResults,
    expectedCount: opts.expectedCount,
  };
  for (const r of rules) {
    const d = r(ctx);
    if (d) return d;
  }
  return null;
}
