interface LandingProps {
  onStart: () => void;
  onFreeMode: () => void;
}

export function Landing({ onStart, onFreeMode }: LandingProps) {
  return (
    <div id="screen-landing" className="screen active">

      <div className="landing-grid-dots" />
      <div className="landing-scanlines" />

      <header className="landing-header">
        <div className="landing-header-inner">
          <div className="landing-logo">
            <img src="/logo.svg" alt="" className="landing-logo-icon" />
            <span className="landing-logo-text">Tree<span className="landing-logo-accent">Dap</span></span>
          </div>
          <a
            className="landing-header-github"
            href="https://github.com/saluc28/treedap"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Star TreeDap on GitHub"
          >
            <svg width="15" height="15" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z"/>
            </svg>
            <span>GitHub</span>
          </a>
        </div>
      </header>

      <section className="landing-hero">
        <div className="landing-hero-inner">

          <div className="landing-hero-text">
            <h1 className="landing-title">
              LDAP doesn't tell you when you're <em>wrong.</em>
            </h1>

            <p className="landing-description">
              17 hands-on incidents - wrong baseDN, locked accounts, nested groups, AD vs OpenLDAP schema traps - with a live directory and a real RFC 4515 engine.
            </p>

            <div className="landing-cta-row">
              <button className="btn btn-primary btn-lg" onClick={onStart}>
                Start Level 1 →
              </button>
              <button className="btn btn-ghost btn-lg landing-cta-secondary" onClick={onFreeMode}>
                Free mode
              </button>
            </div>

            <div className="landing-meta">
              <span>17 scenarios</span>
              <span className="landing-meta-dot">·</span>
              <span>no signup</span>
              <span className="landing-meta-dot">·</span>
              <span>runs in your browser</span>
              <span className="landing-meta-dot">·</span>
              <span>open source</span>
            </div>
          </div>

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
                <span className="lc-white lc-i2">uid=grace.lee,ou=people,dc=treedap,dc=com</span>
              </div>
              <div className="lc-line">
                <span className="lc-num">04</span>
                <span className="lc-muted lc-i3">objectClass: inetOrgPerson</span>
              </div>
              <div className="lc-line">
                <span className="lc-num">05</span>
                <span className="lc-muted lc-i3">cn: Grace Lee</span>
              </div>
              <div className="lc-line">
                <span className="lc-num">06</span>
                <span className="lc-muted lc-i3">pwdChangedTime: 20230101120000Z</span>
              </div>
              <div className="lc-line">
                <span className="lc-num">07</span>
                <span className="lc-muted lc-i3">memberOf: cn=finance,ou=groups</span>
              </div>
              <div className="lc-terminal">
                <span className="lc-prompt">filter&gt;</span>
                <span> (&amp;(objectClass=inetOrgPerson)(pwdChangedTime&lt;=20250101000000Z))</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      <footer className="landing-footer">
        <span className="landing-footer-copy">MIT licensed · Built for sysadmins, SREs, and anyone tired of "invalid credentials".</span>
      </footer>

    </div>
  );
}
