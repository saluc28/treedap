import { useState, useRef, useCallback, useEffect } from 'react';
import { LEVEL_THEORY } from '../../data/theory';

interface InlineConceptProps {
  levelId: number;
}

const DEFAULT_HEIGHT = 360;
const MIN_HEIGHT = 48;
const MAX_HEIGHT = 560;

export function InlineConcept({ levelId }: InlineConceptProps) {
  const [open, setOpen] = useState(false);
  const [bodyHeight, setBodyHeight] = useState(DEFAULT_HEIGHT);
  const dragStartY = useRef(0);
  const dragStartHeight = useRef(DEFAULT_HEIGHT);

  // Reset height when level changes
  useEffect(() => {
    setBodyHeight(DEFAULT_HEIGHT);
    setOpen(false);
  }, [levelId]);

  const theory = LEVEL_THEORY[levelId];
  if (!theory) return null;

  const handleDragStart = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    dragStartY.current = e.clientY;
    dragStartHeight.current = bodyHeight;

    const onMove = (ev: MouseEvent) => {
      const delta = ev.clientY - dragStartY.current;
      setBodyHeight(Math.max(MIN_HEIGHT, Math.min(MAX_HEIGHT, dragStartHeight.current + delta)));
    };

    const onUp = () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  }, [bodyHeight]);

  return (
    <div className="inline-concept">
      <div className="inline-concept-header" onClick={() => setOpen(o => !o)}>
        <span style={{ fontSize: '14px' }}>📘</span>
        <span className="inline-concept-title">{theory.title}</span>
        <span className="inline-concept-toggle">{open ? '▼ collapse' : '▶ expand'}</span>
      </div>

      {open && (
        <>
          <div
            className="inline-concept-body"
            style={{ height: bodyHeight, overflowY: 'auto' }}
            dangerouslySetInnerHTML={{ __html: theory.html }}
          />
          <div
            className="inline-concept-resize-handle"
            onMouseDown={handleDragStart}
            title="Drag to resize"
          >
            <div className="inline-concept-resize-grip" />
          </div>
        </>
      )}
    </div>
  );
}
