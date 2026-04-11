import type { ContextMeta, EmailContextMeta, JiraContextMeta, TeamsContextMeta } from '../../engine/types';

interface ObjectiveBarProps {
  context: string;
  task: string;
  contextType?: 'plain' | 'teams' | 'jira' | 'email';
  contextMeta?: ContextMeta;
}

export function ObjectiveBar({ context, task, contextType = 'plain', contextMeta }: ObjectiveBarProps) {
  return (
    <div className="objective-bar">
      <div className="objective-inner">
        {contextType === 'teams' && contextMeta?.type === 'teams' && (
          <TeamsMessage context={context} meta={contextMeta} />
        )}
        {contextType === 'jira' && contextMeta?.type === 'jira' && (
          <JiraTicket context={context} meta={contextMeta} />
        )}
        {contextType === 'email' && contextMeta?.type === 'email' && (
          <EmailMessage context={context} meta={contextMeta} />
        )}
        {(contextType === 'plain' || !contextType) && (
          <div className="objective-context-row">
            <span className="objective-context-label">📋 Scenario</span>
            <span className="objective-context-text" dangerouslySetInnerHTML={{ __html: context }} />
          </div>
        )}
        <div className="objective-task-row">
          <span className="objective-task-label">🎯 Your task</span>
          <span className="objective-task-text" dangerouslySetInnerHTML={{ __html: task }} />
        </div>
      </div>
    </div>
  );
}

function getInitials(name: string): string {
  return name.split(' ').slice(0, 2).map(p => p[0]).join('').toUpperCase();
}

function TeamsMessage({ context, meta }: { context: string; meta: TeamsContextMeta }) {
  return (
    <div className="ctx-teams">
      <div className="ctx-teams-header">
        <div className="ctx-teams-avatar" style={{ background: meta.avatarColor }}>
          {getInitials(meta.sender)}
        </div>
        <div className="ctx-teams-sender-block">
          <span className="ctx-teams-sender">{meta.sender}</span>
          <span className="ctx-teams-role">{meta.senderRole}</span>
        </div>
        <span className="ctx-teams-timestamp">{meta.timestamp}</span>
      </div>
      <div className="ctx-teams-body" dangerouslySetInnerHTML={{ __html: context }} />
    </div>
  );
}

const JIRA_TYPE_COLORS: Record<string, string> = {
  Incident: '#ff7452',
  Task: '#4bade8',
  Bug: '#e5493a',
  Story: '#36b37e',
};

const JIRA_PRIORITY_COLORS: Record<string, string> = {
  Critical: '#c9372c',
  High: '#e2483d',
  Medium: '#e97f33',
  Low: '#2d8738',
};

function JiraTicket({ context, meta }: { context: string; meta: JiraContextMeta }) {
  const typeColor = JIRA_TYPE_COLORS[meta.issueType] ?? '#4bade8';
  const priorityColor = JIRA_PRIORITY_COLORS[meta.priority] ?? '#e97f33';

  return (
    <div className="ctx-jira">
      <div className="ctx-jira-header">
        <div className="ctx-jira-badges">
          <span className="ctx-jira-type" style={{ background: typeColor }}>{meta.issueType}</span>
          <span className="ctx-jira-id">{meta.ticketId}</span>
        </div>
        <div className="ctx-jira-priority">
          <span className="ctx-jira-priority-dot" style={{ background: priorityColor }} />
          <span className="ctx-jira-priority-label">{meta.priority}</span>
        </div>
      </div>
      <div className="ctx-jira-title">{meta.ticketTitle}</div>
      <div className="ctx-jira-reporter">Reported by <strong>{meta.reporter}</strong></div>
      <div className="ctx-jira-body" dangerouslySetInnerHTML={{ __html: context }} />
    </div>
  );
}

function EmailMessage({ context, meta }: { context: string; meta: EmailContextMeta }) {
  return (
    <div className="ctx-email">
      <div className="ctx-email-header">
        <div className="ctx-email-row">
          <span className="ctx-email-field">From</span>
          <span className="ctx-email-value"><strong>{meta.from}</strong> <span className="ctx-email-role">({meta.fromRole})</span></span>
        </div>
        <div className="ctx-email-row">
          <span className="ctx-email-field">Subject</span>
          <span className="ctx-email-value ctx-email-subject">{meta.subject}</span>
        </div>
        <div className="ctx-email-row">
          <span className="ctx-email-field">Date</span>
          <span className="ctx-email-value ctx-email-date">{meta.date}</span>
        </div>
      </div>
      <div className="ctx-email-divider" />
      <div className="ctx-email-body" dangerouslySetInnerHTML={{ __html: context }} />
    </div>
  );
}
