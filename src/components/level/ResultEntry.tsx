import type { LdapEntry } from '../../engine/types';

export function ResultEntry({ entry }: { entry: LdapEntry }) {
  const previewAttrs = Object.entries(entry.attributes).slice(0, 4);

  return (
    <div className="result-entry">
      <div className="result-dn">{entry.dn}</div>
      <div className="result-attrs">
        {previewAttrs.map(([key, val]) => {
          const display = Array.isArray(val) ? val[0] : val;
          return (
            <span key={key} className="result-attr-chip">
              <span className="key">{key}: </span>
              <span className="val">{String(display)}</span>
            </span>
          );
        })}
      </div>
    </div>
  );
}
