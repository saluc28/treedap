import { useEffect, useLayoutEffect, useRef, useState } from 'react';

interface Props {
  filter: string;
  baseDN: string;
  scope: string;
}

function buildCommand(filter: string, baseDN: string, scope: string): string {
  const safeFilter = filter.trim() || '(objectClass=*)';
  return `ldapsearch -H ldap://your-server -x \\
  -D "cn=your-bind-user,dc=example,dc=com" -W \\
  -b "${baseDN}" -s ${scope} \\
  '${safeFilter}'`;
}

export function CopyLdapsearchButton({ filter, baseDN, scope }: Props) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const popRef = useRef<HTMLDivElement>(null);
  const disabled = !filter.trim();
  const command = buildCommand(filter, baseDN, scope);

  useLayoutEffect(() => {
    if (!open || !btnRef.current) return;
    const place = () => {
      const b = btnRef.current!.getBoundingClientRect();
      const width = Math.min(520, window.innerWidth - 40);
      let left = b.right - width;
      if (left + width > window.innerWidth - 20) left = window.innerWidth - 20 - width;
      if (left < 20) left = 20;
      setPos({ top: b.bottom + 6, left });
    };
    place();
    window.addEventListener('resize', place);
    window.addEventListener('scroll', place, true);
    return () => {
      window.removeEventListener('resize', place);
      window.removeEventListener('scroll', place, true);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onDocClick = (e: MouseEvent) => {
      const t = e.target as Node;
      if (popRef.current?.contains(t)) return;
      if (btnRef.current?.contains(t)) return;
      setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('mousedown', onDocClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDocClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const doCopy = async () => {
    try {
      await navigator.clipboard.writeText(command);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = command;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand('copy'); setCopied(true); setTimeout(() => setCopied(false), 1600); } catch { /* noop */ }
      document.body.removeChild(ta);
    }
  };

  return (
    <>
      <button
        ref={btnRef}
        className="btn btn-ghost btn-sm"
        onClick={() => !disabled && setOpen(v => !v)}
        title="Preview and copy as an ldapsearch command"
        disabled={disabled}
        aria-expanded={open}
      >
        📋 Copy as ldapsearch
      </button>
      {open && pos && (
        <div
          ref={popRef}
          className="ldapsearch-popover"
          role="dialog"
          aria-label="ldapsearch preview"
          style={{ top: pos.top, left: pos.left }}
        >
          <div className="ldapsearch-popover-head">
            <span className="ldapsearch-popover-title">Preview - paste into any terminal</span>
            <button className="ldapsearch-popover-close" onClick={() => setOpen(false)} aria-label="Close">×</button>
          </div>
          <pre className="ldapsearch-popover-code">{command}</pre>
          <div className="ldapsearch-popover-foot">
            <button className="btn btn-primary btn-sm" onClick={doCopy}>
              {copied ? '✓ Copied' : '📋 Copy'}
            </button>
            <span className="ldapsearch-popover-hint">Replace host and bind DN with your values.</span>
          </div>
        </div>
      )}
    </>
  );
}
