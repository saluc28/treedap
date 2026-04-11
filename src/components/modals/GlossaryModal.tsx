import { useState } from 'react';
import { GLOSSARY_TERMS } from '../../data/glossary';

interface GlossaryModalProps {
  onClose: () => void;
}

export function GlossaryModal({ onClose }: GlossaryModalProps) {
  const [search, setSearch] = useState('');
  const [openTerm, setOpenTerm] = useState<string | null>(null);

  const filtered = GLOSSARY_TERMS.filter(t =>
    t.code.toLowerCase().includes(search.toLowerCase()) ||
    t.short.toLowerCase().includes(search.toLowerCase())
  );

  const toggleTerm = (code: string) => {
    setOpenTerm(prev => prev === code ? null : code);
  };

  return (
    <div className="glossary-overlay" onClick={onClose}>
      <div className="glossary-modal" onClick={e => e.stopPropagation()}>
        <div className="glossary-header">
          <div className="glossary-header-left">
            <span style={{ fontSize: '20px' }}>📖</span>
            <span className="glossary-title">LDAP Glossary</span>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={onClose}>✕</button>
        </div>
        <div className="glossary-search">
          <input
            className="glossary-search-input"
            type="text"
            placeholder="Search terms..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            autoFocus
          />
        </div>
        <div className="glossary-body">
          {filtered.length === 0 && (
            <div style={{ color: 'var(--text-secondary)', fontSize: '14px', padding: '20px 0', textAlign: 'center' }}>
              No terms found
            </div>
          )}
          {filtered.map(term => (
            <div key={term.code} className="glossary-term">
              <div className="glossary-term-header" onClick={() => toggleTerm(term.code)}>
                <span className="glossary-term-code">{term.code}</span>
                <span className="glossary-term-short">{term.short}</span>
                <span style={{ marginLeft: 'auto', color: 'var(--text-secondary)', fontSize: '11px' }}>
                  {openTerm === term.code ? '▲' : '▼'}
                </span>
              </div>
              {openTerm === term.code && (
                <div
                  className="glossary-term-body"
                  dangerouslySetInnerHTML={{ __html: term.body }}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
