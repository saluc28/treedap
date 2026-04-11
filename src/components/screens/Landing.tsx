interface LandingProps {
  onStart: () => void;
}

export function Landing({ onStart }: LandingProps) {
  return (
    <div
      id="screen-landing"
      className="screen active"
      style={{ alignItems: 'center', justifyContent: 'center', padding: '40px 20px', position: 'relative', overflow: 'hidden' }}
    >
      <div className="landing-bg" />
      <div className="landing-grid" />

      <main className="landing-content">

        {/* Logo */}
        <div className="landing-logo">
          <div className="landing-logo-icon">🌳</div>
          <span className="landing-logo-text">
            Tree<span className="text-accent">Dap</span>
          </span>
        </div>

        {/* Eyebrow */}
        <p className="landing-tagline">Free Interactive IAM Course</p>

        {/* Hero title */}
        <h1 className="landing-title">
          LDAP doesn't tell you<br />when you're wrong.
        </h1>

        {/* Description */}
        <p className="landing-description">
          LDAP is the backbone of enterprise identity. It powers <strong>Active Directory</strong>,
          OpenLDAP, FreeIPA, and every serious IAM platform. If you work in IT, security, or
          cloud infrastructure, <strong>understanding it is not optional</strong>.
        </p>

        {/* Primary CTA */}
        <div className="landing-cta-group">
          <button className="btn btn-primary btn-lg" onClick={onStart}>
            Start Learning →
          </button>
        </div>

        {/* Meta stats row */}
        <div className="landing-meta">
          <span>15 levels</span>
          <span className="landing-meta-sep">·</span>
          <span>Real scenarios</span>
          <span className="landing-meta-sep">·</span>
          <span>No signup needed</span>
        </div>

        {/* Feature cards */}
        <div className="landing-features" id="features">
          <div className="feature-card">
            <div className="feature-icon">🌳</div>
            <div className="feature-title">Live Directory Tree</div>
            <div className="feature-desc">
              Explore a realistic LDAP tree with users, groups, and computers. Click entries to inspect attributes, watch queries highlight live, and hit the <strong>🌳 button</strong> for a visual branching tree view.
            </div>
          </div>
          <div className="feature-card">
            <div className="feature-icon">⚡</div>
            <div className="feature-title">Real Query Engine</div>
            <div className="feature-desc">
              A full RFC 4515 filter parser runs entirely in your browser. AND, OR, NOT, wildcards, comparisons and presence filters all work exactly as on a real LDAP server.
            </div>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🎯</div>
            <div className="feature-title">Real-world scenarios</div>
            <div className="feature-desc">
              Debug a colleague's broken filter. Run a security investigation. Discover what an offboarding script silently missed. Actual IT problems, not abstract drills.
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}
