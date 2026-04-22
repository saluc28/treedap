import { useRef, useCallback, useEffect, useState } from 'react';
import type { KeyboardEvent } from 'react';
import { useApp } from '../../store/AppContext';
import { DIRECTORY } from '../../data/directory';
import { LEVELS } from '../../data/levels';
import { executeFilter } from '../../engine/ldapEngine';
import { diagnose, type Diagnostic } from '../../engine/diagnostics';
import type { FilterLevel, InvestigativeLevel, LdapEntry, LevelProgress, ValidationResult } from '../../engine/types';
import { ObjectiveBar } from './ObjectiveBar';
import { DirectoryTree } from './DirectoryTree';
import { InlineConcept } from './InlineConcept';
import { ResultEntry } from './ResultEntry';
import { CopyLdapsearchButton } from './CopyLdapsearchButton';
import { MobileWall } from '../MobileWall';

interface UseProgressReturn {
  save: (levelId: number, update: Partial<LevelProgress>) => void;
  isUnlocked: (id: number) => boolean;
  isCompleted: (id: number) => boolean;
  getStars: (id: number) => number;
}

interface LevelScreenProps {
  levelId: number;
  progress: UseProgressReturn;
  onBack: () => void;
}

function computeStars(hintsUsed: number, attempts: number): number {
  if (hintsUsed >= 3) return 1;
  if (hintsUsed >= 1 || attempts > 3) return 2;
  return 3;
}

