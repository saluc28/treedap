import type { AppState, Action } from './types';

export const initialState: AppState = {
  screen: 'landing',
  currentLevelId: null,
  queryInput: '',
  queryResults: null,
  allQueryResults: null,
  validationResult: null,
  parseError: null,
  hintsUsed: 0,
  currentHintIndex: -1,
  attempts: 0,
  selectedEntryDn: null,
  expandedNodes: new Set<string>(),
  glossaryOpen: false,
  conceptModalOpen: false,
  celebrationOpen: false,
  celebrationStars: 0,
  answerInput: '',
  answerResult: null,
};

export function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'SET_SCREEN':
      return { ...state, screen: action.payload };

    case 'ENTER_LEVEL':
      return {
        ...state,
        screen: 'level',
        currentLevelId: action.payload,
        queryInput: '',
        queryResults: null,
        allQueryResults: null,
        validationResult: null,
        parseError: null,
        hintsUsed: 0,
        currentHintIndex: -1,
        attempts: 0,
        selectedEntryDn: null,
        expandedNodes: new Set<string>(),
        celebrationOpen: false,
        conceptModalOpen: true,
        answerInput: '',
        answerResult: null,
      };

    case 'SET_QUERY':
      return { ...state, queryInput: action.payload };

    case 'INCREMENT_ATTEMPTS':
      return { ...state, attempts: state.attempts + 1 };

    case 'SET_RESULTS':
      return {
        ...state,
        queryResults: action.payload.results,
        allQueryResults: action.payload.allResults,
        validationResult: action.payload.validation,
        parseError: null,
      };

    case 'SET_QUERY_RESULTS':
      return {
        ...state,
        queryResults: action.payload.results,
        allQueryResults: action.payload.allResults,
        validationResult: null,
        parseError: null,
      };

    case 'SET_PARSE_ERROR':
      return {
        ...state,
        parseError: action.payload,
        queryResults: null,
        allQueryResults: null,
        validationResult: null,
      };

    case 'USE_HINT': {
      const nextIndex = Math.min(state.currentHintIndex + 1, 2); // max 3 hints (0,1,2)
      return {
        ...state,
        currentHintIndex: nextIndex,
        hintsUsed: Math.max(state.hintsUsed, nextIndex + 1),
      };
    }

    case 'SELECT_ENTRY':
      return { ...state, selectedEntryDn: action.payload };

    case 'TOGGLE_NODE': {
      const next = new Set(state.expandedNodes);
      if (next.has(action.payload)) {
        next.delete(action.payload);
      } else {
        next.add(action.payload);
      }
      return { ...state, expandedNodes: next };
    }

    case 'EXPAND_ALL': {
      const next = new Set(action.payload);
      return { ...state, expandedNodes: next };
    }

    case 'OPEN_GLOSSARY':
      return { ...state, glossaryOpen: true };

    case 'CLOSE_GLOSSARY':
      return { ...state, glossaryOpen: false };

    case 'OPEN_CONCEPT':
      return { ...state, conceptModalOpen: true };

    case 'CLOSE_CONCEPT':
      return { ...state, conceptModalOpen: false };

    case 'OPEN_CELEBRATION':
      return { ...state, celebrationOpen: true, celebrationStars: action.payload };

    case 'CLOSE_CELEBRATION':
      return { ...state, celebrationOpen: false };

    case 'RESET_LEVEL':
      return {
        ...state,
        queryInput: '',
        queryResults: null,
        allQueryResults: null,
        validationResult: null,
        parseError: null,
        hintsUsed: 0,
        currentHintIndex: -1,
        attempts: 0,
        selectedEntryDn: null,
        expandedNodes: new Set<string>(),
        answerInput: '',
        answerResult: null,
      };

    case 'SET_VALIDATION':
      return { ...state, validationResult: action.payload };

    case 'SET_ANSWER_INPUT':
      return { ...state, answerInput: action.payload };

    case 'SET_ANSWER_RESULT':
      return { ...state, answerResult: action.payload };

    default:
      return state;
  }
}
