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
  if (dnL.startsWith('dc=')) return '🏢';
  if (dnL.startsWith('ou=')) return '📁';
  if (dnL.startsWith('uid=')) return '👤';
  if (dnL.startsWith('cn=') && dnL.includes('ou=groups')) return '👥';
  if (dnL.startsWith('cn=') && dnL.includes('ou=services')) return '⚙️';
  if (dnL.includes('ou=computers')) return '🖥️';
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
        <span
          className={`tree-toggle${children.length === 0 ? ' leaf' : ''}${isExpanded ? ' open' : ''}`}
          onClick={children.length > 0 ? handleToggleClick : undefined}
        >▶</span>
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

export function DirectoryTree({ entries, matchedDns, selectedDn, onSelectEntry, expandedNodes, onToggleNode, onExpandAll }: DirectoryTreeProps) {
  const { map, roots } = buildTree(entries);

  const selectedEntry = selectedDn
    ? entries.find(e => e.dn.toLowerCase() === selectedDn.toLowerCase()) || null
    : null;

  return (
    <div className="tree-panel">
      <div className="panel-header">
        <span>📂 Directory Tree</span>
        <button className="btn btn-ghost btn-sm" style={{ padding: '2px 8px', fontSize: '11px' }} onClick={onExpandAll}>
          Expand All
        </button>
      </div>

      <div className="tree-scroll">
        {roots.map(dn => (
          <TreeNodeView key={dn} dn={dn} map={map} depth={0} matchedDns={matchedDns}
            selectedDn={selectedDn} onSelectEntry={onSelectEntry}
            expandedNodes={expandedNodes} onToggleNode={onToggleNode} />
        ))}
      </div>

      <AttrPanel entry={selectedEntry} />
    </div>
  );
}
