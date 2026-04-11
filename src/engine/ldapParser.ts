import type { LdapFilter } from './types';

class LDAPParseError extends Error {
  pos: number;
  constructor(msg: string, pos: number) {
    super(msg);
    this.pos = pos;
  }
}

export function parseLdapFilter(input: string): LdapFilter {
  const s = input.trim();
  if (!s) throw new LDAPParseError('Filter cannot be empty', 0);

  let pos = 0;

  function peek(): string { return s[pos]; }

  function consume(ch: string): void {
    if (s[pos] !== ch) {
      throw new LDAPParseError(
        `Expected '${ch}' but got '${s[pos] || 'end'}' at position ${pos}`,
        pos
      );
    }
    pos++;
  }

  function parseFilter(): LdapFilter {
    if (peek() !== '(') {
      throw new LDAPParseError(
        `Expected '(' at position ${pos}. Filters must be wrapped in parentheses.`,
        pos
      );
    }
    consume('(');
    const node = parseFilterComp();
    if (peek() !== ')') {
      throw new LDAPParseError(
        `Expected closing ')' at position ${pos}. Check that your parentheses are balanced.`,
        pos
      );
    }
    consume(')');
    return node;
  }

  function parseFilterComp(): LdapFilter {
    const ch = peek();
    if (ch === '&') {
      pos++;
      const filters = parseFilterList();
      return { type: 'and', filters };
    } else if (ch === '|') {
      pos++;
      const filters = parseFilterList();
      return { type: 'or', filters };
    } else if (ch === '!') {
      pos++;
      const filter = parseFilter();
      return { type: 'not', filter };
    } else {
      return parseItem();
    }
  }

  function parseFilterList(): LdapFilter[] {
    const filters: LdapFilter[] = [];
    while (peek() === '(') {
      filters.push(parseFilter());
    }
    if (filters.length === 0) {
      throw new LDAPParseError('AND/OR operator requires at least one filter inside', pos);
    }
    return filters;
  }

  function parseItem(): LdapFilter {
    // Read attribute name
    let attr = '';
    while (pos < s.length && s[pos] !== '=' && s[pos] !== '>' && s[pos] !== '<' && s[pos] !== '~' && s[pos] !== ')') {
      attr += s[pos++];
    }
    attr = attr.trim();
    if (!attr) throw new LDAPParseError(`Missing attribute name at position ${pos}`, pos);

    // Read operator
    let op: '=' | '>=' | '<=' | '~=' = '=';
    if (s[pos] === '>') { op = '>='; pos++; consume('='); }
    else if (s[pos] === '<') { op = '<='; pos++; consume('='); }
    else if (s[pos] === '~') { op = '~='; pos++; consume('='); }
    else { consume('='); }

    // Read value (everything up to closing paren, handle nested parens for member DNs)
    let value = '';
    let depth = 0;
    while (pos < s.length) {
      if (s[pos] === '(') { depth++; value += s[pos++]; }
      else if (s[pos] === ')' && depth > 0) { depth--; value += s[pos++]; }
      else if (s[pos] === ')' && depth === 0) { break; }
      else { value += s[pos++]; }
    }

    return { type: 'item', attr, op, value };
  }

  const ast = parseFilter();
  if (pos < s.length) {
    throw new LDAPParseError(
      `Unexpected characters after filter: '${s.slice(pos)}'. Make sure the entire filter is wrapped in parentheses.`,
      pos
    );
  }
  return ast;
}
