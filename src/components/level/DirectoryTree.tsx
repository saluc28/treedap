import { useState } from 'react';
import type { MouseEvent } from 'react';
import type { LdapEntry } from '../../engine/types';

interface DirectoryTreeProps {
  entries: LdapEntry[];
  matchedDns: Set<string>;
  selectedDn: string | null;
  onSelectEntry: (dn: string) => void;
  expandedNodes: Set<string>;
  onToggleNode: (dn: string) => void;
  onExpandAll: () => void;
}

interface TreeNode {
  dn: string;
  children: string[];
  entry: LdapEntry;
}

interface TreeMap {
  [key: string]: TreeNode;
}

function getNodeIcon(dn: string): string {
  const dnL = dn.toLowerCase();
  if (dnL === 'dc=acme,dc=com') return '🏢';
  if (dnL.startsWith('ou=')) return '📁';
  if (dnL.startsWith('uid=')) return '👤';
  if (dnL.startsWith('cn=') && dnL.includes('ou=groups')) return '👥';
  if (dnL.startsWith('cn=') && dnL.includes('ou=services')) return '⚙️';
  return '📄';
}

function buildTree(entries: LdapEntry[]): { map: TreeMap; roots: string[] } {
  const map: TreeMap = {};
  const roots: string[] = [];
  entries.forEach(e => {
    map[e.dn.toLowerCase()] = { dn: e.dn, entry: e, children: [] };
  });
  entries.forEach(e => {
    const dnParts = e.dn.split(',');
    if (dnParts.length === 1) { roots.push(e.dn); return; }
    const parentDN = dnParts.slice(1).join(',');
    const parentNode = map[parentDN.toLowerCase()];
    if (parentNode) parentNode.children.push(e.dn);
    else roots.push(e.dn);
  });
  return { map, roots };
}

// ── Normal mode ──────────────────────────────────────────────────────────────

interface TreeNodeViewProps {
  dn: string;
  map: TreeMap;
  depth: number;
  matchedDns: Set<string>;
  selectedDn: string | null;
  onSelectEntry: (dn: string) => void;
  expandedNodes: Set<string>;
  onToggleNode: (dn: string) => void;
}

function TreeNodeView({ dn, map, depth, matchedDns, selectedDn, onSelectEntry, expandedNodes, onToggleNode }: TreeNodeViewProps) {
  const node = map[dn.toLowerCase()];
  if (!node) return null;
  const { entry, children } = node;
  const isExpanded = expandedNodes.has(dn.toLowerCase());
  const isMatched = matchedDns.has(dn.toLowerCase());
  const isSelected = selectedDn?.toLowerCase() === dn.toLowerCase();

  let rowCls = 'tree-node-row';
  if (isSelected) rowCls += ' selected';
  if (isMatched) rowCls += ' matched';

  const handleRowClick = () => {
    if (children.length > 0) onToggleNode(dn.toLowerCase());
    onSelectEntry(entry.dn);
  };
  const handleToggleClick = (e: MouseEvent) => { e.stopPropagation(); onToggleNode(dn.toLowerCase()); };

  return (
    <div className="tree-node">
      <div className={rowCls} style={{ paddingLeft: `${12 + depth * 18}px` }} data-dn={entry.dn} onClick={handleRowClick}>
        <span className={`tree-toggle${children.length === 0 ? ' leaf' : ''}${isExpanded ? ' open' : ''}`} onClick={children.length > 0 ? handleToggleClick : undefined}>▶</span>
        <span className="tree-icon">{getNodeIcon(entry.dn)}</span>
        <span className="tree-label" title={entry.dn}>{entry.dn.split(',')[0]}</span>
      </div>
      {children.length > 0 && (
        <div className="tree-children" style={{ maxHeight: isExpanded ? '10000px' : '0' }}>
          {children.map(childDn => (
            <TreeNodeView key={childDn} dn={childDn} map={map} depth={depth + 1}
              matchedDns={matchedDns} selectedDn={selectedDn} onSelectEntry={onSelectEntry}
              expandedNodes={expandedNodes} onToggleNode={onToggleNode} />
          ))}
        </div>
      )}
    </div>
  );
}

// ── Visual mode ──────────────────────────────────────────────────────────────

interface VisualNodeProps {
  dn: string;
  map: TreeMap;
  matchedDns: Set<string>;
  selectedDn: string | null;
  onSelectEntry: (dn: string) => void;
  expandedNodes: Set<string>;
  onToggleNode: (dn: string) => void;
  /** Accumulated continuation prefix passed from parent, e.g. "│   │   " */
  prefix: string;
  /** Whether this node is the last child of its parent */
  isLast: boolean;
  /** Root has no connector */
  isRoot: boolean;
}

