import { useCallback, useEffect, useMemo, useState } from 'react';
import type { KeyboardEvent } from 'react';
import { DIRECTORY } from '../../data/directory';
import { executeFilter } from '../../engine/ldapEngine';
import type { LdapEntry, LdapScope } from '../../engine/types';
import { DirectoryTree } from '../level/DirectoryTree';
import { MobileWall } from '../MobileWall';

interface FreeModeProps {
  onBack: () => void;
}

const BASE_DN_OPTIONS = [
  'dc=treedap,dc=com',
  'ou=People,dc=treedap,dc=com',
  'ou=Contractors,ou=People,dc=treedap,dc=com',
  'ou=Groups,dc=treedap,dc=com',
  'ou=Services,dc=treedap,dc=com',
  'ou=Computers,dc=treedap,dc=com',
  'ou=Workstations,ou=Computers,dc=treedap,dc=com',
  'ou=Servers,ou=Computers,dc=treedap,dc=com',
];

const EXAMPLES: { label: string; filter: string }[] = [
  { label: 'All people',            filter: '(objectClass=inetOrgPerson)' },
  { label: 'All groups',            filter: '(objectClass=groupOfNames)' },
  { label: 'Workstations only',     filter: '(&(objectClass=device)(cn=ws-*))' },
  { label: 'Missing manager',       filter: '(&(objectClass=inetOrgPerson)(!(manager=*)))' },
  { label: 'Locked accounts',       filter: '(&(objectClass=inetOrgPerson)(pwdAccountLockedTime=*))' },
  { label: 'Domain Users (AD RID)', filter: '(&(objectClass=inetOrgPerson)(primaryGroupID=513))' },
];

export function FreeMode({ onBack }: FreeModeProps) {
  const [filter, setFilter] = useState<string>('(objectClass=inetOrgPerson)');
  const [baseDN, setBaseDN] = useState<string>('dc=treedap,dc=com');
  const [scope, setScope] = useState<LdapScope>('sub');
  const [results, setResults] = useState<LdapEntry[] | null>(null);
  const [parseError, setParseError] = useState<string | null>(null);
  const [selectedDn, setSelectedDn] = useState<string | null>(null);
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(
    () => new Set(DIRECTORY.map(e => e.dn.toLowerCase()))
  );

  useEffect(() => {
    document.documentElement.classList.remove('hide-shell');
  }, []);

  const matchedDns = useMemo(() => {
    if (!results) return new Set<string>();
    return new Set(results.map(e => e.dn.toLowerCase()));
  }, [results]);

  const runQuery = useCallback(() => {
    const trimmed = filter.trim();
    if (!trimmed) {
      setParseError('Enter a filter first.');
      setResults(null);
      return;
    }
    try {
      const out = executeFilter(DIRECTORY, trimmed, baseDN, scope);
      setResults(out);
      setParseError(null);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setParseError(msg);
      setResults(null);
    }
  }, [filter, baseDN, scope]);

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      runQuery();
    }
  };

  const toggleNode = (dn: string) => {
    setExpandedNodes(prev => {
      const next = new Set(prev);
      const key = dn.toLowerCase();
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const expandAll = () => {
    setExpandedNodes(new Set(DIRECTORY.map(e => e.dn.toLowerCase())));
  };

  return (
    <div id="screen-free-mode" className="screen">

      <MobileWall />

      {/* Header */}
      <header className="level-header">
        <div className="level-header-left">
          <button className="btn btn-ghost btn-sm lv-dashboard-btn" onClick={onBack}>
            <img src="/logo.svg" alt="" className="lv-dashboard-logo" />
            Dashboard
          </button>
          <div>
            <div className="level-header-title">Free Mode</div>
            <div className="level-header-sub">
              Directory sandbox - no objectives, no stars
            </div>
          </div>
        </div>
      </header>

      {/* Body */}
      <main className="level-body">
        <div className="level-workspace">
          {/* Left: Directory Tree */}
          <DirectoryTree
            entries={DIRECTORY}
            matchedDns={matchedDns}
            selectedDn={selectedDn}
            onSelectEntry={(dn) => setSelectedDn(prev => (prev?.toLowerCase() === dn.toLowerCase() ? null : dn))}
            expandedNodes={expandedNodes}
            onToggleNode={toggleNode}
            onExpandAll={expandAll}
          />

          {/* Right: Query + Results */}
          <div className="query-panel">

            <div className="query-editor-section">
              <div className="query-meta">
                <div className="query-scope-info fm-controls">
                  <label>
                    Base:
                    <select
                      className="fm-select"
                      value={baseDN}
                      onChange={(e) => setBaseDN(e.target.value)}
                    >
                      {BASE_DN_OPTIONS.map(dn => (
                        <option key={dn} value={dn}>{dn}</option>
                      ))}
                    </select>
                  </label>
                  <label>
                    Scope:
                    <select
                      className="fm-select"
                      value={scope}
                      onChange={(e) => setScope(e.target.value as LdapScope)}
                    >
                      <option value="base">base</option>
                      <option value="one">one</option>
                      <option value="sub">sub</option>
                    </select>
                  </label>
                </div>
                <span className="text-secondary" style={{ fontSize: '12px' }}>
                  <span className="kbd">Ctrl</span>+<span className="kbd">Enter</span> to run
                </span>
              </div>

              <div className="editor-wrapper">
                <textarea
                  className="query-textarea"
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Enter LDAP filter... e.g. (objectClass=inetOrgPerson)"
                  spellCheck={false}
                  autoComplete="off"
                  autoCorrect="off"
                />
                <div className="editor-footer">
                  <span className="char-count">{filter.length} chars</span>
                  <div className="query-actions">
                    <button className="btn btn-ghost btn-sm" onClick={() => setFilter('')}>
                      ✕ Clear
                    </button>
                    <button className="btn btn-primary btn-sm" onClick={runQuery}>
                      ▶ Run Query
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Examples */}
            <div className="fm-examples">
              <div className="fm-examples-label">Examples</div>
              <div className="fm-examples-row">
                {EXAMPLES.map(ex => (
                  <button
                    key={ex.label}
                    className="fm-example-chip"
                    onClick={() => setFilter(ex.filter)}
                    title={ex.filter}
                  >
                    {ex.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Results */}
            <div className="results-section">
              <div className="panel-header">
                <span>Results</span>
                {results != null && (
                  <span className="text-secondary" style={{ fontSize: '12px' }}>
                    {results.length} {results.length === 1 ? 'entry' : 'entries'}
                  </span>
                )}
              </div>

              {parseError && (
                <div className="feedback feedback-error">
                  <strong>Parse error:</strong> {parseError}
                </div>
              )}

              {!parseError && results == null && (
                <div className="fm-empty">Run a filter to see matching entries here.</div>
              )}

              {!parseError && results != null && results.length === 0 && (
                <div className="fm-empty">No entries match this filter under the chosen baseDN and scope.</div>
              )}

              {!parseError && results != null && results.length > 0 && (
                <ul className="fm-result-list">
                  {results.map(e => (
                    <li
                      key={e.dn}
                      className={`fm-result-item${selectedDn?.toLowerCase() === e.dn.toLowerCase() ? ' selected' : ''}`}
                      onClick={() => setSelectedDn(e.dn)}
                    >
                      {e.dn}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
