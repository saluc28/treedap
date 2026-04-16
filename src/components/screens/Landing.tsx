interface LandingProps {
  onStart: () => void;
}

export function Landing({ onStart }: LandingProps) {
  return (
    <div id="screen-landing" className="screen active">

      {/* Backgrounds */}
      <div className="landing-grid-dots" />
      <div className="landing-scanlines" />

      {/* Sticky Header */}
      <header className="landing-header">
        <div className="landing-header-inner">
          <div className="landing-logo">
            <span className="landing-logo-icon">🌳</span>
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
              <span>16 Real-World Troubleshooting Scenarios</span>
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
                Start Learning →
              </button>
              <div className="landing-stats">
                <div className="landing-stat">
                  <span className="landing-stat-num">16</span>
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
                Three intro levels cover the minimum you need to know. Then 13 troubleshooting
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
          <span>🌳</span>
          <span className="landing-footer-name">TreeDap</span>
          <p className="landing-footer-copy">© 2026 TreeDap. Free and open source. No signup required.</p>
        </div>
        <div className="landing-footer-links">
          <a href="#">LDAP RFCs</a>
          <a href="#">GitHub</a>
          <a href="#">Security</a>
        </div>
      </footer>

    </div>
  );
}
