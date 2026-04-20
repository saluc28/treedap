interface LandingProps {
  onStart: () => void;
  onFreeMode: () => void;
}

export function Landing({ onStart, onFreeMode }: LandingProps) {
  return (
    <div id="screen-landing" className="screen active">

      {/* Backgrounds */}
      <div className="landing-grid-dots" />
      <div className="landing-scanlines" />

      {/* Sticky Header */}
      <header className="landing-header">
        <div className="landing-header-inner">
          <div className="landing-logo">
            <img src="/logo.svg" alt="" className="landing-logo-icon" />
            <span className="landing-logo-text">Tree<span className="landing-logo-accent">Dap</span></span>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="landing-hero">
        <div className="landing-hero-inner">

          {/* Left: text */}
          <div className="landing-hero-text">
            <div className="landing-badge">
              <span className="landing-badge-dot" />
              <span>17 Real-World Troubleshooting Scenarios</span>
            </div>

            <h1 className="landing-title">
              LDAP doesn't tell you when you're <em>wrong.</em>
            </h1>

            <p className="landing-description">
              A login stops working. A service account can't bind. A group has the right members
              but access is still denied. LDAP fails <strong>silently</strong> - no error, just
              nothing. These scenarios train you to diagnose exactly that,
              whether you're working with <strong>Active Directory</strong>, OpenLDAP, or FreeIPA.
            </p>

            <div className="landing-cta-row">
              <button className="btn btn-primary btn-lg" onClick={onStart}>
                Diagnose Your First Incident →
              </button>
              <button className="btn btn-ghost btn-lg landing-cta-secondary" onClick={onFreeMode}>
                Or explore in Free Mode
              </button>
              <div className="landing-stats">
                <div className="landing-stat">
                  <span className="landing-stat-num">17</span>
                  <span className="landing-stat-label">Scenarios</span>
                </div>
                <div className="landing-stat">
                  <span className="landing-stat-num">Live</span>
                  <span className="landing-stat-label">Directory</span>
                </div>
                <div className="landing-stat">
                  <span className="landing-stat-num">0</span>
                  <span className="landing-stat-label">Signup</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: code mockup */}
          <div className="landing-code-panel">
            <div className="landing-code-titlebar">
              <div className="landing-code-dots">
                <span className="lcd-red" />
                <span className="lcd-yellow" />
                <span className="lcd-blue" />
              </div>
              <span className="landing-code-label">DIRECTORY_NAVIGATOR_V1.0</span>
            </div>
            <div className="landing-code-body">
              <div className="lc-line">
                <span className="lc-num">01</span>
                <span className="lc-blue">dn: dc=treedap,dc=com</span>
              </div>
              <div className="lc-line">
                <span className="lc-num">02</span>
                <span className="lc-blue lc-i1">ou=people,dc=treedap,dc=com</span>
              </div>
              <div className="lc-line lc-highlighted">
                <span className="lc-num">03</span>
                <span className="lc-white lc-i2">uid=jsmith,ou=people,dc=treedap,dc=com</span>
              </div>
              <div className="lc-line">
                <span className="lc-num">04</span>
                <span className="lc-muted lc-i3">objectClass: inetOrgPerson</span>
              </div>
              <div className="lc-line">
                <span className="lc-num">05</span>
                <span className="lc-muted lc-i3">cn: John Smith</span>
              </div>
              <div className="lc-line">
                <span className="lc-num">06</span>
                <span className="lc-muted lc-i3">uid: jsmith</span>
              </div>
              <div className="lc-line">
                <span className="lc-num">07</span>
                <span className="lc-muted lc-i3">memberOf: cn=vpn-users,ou=groups</span>
              </div>
              <div className="lc-terminal">
                <span className="lc-prompt">filter&gt;</span>
                <span> (&amp;(objectClass=inetOrgPerson)(uid=jsmith))</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Features bento */}
      <section className="landing-features-section">
        <div className="landing-features-inner">

          <div className="landing-features-header">
            <p className="landing-section-label">How it works</p>
            <h2 className="landing-section-title">
              Jump straight into incidents. No toy examples.
            </h2>
          </div>

          <div className="landing-bento">

            <div className="bento-card bento-large">
              <div className="bento-icon">📋</div>
              <h3 className="bento-title">Realistic Incident Context</h3>
              <p className="bento-desc">
                Every scenario arrives as a Jira ticket, a Teams message, or an email from a
                colleague. You diagnose it the same way you would on the job - read the context,
                explore the directory, find what's broken.
              </p>
            </div>

            <div className="bento-card bento-primary">
              <div className="bento-icon">🌳</div>
              <h3 className="bento-title">Live Directory Tree</h3>
              <p className="bento-desc">
                Every scenario has a real directory you can explore. Click any entry to inspect
                its full attribute set, run filters and see exactly what the server returns.
                No fake output.
              </p>
              <div className="bento-code-snippet">
                <code>(&amp;(objectClass=inetOrgPerson)(pwdAccountLockedTime=*))</code>
              </div>
            </div>

            <div className="bento-card bento-surface">
              <div className="bento-icon">📈</div>
              <h3 className="bento-title">Beginner to Advanced</h3>
              <p className="bento-desc">
                Three intro levels cover the minimum you need to know. Then 14 troubleshooting
                scenarios escalate from common config mistakes to security issues - wrong baseDN,
                moved bind accounts, nested groups, anonymous bind, TLS misconfiguration.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="landing-footer-brand">
          <img src="/logo.svg" alt="" className="landing-footer-logo" />
          <span className="landing-footer-name">TreeDap</span>
          <p className="landing-footer-copy">Open source. MIT licensed.</p>
        </div>
        <a
          className="landing-footer-github"
          href="https://github.com/saluc28/treedap"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Star TreeDap on GitHub"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
            <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z"/>
          </svg>
          <span>Star on GitHub</span>
        </a>
      </footer>

    </div>
  );
}
