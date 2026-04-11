import type { LdapEntry, ValidationResult } from '../engine/types';

export type Screen = 'landing' | 'dashboard' | 'level';

export interface AppState {
  screen: Screen;
  currentLevelId: number | null;
  queryInput: string;
  queryResults: LdapEntry[] | null;
  allQueryResults: LdapEntry[] | null;
  validationResult: ValidationResult | null;
  parseError: string | null;
  hintsUsed: number;
  currentHintIndex: number;
  attempts: number;
  selectedEntryDn: string | null;
  expandedNodes: Set<string>;
  glossaryOpen: boolean;
  conceptModalOpen: boolean;
  celebrationOpen: boolean;
  celebrationStars: number;
  answerInput: string;
  answerResult: ValidationResult | null;
}

export type Action =
  | { type: 'SET_SCREEN'; payload: Screen }
  | { type: 'ENTER_LEVEL'; payload: number }
  | { type: 'SET_QUERY'; payload: string }
  | { type: 'SET_RESULTS'; payload: { results: LdapEntry[]; allResults: LdapEntry[]; validation: ValidationResult } }
  | { type: 'SET_QUERY_RESULTS'; payload: { results: LdapEntry[]; allResults: LdapEntry[] } }
  | { type: 'SET_PARSE_ERROR'; payload: string }
  | { type: 'INCREMENT_ATTEMPTS' }
  | { type: 'USE_HINT' }
  | { type: 'SELECT_ENTRY'; payload: string | null }
  | { type: 'TOGGLE_NODE'; payload: string }
  | { type: 'EXPAND_ALL'; payload: string[] }
  | { type: 'OPEN_GLOSSARY' }
  | { type: 'CLOSE_GLOSSARY' }
  | { type: 'OPEN_CONCEPT' }
  | { type: 'CLOSE_CONCEPT' }
  | { type: 'OPEN_CELEBRATION'; payload: number }
  | { type: 'CLOSE_CELEBRATION' }
  | { type: 'RESET_LEVEL' }
  | { type: 'SET_ANSWER_INPUT'; payload: string }
  | { type: 'SET_ANSWER_RESULT'; payload: ValidationResult };
