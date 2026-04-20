export function MobileWall() {
  return (
    <div className="mobile-wall">
      <img src="/logo.svg" alt="" className="mobile-wall-logo" />
      <div className="mobile-wall-title">Save this for your desktop</div>
      <div className="mobile-wall-body">
        The scenarios need a real keyboard and a full-size directory tree. We keep
        TreeDap desktop-only on purpose - writing LDAP filters on a phone would miss the point.
      </div>

      <ul className="mobile-wall-list">
        <li><span className="mobile-wall-check">✓</span> 17 real incident scenarios</li>
        <li><span className="mobile-wall-check">✓</span> Live directory tree + RFC 4515 engine</li>
        <li><span className="mobile-wall-check">✓</span> Hints, stars and progress tracking</li>
      </ul>

      <div className="mobile-wall-hint">
        Bookmark <strong>treedap.com</strong> and open it on your laptop when you have 20 minutes.
      </div>
    </div>
  );
}
