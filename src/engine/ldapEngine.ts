import type { LdapEntry, LdapFilter, LdapScope } from './types';
import { parseLdapFilter } from './ldapParser';

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function matchesSingle(entryVal: string, filterVal: string): boolean {
  const ev = entryVal.toLowerCase();
  const fv = filterVal.toLowerCase();

  // Presence
  if (fv === '*') return true;

  // No wildcards — exact match
  if (!fv.includes('*')) return ev === fv;

  // Wildcard matching — convert to regex
  const parts = fv.split('*');
  let regex = '^';
  for (let i = 0; i < parts.length; i++) {
    regex += escapeRegex(parts[i]);
    if (i < parts.length - 1) regex += '.*';
  }
  regex += '$';
  return new RegExp(regex).test(ev);
}

function matchesValue(entryVal: string | string[], filterVal: string): boolean {
  const vals = Array.isArray(entryVal) ? entryVal : [entryVal];
  return vals.some(v => matchesSingle(String(v), filterVal));
}

function compareValues(entryVal: string | string[], filterVal: string, op: '>=' | '<='): boolean {
  const vals = Array.isArray(entryVal) ? entryVal : [entryVal];
  return vals.some(v => {
    const ev = String(v).toLowerCase();
    const fv = filterVal.toLowerCase();
    if (op === '>=') return ev >= fv;
    if (op === '<=') return ev <= fv;
    return false;
  });
}

function applyFilter(entry: LdapEntry, ast: LdapFilter): boolean {
  if (ast.type === 'and') {
    return ast.filters.every(f => applyFilter(entry, f));
  }
  if (ast.type === 'or') {
    return ast.filters.some(f => applyFilter(entry, f));
  }
  if (ast.type === 'not') {
    return !applyFilter(entry, ast.filter);
  }
  if (ast.type === 'item') {
    const attrKey = Object.keys(entry.attributes).find(
      k => k.toLowerCase() === ast.attr.toLowerCase()
    );
    if (!attrKey) {
      return false; // attribute not present
    }
    const entryVal = entry.attributes[attrKey];
    if (ast.op === '=') return matchesValue(entryVal, ast.value);
    if (ast.op === '>=' || ast.op === '<=') return compareValues(entryVal, ast.value, ast.op);
    if (ast.op === '~=') return matchesValue(entryVal, ast.value); // approx = equality for simplicity
    return false;
  }
  return false;
}

function isDescendantOf(dn: string, baseDN: string): boolean {
  const dnL = dn.toLowerCase();
  const baseL = baseDN.toLowerCase();
  return dnL === baseL || dnL.endsWith(',' + baseL);
}

function isDirectChild(dn: string, baseDN: string): boolean {
  const dnL = dn.toLowerCase();
  const baseL = baseDN.toLowerCase();
  if (!dnL.endsWith(',' + baseL)) return false;
  const prefix = dnL.slice(0, dnL.length - baseL.length - 1);
  return !prefix.includes(',');
}

export function executeFilter(
  entries: LdapEntry[],
  filterStr: string,
  baseDN: string,
  scope: LdapScope
): LdapEntry[] {
  // 1. Parse filter
  const ast = parseLdapFilter(filterStr);

  // 2. Filter by scope
  let scoped: LdapEntry[];
  if (scope === 'base') {
    scoped = entries.filter(e => e.dn.toLowerCase() === baseDN.toLowerCase());
  } else if (scope === 'one') {
    scoped = entries.filter(e => isDirectChild(e.dn, baseDN));
  } else {
    // sub
    scoped = entries.filter(e => isDescendantOf(e.dn, baseDN));
  }

  // 3. Apply filter
  return scoped.filter(e => applyFilter(e, ast));
}
