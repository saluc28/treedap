import { useState, useEffect } from 'react';

const DISMISS_KEY = 'treedap_mobile_dismissed';

export function MobileWall() {
  const [dismissed, setDismissed] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem(DISMISS_KEY) === '1';
    } catch {
      return false;
    }
  });

  useEffect(() => {
    if (dismissed) {
      document.documentElement.classList.add('mobile-readonly');
    } else {
      document.documentElement.classList.remove('mobile-readonly');
    }
    return () => document.documentElement.classList.remove('mobile-readonly');
  }, [dismissed]);

  const dismiss = () => {
    try { sessionStorage.setItem(DISMISS_KEY, '1'); } catch { /* noop */ }
    setDismissed(true);
  };

  if (dismissed) {
    return (
      <div className="mobile-banner">
        <span className="mobile-banner-icon">💻</span>
        <span className="mobile-banner-text">
          Read-only on mobile. Bookmark <strong>treedap.com</strong> for your laptop to solve.
        </span>
      </div>
    );
  }

  return (
    <div className="mobile-wall">
      <img src="/logo.svg" alt="" className="mobile-wall-logo" />
      <div className="mobile-wall-title">Best on a laptop</div>
      <div className="mobile-wall-body">
        The scenarios need a real keyboard and a full-size directory tree. You can still
        read the tickets and explore the directory on your phone - just can't write filters here.
      </div>

      <ul className="mobile-wall-list">
        <li><span className="mobile-wall-check">✓</span> 17 real incident scenarios</li>
        <li><span className="mobile-wall-check">✓</span> Live directory tree + RFC 4515 engine</li>
        <li><span className="mobile-wall-check">✓</span> Hints, stars and progress tracking</li>
      </ul>

      <div className="mobile-wall-actions">
        <button className="mobile-wall-explore" onClick={dismiss}>
          Explore in read-only →
        </button>
      </div>

      <div className="mobile-wall-hint">
        Bookmark <strong>treedap.com</strong> and open it on your laptop when you have 20 minutes.
      </div>
    </div>
  );
}
