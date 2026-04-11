import { LEVEL_THEORY } from '../../data/theory';

interface ConceptModalProps {
  levelId: number;
  onClose: () => void;
}

export function ConceptModal({ levelId, onClose }: ConceptModalProps) {
  const theory = LEVEL_THEORY[levelId];
  if (!theory) return null;

  return (
    <div className="concept-overlay" onClick={onClose}>
      <div className="concept-modal" onClick={e => e.stopPropagation()}>
        <div className="concept-modal-header">
          <div className="concept-modal-badge">{theory.badge}</div>
          <div className="concept-modal-title">{theory.title}</div>
        </div>
        <div
          className="concept-modal-body"
          dangerouslySetInnerHTML={{ __html: theory.html }}
        />
        <div className="concept-modal-footer">
          <button className="btn btn-primary" onClick={onClose}>
            Got it →
          </button>
        </div>
      </div>
    </div>
  );
}