export function LevelScreen({ levelId, progress, onBack }: LevelScreenProps) {
  const level = LEVELS.find(l => l.id === levelId);
  if (!level) return null;
  const { state, dispatch } = useApp();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-expand all directory nodes when entering a level
  useEffect(() => {
    const allDns = DIRECTORY.map(e => e.dn.toLowerCase());
    dispatch({ type: 'EXPAND_ALL', payload: allDns });
  }, [level.id, dispatch]);

  const matchedDns = new Set(
    (state.allQueryResults ?? []).map(e => e.dn.toLowerCase())
  );

  const handleExpandAll = useCallback(() => {
    const allDns = DIRECTORY.map(e => e.dn.toLowerCase());
    dispatch({ type: 'EXPAND_ALL', payload: allDns });
  }, [dispatch]);

  const isInvestigative = 'answerType' in level;
  const [diagnostic, setDiagnostic] = useState<Diagnostic | null>(null);

  useEffect(() => {
    setDiagnostic(null);
  }, [level.id]);

  const runQuery = useCallback(() => {
    const filter = state.queryInput.trim();
    if (!filter) return;

    try {
      const results = executeFilter(DIRECTORY, filter, level.baseDN, level.scope);
      const allResults = executeFilter(DIRECTORY, filter, 'dc=treedap,dc=com', 'sub');
      // Always just store results - verdict comes only on explicit submit
      dispatch({ type: 'SET_QUERY_RESULTS', payload: { results, allResults } });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      dispatch({ type: 'SET_PARSE_ERROR', payload: msg });
    }
  }, [state.queryInput, level, dispatch]);

  const submitFilter = useCallback(() => {
    if (!state.queryResults || isInvestigative) return;

    dispatch({ type: 'INCREMENT_ATTEMPTS' });
    const filterLevel = level as FilterLevel;
    const validation = filterLevel.validate(state.queryResults);
    dispatch({ type: 'SET_VALIDATION', payload: validation });

    if (validation.correct) {
      setDiagnostic(null);
      const stars = computeStars(state.hintsUsed, state.attempts + 1);
      progress.save(level.id, { completed: true, stars, attempts: state.attempts + 1 });
      dispatch({ type: 'OPEN_CELEBRATION', payload: stars });
    } else {
      const d = diagnose({
        filter: state.queryInput,
        directory: DIRECTORY,
        baseDN: level.baseDN,
        scope: level.scope,
        results: state.queryResults,
        allResults: state.allQueryResults ?? [],
        expectedCount: filterLevel.expectedDNs.length,
      });
      setDiagnostic(d);
    }
  }, [state.queryResults, state.allQueryResults, state.queryInput, state.hintsUsed, state.attempts, level, isInvestigative, dispatch, progress]);

  const submitAnswer = useCallback(() => {
    if (!isInvestigative) return;
    const inv = level as InvestigativeLevel;
    const result = inv.validateAnswer(state.answerInput);
    dispatch({ type: 'SET_ANSWER_RESULT', payload: result });

    if (result.correct) {
      const stars = computeStars(state.hintsUsed, state.attempts);
      progress.save(level.id, { completed: true, stars, attempts: state.attempts });
      dispatch({ type: 'OPEN_CELEBRATION', payload: stars });
    }
  }, [isInvestigative, level, state.answerInput, state.hintsUsed, state.attempts, dispatch, progress]);

  const handleKeyDown = useCallback((e: KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      runQuery();
    }
  }, [runQuery]);

  const showNextHint = useCallback(() => {
    if (state.hintsUsed >= 3) return;
    dispatch({ type: 'USE_HINT' });
  }, [state.hintsUsed, dispatch]);

  // Build nav dots state
  const navDotClass = (id: number) => {
    if (id === level.id) return 'level-nav-dot active';
    if (progress.isCompleted(id)) return 'level-nav-dot done';
    return 'level-nav-dot';
  };

  return (
    <div id="screen-level" className="screen">

      {/* Mobile wall - visible only on small viewports via CSS, zero SEO impact */}
      <MobileWall />

      {/* Header */}
      <header className="level-header">
        <div className="level-header-left">
          <button className="btn btn-ghost btn-sm lv-dashboard-btn" onClick={onBack}>
            <img src="/logo.svg" alt="" className="lv-dashboard-logo" />
            Dashboard
          </button>
          <div>
            <div className="level-header-title">Level {level.id}: {level.title}</div>
            <div className="level-header-sub">
              baseDN: {level.baseDN} &nbsp;|&nbsp; scope: {level.scope}
            </div>
          </div>
        </div>
        <div className="level-header-right">
          <div className="level-nav-dots">
            {LEVELS.map(l => (
              <div
                key={l.id}
                className={navDotClass(l.id)}
                title={`Level ${l.id}: ${l.title}`}
                onClick={() => progress.isUnlocked(l.id) && dispatch({ type: 'ENTER_LEVEL', payload: l.id })}
              />
            ))}
          </div>
          <button className="btn btn-ghost btn-sm" onClick={() => dispatch({ type: 'OPEN_CONCEPT' })}>
            📘 Concept
          </button>
          <button className="btn btn-ghost btn-sm" onClick={() => dispatch({ type: 'OPEN_GLOSSARY' })}>
            📖 Glossary
          </button>
          <div className="hint-counter" title="Hints used (each costs a star)">
            💡 {state.hintsUsed}/3
          </div>
        </div>
      </header>

      {/* Body */}
      <main className="level-body">
        <InlineConcept levelId={level.id} />

        <ObjectiveBar context={level.context} task={level.task} contextType={level.contextType} contextMeta={level.contextMeta} />

        <div className="level-workspace">
          {/* Left: Directory Tree */}
          <DirectoryTree
            entries={DIRECTORY}
            matchedDns={matchedDns}
            selectedDn={state.selectedEntryDn}
            onSelectEntry={(dn) => dispatch({ type: 'SELECT_ENTRY', payload: state.selectedEntryDn?.toLowerCase() === dn.toLowerCase() ? null : dn })}
            expandedNodes={state.expandedNodes}
            onToggleNode={(dn) => dispatch({ type: 'TOGGLE_NODE', payload: dn })}
            onExpandAll={handleExpandAll}
          />

          {/* Right: Query + Results */}
          <div className="query-panel">
            {/* Query Editor */}
            <div className="query-editor-section">
              <div className="query-meta">
                <div className="query-scope-info">
                  Base: <span>{level.baseDN}</span> &nbsp;|&nbsp; Scope: <span>{level.scope}</span>
                </div>
                <span className="text-secondary" style={{ fontSize: '12px' }}>
                  <span className="kbd">Ctrl</span>+<span className="kbd">Enter</span> to run
                </span>
              </div>
              <div className="editor-wrapper">
                <textarea
                  ref={textareaRef}
                  className="query-textarea"
                  value={state.queryInput}
                  onChange={(e) => dispatch({ type: 'SET_QUERY', payload: e.target.value })}
                  onKeyDown={handleKeyDown}
                  placeholder="Enter LDAP filter... e.g. (objectClass=person)"
                  spellCheck={false}
                  autoComplete="off"
                  autoCorrect="off"
                />
                <div className="editor-footer">
                  <span className="char-count">{state.queryInput.length} chars</span>
                  <div className="query-actions">
                    <button
                      className="btn btn-ghost btn-sm"
                      onClick={() => dispatch({ type: 'SET_QUERY', payload: '' })}
                    >
                      ✕ Clear
                    </button>
                    <CopyLdapsearchButton filter={state.queryInput} baseDN={level.baseDN} scope={level.scope} />
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={showNextHint}
                      disabled={state.hintsUsed >= 3}
                    >
                      💡 Hint
                    </button>
                    <button className="btn btn-primary btn-sm" onClick={runQuery}>
                      ▶ Run Query
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Results */}
            <ResultsSection
              queryResults={state.queryResults}
              allQueryResults={state.allQueryResults}
              validationResult={state.validationResult}
              parseError={state.parseError}
              currentHintIndex={state.currentHintIndex}
              hints={level.hints}
              isInvestigative={isInvestigative}
              levelBaseDN={level.baseDN}
              levelScope={level.scope}
              diagnostic={diagnostic}
              onSubmit={submitFilter}
            />

            {/* Answer submission - investigative levels only */}
            {isInvestigative && (
              <AnswerSection
                level={level as InvestigativeLevel}
                answerInput={state.answerInput}
                answerResult={state.answerResult}
                onAnswerChange={(v) => dispatch({ type: 'SET_ANSWER_INPUT', payload: v })}
                onSubmit={submitAnswer}
              />
            )}

            {/* Next Lesson bar - always visible, locked until exercise is solved */}
            {(() => {
              const done = isInvestigative
                ? !!state.answerResult?.correct
                : !!state.validationResult?.correct;
              const isLast = level.id >= LEVELS.length;
              return (
                <div className={`next-lesson-bar ${done ? 'unlocked' : 'locked'}`}>
                  <div className="next-lesson-bar-msg">
                    {done
                      ? <><span className="next-lesson-star">⭐</span> Level {level.id} complete!</>
                      : <><span className="next-lesson-lock">🔒</span> Complete the exercise to continue</>
                    }
                  </div>
                  <div className="next-lesson-bar-actions">
                    {isLast ? (
                      <button
                        className={`btn ${done ? 'btn-success' : 'btn-secondary'}`}
                        disabled={!done}
                        onClick={() => dispatch({ type: 'SET_SCREEN', payload: 'dashboard' })}
                      >
                        🏁 Finish Course
                      </button>
                    ) : (
                      <button
                        className={`btn ${done ? 'btn-success' : 'btn-secondary'}`}
                        disabled={!done}
                        onClick={() => dispatch({ type: 'ENTER_LEVEL', payload: level.id + 1 })}
                      >
                        Next Lesson →
                      </button>
                    )}
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      </main>
    </div>
  );
}

function renderInlineCode(s: string): string {
  const escaped = s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
  return escaped.replace(/`([^`]+)`/g, '<code>$1</code>');
}

/* ---- Results Section ---- */

interface ResultsSectionProps {
  queryResults: LdapEntry[] | null;
  allQueryResults: LdapEntry[] | null;
  validationResult: ValidationResult | null;
  parseError: string | null;
  currentHintIndex: number;
  hints: string[];
  isInvestigative: boolean;
  levelBaseDN: string;
  levelScope: string;
  diagnostic: Diagnostic | null;
  onSubmit: () => void;
}

function ResultsSection({ queryResults, allQueryResults, validationResult, parseError, currentHintIndex, hints, isInvestigative, levelBaseDN, levelScope, diagnostic, onSubmit }: ResultsSectionProps) {
  if (!queryResults && !parseError && currentHintIndex < 0) {
    return (
      <div className="results-section">
        <div className="results-empty">
          <div className="results-empty-icon">🔎</div>
          <div className="results-empty-text">{isInvestigative ? 'Use queries to explore the directory' : 'Run a query to see results'}</div>
          <div className="results-empty-sub">{isInvestigative ? 'Run as many queries as you need, then submit your answer below' : 'Type an LDAP filter above and click Run Query'}</div>
        </div>
      </div>
    );
  }

  const canSubmit = !isInvestigative && queryResults !== null && !validationResult?.correct;

  return (
    <div className="results-section">
      {/* Parse Error */}
      {parseError && (
        <div className="result-verdict syntax-error">
          <span className="verdict-emoji">⚠️</span>
          <div className="verdict-text">
            <div className="verdict-title syntax-error">Syntax Error</div>
            <div className="verdict-detail">{parseError}</div>
          </div>
        </div>
      )}

      {/* Hint Panel */}
      {currentHintIndex >= 0 && hints[currentHintIndex] && (
        <div className="hint-panel">
          <div className="hint-label">💡 Hint {currentHintIndex + 1} of 3</div>
          <div className="hint-text" dangerouslySetInnerHTML={{ __html: hints[currentHintIndex] }} />
        </div>
      )}

      {/* Validation Verdict */}
      {validationResult && (
        <div className={`result-verdict ${validationResult.correct ? 'correct' : 'incorrect'}`}>
          <span className="verdict-emoji">{validationResult.correct ? '✅' : '❌'}</span>
          <div className="verdict-text">
            <div className={`verdict-title ${validationResult.correct ? 'correct' : 'incorrect'}`}>
              {validationResult.correct ? 'Correct!' : 'Not quite'}
            </div>
            <div className="verdict-detail">{validationResult.feedback}</div>
          </div>
        </div>
      )}

      {/* Diagnostic (free, not a hint) */}
      {diagnostic && validationResult && !validationResult.correct && (
        <div className="diagnostic-panel">
          <span className="diagnostic-icon">🔍</span>
          <div className="diagnostic-text" dangerouslySetInnerHTML={{ __html: renderInlineCode(diagnostic.message) }} />
        </div>
      )}

      {/* Results List */}
      {queryResults && queryResults.length > 0 && (
        <>
          <div className="results-header">
            <span className="results-count">
              <span className="num">{queryResults.length}</span> {queryResults.length === 1 ? 'result' : 'results'} found
            </span>
          </div>
          {queryResults.map((entry) => (
            <ResultEntry key={entry.dn} entry={entry} />
          ))}
        </>
      )}

      {queryResults && queryResults.length === 0 && !parseError && (
        allQueryResults && allQueryResults.length > 0 ? (
          <>
            <div className="result-verdict incorrect" style={{ marginBottom: '8px' }}>
              <span className="verdict-emoji">⚠️</span>
              <div className="verdict-text">
                <div className="verdict-title incorrect">Outside exercise scope</div>
                <div className="verdict-detail">
                  These entries are not within <code>baseDN: {levelBaseDN}</code>, scope: <code>{levelScope}</code> - they won't count for validation.
                </div>
              </div>
            </div>
            <div className="results-header">
              <span className="results-count">
                <span className="num">{allQueryResults.length}</span> {allQueryResults.length === 1 ? 'result' : 'results'} found (outside scope)
              </span>
            </div>
            {allQueryResults.map((entry) => (
              <ResultEntry key={entry.dn} entry={entry} />
            ))}
          </>
        ) : (
          <div className="results-empty">
            <div className="results-empty-icon">📭</div>
            <div className="results-empty-text">No results</div>
            <div className="results-empty-sub">Your filter did not match any entries</div>
          </div>
        )
      )}

      {/* Submit bar - visible after first run, for non-investigative levels */}
      {canSubmit && (
        <div className="submit-bar">
          <span className="submit-bar-hint">Happy with these results?</span>
          <button className="btn btn-primary btn-sm" onClick={onSubmit}>
            ✓ Submit answer
          </button>
        </div>
      )}
    </div>
  );
}

/* ---- Answer Section (investigative levels) ---- */
interface AnswerSectionProps {
  level: InvestigativeLevel;
  answerInput: string;
  answerResult: ValidationResult | null;
  onAnswerChange: (v: string) => void;
  onSubmit: () => void;
}

function AnswerSection({ level, answerInput, answerResult, onAnswerChange, onSubmit }: AnswerSectionProps) {
  const handleKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') onSubmit();
  };

  return (
    <div className="answer-section">
      <div className="answer-section-label">📋 Your answer</div>
      <p className="answer-prompt">{level.answerPrompt}</p>
      <div className="answer-input-row">
        {level.answerType === 'number' && (
          <input
            className="answer-input"
            type="number"
            min="0"
            value={answerInput}
            onChange={(e) => onAnswerChange(e.target.value)}
            onKeyDown={handleKey}
            disabled={!!answerResult?.correct}
          />
        )}
        {level.answerType === 'boolean' && (
          <div className="answer-bool-group">
            {['Yes', 'No'].map((opt) => (
              <button
                key={opt}
                className={`btn btn-secondary btn-sm ${answerInput === opt ? 'answer-bool-active' : ''}`}
                onClick={() => onAnswerChange(opt)}
                disabled={!!answerResult?.correct}
              >
                {opt}
              </button>
            ))}
          </div>
        )}
        <button
          className="btn btn-primary btn-sm"
          onClick={onSubmit}
          disabled={!answerInput.trim() || !!answerResult?.correct}
        >
          Submit
        </button>
      </div>
      {answerResult && (
        <div className={`result-verdict ${answerResult.correct ? 'correct' : 'incorrect'}`} style={{ marginTop: '12px' }}>
          <span className="verdict-emoji">{answerResult.correct ? '✅' : '❌'}</span>
          <div className="verdict-text">
            <div className={`verdict-title ${answerResult.correct ? 'correct' : 'incorrect'}`}>
              {answerResult.correct ? 'Correct!' : 'Not quite'}
            </div>
            <div className="verdict-detail">{answerResult.feedback}</div>
          </div>
        </div>
      )}
    </div>
  );
}
