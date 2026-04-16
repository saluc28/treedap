import { createContext, useContext, useReducer, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { AppState, Action } from './types';
import { reducer, initialState } from './reducer';

interface AppContextValue {
  state: AppState;
  dispatch: React.Dispatch<Action>;
}

const AppContext = createContext<AppContextValue | null>(null);

const SESSION_KEY = 'treedap_nav';

function loadInitialState(): AppState {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (!raw) return initialState;
    const { screen, currentLevelId } = JSON.parse(raw);
    if (screen === 'dashboard' || (screen === 'level' && currentLevelId != null)) {
      return { ...initialState, screen, currentLevelId };
    }
  } catch {
    // ignore parse errors
  }
  return initialState;
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, loadInitialState);

  // Remove the hide-shell class injected by the inline script in index.html
  useEffect(() => {
    document.documentElement.classList.remove('hide-shell');
  }, []);

  useEffect(() => {
    if (state.screen === 'landing') {
      sessionStorage.removeItem(SESSION_KEY);
    } else {
      sessionStorage.setItem(SESSION_KEY, JSON.stringify({
        screen: state.screen,
        currentLevelId: state.currentLevelId,
      }));
    }
  }, [state.screen, state.currentLevelId]);

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
