import type { Level, LdapEntry, ValidationResult } from '../engine/types';

function normalizeDN(dn: string): string {
  return dn.trim().toLowerCase();
}

function validateByDNSet(result: LdapEntry[], expectedDNs: string[], hint: string): ValidationResult {
  const exp = expectedDNs.map(normalizeDN).sort();
  const got = result.map(e => normalizeDN(e.dn)).sort();

  const expSet = new Set(exp);
  const gotSet = new Set(got);

  const missing = exp.filter(d => !gotSet.has(d));
  const extra = got.filter(d => !expSet.has(d));

  if (missing.length === 0 && extra.length === 0) {
    return { correct: true, feedback: `Perfect! You matched all ${exp.length} expected entries.` };
  }

  if (got.length === 0) {
    return {
      correct: false,
      type: 'warning',
      feedback: `No results. Your filter doesn't match any entries. Double-check attribute names and values. Hint: try ${hint}`
    };
  }

  if (extra.length > 0 && missing.length === 0) {
    return {
      correct: false,
      type: 'warning',
      feedback: `Too many results (got ${got.length}, expected ${exp.length}). Your query is too broad. Try adding more conditions.`
    };
  }

  if (missing.length > 0 && extra.length === 0) {
    return {
      correct: false,
      type: 'warning',
      feedback: `Too few results (got ${got.length}, expected ${exp.length}). Your query is too restrictive. You're missing some entries.`
    };
  }

  return {
    correct: false,
    type: 'error',
    feedback: `Wrong entries matched. Got ${got.length} results but ${extra.length} are unexpected and ${missing.length} are missing. Hint: ${hint}`
  };
}

