import { useEffect, useState } from 'react';

interface CelebrationOverlayProps {
  stars: number;
  levelId: number;
  isLastLevel: boolean;
  totalStars: number;
  maxStars: number;
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

export function CelebrationOverlay({ stars, levelId, isLastLevel, totalStars, maxStars, onNext, onDashboard, onStayHere }: CelebrationOverlayProps) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    launchConfetti();
  }, []);

  const shareText = `I just completed TreeDap - 18 real-world LDAP troubleshooting scenarios. ${totalStars}/${maxStars} stars ⭐`;
  const shareUrl = 'https://treedap.com';
  const twitterHref = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
  const linkedinHref = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

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
        {isLastLevel && (
          <div className="celebration-share">
            <div className="celebration-share-title">
              🏁 You finished every scenario - {totalStars}/{maxStars} stars
            </div>
            <div className="celebration-share-desc">
              Share your run so other sysadmins can have a go:
            </div>
            <div className="celebration-share-actions">
              <a className="btn btn-secondary btn-sm" href={twitterHref} target="_blank" rel="noopener noreferrer">
                Post on X
              </a>
              <a className="btn btn-secondary btn-sm" href={linkedinHref} target="_blank" rel="noopener noreferrer">
                Share on LinkedIn
              </a>
              <button className="btn btn-secondary btn-sm" onClick={handleCopy}>
                {copied ? '✓ Copied' : 'Copy link'}
              </button>
            </div>
          </div>
        )}
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
