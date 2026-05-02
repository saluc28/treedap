import { useApp } from '../../store/AppContext';

interface Props {
  onRerun: (filter: string) => void;
}

const MAX_DISPLAY_LENGTH = 32;

function truncate(s: string): string {
  if (s.length <= MAX_DISPLAY_LENGTH) return s;
  return s.slice(0, MAX_DISPLAY_LENGTH - 1) + '…';
}

export function QueryHistory({ onRerun }: Props) {
  const { state, dispatch } = useApp();
  const history = state.queryHistory;
  if (history.length === 0) return null;

  const handleClick = (filter: string) => {
    dispatch({ type: 'SET_QUERY', payload: filter });
    onRerun(filter);
  };

  const reversed = [...history].reverse();

  return (
    <div className="query-history" role="list" aria-label="Recent queries">
      <span className="query-history-label">History</span>
      <div className="query-history-chips">
        {reversed.map((entry, i) => {
          const badge = entry.parseError
            ? '!'
            : entry.resultCount === null
            ? '…'
            : String(entry.resultCount);
          const badgeClass = entry.parseError
            ? 'query-history-chip-badge error'
            : 'query-history-chip-badge';
          return (
            <button
              key={`${i}-${entry.filter}`}
              className="query-history-chip"
              role="listitem"
              onClick={() => handleClick(entry.filter)}
              title={entry.parseError ? `${entry.filter} (parse error)` : `${entry.filter} - ${entry.resultCount ?? '?'} result${entry.resultCount === 1 ? '' : 's'}`}
            >
              <code className="query-history-chip-filter">{truncate(entry.filter)}</code>
              <span className={badgeClass}>{badge}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
