import { useState } from 'react';
import type { LevelProgress, ProgressMap } from '../engine/types';

const STORAGE_KEY = 'ldaplearn_progress';

export function useProgress() {
  const [progress, setProgress] = useState<ProgressMap>(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}') as ProgressMap;
    } catch {
      return {};
    }
  });

  const save = (levelId: number, update: Partial<LevelProgress>) => {
    setProgress(prev => {
      const existing = prev[levelId] || { stars: 0, completed: false, attempts: 0 };
      const next: ProgressMap = {
        ...prev,
        [levelId]: {
          ...existing,
          ...update,
          // Only upgrade stars, never downgrade
          stars: Math.max(existing.stars || 0, update.stars || 0),
        }
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  };

  const isUnlocked = (levelId: number): boolean => {
    if (levelId === 1) return true;
    return !!progress[levelId - 1]?.completed;
  };

  const isCompleted = (levelId: number): boolean => {
    return !!progress[levelId]?.completed;
  };

  const getStars = (levelId: number): number => {
    return progress[levelId]?.stars || 0;
  };

  const getCompletedCount = (): number =>
    Object.values(progress).filter(p => p?.completed).length;

  const getTotalStars = (): number =>
    Object.values(progress).reduce((sum, p) => sum + (p?.stars || 0), 0);

  return {
    save,
    isUnlocked,
    isCompleted,
    getStars,
    getCompletedCount,
    getTotalStars,
  };
}
