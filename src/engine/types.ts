export interface LdapEntry {
  dn: string;
  attributes: Record<string, string | string[]>;
}

export type LdapScope = 'base' | 'one' | 'sub';

export type LdapFilter =
  | { type: 'and'; filters: LdapFilter[] }
  | { type: 'or'; filters: LdapFilter[] }
  | { type: 'not'; filter: LdapFilter }
  | { type: 'item'; attr: string; op: '=' | '>=' | '<=' | '~='; value: string };

export interface ValidationResult {
  correct: boolean;
  type?: 'success' | 'warning' | 'error';
  feedback: string;
}

export interface TeamsContextMeta {
  type: 'teams';
  sender: string;
  senderRole: string;
  avatarColor: string;
  timestamp: string;
}

export interface JiraContextMeta {
  type: 'jira';
  ticketId: string;
  issueType: 'Task' | 'Incident' | 'Bug' | 'Story';
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  ticketTitle: string;
  reporter: string;
}

export interface EmailContextMeta {
  type: 'email';
  from: string;
  fromRole: string;
  subject: string;
  date: string;
}

export type ContextMeta = TeamsContextMeta | JiraContextMeta | EmailContextMeta;

export type LdapFlavor = 'ad' | 'openldap' | 'both';

interface BaseLevelFields {
  id: number;
  title: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  context: string;
  contextType?: 'plain' | 'teams' | 'jira' | 'email';
  contextMeta?: ContextMeta;
  task: string;
  baseDN: string;
  scope: LdapScope;
  hints: string[];
  flavor?: LdapFlavor;
  insight?: string;
}

export interface FilterLevel extends BaseLevelFields {
  answerType?: never;
  expectedDNs: string[];
  solution?: string;
  validate: (result: LdapEntry[], filterStr?: string) => ValidationResult;
}

export interface InvestigativeLevel extends BaseLevelFields {
  answerType: 'number' | 'boolean';
  answerPrompt: string;
  validateAnswer: (answer: string) => ValidationResult;
}

export type Level = FilterLevel | InvestigativeLevel;

export interface LevelProgress {
  stars: number;
  completed: boolean;
  attempts: number;
}

export type ProgressMap = Record<number, LevelProgress>;

export interface Theory {
  badge: string;
  title: string;
  html: string;
}

export interface GlossaryTerm {
  code: string;
  short: string;
  body: string;
}
