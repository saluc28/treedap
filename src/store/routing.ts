import type { Screen } from './types';

const LEVEL_COUNT = 18;

export interface Route {
  screen: Screen;
  currentLevelId: number | null;
}

export function parsePath(pathname: string = window.location.pathname): Route {
  const p = pathname.replace(/\/+$/, ''); // strip trailing slash

  const levelMatch = p.match(/^\/level\/(\d+)$/);
  if (levelMatch) {
    const id = parseInt(levelMatch[1], 10);
    if (!isNaN(id) && id >= 1 && id <= LEVEL_COUNT) {
      return { screen: 'level', currentLevelId: id };
    }
  }
  if (p === '/free' || p === '/free-mode') return { screen: 'free-mode', currentLevelId: null };
  if (p === '/dashboard') return { screen: 'dashboard', currentLevelId: null };
  return { screen: 'landing', currentLevelId: null };
}

export function routeToPath(screen: Screen, levelId: number | null): string {
  if (screen === 'level' && levelId != null) return `/level/${levelId}`;
  if (screen === 'free-mode') return '/free';
  if (screen === 'dashboard') return '/dashboard';
  return '/';
}
