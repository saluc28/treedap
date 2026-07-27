import { lazy, Suspense, useEffect } from 'react';
import { AppProvider, useApp } from './store/AppContext';
import { useProgress } from './hooks/useProgress';
import { Landing } from './components/screens/Landing';

// ── Lazy-loaded chunks ───────────────────────────────────────────────────────
// Nothing below this line is in the initial bundle.
// Each import() becomes its own chunk downloaded only when needed.
const Dashboard       = lazy(() => import('./components/screens/Dashboard').then(m => ({ default: m.Dashboard })));
const LevelScreen     = lazy(() => import('./components/level/LevelScreen').then(m => ({ default: m.LevelScreen })));
const FreeMode        = lazy(() => import('./components/screens/FreeMode').then(m => ({ default: m.FreeMode })));
const GlossaryModal   = lazy(() => import('./components/modals/GlossaryModal').then(m => ({ default: m.GlossaryModal })));
const ConceptModal    = lazy(() => import('./components/modals/ConceptModal').then(m => ({ default: m.ConceptModal })));
const CelebrationOverlay = lazy(() => import('./components/modals/CelebrationOverlay').then(m => ({ default: m.CelebrationOverlay })));

// Tiny constant - avoids pulling levels.ts into the initial bundle
const LEVEL_COUNT = 18;

// ── Preloader ────────────────────────────────────────────────────────────────
// While the user reads the landing page we silently fetch the next chunks so
// the transition to Dashboard is instant.
function ChunkPreloader() {
  useEffect(() => {
    import('./components/screens/Dashboard');
    import('./components/level/LevelScreen');
  }, []);
  return null;
}

// ── App shell ────────────────────────────────────────────────────────────────
function AppInner() {
  const { state, dispatch } = useApp();
  const progress = useProgress();

  return (
    <>
      {/* Landing is eager - renders with zero JS overhead */}
      {state.screen === 'landing' && (
        <>
          <Landing
            onStart={() => dispatch({ type: 'ENTER_LEVEL', payload: 1 })}
            onFreeMode={() => dispatch({ type: 'SET_SCREEN', payload: 'free-mode' })}
          />
          <ChunkPreloader />
        </>
      )}

      {/* Everything else is lazy */}
      <Suspense fallback={null}>
        {state.screen === 'dashboard' && (
          <Dashboard
            onSelectLevel={(id) => dispatch({ type: 'ENTER_LEVEL', payload: id })}
            onBack={() => dispatch({ type: 'SET_SCREEN', payload: 'landing' })}
            onFreeMode={() => dispatch({ type: 'SET_SCREEN', payload: 'free-mode' })}
            completedCount={progress.getCompletedCount()}
            totalStars={progress.getTotalStars()}
            isUnlocked={progress.isUnlocked}
            isCompleted={progress.isCompleted}
            getStars={progress.getStars}
          />
        )}

        {state.screen === 'free-mode' && (
          <FreeMode
            onBack={() => dispatch({ type: 'SET_SCREEN', payload: 'dashboard' })}
          />
        )}

        {state.screen === 'level' && state.currentLevelId != null && (
          <LevelScreen
            levelId={state.currentLevelId}
            progress={progress}
            onBack={() => dispatch({ type: 'SET_SCREEN', payload: 'dashboard' })}
          />
        )}

        {state.glossaryOpen && (
          <GlossaryModal onClose={() => dispatch({ type: 'CLOSE_GLOSSARY' })} />
        )}

        {state.conceptModalOpen && state.currentLevelId != null && (
          <ConceptModal
            levelId={state.currentLevelId}
            onClose={() => dispatch({ type: 'CLOSE_CONCEPT' })}
          />
        )}

        {state.celebrationOpen && (
          <CelebrationOverlay
            stars={state.celebrationStars}
            levelId={state.currentLevelId!}
            isLastLevel={state.currentLevelId === LEVEL_COUNT}
            totalStars={progress.getTotalStars()}
            maxStars={LEVEL_COUNT * 3}
            onStayHere={() => dispatch({ type: 'CLOSE_CELEBRATION' })}
            onNext={() => {
              dispatch({ type: 'CLOSE_CELEBRATION' });
              const nextId = (state.currentLevelId ?? 0) + 1;
              if (nextId <= LEVEL_COUNT) {
                dispatch({ type: 'ENTER_LEVEL', payload: nextId });
              } else {
                dispatch({ type: 'SET_SCREEN', payload: 'dashboard' });
              }
            }}
            onDashboard={() => {
              dispatch({ type: 'CLOSE_CELEBRATION' });
              dispatch({ type: 'SET_SCREEN', payload: 'dashboard' });
            }}
          />
        )}
      </Suspense>
    </>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppInner />
    </AppProvider>
  );
}
