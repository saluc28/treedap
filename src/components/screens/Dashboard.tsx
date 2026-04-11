import { LEVELS } from '../../data/levels';
import { Badge } from '../ui/Badge';

interface DashboardProps {
  onSelectLevel: (id: number) => void;
  onBack: () => void;
  completedCount: number;
  totalStars: number;
  isUnlocked: (id: number) => boolean;
  isCompleted: (id: number) => boolean;
  getStars: (id: number) => number;
}

export function Dashboard({
  onSelectLevel,
  onBack,
  completedCount,
  totalStars,
  isUnlocked,
  isCompleted,
  getStars,
}: DashboardProps) {
  const pct = Math.round((completedCount / LEVELS.length) * 100);

  return (
    <div id="screen-dashboard" className="screen active" style={{ flexDirection: 'column' }}>

      {/* Mobile wall - visible only on small viewports via CSS, zero SEO impact */}
      <div className="mobile-wall">
        <div className="mobile-wall-icon">🖥️</div>
        <div className="mobile-wall-title">Best experienced on desktop</div>
        <div className="mobile-wall-body">
          TreeDap is a hands-on LDAP query trainer that needs a full keyboard and screen to work properly.
        </div>
        <div className="mobile-wall-hint">Open this page on a laptop or desktop to start the course.</div>
      </div>

      <header className="dashboard-header">
        <a
          className="header-logo"
          onClick={onBack}
          style={{ cursor: 'pointer', textDecoration: 'none', color: 'var(--text-primary)' }}
        >
          <div className="header-logo-icon">🌳</div>
          TreeDap
        </a>
        <div className="dashboard-stats">
          <div className="stat-item">
            <span className="stat-value">{totalStars}</span>
            <span className="stat-label">⭐ stars</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{completedCount}</span>
            <span className="stat-label">/ {LEVELS.length} levels</span>
          </div>
        </div>
      </header>

      <main className="dashboard-body">
        <h2 className="dashboard-section-title">Your Progress</h2>
        <p className="dashboard-section-subtitle">
          Complete levels to unlock new challenges. Each level teaches a new LDAP concept.
        </p>

        <div className="progress-bar-container">
          <div className="progress-bar-fill" style={{ width: `${pct}%` }} />
        </div>

        <div className="progress-dots">
          {LEVELS.map(l => {
            let cls = 'progress-dot';
            if (isCompleted(l.id)) cls += ' completed';
            else if (isUnlocked(l.id)) cls += ' current';
            return <div key={l.id} className={cls} />;
          })}
        </div>

        <div className="levels-grid">
          {LEVELS.map(l => {
            const unlocked = isUnlocked(l.id);
            const completed = isCompleted(l.id);
            const stars = getStars(l.id);

            let cardCls = 'level-card';
            if (completed) cardCls += ' completed';
            if (!unlocked) cardCls += ' locked';

            return (
              <div
                key={l.id}
                className={cardCls}
                onClick={() => unlocked && onSelectLevel(l.id)}
              >
                <div className="level-card-header">
                  <span className="level-number">Level {l.id}</span>
                  <span className="level-status-icon">
                    {completed ? '✅' : unlocked ? '🔓' : '🔒'}
                  </span>
                </div>
                <div className="level-title">{l.title}</div>
                <div className="level-card-footer">
                  <Badge difficulty={l.difficulty} />
                  <div className="stars-display">
                    <span className={`star${stars >= 1 ? ' earned' : ''}`}>⭐</span>
                    <span className={`star${stars >= 2 ? ' earned' : ''}`}>⭐</span>
                    <span className={`star${stars >= 3 ? ' earned' : ''}`}>⭐</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