export const LEVELS: Level[] = [
  // ── BEGINNER (Levels 1-3) ───────────────────────────────────────────────────

  {
    id: 1,
    title: "Mapping the Directory",
    difficulty: "beginner",
    context: "You've just joined TreeDap Corp as a sysadmin. Before you can manage anything, you need to understand how the LDAP directory is organized. A directory is a tree: the root is the company domain, and below it sit containers called Organizational Units (OUs) that group related entries together.",
    task: "List all the top-level organizational units directly under dc=treedap,dc=com",
    baseDN: "dc=treedap,dc=com",
    scope: "one",
    expectedDNs: [
      "ou=People,dc=treedap,dc=com",
      "ou=Groups,dc=treedap,dc=com",
      "ou=Services,dc=treedap,dc=com",
      "ou=Computers,dc=treedap,dc=com"
    ],
    hints: [
      "<code>scope=one</code> searches only the <em>direct children</em> of the baseDN - one level down, without going deeper. Use it to list the immediate contents of a container.",
      "Every LDAP entry has an <code>objectClass</code> attribute that declares what type of entry it is. Containers and departments use <code>objectClass=organizationalUnit</code>.",
      "Try: <code>(objectClass=organizationalUnit)</code>"
    ],
    validate(result: LdapEntry[]): ValidationResult {
      return validateByDNSet(result, this.expectedDNs, '(objectClass=organizationalUnit)');
    }
  },

  {
    id: 2,
    title: "Finding a User Account",
    difficulty: "beginner",
    contextType: "jira" as const,
    contextMeta: {
      type: 'jira' as const,
      ticketId: 'TD-089',
      issueType: 'Incident' as const,
      priority: 'High' as const,
      ticketTitle: 'Cannot log in - Alice Smith',
      reporter: 'IT Helpdesk',
    },
    context: "User reports being unable to log in since this morning. No recent password reset or account changes on record. Account was confirmed active as of yesterday's routine scan. Requires LDAP entry inspection to verify account status and attributes. User accounts in this directory live inside the People OU, but in a real enterprise you often don't know which OU holds a user - so you search the entire tree recursively using <code>scope=sub</code>.",
    task: "Find Alice Smith's user account",
    baseDN: "dc=treedap,dc=com",
    scope: "sub",
    expectedDNs: ["uid=alice.smith,ou=People,dc=treedap,dc=com"],
    hints: [
      "<code>scope=sub</code> searches recursively through all descendants of the baseDN. Use it when you don't know which branch holds the entry you need.",
      "User accounts have <code>objectClass=inetOrgPerson</code>. Common attributes include <code>uid</code> (login name), <code>cn</code> (full name), and <code>mail</code> (email address).",
      "Try: <code>(uid=alice.smith)</code> or <code>(mail=alice@treedap.com)</code> or <code>(cn=Alice Smith)</code>"
    ],
    validate(result: LdapEntry[]): ValidationResult {
      return validateByDNSet(result, this.expectedDNs, '(uid=alice.smith)');
    }
  },

  {
    id: 3,
    title: "Pattern Matching",
    difficulty: "beginner",
    context: "The CTO asks for a headcount of all engineers for the quarterly report. You don't know the exact job titles in the system - there could be 'Software Engineer', 'DevOps Engineer', 'Security Engineer', and so on. Rather than guessing exact values, you use a wildcard to match any title that contains the word 'Engineer'.",
    task: "Find all employees whose job title contains the word 'Engineer'",
    baseDN: "ou=People,dc=treedap,dc=com",
    scope: "sub",
    expectedDNs: [
      "uid=alice.smith,ou=People,dc=treedap,dc=com",
      "uid=carol.white,ou=People,dc=treedap,dc=com"
    ],
    hints: [
      "The <code>*</code> character is a wildcard that matches any sequence of characters. Place it on the left to match a suffix (<code>*word</code>), on the right for a prefix (<code>word*</code>), or on both sides for a substring (<code>*word*</code>).",
      "The <code>title</code> attribute stores the employee's job title. Click some entries in the directory tree to inspect their actual title values.",
      "Try: <code>(title=*Engineer*)</code>"
    ],
    validate(result: LdapEntry[]): ValidationResult {
      return validateByDNSet(result, this.expectedDNs, '(title=*Engineer*)');
    }
  },

  // ── INTERMEDIATE (Levels 4-6) ───────────────────────────────────────────────

  {
    id: 4,
    title: "AND Operator",
    difficulty: "intermediate",
    context: "A vendor wants to invite active engineers to a product demo. You need accounts that satisfy two conditions at once: the user must be in the Engineering department AND their account must currently be active. A single-condition filter is no longer enough.",
    task: "Find all active employees in the Engineering department",
    baseDN: "dc=treedap,dc=com",
    scope: "sub",
    expectedDNs: [
      "uid=alice.smith,ou=People,dc=treedap,dc=com",
      "uid=carol.white,ou=People,dc=treedap,dc=com",
      "uid=eve.davis,ou=People,dc=treedap,dc=com"
    ],
    hints: [
      "You need both conditions to be true at the same time. In LDAP the AND operator is <code>&</code> and it wraps one or more filter expressions inside a pair of parentheses.",
      "The syntax is: <code>(&(filter1)(filter2))</code>. Both filters must match for an entry to be returned.",
      "Try: <code>(&(department=Engineering)(active=TRUE))</code>"
    ],
    validate(result: LdapEntry[]): ValidationResult {
      return validateByDNSet(result, this.expectedDNs, '(&(department=Engineering)(active=TRUE))');
    }
  },

  {
    id: 5,
    title: "OR Operator and Presence Filter",
    difficulty: "intermediate",
    context: "An incident alert needs to reach Engineering and IT staff via SMS - but only those who actually have a mobile number registered in the directory. This query combines two new ideas: the OR operator (to match either department) and a presence filter (to check that the mobile attribute exists).",
    task: "Find all active users in Engineering or IT who have a registered mobile number",
    baseDN: "dc=treedap,dc=com",
    scope: "sub",
    expectedDNs: [
      "uid=alice.smith,ou=People,dc=treedap,dc=com",
      "uid=carol.white,ou=People,dc=treedap,dc=com",
      "uid=eve.davis,ou=People,dc=treedap,dc=com",
      "uid=henry.scott,ou=People,dc=treedap,dc=com"
    ],
    hints: [
      "The OR operator is <code>|</code> and works exactly like AND in syntax: <code>(|(filter1)(filter2))</code>. At least one of the wrapped filters must match.",
      "A presence filter checks whether an attribute exists at all, regardless of its value. The syntax is <code>(attr=*)</code> - the lone wildcard means 'has any value'.",
      "Try: <code>(&(active=TRUE)(|(department=Engineering)(department=IT))(mobile=*))</code>"
    ],
    validate(result: LdapEntry[]): ValidationResult {
      return validateByDNSet(result, this.expectedDNs, '(&(active=TRUE)(|(department=Engineering)(department=IT))(mobile=*))');
    }
  },

  {
    id: 6,
    title: "NOT Operator",
    difficulty: "intermediate",
    context: "A security review requires a list of all active employees who are outside Finance and HR - the technical staff who need the new system access policy applied. Instead of listing every included department, it's cleaner to exclude the ones you don't want. This is where the NOT operator comes in.",
    task: "Find all active users who are not in Finance or HR",
    baseDN: "dc=treedap,dc=com",
    scope: "sub",
    expectedDNs: [
      "uid=alice.smith,ou=People,dc=treedap,dc=com",
      "uid=carol.white,ou=People,dc=treedap,dc=com",
      "uid=eve.davis,ou=People,dc=treedap,dc=com",
      "uid=henry.scott,ou=People,dc=treedap,dc=com"
    ],
    hints: [
      "The NOT operator is <code>!</code> and negates a single filter expression: <code>(!(condition))</code>. Any entry that would have matched the inner condition is excluded.",
      "To exclude multiple values at once, nest an OR inside the NOT: <code>(!(|(dept=Finance)(dept=HR)))</code>. This reads as 'not in Finance and not in HR'.",
      "Try: <code>(&(active=TRUE)(!(|(department=Finance)(department=HR))))</code>"
    ],
    validate(result: LdapEntry[]): ValidationResult {
      return validateByDNSet(result, this.expectedDNs, '(&(active=TRUE)(!(|(department=Finance)(department=HR))))');
    }
  },

  // ── ADVANCED (Levels 7-9) ───────────────────────────────────────────────────

  {
    id: 7,
    title: "Group Membership",
    difficulty: "intermediate",
    contextType: "teams" as const,
    contextMeta: {
      type: 'teams' as const,
      sender: 'Alice Smith',
      senderRole: 'Software Engineer',
      avatarColor: '#d83b01',
      timestamp: 'Today 09:47',
    },
    context: "Hey, can you take a look at something for me? I keep getting 'insufficient access' errors when I try to use the admin console - started this morning out of nowhere. My manager confirmed I should have admin rights on this system. Can you check if my account is actually in the right group? In LDAP, groups are separate entries and membership is stored in the group's <code>member</code> attribute as a list of full DNs.",
    task: "Find all groups that Alice Smith is a direct member of",
    baseDN: "ou=Groups,dc=treedap,dc=com",
    scope: "sub",
    expectedDNs: [
      "cn=admins,ou=Groups,dc=treedap,dc=com",
      "cn=engineering,ou=Groups,dc=treedap,dc=com",
      "cn=vpn-users,ou=Groups,dc=treedap,dc=com"
    ],
    hints: [
      "You're searching the Groups OU for entries whose <code>member</code> attribute contains Alice's DN. The search goes from the group toward the member, not the other way around.",
      "The <code>member</code> attribute stores full DNs as plain string values. You can filter on it exactly like any other attribute - just supply the full DN as the value.",
      "Click Alice's entry in the tree to read her exact DN. The filter attribute is <code>member</code> and the value is that complete DN - every component in order, including the <code>uid=</code> prefix."
    ],
    validate(result: LdapEntry[]): ValidationResult {
      return validateByDNSet(result, this.expectedDNs, '(member=uid=alice.smith,ou=People,dc=treedap,dc=com)');
    }
  },

  {
    id: 8,
    title: "Asset Inventory",
    difficulty: "intermediate",
    contextType: "jira" as const,
    contextMeta: {
      type: 'jira' as const,
      ticketId: 'TD-156',
      issueType: 'Incident' as const,
      priority: 'Medium' as const,
      ticketTitle: 'Missing patch bundle - workstation assigned to Carol White',
      reporter: 'Security Scanner (automated)',
    },
    context: "Automated vulnerability scanner detected that a workstation assigned to Carol White has not received patch bundle SEC-2024-11. LDAP isn't only for people and groups - enterprises also store devices in the directory, each with an <code>owner</code> attribute containing the full DN of the assigned user. Identify the exact machine entry and initiate targeted patch deployment.",
    task: "Find the workstation assigned to Carol White",
    baseDN: "ou=Computers,dc=treedap,dc=com",
    scope: "sub",
    expectedDNs: ["cn=ws-carol,ou=Workstations,ou=Computers,dc=treedap,dc=com"],
    hints: [
      "Machines in the directory have <code>objectClass=device</code>. Each one has an <code>owner</code> attribute that stores the full DN of the assigned user - a DN-valued attribute pointing across the tree.",
      "You're searching inside the Computers OU for a machine whose owner matches Carol. Supply her full DN as the filter value.",
      "Click Carol's entry in the tree to read her exact DN. The filter attribute is <code>owner</code> - same DN-value pattern as <code>member</code>, different attribute name."
    ],
    validate(result: LdapEntry[]): ValidationResult {
      return validateByDNSet(result, this.expectedDNs, '(owner=uid=carol.white,ou=People,dc=treedap,dc=com)');
    }
  },

  {
    id: 9,
    title: "Security Audit",
    difficulty: "advanced",
    context: "Quarterly security review. The compliance team needs two reports in one pass: first, identify stale accounts - inactive users with no mobile number registered, which are prime candidates for decommissioning. Second, produce a field-staff contact list: active Engineering or IT employees reachable by SMS, excluding contractor accounts (surname starting with 'D'). Both queries draw on everything you've learned.",
    task: "Find active users in Engineering or IT with a mobile number whose surname does not start with 'D'",
    baseDN: "dc=treedap,dc=com",
    scope: "sub",
    expectedDNs: [
      "uid=alice.smith,ou=People,dc=treedap,dc=com",
      "uid=carol.white,ou=People,dc=treedap,dc=com",
      "uid=henry.scott,ou=People,dc=treedap,dc=com"
    ],
    hints: [
      "Break the problem into four independent conditions: (1) <code>active=TRUE</code>, (2) mobile exists <code>(mobile=*)</code>, (3) Engineering OR IT, (4) surname does NOT start with 'D'. All four go inside a top-level AND.",
      "The decommission part needs two conditions: account status and the absence of a contact attribute. The field-staff query needs four things inside a top-level AND: active status, mobile presence, a department OR, and a surname exclusion with NOT and a wildcard.",
      "Four conditions, one AND. The department condition is an OR nested inside it. The surname exclusion is a NOT wrapping a wildcard match. You have all the operators - now combine them."
    ],
    validate(result: LdapEntry[]): ValidationResult {
      return validateByDNSet(result, this.expectedDNs, '(&(active=TRUE)(mobile=*)(|(department=Engineering)(department=IT))(!(sn=D*)))');
    }
  },

  // ── DIAGNOSTIC (Levels 10-12) ───────────────────────────────────────────────

  {
    id: 10,
    title: "The Missing Prefix",
    difficulty: "advanced",
    contextType: "teams" as const,
    contextMeta: {
      type: 'teams' as const,
      sender: 'Luca Ferretti',
      senderRole: 'Backend Developer',
      avatarColor: '#107c10',
      timestamp: 'Today 18:32',
    },
    context: "Hey, can you help me? I need to find all groups Henry Scott is in before revoking his access tonight. I tried <code>(member=henry.scott,ou=People,dc=treedap,dc=com)</code> but zero results. Also tried without the path: <code>(member=henry.scott)</code> - still nothing. His account definitely exists, I can see it in the tree. I don't get it, the filter looks right to me...",
    task: "Find all groups Henry Scott is a member of",
    baseDN: "ou=Groups,dc=treedap,dc=com",
    scope: "sub",
    expectedDNs: [
      "cn=admins,ou=Groups,dc=treedap,dc=com",
      "cn=vpn-users,ou=Groups,dc=treedap,dc=com",
      "cn=it-ops,ou=Groups,dc=treedap,dc=com"
    ],
    hints: [
      "Luca's filter looks almost right but has one structural flaw. Open the directory tree, expand Groups, click any group, and compare the exact format of its <code>member</code> values against what Luca tried.",
      "A DN is not just a path - each component has a named attribute prefix. The first component of a user DN is not just the login value: it is <code>attributeName=value</code>. Look at the RDN prefix used on entries inside the People OU.",
      "You have all the information in the tree. Click Henry's entry to get his exact DN, then wrap it in <code>(member=...)</code>."
    ],
    validate(result: LdapEntry[]): ValidationResult {
      return validateByDNSet(result, this.expectedDNs, '(member=uid=henry.scott,ou=People,dc=treedap,dc=com)');
    }
  },

  {
    id: 11,
    title: "Lost in Translation",
    difficulty: "advanced",
    contextType: "teams" as const,
    contextMeta: {
      type: 'teams' as const,
      sender: 'Martina Russo',
      senderRole: 'Sysadmin',
      avatarColor: '#0078d4',
      timestamp: 'Today 14:15',
    },
    context: "I need to audit all service accounts for the compliance report. I tried <code>(objectClass=user)</code> like I always did in AD - nothing. Then I tried <code>(objectClass=serviceAccount)</code> - nothing. Even <code>(objectClass=computer)</code> just to test. I know the accounts are there, I can see them in the Services container. What is wrong with this directory?",
    task: "Find all service accounts in the directory",
    baseDN: "dc=treedap,dc=com",
    scope: "sub",
    expectedDNs: [
      "cn=ldap-svc,ou=Services,dc=treedap,dc=com",
      "cn=backup-svc,ou=Services,dc=treedap,dc=com",
      "cn=mail-svc,ou=Services,dc=treedap,dc=com",
      "cn=monitor-svc,ou=Services,dc=treedap,dc=com"
    ],
    hints: [
      "Martina is not wrong to think this way - in Active Directory, <code>objectClass=user</code> is the correct class for accounts. But this directory is not AD. Open the tree, expand the Services container, and click one of the entries to see what <code>objectClass</code> is actually stored.",
      "Every LDAP implementation defines its own schema. AD, OpenLDAP, and FreeIPA use different class names for equivalent concepts. The only reliable approach is to read the directory rather than assume a class name from another system.",
      "The answer is one click away in the tree. Once you have read the actual <code>objectClass</code> value from a service account entry, the filter writes itself."
    ],
    validate(result: LdapEntry[]): ValidationResult {
      return validateByDNSet(result, this.expectedDNs, '(objectClass=account)');
    }
  },

  {
    id: 12,
    title: "Lost in Translation (Values)",
    difficulty: "advanced",
    contextType: "teams" as const,
    contextMeta: {
      type: 'teams' as const,
      sender: 'Sara Conti',
      senderRole: 'Legal',
      avatarColor: '#8764b8',
      timestamp: 'Today 11:08',
    },
    context: "Hi, I need to configure a contract signing integration. It identifies signatories by job title in LDAP, and I need to point it at the head of Finance. I tried <code>(title=Finance Director)</code> - nothing. Then <code>(title=Head of Finance)</code> and <code>(title=Finance Manager)</code> - all zero results. The integration cannot use a name or uid filter, it must be title-based. I know it is David Brown but I have no idea what title string is actually stored for him in the directory.",
    task: "Find David Brown's account using the title attribute",
    baseDN: "ou=People,dc=treedap,dc=com",
    scope: "sub",
    expectedDNs: [
      "uid=david.brown,ou=People,dc=treedap,dc=com"
    ],
    hints: [
      "Sara's guesses are all plausible formal titles, but the directory stores whatever the data entry team typed - which may follow a completely different convention. The tree is the only source of truth. Open it, click David Brown's entry, and read his <code>title</code> attribute directly.",
      "LDAP equality filters require a byte-for-byte match against the stored value. The directory has no concept of synonyms, abbreviations, or equivalent role names. One character difference means zero results.",
      "Stop guessing - the answer is in the tree. Click the entry, copy the value exactly as stored, paste it into your filter."
    ],
    validate(result: LdapEntry[]): ValidationResult {
      return validateByDNSet(result, this.expectedDNs, '(title=CFO)');
    }
  },

  {
    id: 13,
    title: "The Ghost Member",
    difficulty: "advanced",
    contextType: "teams" as const,
    contextMeta: {
      type: 'teams' as const,
      sender: 'Francesca Vitale',
      senderRole: 'Security Team',
      avatarColor: '#c50f1f',
      timestamp: 'Today 16:45',
    },
    context: "David Brown resigned two weeks ago. I disabled his account the same day - set <code>active=FALSE</code> immediately, I have the ticket to prove it. But our SOC just escalated: the compliance scan is still flagging him as having access to Finance systems. I double-checked with <code>(&(uid=david.brown)(active=FALSE))</code> and the account is definitely disabled. How is this possible? What am I missing?",
    task: "Investigate David Brown's group memberships and report how many groups he is still listed as a member of",
    baseDN: "dc=treedap,dc=com",
    scope: "sub",
    answerType: "number" as const,
    answerPrompt: "How many groups is David Brown still listed as a member of?",
    hints: [
      "Francesca disabled the account correctly - but in LDAP, account status and group membership are entirely separate. Setting <code>active=FALSE</code> modifies the user entry only. It has zero effect on group objects that list him as a <code>member</code>.",
      "Group memberships live on the group object, not on the user. Use the query panel to search the Groups branch for any group where the <code>member</code> attribute contains David's full DN. His DN is constructed from his UID and the People OU - click his entry to read it exactly.",
      "Each group entry returned by your query is one membership David still holds. Count the results and enter that number."
    ],
    validateAnswer(answer: string): ValidationResult {
      const n = parseInt(answer.trim(), 10);
      if (n === 3) return { correct: true, feedback: "Correct. David is still listed as a member of 3 groups despite his account being disabled. LDAP has no cascade: deactivating a user never removes them from group membership lists. Offboarding procedures must explicitly remove the user from all groups." };
      if (!isNaN(n) && n < 3) return { correct: false, feedback: `You found ${n} group${n === 1 ? '' : 's'} - there are more. Make sure you are searching the entire Groups branch with scope sub and using David's exact DN as the filter value.` };
      return { correct: false, feedback: "That is not the right count. Check your filter - make sure you are matching only groups where David appears as a member." };
    }
  },

  {
    id: 14,
    title: "Orphaned Assets",
    difficulty: "advanced",
    contextType: "jira" as const,
    contextMeta: {
      type: 'jira' as const,
      ticketId: 'TD-271',
      issueType: 'Task' as const,
      priority: 'Medium' as const,
      ticketTitle: 'Hardware refresh - reclaim machines from former employees',
      reporter: 'Marco Bianchi (IT Operations)',
    },
    context: "We are doing a hardware refresh before Q3 and need to reclaim machines from former employees. I exported the Computers OU but cannot cross-reference which machines are assigned to users who have already left. Need the exact count of workstations currently assigned to inactive users so we know what to physically collect from the office.",
    task: "Identify workstations whose owner is a disabled user and report the count",
    baseDN: "dc=treedap,dc=com",
    scope: "sub",
    answerType: "number" as const,
    answerPrompt: "How many workstations are currently assigned to an inactive user?",
    hints: [
      "This requires two queries. First identify which users have <code>active=FALSE</code> - search the People branch and note their full DNs. Then look at the workstation entries.",
      "A workstation's <code>owner</code> attribute holds the full DN of its assigned user - the same DN-value pattern you used with <code>member</code> in groups. Search the Computers branch with <code>(owner=...)</code> using the inactive user's DN.",
      "LDAP has no join. You build the picture yourself: get the inactive user DN from one query, use it as the filter value in a second query on the Computers branch. Each match is an orphaned workstation."
    ],
    validateAnswer(answer: string): ValidationResult {
      const n = parseInt(answer.trim(), 10);
      if (n === 2) return { correct: true, feedback: "Correct. Two workstations are still assigned to disabled users. The <code>owner</code> attribute is never updated automatically when an account is deactivated - removing or reassigning device ownership must be an explicit step in the offboarding checklist." };
      if (n === 0) return { correct: false, feedback: "There are multiple orphaned workstations. Make sure you are checking all inactive users and searching for owner matches using their exact DNs." };
      if (n === 1) return { correct: false, feedback: "There is more than one. Make sure you found all disabled users first - there may be more than one inactive account with an assigned machine." };
      return { correct: false, feedback: "That count is off. Verify your inactive user list first, then search for owner matches one DN at a time." };
    }
  },

  {
    id: 15,
    title: "Silent Data",
    difficulty: "advanced",
    contextType: "email" as const,
    contextMeta: {
      type: 'email' as const,
      from: 'Elena Marchetti',
      fromRole: 'Compliance Officer',
      subject: 'GDPR pre-audit: personal data on inactive accounts',
      date: 'Tue, 7 Apr 2026, 09:15',
    },
    context: "We have a GDPR audit next month. One item on the checklist is personal contact data retained for former employees - specifically mobile numbers on accounts that have been deactivated. I need the exact count of disabled accounts that still carry a mobile number in the directory so I can include it in the pre-audit report. The DPO needs this by end of day.",
    task: "Count disabled user accounts that still have a mobile number attribute stored in the directory",
    baseDN: "ou=People,dc=treedap,dc=com",
    scope: "sub",
    answerType: "number" as const,
    answerPrompt: "How many disabled accounts still have a mobile number stored in the directory?",
    hints: [
      "You need entries that satisfy two conditions at once: the account is disabled (<code>active=FALSE</code>) and the <code>mobile</code> attribute is present. To check whether an attribute exists regardless of its value, use the presence filter: <code>(mobile=*)</code>.",
      "Combine the two conditions with an AND operator: <code>(&(condition1)(condition2))</code>. One condition checks a specific value, the other uses the presence filter. Run this against the People branch.",
      "Count the entries returned by your filter. Each one is a disabled account with a mobile number still on record in the directory."
    ],
    validateAnswer(answer: string): ValidationResult {
      const n = parseInt(answer.trim(), 10);
      if (n === 1) return { correct: true, feedback: "Correct. One disabled account still has a mobile number stored. LDAP does not delete attributes automatically when an account is disabled - personal data persists until explicitly removed. From a GDPR standpoint, this data either needs to be erased or covered by a documented retention justification." };
      if (n === 0) return { correct: false, feedback: "At least one disabled account has a mobile number stored. Check your presence filter syntax - <code>(mobile=*)</code> matches any entry where the attribute exists with any value." };
      return { correct: false, feedback: "That count is too high. Verify that you are also filtering for disabled accounts - otherwise you may be counting active users with mobile numbers." };
    }
  }
];
