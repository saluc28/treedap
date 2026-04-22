import { createContext, useContext, useReducer, useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import type { AppState, Action } from './types';
import { reducer, initialState } from './reducer';
import { parsePath, routeToPath } from './routing';

interface AppContextValue {
  state: AppState;
  dispatch: React.Dispatch<Action>;
}

const AppContext = createContext<AppContextValue | null>(null);

function loadInitialState(): AppState {
  const route = parsePath();
  return { ...initialState, screen: route.screen, currentLevelId: route.currentLevelId };
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, loadInitialState);
  const lastWrittenPath = useRef<string>(routeToPath(state.screen, state.currentLevelId));

  useEffect(() => {
    document.documentElement.classList.remove('hide-shell');
  }, []);

  // Sync state → URL.
  useEffect(() => {
    const target = routeToPath(state.screen, state.currentLevelId);
    if (target !== window.location.pathname && target !== lastWrittenPath.current) {
      lastWrittenPath.current = target;
      window.history.pushState(null, '', target);
    } else if (target !== window.location.pathname) {
      // Initial sync after mount.
      window.history.replaceState(null, '', target);
    }
  }, [state.screen, state.currentLevelId]);

  // Sync URL → state (back/forward, external navigation).
  useEffect(() => {
    function onPopState() {
      const route = parsePath();
      lastWrittenPath.current = routeToPath(route.screen, route.currentLevelId);
      if (route.screen === 'level' && route.currentLevelId != null) {
        dispatch({ type: 'ENTER_LEVEL', payload: route.currentLevelId });
      } else {
        dispatch({ type: 'SET_SCREEN', payload: route.screen });
      }
    }
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error('useApp must be used within AppProvider');
  }
  return ctx;
}
