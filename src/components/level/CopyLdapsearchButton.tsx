import { useState } from 'react';

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
  const [copied, setCopied] = useState(false);

  const onClick = async () => {
    const cmd = buildCommand(filter, baseDN, scope);
    try {
      await navigator.clipboard.writeText(cmd);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      // Fallback: select in a hidden textarea.
      const ta = document.createElement('textarea');
      ta.value = cmd;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand('copy'); setCopied(true); setTimeout(() => setCopied(false), 1600); } catch { /* noop */ }
      document.body.removeChild(ta);
    }
  };

  return (
    <button
      className="btn btn-ghost btn-sm"
      onClick={onClick}
      title="Copy as an ldapsearch command you can paste into a terminal"
      disabled={!filter.trim()}
    >
      {copied ? '✓ Copied' : '📋 Copy as ldapsearch'}
    </button>
  );
}