function VisualNode({ dn, map, matchedDns, selectedDn, onSelectEntry, expandedNodes, onToggleNode, prefix, isLast, isRoot }: VisualNodeProps) {
  const node = map[dn.toLowerCase()];
  if (!node) return null;
  const { entry, children } = node;
  const isExpanded = expandedNodes.has(dn.toLowerCase());
  const isMatched = matchedDns.has(dn.toLowerCase());
  const isSelected = selectedDn?.toLowerCase() === dn.toLowerCase();
  const isLeaf = children.length === 0;
  const rdn = entry.dn.split(',')[0];

  // Characters this node contributes to its OWN line
  const connector = isRoot ? '' : (isLast ? '└─ ' : '├─ ');
  // Prefix that gets passed down to children of this node
  const childPrefix = isRoot ? '' : prefix + (isLast ? '      ' : '│     ');

  let rowCls = 'tree-node-row visual-entry-row';
  if (isSelected) rowCls += ' selected';
  if (isMatched) rowCls += ' matched';

  const handleClick = () => {
    if (children.length > 0) onToggleNode(dn.toLowerCase());
    onSelectEntry(entry.dn);
  };

  // Flatten all attributes into "key: value" strings
  const attrs: string[] = [];
  Object.entries(entry.attributes).forEach(([k, v]) => {
    const vals = Array.isArray(v) ? v : [v];
    vals.forEach(val => attrs.push(`${k}: ${String(val)}`));
  });

  return (
    <div className="tree-node">

      {/* The entry's own line */}
      <div className="visual-line">
        {!isRoot && <span className="vt-pre">{prefix}{connector}</span>}
        <div className={rowCls} data-dn={entry.dn} onClick={handleClick}>
          <span className="tree-icon">{getNodeIcon(entry.dn)}</span>
          <span className="tree-label" title={entry.dn}>{rdn}</span>
          {!isLeaf && <span className={`vt-chevron${isExpanded ? ' open' : ''}`}>▸</span>}
        </div>
      </div>

      {/* Root: show a lone │ separator line after root if expanded */}
      {isRoot && isExpanded && children.length > 0 && (
        <div className="visual-line vt-sep"><span className="vt-pre">│</span></div>
      )}

      {/* Leaf: always show attributes */}
      {isLeaf && attrs.map((attr, idx) => {
        const attrIsLast = idx === attrs.length - 1;
        return (
          <div key={idx} className="visual-line">
            <span className="vt-pre">{childPrefix}{attrIsLast ? '└─ ' : '├─ '}</span>
            <span className="vt-attr">{attr}</span>
          </div>
        );
      })}

      {/* Non-leaf: show LDAP children when expanded */}
      {!isLeaf && isExpanded && children.map((childDn, idx) => {
        const childIsLast = idx === children.length - 1;
        const childNode = map[childDn.toLowerCase()];
        const childIsExpanded = expandedNodes.has(childDn.toLowerCase());
        const childHasChildren = (childNode?.children.length ?? 0) > 0;
        // Add a separator line after an expanded non-last child
        const showSep = !childIsLast && childIsExpanded && childHasChildren;
        return (
          <div key={childDn}>
            <VisualNode
              dn={childDn} map={map} matchedDns={matchedDns} selectedDn={selectedDn}
              onSelectEntry={onSelectEntry} expandedNodes={expandedNodes} onToggleNode={onToggleNode}
              prefix={childPrefix} isLast={childIsLast} isRoot={false}
            />
            {showSep && (
              <div className="visual-line vt-sep">
                <span className="vt-pre">{childPrefix}{childIsLast ? '      ' : '│     '}│</span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ── Attribute panel (normal mode only) ───────────────────────────────────────

function AttrPanel({ entry }: { entry: LdapEntry | null }) {
  if (!entry) return <div className="attr-panel"><div className="attr-panel-title">Click an entry to inspect attributes</div></div>;
  return (
    <div className="attr-panel">
      <div className="attr-panel-title">{entry.dn}</div>
      {Object.entries(entry.attributes).map(([key, val]) => {
        const vals = Array.isArray(val) ? val : [val];
        return vals.map((v, i) => (
          <div key={`${key}-${i}`} className="attr-row">
            <span className="attr-key">{key}:</span>
            <span className="attr-val">{String(v)}</span>
          </div>
        ));
      })}
    </div>
  );
}

// ── Main export ───────────────────────────────────────────────────────────────

export function DirectoryTree({ entries, matchedDns, selectedDn, onSelectEntry, expandedNodes, onToggleNode, onExpandAll }: DirectoryTreeProps) {
  const { map, roots } = buildTree(entries);
  const [visualMode, setVisualMode] = useState(false);

  const selectedEntry = selectedDn
    ? entries.find(e => e.dn.toLowerCase() === selectedDn.toLowerCase()) || null
    : null;

  return (
    <div className="tree-panel">
      <div className="panel-header">
        <span>📂 Directory Tree</span>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>

          {/* Toggle switch */}
          <button
            className="vt-switch"
            title={visualMode ? 'Switch to list view' : 'Switch to visual tree'}
            onClick={() => setVisualMode(v => !v)}
          >
            <span className="vt-switch-icon">🌳</span>
            <span className={`vt-switch-track${visualMode ? ' on' : ''}`}>
              <span className="vt-switch-thumb" />
            </span>
          </button>

          <button className="btn btn-ghost btn-sm" style={{ padding: '2px 8px', fontSize: '11px' }} onClick={onExpandAll}>
            Expand All
          </button>
        </div>
      </div>

      <div className="tree-scroll">
        {visualMode
          ? roots.map(dn => (
              <VisualNode key={dn} dn={dn} map={map} matchedDns={matchedDns} selectedDn={selectedDn}
                onSelectEntry={onSelectEntry} expandedNodes={expandedNodes} onToggleNode={onToggleNode}
                prefix="" isLast={true} isRoot={true} />
            ))
          : roots.map(dn => (
              <TreeNodeView key={dn} dn={dn} map={map} depth={0} matchedDns={matchedDns}
                selectedDn={selectedDn} onSelectEntry={onSelectEntry}
                expandedNodes={expandedNodes} onToggleNode={onToggleNode} />
            ))
        }
      </div>

      {!visualMode && <AttrPanel entry={selectedEntry} />}
    </div>
  );
}
