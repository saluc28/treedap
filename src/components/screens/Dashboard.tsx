import { LEVELS } from '../../data/levels';
import { Badge } from '../ui/Badge';
import { MobileWall } from '../MobileWall';

interface DashboardProps {
  onSelectLevel: (id: number) => void;
  onBack: () => void;
  onFreeMode: () => void;
  completedCount: number;
  totalStars: number;
  isUnlocked: (id: number) => boolean;
  isCompleted: (id: number) => boolean;
  getStars: (id: number) => number;
}

const OU_GROUPS = [
  { key: 'beginner',     ou: 'ou=beginner',     label: 'Foundations' },
  { key: 'intermediate', ou: 'ou=intermediate',  label: 'Query Writing' },
  { key: 'advanced',     ou: 'ou=advanced',      label: 'Real Scenarios' },
] as const;

export function Dashboard({
  onSelectLevel,
  onBack,
  onFreeMode,
  completedCount,
  totalStars,
  isUnlocked,
  isCompleted,
  getStars,
}: DashboardProps) {
  const pct = Math.round((completedCount / LEVELS.length) * 100);

  return (
    <div id="screen-dashboard" className="screen active">

      <div className="db-grid-dots" />

      <MobileWall />

      {/* Header */}
      <header className="db-header">
        <div className="db-header-inner">
          <a className="db-logo" onClick={onBack}>
            <img src="/logo.svg" alt="" className="db-logo-icon" />
            <span className="db-logo-text">Tree<span className="db-logo-accent">Dap</span></span>
          </a>
          <div className="db-header-stats">
            <span className="db-header-stat">
              <strong>{totalStars}</strong> ⭐ stars
            </span>
            <span className="db-header-stat-sep" />
            <span className="db-header-stat">
              <strong>{completedCount}</strong> / {LEVELS.length} levels
            </span>
          </div>
        </div>
      </header>

      <main className="db-main">

        {/* Directory context bar */}
        <div className="db-context">
          <div className="db-context-top">
            <div className="db-breadcrumb">
              <span className="db-breadcrumb-icon">📂</span>
              <span className="db-breadcrumb-item">dc=treedap,dc=com</span>
              <span className="db-breadcrumb-sep">›</span>
              <span className="db-breadcrumb-item">ou=course</span>
            </div>
            <div className="db-context-meta">
              <code className="db-context-filter">(objectClass=courseLevel)</code>
              <span className="db-context-pill">{LEVELS.length} entries</span>
              <span className="db-context-pill db-pill-blue">{completedCount} completed</span>
              <span className="db-context-pill db-pill-gold">{totalStars} ⭐ stars</span>
            </div>
          </div>
          <div className="db-progress-track">
            <div className="db-progress-fill" style={{ width: `${pct}%` }} />
          </div>
          <div className="db-progress-label">{pct}% complete</div>
          <button className="db-free-mode-btn" onClick={onFreeMode}>
            <span className="db-free-mode-icon">🧪</span>
            <span className="db-free-mode-text">
              <strong>Free Mode</strong>
              <span>Open sandbox - write any filter against the full directory</span>
            </span>
            <span className="db-free-mode-arrow">→</span>
          </button>
        </div>

        {/* Level groups */}
        {OU_GROUPS.map(group => {
          const groupLevels = LEVELS.filter(l => l.difficulty === group.key);
          if (!groupLevels.length) return null;

          const groupCompleted = groupLevels.filter(l => isCompleted(l.id)).length;

          return (
            <div key={group.key} className="db-group">
              <div className="db-group-header">
                <span className="db-group-icon">📁</span>
                <span className="db-group-ou">{group.ou}</span>
                <span className="db-group-label">{group.label}</span>
                <span className="db-group-count">{groupCompleted}/{groupLevels.length}</span>
              </div>

              <div className="db-levels-grid">
                {groupLevels.map(l => {
                  const unlocked = isUnlocked(l.id);
                  const completed = isCompleted(l.id);
                  const stars = getStars(l.id);
                  const status = completed ? 'COMPLETE' : unlocked ? 'AVAILABLE' : 'LOCKED';

                  let cardCls = 'db-level-card';
                  if (completed) cardCls += ' db-card-completed';
                  else if (unlocked) cardCls += ' db-card-unlocked';
                  else cardCls += ' db-card-locked';

                  return (
                    <div
                      key={l.id}
                      className={cardCls}
                      onClick={() => unlocked && onSelectLevel(l.id)}
                    >
                      <div className="db-card-dn">
                        cn=level-{String(l.id).padStart(2, '0')},{group.ou}
                      </div>
                      <div className="db-card-title">{l.title}</div>
                      <div className="db-card-footer">
                        <Badge difficulty={l.difficulty} />
                        <div className="db-card-right">
                          <div className="db-stars">
                            {[1, 2, 3].map(n => (
                              <span key={n} className={`db-star${stars >= n ? ' earned' : ''}`}>⭐</span>
                            ))}
                          </div>
                          <span className={`db-status-chip db-chip-${status.toLowerCase()}`}>
                            {status}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}

      </main>
    </div>
  );
}
