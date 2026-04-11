import { useEffect } from 'react';

interface CelebrationOverlayProps {
  stars: number;
  levelId: number;
  isLastLevel: boolean;
  onNext: () => void;
  onDashboard: () => void;
  onStayHere: () => void;
}

function launchConfetti() {
  const colors = ['#4f8ef7', '#3fb950', '#e3b341', '#f85149', '#7b6ef6', '#ffffff'];
  const count = 80;

  for (let i = 0; i < count; i++) {
    const piece = document.createElement('div');
    piece.className = 'confetti-piece';

    const color = colors[Math.floor(Math.random() * colors.length)];
    const left = Math.random() * 100;
    const duration = 1.5 + Math.random() * 1.5;
    const delay = Math.random() * 0.8;
    const size = 6 + Math.random() * 8;

    piece.style.cssText = `
      left: ${left}vw;
      top: 0;
      width: ${size}px;
      height: ${size}px;
      background: ${color};
      animation-duration: ${duration}s;
      animation-delay: ${delay}s;
      border-radius: ${Math.random() > 0.5 ? '50%' : '2px'};
    `;

    document.body.appendChild(piece);
    setTimeout(() => piece.remove(), (duration + delay) * 1000 + 200);
  }
}

export function CelebrationOverlay({ stars, levelId, isLastLevel, onNext, onDashboard, onStayHere }: CelebrationOverlayProps) {
  useEffect(() => {
    launchConfetti();
  }, []);

  const starsArr = [1, 2, 3];

  const getMessage = () => {
    if (stars === 3) return { emoji: '🏆', title: 'Perfect!', desc: 'You solved it on the first try without hints!' };
    if (stars === 2) return { emoji: '⭐', title: 'Well done!', desc: 'Good work! Try with fewer hints next time for 3 stars.' };
    return { emoji: '✅', title: 'Level Complete!', desc: 'You got it! Challenge yourself with fewer hints.' };
  };

  const { emoji, title, desc } = getMessage();

  return (
    <div className="celebration-overlay">
      <div className="celebration-card">
        <span className="celebration-emoji">{emoji}</span>
        <div className="celebration-title">{title}</div>
        <div className="celebration-desc">Level {levelId} complete! {desc}</div>
        <div className="celebration-stars">
          {starsArr.map(i => (
            <span
              key={i}
              className="celebration-star"
              style={{ opacity: i <= stars ? 1 : 0.2 }}
            >
              ⭐
            </span>
          ))}
        </div>
        <div className="celebration-actions">
          <button className="btn btn-ghost" onClick={onStayHere}>
            Stay Here
          </button>
          <button className="btn btn-secondary" onClick={onDashboard}>
            Dashboard
          </button>
          {!isLastLevel && (
            <button className="btn btn-primary" onClick={onNext}>
              Next Lesson →
            </button>
          )}
          {isLastLevel && (
            <button className="btn btn-success" onClick={onDashboard}>
              🏁 All Done!
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
