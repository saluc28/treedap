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

  // ── BEGINNER (Levels 1-3) ────────────────────────────────────────────────────

  {
    id: 1,
    title: "The Directory",
    difficulty: "beginner",
    context: "Welcome. Before writing any filter, look at what you have on screen. The tree on the left is the directory - a hierarchy of entries. Every entry has a unique address called a <strong>DN</strong> (Distinguished Name), read right-to-left like a reverse file path: <code>uid=alice.smith,ou=People,dc=treedap,dc=com</code> means 'Alice, inside the People container, inside the treedap.com domain'. The root here is <code>dc=treedap,dc=com</code>. Expand it and you will see its direct children. Click a couple of them to see their attributes in the right panel - that is what every LDAP query ultimately returns.<br><br>Every entry declares what it is through an <code>objectClass</code> attribute. Containers carry <code>objectClass=organizationalUnit</code>, person entries carry <code>inetOrgPerson</code>, groups carry <code>groupOfNames</code>. Filtering on objectClass is how you ask the directory 'show me only entries of this type'.<br><br>Below the tree there is a filter bar. That is where the real work happens. Your first task is to use it.",
    task: "Find the top-level organizational units - the containers directly under the root",
    baseDN: "dc=treedap,dc=com",
    scope: "one",
    expectedDNs: [
      "ou=People,dc=treedap,dc=com",
      "ou=Groups,dc=treedap,dc=com",
      "ou=Services,dc=treedap,dc=com",
      "ou=Computers,dc=treedap,dc=com"
    ],
    hints: [
      "An LDAP filter uses the form <code>(attribute=value)</code> with parentheses. The attribute here is <code>objectClass</code> and the value is the name of the entry type you are looking for.",
      "Containers in LDAP are entries of type <code>organizationalUnit</code>. Your filter is <code>(objectClass=organizationalUnit)</code>. The scope is already set to <code>one</code> which means 'only direct children of the baseDN' - exactly what you want.",
      "Type <code>(objectClass=organizationalUnit)</code> in the filter bar and press Run. You should get four results - People, Groups, Services, Computers. These are the top-level containers of the directory. Every entry you will work with in later levels lives inside one of them."
    ],
    flavor: "both" as const,
    solution: "(objectClass=organizationalUnit)",
    insight: "<code>objectClass</code> is the universal type tag - every entry has one, so it's the first filter to try when you need 'show me all the X'.",
    validate(result: LdapEntry[]): ValidationResult {
      return validateByDNSet(result, this.expectedDNs, '(objectClass=organizationalUnit)');
    }
  },

  {
    id: 2,
    title: "Your First Filter",
    difficulty: "beginner",
    context: "A filter is a predicate you write to select entries from the directory. The simplest form is <code>(attribute=value)</code> - it matches every entry where that attribute equals that value. The most useful attribute to start with is <code>objectClass</code>, which every entry must have. It declares what type of entry this is: <code>organizationalUnit</code> for containers, <code>inetOrgPerson</code> for people, <code>groupOfNames</code> for groups, <code>account</code> for service accounts, <code>device</code> for machines. Filter on objectClass and you instantly know what you are dealing with.",
    task: "Find all person accounts in the entire directory",
    baseDN: "dc=treedap,dc=com",
    scope: "sub",
    expectedDNs: [
      "uid=lisa.parker,ou=People,dc=treedap,dc=com",
      "uid=alice.smith,ou=People,dc=treedap,dc=com",
      "uid=bob.johnson,ou=People,dc=treedap,dc=com",
      "uid=carol.white,ou=People,dc=treedap,dc=com",
      "uid=david.brown,ou=People,dc=treedap,dc=com",
      "uid=eve.davis,ou=People,dc=treedap,dc=com",
      "uid=frank.miller,ou=People,dc=treedap,dc=com",
      "uid=grace.lee,ou=People,dc=treedap,dc=com",
      "uid=henry.scott,ou=People,dc=treedap,dc=com",
      "uid=tom.harris,ou=Contractors,ou=People,dc=treedap,dc=com",
      "uid=sara.klein,ou=Contractors,ou=People,dc=treedap,dc=com"
    ],
    hints: [
      "Person accounts in this directory use the <code>inetOrgPerson</code> objectClass. This is the standard OpenLDAP class for human user accounts - equivalent to what Active Directory calls a <code>user</code> object.",
      "The filter syntax is always <code>(attributeName=value)</code> with parentheses. Attribute names are case-insensitive. Try: <code>(objectClass=inetOrgPerson)</code>.",
      "Scope is already set to <code>sub</code> which means the search descends into every sub-OU. You should get back all person accounts regardless of where they sit in the tree."
    ],
    flavor: "openldap" as const,
    solution: "(objectClass=inetOrgPerson)",
    insight: "<code>inetOrgPerson</code> is the OpenLDAP class for human accounts. AD uses <code>(objectClass=user)</code> instead - same concept, different schema label. Picking the wrong one is one of the most common cross-platform mistakes.",
    validate(result: LdapEntry[]): ValidationResult {
      return validateByDNSet(result, this.expectedDNs, '(objectClass=inetOrgPerson)');
    }
  },

  {
    id: 3,
    title: "The Asset Audit",
    difficulty: "beginner",
    contextType: "jira" as const,
    contextMeta: {
      type: 'jira' as const,
      ticketId: 'TD-145',
      issueType: 'Task' as const,
      priority: 'Medium' as const,
      ticketTitle: 'Quarterly inventory - list every employee workstation',
      reporter: 'Megan Carter (IT Asset Management)',
    },
    context: "IT Asset Management needs a list of every employee workstation for the quarterly audit. The directory stores all hardware under <code>ou=Computers</code>: workstations, servers, printers, and network gear (routers, switches, firewalls, access points). By convention, workstation entries are named with a <code>ws-</code> prefix (e.g. <code>cn=ws-alice</code>), servers use <code>srv-</code>, printers <code>prn-</code>, network devices <code>rtr-/sw-/fw-/ap-</code>. They are all stored as <code>objectClass=device</code> - so filtering on objectClass alone would give you every piece of hardware in the company. You need to combine two conditions: the objectClass and a pattern match on the cn. LDAP supports wildcards in equality filters: <code>(cn=ws-*)</code> matches any entry whose cn starts with <code>ws-</code>.",
    task: "Find every employee workstation in the directory (cn starts with ws-, objectClass is device)",
    baseDN: "ou=Computers,dc=treedap,dc=com",
    scope: "sub",
    expectedDNs: [
      "cn=ws-david,ou=Workstations,ou=Computers,dc=treedap,dc=com",
      "cn=ws-lisa,ou=Workstations,ou=Computers,dc=treedap,dc=com",
      "cn=ws-alice,ou=Workstations,ou=Computers,dc=treedap,dc=com",
      "cn=ws-carol,ou=Workstations,ou=Computers,dc=treedap,dc=com",
      "cn=ws-henry,ou=Workstations,ou=Computers,dc=treedap,dc=com",
      "cn=ws-bob,ou=Workstations,ou=Computers,dc=treedap,dc=com"
    ],
    hints: [
      "You need two conditions combined with AND: <code>(&(condition1)(condition2))</code>. One condition fixes the objectClass, the other matches the naming pattern.",
      "The wildcard <code>*</code> matches any sequence of characters inside an equality filter. <code>(cn=ws-*)</code> matches every cn beginning with <code>ws-</code> - it will exclude servers, printers, and network gear.",
      "Try: <code>(&(objectClass=device)(cn=ws-*))</code>. This returns the six workstations and nothing else - no servers, no printers, no switches, no OU containers."
    ],
    flavor: "both" as const,
    solution: "(&(objectClass=device)(cn=ws-*))",
    insight: "Wildcards on <code>cn</code> let you slice hardware by naming convention without a dedicated attribute. Always combine with <code>objectClass</code> so you don't catch OU containers with names starting the same way.",
    validate(result: LdapEntry[]): ValidationResult {
      return validateByDNSet(result, this.expectedDNs, '(&(objectClass=device)(cn=ws-*))');
    }
  },

  // ── INTERMEDIATE (Levels 4-9) ────────────────────────────────────────────────

  {
    id: 4,
    title: "The Wrong Branch",
    difficulty: "intermediate",
    contextType: "jira" as const,
    contextMeta: {
      type: 'jira' as const,
      ticketId: 'TD-318',
      issueType: 'Incident' as const,
      priority: 'Critical' as const,
      ticketTitle: 'All logins broken after config deployment',
      reporter: 'Deploy Pipeline (automated)',
    },
    context: "A config change was pushed to production at 03:12. Since then, 100% of user logins fail. The new config sets <code>baseDN=ou=Services,dc=treedap,dc=com</code>. The previous config had <code>baseDN=ou=People,dc=treedap,dc=com</code>. No other changes were made. The baseDN tells the LDAP server where to start searching. If the baseDN does not cover the location of your user accounts, the server will find nothing - it simply never looks in the right place.",
    task: "Verify the impact: how many person accounts can be found from ou=Services?",
    baseDN: "ou=Services,dc=treedap,dc=com",
    scope: "sub",
    answerType: "number" as const,
    answerPrompt: "How many inetOrgPerson accounts are reachable from baseDN ou=Services?",
    hints: [
      "Run a filter for person accounts from the current baseDN. The baseDN is fixed at <code>ou=Services</code> for this exercise - that is the broken configuration you need to analyse.",
      "Use <code>(objectClass=inetOrgPerson)</code> and count the results. The Services OU contains only service accounts with a different objectClass.",
      "Zero results from a valid filter is the clearest possible sign of a wrong baseDN. The filter is correct, the accounts exist - they are just unreachable from this starting point."
    ],
    flavor: "both" as const,
    insight: "baseDN is scoped, not absolute. If your data lives in a sibling branch, the server finds nothing and returns no error - just an empty result set, which callers often misread as 'user not registered'.",
    validateAnswer(answer: string): ValidationResult {
      const n = parseInt(answer.trim(), 10);
      if (n === 0) return { correct: true, feedback: "Correct. Zero person accounts are reachable from ou=Services because that OU contains only service accounts (objectClass=account). The LDAP server obeys the baseDN strictly - it never searches outside it. The fix is to restore baseDN to ou=People,dc=treedap,dc=com." };
      return { correct: false, feedback: "Run the query and count the results. Person accounts (inetOrgPerson) do not live under ou=Services." };
    }
  },

  {
    id: 5,
    title: "The Invisible Contractors",
    difficulty: "intermediate",
    contextType: "jira" as const,
    contextMeta: {
      type: 'jira' as const,
      ticketId: 'TD-302',
      issueType: 'Incident' as const,
      priority: 'High' as const,
      ticketTitle: 'Authentication broken for contractor accounts',
      reporter: 'Daniel Wright (IT Helpdesk)',
    },
    context: "Two contractors - Tom Harris and Sara Klein - cannot log in since this morning. The app uses baseDN <code>ou=People,dc=treedap,dc=com</code> with scope <code>one</code> and filter <code>(objectClass=inetOrgPerson)</code>. Both accounts are active and the passwords are correct. When you search the directory yourself you can see them in the tree. The app insists they don't exist. The scope is the culprit: scope <code>one</code> only searches direct children of the baseDN - it never descends into sub-OUs like <code>ou=Contractors</code>. To confirm the root cause, isolate exactly the accounts the app is failing to reach.",
    task: "Find only the contractor accounts that the app cannot see",
    baseDN: "ou=People,dc=treedap,dc=com",
    scope: "sub",
    expectedDNs: [
      "uid=tom.harris,ou=Contractors,ou=People,dc=treedap,dc=com",
      "uid=sara.klein,ou=Contractors,ou=People,dc=treedap,dc=com"
    ],
    hints: [
      "You need a filter that matches only contractor accounts, not all person accounts. Look at the entries in the tree - what attribute distinguishes contractors from regular employees?",
      "Contractor accounts have <code>title=Contractor</code>. Combine that with <code>objectClass=inetOrgPerson</code> using an AND operator: <code>(&(condition1)(condition2))</code>.",
      "Try: <code>(&(objectClass=inetOrgPerson)(title=Contractor))</code>. This returns only the accounts the app cannot see - the ones sitting inside the sub-OU that scope=one never reaches."
    ],
    flavor: "both" as const,
    solution: "(&(objectClass=inetOrgPerson)(title=Contractor))",
    insight: "Attributes like <code>title</code> or <code>department</code> are often more reliable than DN location. Contractors may sit in sub-OUs or alongside employees - filter on the attribute, not on where they live.",
    validate(result: LdapEntry[]): ValidationResult {
      return validateByDNSet(result, this.expectedDNs, '(&(objectClass=inetOrgPerson)(title=Contractor))');
    }
  },

  {
    id: 6,
    title: "The Moved Service Account",
    difficulty: "intermediate",
    contextType: "email" as const,
    contextMeta: {
      type: 'email' as const,
      from: 'Brian Stevens',
      fromRole: 'Backend Developer',
      subject: 'LDAP bind failing after infrastructure review',
      date: 'Mon, 13 Apr 2026, 17:40',
    },
    context: "The app's bind DN is <code>cn=ldap-svc,dc=treedap,dc=com</code> - that is what has been in the config since day one. Last week's infrastructure review moved all service accounts into the <code>ou=Services</code> container. Nobody updated the app config. Now every bind attempt fails with <em>invalid credentials</em>, even though the password is unchanged. In LDAP, a DN is both a unique identifier and an address. Moving an entry to a different OU changes its DN completely. The old DN no longer exists anywhere in the directory.",
    task: "Confirm the old bind DN no longer exists - search for cn=ldap-svc as a direct child of dc=treedap,dc=com",
    baseDN: "dc=treedap,dc=com",
    scope: "one",
    answerType: "boolean" as const,
    answerPrompt: "Does cn=ldap-svc exist as a direct child of dc=treedap,dc=com?",
    hints: [
      "Use scope <code>one</code> - it searches only direct children of the baseDN, which is exactly what the old config assumed. If the entry were still there, it would show up here.",
      "Try <code>(cn=ldap-svc)</code>. Zero results means the entry is not a direct child of the root. Then search the full tree with scope <code>sub</code> to confirm where it actually lives now.",
      "The entry exists - just not where the app expects it. Scope <code>one</code> from the root shows only the top-level OUs. The service account moved to <code>ou=Services</code>, making its new DN <code>cn=ldap-svc,ou=Services,dc=treedap,dc=com</code>."
    ],
    flavor: "both" as const,
    insight: "A DN is both ID and address. Moving an entry across OUs keeps the data but breaks every config that references the old DN - silently, because the directory just returns 'not found'.",
    validateAnswer(answer: string): ValidationResult {
      if (answer === 'No') return { correct: true, feedback: "Correct. cn=ldap-svc does not exist as a direct child of dc=treedap,dc=com. After the move, its DN is cn=ldap-svc,ou=Services,dc=treedap,dc=com. The app config must be updated to use this new DN. This is a common post-migration failure: the account is intact but unreachable at the configured address." };
      return { correct: false, feedback: "Run (cn=ldap-svc) with scope one from dc=treedap,dc=com and count the results. A DN is a precise address - if the entry moved, the old address is gone." };
    }
  },

  {
    id: 7,
    title: "The Wrong Login Attribute",
    difficulty: "intermediate",
    contextType: "teams" as const,
    contextMeta: {
      type: 'teams' as const,
      sender: 'Rachel Hayes',
      senderRole: 'Backend Developer',
      avatarColor: '#498205',
      timestamp: 'Today 10:15',
    },
    context: "I'm integrating a third-party SSO library. It builds the LDAP search filter using the username the user types at login. It constructs: <code>(cn=alice.smith)</code>. Zero results, every time. I checked and Alice's account definitely exists. I tried her full name too: <code>(cn=Alice Smith)</code> - that works, but users obviously don't type their full name at login. The <code>cn</code> attribute stores the full display name ('Alice Smith'). The login identifier is stored in a different attribute. This is a very common misconfiguration when integrating libraries that default to <code>cn</code> for the search filter.",
    task: "Find Alice Smith's account using the attribute that stores her login name (not her display name)",
    baseDN: "ou=People,dc=treedap,dc=com",
    scope: "sub",
    expectedDNs: ["uid=alice.smith,ou=People,dc=treedap,dc=com"],
    hints: [
      "Click Alice's entry in the directory tree and compare the <code>cn</code> value with the other attributes. One of them stores the short login identifier that matches the format users type at the keyboard.",
      "In inetOrgPerson schema, <code>cn</code> is the common name (display name). The login attribute is <code>uid</code> - it stores the short username. These two attributes serve different purposes and almost never have the same value.",
      "Try: <code>(uid=alice.smith)</code>. The SSO library's filter attribute needs to be changed from <code>cn</code> to <code>uid</code> in its configuration."
    ],
    flavor: "openldap" as const,
    solution: "(uid=alice.smith)",
    insight: "<code>uid</code> is the OpenLDAP login attribute. AD doesn't populate it by default - AD logins use <code>sAMAccountName</code>. A config pointing at the wrong one returns zero matches even when the user obviously exists.",
    validate(result: LdapEntry[]): ValidationResult {
      return validateByDNSet(result, this.expectedDNs, '(uid=alice.smith)');
    }
  },

  {
    id: 8,
    title: "The Attribute Migration",
    difficulty: "intermediate",
    contextType: "teams" as const,
    contextMeta: {
      type: 'teams' as const,
      sender: 'Jason Cooper',
      senderRole: 'Backend Developer',
      avatarColor: '#0078d4',
      timestamp: 'Today 15:33',
    },
    context: "We just migrated to an AD-synced LDAP directory. My app's login filter is still <code>(uid=%s)</code> - written years ago against pure OpenLDAP. After the cutover the filter technically still works: <code>uid</code> happens to be populated by the sync, so users keep logging in. But security audit flagged it. In Active Directory the canonical login attribute is <code>sAMAccountName</code>, not <code>uid</code>; the synced <code>uid</code> is a compatibility convenience that disappears the day the sync template changes or a new account is provisioned with the AD-only profile. We need to migrate the filter now, before the next provisioning round breaks logins silently. Before you change the config, prove to yourself that the legacy filter still works in this dataset, then write the AD-canonical version that does not depend on the sync.",
    task: "Find Alice Smith using the AD-canonical login attribute - the one that does not depend on the OpenLDAP-side sync",
    baseDN: "ou=People,dc=treedap,dc=com",
    scope: "sub",
    expectedDNs: ["uid=alice.smith,ou=People,dc=treedap,dc=com"],
    hints: [
      "Step 1, verify the fragility yourself. Run <code>(uid=alice.smith)</code> against this baseDN. It returns Alice - because the AD sync currently populates <code>uid</code>. But that population is a sync convenience, not a directory truth: the day the sync template changes or a new account skips the OpenLDAP-compat field, the filter silently breaks. Now find the AD-native attribute that records the same login name and does not depend on a sync template.",
      "Click Alice's entry in the tree. Compare <code>uid</code> with another attribute that holds the same value but uses Microsoft's naming. That other attribute is the canonical AD login - it would still be present in a pure-AD environment with no OpenLDAP heritage.",
      "Try: <code>(sAMAccountName=alice.smith)</code>. The migration is a one-line config change in the app: filter template goes from <code>(uid=%s)</code> to <code>(sAMAccountName=%s)</code>. Same data today, durable to schema or sync changes tomorrow."
    ],
    flavor: "ad" as const,
    solution: "(sAMAccountName=alice.smith)",
    insight: "<code>sAMAccountName</code> is the AD-specific login attribute, required for domain logins and capped at 20 characters. Pure OpenLDAP deployments don't populate it - so apps written for AD break when pointed at an LDAP server using <code>uid</code>. The opposite trap is what this scenario warns against: a filter using <code>uid</code> against an AD-synced directory works today and silently breaks the day the sync stops populating it.",
    validate(result: LdapEntry[], filterStr?: string): ValidationResult {
      const usesSAM = (filterStr || '').toLowerCase().includes('samaccountname');
      if (!usesSAM) {
        return {
          correct: false,
          type: 'warning',
          feedback: "Your filter returns Alice in this dataset, but it depends on the OpenLDAP-side attribute the audit flagged. The whole point of this scenario is to stop using uid - the day the sync template changes, that filter silently breaks. Use the AD-canonical login attribute instead."
        };
      }
      return validateByDNSet(result, this.expectedDNs, '(sAMAccountName=alice.smith)');
    }
  },

  {
    id: 9,
    title: "The Incomplete Profile",
    difficulty: "intermediate",
    contextType: "jira" as const,
    contextMeta: {
      type: 'jira' as const,
      ticketId: 'TD-334',
      issueType: 'Task' as const,
      priority: 'Low' as const,
      ticketTitle: 'Org chart widget shows blank manager for most users',
      reporter: 'Emily Foster (Product)',
    },
    context: "The new org chart widget reads the <code>manager</code> attribute to build the hierarchy. For most users it shows nothing. The dev team assumed all accounts have a <code>manager</code> attribute - that assumption is wrong. In LDAP, attributes are optional unless the schema enforces them as required. An attribute that is absent returns no value - it does not return null or an empty string. The presence filter <code>(attr=*)</code> is the correct way to check whether an attribute exists. The NOT operator <code>(!())</code> inverts it: you get everything where the attribute is absent.",
    task: "Find all person accounts that are missing the manager attribute - these are the ones the widget cannot display",
    baseDN: "ou=People,dc=treedap,dc=com",
    scope: "sub",
    expectedDNs: [
      "uid=bob.johnson,ou=People,dc=treedap,dc=com",
      "uid=david.brown,ou=People,dc=treedap,dc=com",
      "uid=eve.davis,ou=People,dc=treedap,dc=com",
      "uid=frank.miller,ou=People,dc=treedap,dc=com",
      "uid=grace.lee,ou=People,dc=treedap,dc=com",
      "uid=lisa.parker,ou=People,dc=treedap,dc=com"
    ],
    hints: [
      "You need a filter that matches person accounts where the <code>manager</code> attribute is absent. The presence filter <code>(manager=*)</code> matches entries that HAVE it - you need the opposite.",
      "The NOT operator wraps a single filter: <code>(!(manager=*))</code> matches entries where manager is absent. Combine it with objectClass using AND.",
      "Try: <code>(&(objectClass=inetOrgPerson)(!(manager=*)))</code>. Each result is an account the org chart widget will silently skip."
    ],
    flavor: "both" as const,
    solution: "(&(objectClass=inetOrgPerson)(!(manager=*)))",
    insight: "<code>!(attr=*)</code> negates a presence check - it finds entries where the attribute is <em>absent</em>. This is the standard idiom for auditing incomplete records, and it works identically on AD and OpenLDAP.",
    validate(result: LdapEntry[]): ValidationResult {
      return validateByDNSet(result, this.expectedDNs, '(&(objectClass=inetOrgPerson)(!(manager=*)))');
    }
  },

  // ── ADVANCED (Levels 10-17) ──────────────────────────────────────────────────

  {
    id: 10,
    title: "The Lockout Audit",
    difficulty: "advanced",
    contextType: "jira" as const,
    contextMeta: {
      type: 'jira' as const,
      ticketId: 'TD-412',
      issueType: 'Task' as const,
      priority: 'High' as const,
      ticketTitle: 'Generate list of accounts currently locked by ppolicy',
      reporter: 'Hannah Whitfield (Security Operations)',
    },
    context: "Security Operations is investigating a brute-force wave from last night. They need a definitive list of every person account currently locked by the directory's password policy, so helpdesk can reset them in one batch. Application-level flags like <code>active</code> are useless for this - those are set by HR systems, not by the directory. OpenLDAP's ppolicy overlay records a directory-level lockout in the <code>pwdAccountLockedTime</code> attribute. An account has this attribute if and only if ppolicy has locked it. The presence filter <code>(attr=*)</code> matches any entry that has the attribute set, regardless of its value - exactly what you need here.",
    task: "Find every person account currently locked by the directory password policy",
    baseDN: "ou=People,dc=treedap,dc=com",
    scope: "sub",
    expectedDNs: [
      "uid=frank.miller,ou=People,dc=treedap,dc=com"
    ],
    hints: [
      "You need two conditions combined with AND: the entry must be a person account, AND it must have the lockout attribute set. Use the presence filter <code>(attr=*)</code> for the second part.",
      "The lockout attribute is <code>pwdAccountLockedTime</code>. An entry either has it (locked) or does not (not locked). Its exact value - a GeneralizedTime string - is irrelevant for the audit.",
      "Try: <code>(&(objectClass=inetOrgPerson)(pwdAccountLockedTime=*))</code>. Every result is an account the app's <code>active=TRUE</code> check would wrongly let through - the directory will still refuse every bind."
    ],
    flavor: "openldap" as const,
    solution: "(&(objectClass=inetOrgPerson)(pwdAccountLockedTime=*))",
    insight: "<code>pwdAccountLockedTime</code> is set by the OpenLDAP <code>ppolicy</code> overlay when a lockout triggers - its mere presence means 'locked'. AD uses <code>lockoutTime</code> instead, and you test for a non-zero value.",
    validate(result: LdapEntry[]): ValidationResult {
      return validateByDNSet(result, this.expectedDNs, '(&(objectClass=inetOrgPerson)(pwdAccountLockedTime=*))');
    }
  },

  {
    id: 11,
    title: "The Expired Password",
    difficulty: "advanced",
    contextType: "email" as const,
    contextMeta: {
      type: 'email' as const,
      from: 'Grace Lee',
      fromRole: 'Controller - Finance',
      subject: 'Cannot log in - two days now',
      date: 'Tue, 14 Apr 2026, 09:22',
    },
    context: "I haven't been able to log in for two days. IT confirmed my account is active and there is no lockout - they checked <code>pwdAccountLockedTime</code> specifically after last month's incident with Frank. The password is correct, I type it carefully every time. I set it when I joined 14 months ago and never changed it since. Password expiry is distinct from account lockout. OpenLDAP's ppolicy overlay records when a password was last changed in <code>pwdChangedTime</code>. When that date combined with the policy's <code>pwdMaxAge</code> falls in the past, the bind returns error 49 sub-code 773 - different from the 775 sub-code for lockout. Most apps surface both as a generic 'invalid credentials' message.",
    task: "Investigate Grace Lee's account - has her password exceeded the maximum age?",
    baseDN: "ou=People,dc=treedap,dc=com",
    scope: "sub",
    answerType: "boolean" as const,
    answerPrompt: "Has Grace Lee's password expired according to the directory?",
    hints: [
      "This is different from an account lockout. Run <code>(uid=grace.lee)</code> and compare her attributes to those of other users. Look for any attribute that records password history or age.",
      "The <code>pwdChangedTime</code> attribute records when the password was last changed, in GeneralizedTime format (YYYYMMDDHHmmssZ). If the gap between that date and today exceeds the policy's maximum password age, the password is expired.",
      "Grace's <code>pwdChangedTime</code> is set to January 2023 - over 14 months ago. With a standard 365-day policy, the password expired in January 2024 and every bind attempt has been failing at the server level since then."
    ],
    flavor: "openldap" as const,
    insight: "Password expiry and lockout are distinct failure modes with distinct error codes (773 vs 775), but most apps collapse them into one 'invalid credentials' message - hiding the actual remediation path from the user.",
    validateAnswer(answer: string): ValidationResult {
      if (answer === 'Yes') return { correct: true, feedback: "Correct. Grace's pwdChangedTime is set to 20230101120000Z - January 2023. With a 365-day password policy, her password expired in January 2024. The app receives LDAP error 49 sub-code 773 (password expired) but surfaces it as 'invalid credentials', giving Grace no actionable feedback. The fix: handle error 773 explicitly and prompt the user to change their password, rather than showing a generic login failure." };
      return { correct: false, feedback: "Run (uid=grace.lee) and read every attribute. There is one that tells you when her password was last changed - and how long ago that was." };
    }
  },

  {
    id: 12,
    title: "Five Tickets, One Symptom",
    difficulty: "advanced",
    contextType: "jira" as const,
    contextMeta: {
      type: 'jira' as const,
      ticketId: 'TD-415',
      issueType: 'Incident' as const,
      priority: 'Critical' as const,
      ticketTitle: 'Authentication failures across multiple accounts overnight',
      reporter: 'Help Desk (escalated)',
    },
    context: "Five accounts opened tickets last night, all with the same complaint: 'invalid credentials'. The directory is up. Manual binds confirmed each one returns LDAP error 49 - but error 49 is a bag of distinct sub-causes, all hidden behind the same generic message at the application layer.<br><br>The five accounts: <code>frank.miller</code>, <code>grace.lee</code>, <code>henry.scott</code>, <code>bob.johnson</code>, and the service account <code>ldap-svc</code>.<br><br>Some are blocked by directory-side state: lockout (<code>pwdAccountLockedTime</code> set), password expiry (<code>pwdChangedTime</code> older than the policy max age of 365 days), account expiry (<code>shadowExpire</code> in the past), or a forced reset (<code>pwdReset=TRUE</code>). For these the user could type the right password and still be rejected - the directory refuses the bind before the password is even compared. The remaining ones have no directory-side issue: the user really did mistype.<br><br>Help desk needs the count: how many of the five require directory-side remediation, and how many are plain wrong-password tickets to hand back to the user?",
    task: "Investigate the five accounts and count: how many are being rejected by directory-side state (lockout, password expiry, account expiry, or forced reset)?",
    baseDN: "dc=treedap,dc=com",
    scope: "sub",
    answerType: "number" as const,
    answerPrompt: "How many of the five accounts are blocked by directory-side state (not just a wrong password)?",
    hints: [
      "Run <code>(uid=frank.miller)</code>, <code>(uid=grace.lee)</code>, <code>(uid=henry.scott)</code>, <code>(uid=bob.johnson)</code>, and <code>(cn=ldap-svc)</code> one at a time. For each, read every attribute and check for any of: <code>pwdAccountLockedTime</code> (any value), <code>pwdChangedTime</code> older than 365 days, <code>shadowExpire</code> set to a past value, or <code>pwdReset=TRUE</code>.",
      "Frank has <code>pwdAccountLockedTime</code> set (locked by ppolicy after too many bad attempts). Grace has <code>pwdChangedTime</code> from January 2023 - past the 365-day max age (expired). The service account <code>ldap-svc</code> has <code>shadowExpire=19754</code> (early 2024 - already past). Henry has <code>pwdReset=TRUE</code> (admin forced him to change at next login). Bob has none of these.",
      "Four of the five (Frank, Grace, ldap-svc, Henry) are directory-side blocks - each one needs a different remediation (unlock, force change, extend expiry, clear pwdReset). One (Bob) is genuinely a wrong-password ticket - hand it back."
    ],
    flavor: "openldap" as const,
    insight: "Error 49 is the generic 'invalid credentials' but the sub-codes tell you the real cause: 773 (must change), 775 (locked), and policy-driven cases that surface as plain 49 with the diagnostic in the server log. Apps that collapse all of these into one user-facing message create an unsolvable troubleshooting loop where the user keeps trying the password they think is right while the directory rejects them for entirely different reasons. The fix is on the app side: read the sub-code and route the user to the right remediation - or at minimum log it so help desk can.",
    validateAnswer(answer: string): ValidationResult {
      const n = parseInt(answer.trim(), 10);
      if (n === 4) return { correct: true, feedback: "Correct. Four of the five are blocked at the directory before the password is even checked: Frank (locked, pwdAccountLockedTime set), Grace (password expired, pwdChangedTime over 365 days old), ldap-svc (account expired, shadowExpire 19754 = early 2024), Henry (forced reset, pwdReset=TRUE). Each needs a different remediation. Bob has no directory-side block - his complaint is a real wrong-password ticket. The deeper lesson: 'invalid credentials' at the app layer is a single string concealing four to six distinct directory states. Always check the LDAP sub-code (773, 775, 532, 533, etc.) before asking the user to re-type their password." };
      return { correct: false, feedback: "Investigate each of the five accounts and check for any of: pwdAccountLockedTime (any value), pwdChangedTime more than 365 days ago, shadowExpire set to a past value, pwdReset=TRUE. Each of those is a directory-side block. Then count." };
    }
  },

  {
    id: 13,
    title: "The Flat Group Problem",
    difficulty: "advanced",
    contextType: "teams" as const,
    contextMeta: {
      type: 'teams' as const,
      sender: 'Frank Miller',
      senderRole: 'Recruiter - HR',
      avatarColor: '#c43e1c',
      timestamp: 'Today 14:22',
    },
    context: "Hi, I still can't access the engineering portal. My manager told me I should have access because I'm in the engineering group via the backend team. The access control reads the groups that list Frank directly and denies if engineering is not among them. Standard LDAP search does not follow nested group membership: the chain here is four levels deep - <code>cn=all-staff</code> contains <code>cn=engineering</code>, <code>cn=engineering</code> contains <code>cn=team-backend</code>, and Frank is a member of <code>cn=team-backend</code> - but the entire chain is invisible to a flat <code>member</code> check. To prove the problem, enumerate exactly the groups that list Frank's DN directly. If <code>cn=engineering</code> is not in that list, the app will always deny him.",
    task: "List every group that has Frank Miller's DN as a direct member (no nesting)",
    baseDN: "ou=Groups,dc=treedap,dc=com",
    scope: "sub",
    expectedDNs: [
      "cn=hr-team,ou=Groups,dc=treedap,dc=com",
      "cn=team-backend,ou=Groups,dc=treedap,dc=com"
    ],
    hints: [
      "You need an AND filter combining two conditions: the entry is a group, AND its <code>member</code> attribute contains Frank's exact DN. The <code>member</code> attribute stores each member as a full DN string, so matching on it is an exact equality.",
      "Frank's DN is <code>uid=frank.miller,ou=People,dc=treedap,dc=com</code>. Groups use <code>objectClass=groupOfNames</code>. The filter is <code>(&(objectClass=groupOfNames)(member=uid=frank.miller,ou=People,dc=treedap,dc=com))</code>.",
      "You will get two results - <code>hr-team</code> and <code>team-backend</code>. Crucially, <code>engineering</code> is NOT among them, even though team-backend is nested inside it. Standard LDAP has no recursive memberOf expansion: the app must resolve nesting itself or the directory must run the memberOf overlay."
    ],
    flavor: "openldap" as const,
    solution: "(&(objectClass=groupOfNames)(member=uid=frank.miller,ou=People,dc=treedap,dc=com))",
    insight: "LDAP <code>member</code> is flat - only DIRECT memberships count. Nested groups (group-of-groups) are invisible to a flat member filter. AD solves this with <code>LDAP_MATCHING_RULE_IN_CHAIN</code>; OpenLDAP needs the <code>memberof</code> overlay or a client-side walk.",
    validate(result: LdapEntry[]): ValidationResult {
      return validateByDNSet(result, this.expectedDNs, '(&(objectClass=groupOfNames)(member=uid=frank.miller,ou=People,dc=treedap,dc=com))');
    }
  },

  {
    id: 14,
    title: "Open to Everyone",
    difficulty: "advanced",
    contextType: "email" as const,
    contextMeta: {
      type: 'email' as const,
      from: 'Mark Donovan',
      fromRole: 'Security Auditor',
      subject: 'Pentest finding: anonymous LDAP bind enabled',
      date: 'Thu, 16 Apr 2026, 11:30',
    },
    context: "The external pentest found that the LDAP server allows anonymous bind. This means any client that omits credentials entirely can still connect and query the directory. The app config has an empty bind DN - it was left that way during initial setup and never corrected. An anonymous client has no identity, so the server falls back to whatever is allowed by default - which on this server is full read access to the entire directory. For the risk report the auditor needs a precise list of accounts whose phone numbers are harvestable without authentication - concrete evidence that an unauthenticated attacker gets real PII, not just metadata.",
    task: "Identify all person accounts whose mobile number is exposed to unauthenticated clients",
    baseDN: "ou=People,dc=treedap,dc=com",
    scope: "sub",
    expectedDNs: [
      "uid=alice.smith,ou=People,dc=treedap,dc=com",
      "uid=bob.johnson,ou=People,dc=treedap,dc=com",
      "uid=carol.white,ou=People,dc=treedap,dc=com",
      "uid=david.brown,ou=People,dc=treedap,dc=com",
      "uid=eve.davis,ou=People,dc=treedap,dc=com",
      "uid=frank.miller,ou=People,dc=treedap,dc=com",
      "uid=grace.lee,ou=People,dc=treedap,dc=com",
      "uid=henry.scott,ou=People,dc=treedap,dc=com",
      "uid=tom.harris,ou=Contractors,ou=People,dc=treedap,dc=com"
    ],
    hints: [
      "You need two conditions: the entry must be a person account AND it must have a mobile number stored. Use an AND filter: <code>(&(condition1)(condition2))</code>.",
      "To check whether an attribute exists regardless of its value, use the presence filter: <code>(mobile=*)</code>. This matches any entry where mobile has any value at all.",
      "Try: <code>(&(objectClass=inetOrgPerson)(mobile=*))</code>. Every result is a real phone number readable by any unauthenticated client on the network."
    ],
    flavor: "both" as const,
    solution: "(&(objectClass=inetOrgPerson)(mobile=*))",
    insight: "The <code>*</code> wildcard on a bare attribute is a presence check - 'has any value'. It's the cleanest way to audit 'who has populated this field' without caring about specific values.",
    validate(result: LdapEntry[]): ValidationResult {
      return validateByDNSet(result, this.expectedDNs, '(&(objectClass=inetOrgPerson)(mobile=*))');
    }
  },

  {
    id: 15,
    title: "Credentials in the Clear",
    difficulty: "advanced",
    contextType: "email" as const,
    contextMeta: {
      type: 'email' as const,
      from: 'Patrick Connor',
      fromRole: 'Security Auditor',
      subject: 'Pentest finding: LDAP traffic unencrypted on port 389',
      date: 'Fri, 17 Apr 2026, 14:05',
    },
    context: "During the internal pentest we captured LDAP traffic between the app servers and the directory server on port 389 - no TLS. We can read the bind DN and password for the service account in plaintext directly from the packet capture. Every attribute of every user entry returned in authentication queries is also visible. LDAP on port 389 sends everything in cleartext: bind credentials, filters, and all returned data. The two encrypted alternatives are STARTTLS (port 389 with a TLS upgrade before any data flows) and LDAPS (port 636, TLS from the start). For the risk report, identify every service account whose credentials are currently flowing in cleartext.",
    task: "Identify all service accounts whose bind credentials are exposed in cleartext on every app connection",
    baseDN: "ou=Services,dc=treedap,dc=com",
    scope: "sub",
    expectedDNs: [
      "cn=ldap-svc,ou=Services,dc=treedap,dc=com",
      "cn=backup-svc,ou=Services,dc=treedap,dc=com",
      "cn=mail-svc,ou=Services,dc=treedap,dc=com",
      "cn=monitor-svc,ou=Services,dc=treedap,dc=com"
    ],
    hints: [
      "Service accounts are the accounts applications use to bind to the directory. Every one of them transmits its credentials in cleartext on every startup or reconnect. Use the objectClass filter to find them all in the Services OU.",
      "In this directory, service accounts have <code>objectClass=account</code> - the OpenLDAP class for non-person accounts. The Services OU is their container.",
      "Try: <code>(objectClass=account)</code>. Each result in the report represents a set of credentials that a network observer can read from a packet capture without any special tooling."
    ],
    flavor: "openldap" as const,
    solution: "(objectClass=account)",
    insight: "The <code>account</code> objectClass (paired with <code>simpleSecurityObject</code>) is a legacy OpenLDAP pattern for service accounts with a plain <code>userPassword</code>. AD has no equivalent - service identities live under <code>user</code> with stricter auditing. These entries are audit magnets.",
    validate(result: LdapEntry[]): ValidationResult {
      return validateByDNSet(result, this.expectedDNs, '(objectClass=account)');
    }
  },

  {
    id: 16,
    title: "The Invisible Primary Group",
    difficulty: "advanced",
    contextType: "email" as const,
    contextMeta: {
      type: 'email' as const,
      from: 'Brian Stevens',
      fromRole: 'Backend Developer',
      subject: 'Domain Users access broken after AD sync',
      date: 'Sat, 18 Apr 2026, 10:14',
    },
    context: "After last week's Active Directory sync, the internal portal denies access to every regular employee. The portal's access control reads the <code>member</code> attribute of <code>cn=domain-users</code> - which on AD-synced directories is always empty. Active Directory does not store the user's primary group as a <code>member</code> link: it stores the numeric <code>primaryGroupID</code> on the user entry instead. By convention, RID <code>513</code> is <code>Domain Users</code> (every regular employee), and <code>514</code> is <code>Domain Guests</code> (contractors and external accounts). To size the impact, produce the definitive list of every person account that belongs to Domain Users via their primary group - the users the portal is wrongly denying.",
    task: "Find every person account whose primary group is Domain Users (RID 513)",
    baseDN: "ou=People,dc=treedap,dc=com",
    scope: "sub",
    expectedDNs: [
      "uid=lisa.parker,ou=People,dc=treedap,dc=com",
      "uid=alice.smith,ou=People,dc=treedap,dc=com",
      "uid=bob.johnson,ou=People,dc=treedap,dc=com",
      "uid=carol.white,ou=People,dc=treedap,dc=com",
      "uid=david.brown,ou=People,dc=treedap,dc=com",
      "uid=eve.davis,ou=People,dc=treedap,dc=com",
      "uid=frank.miller,ou=People,dc=treedap,dc=com",
      "uid=grace.lee,ou=People,dc=treedap,dc=com",
      "uid=henry.scott,ou=People,dc=treedap,dc=com"
    ],
    hints: [
      "Click any employee's entry in the tree and look at their attributes. After the AD sync, a new numeric attribute appeared - it stores the RID of their primary group directly on the user, not as a group <code>member</code> link.",
      "The attribute is <code>primaryGroupID</code>. Employees carry <code>513</code> (Domain Users), contractors carry <code>514</code> (Domain Guests). Combine this with <code>objectClass=inetOrgPerson</code> using AND.",
      "Try: <code>(&(objectClass=inetOrgPerson)(primaryGroupID=513))</code>. The fix on the portal side: when the target group is the primary group of a user, it is never listed in <code>member</code>. The access check must query <code>primaryGroupID</code> separately, or resolve Domain Users specially."
    ],
    flavor: "ad" as const,
    solution: "(&(objectClass=inetOrgPerson)(primaryGroupID=513))",
    insight: "<code>primaryGroupID</code> is AD-specific. 513 = Domain Users (default for every account), 514 = Domain Guests. It doesn't appear in the <code>memberOf</code> chain, so membership audits that only check <code>memberOf</code> silently miss the primary group assignment.",
    validate(result: LdapEntry[]): ValidationResult {
      return validateByDNSet(result, this.expectedDNs, '(&(objectClass=inetOrgPerson)(primaryGroupID=513))');
    }
  },

  {
    id: 17,
    title: "The Full Tree Tax",
    difficulty: "advanced",
    contextType: "jira" as const,
    contextMeta: {
      type: 'jira' as const,
      ticketId: 'TD-421',
      issueType: 'Task' as const,
      priority: 'Medium' as const,
      ticketTitle: 'Login latency spike under load - LDAP search timeout',
      reporter: 'APM Alert (automated)',
    },
    context: "Under load, user login takes 6-8 seconds and occasionally times out. Profiling shows the bottleneck is the LDAP search. The app uses <code>baseDN=dc=treedap,dc=com</code>, scope <code>sub</code>, filter <code>(objectClass=inetOrgPerson)</code>. The LDAP server scans every single entry in the subtree to evaluate the filter - computers, servers, printers, network devices, service accounts, groups, project teams, OUs - before returning the few person accounts it is actually looking for. The fix is obvious once you measure the gap: restrict the baseDN to the OU that actually contains your users. To prove the waste, count how many entries the server touches today - every entry under the root - then compare mentally with the ~13 it would touch under <code>ou=People</code>.",
    task: "Count every entry under dc=treedap,dc=com - the total cost of the current (too broad) search",
    baseDN: "dc=treedap,dc=com",
    scope: "sub",
    answerType: "number" as const,
    answerPrompt: "How many total entries exist under dc=treedap,dc=com (run filter (objectClass=*) with scope sub)?",
    hints: [
      "Use filter <code>(objectClass=*)</code> - this matches every entry in the directory regardless of type. Combined with baseDN <code>dc=treedap,dc=com</code> and scope <code>sub</code>, it tells you exactly how many entries the server must scan for any root-level query.",
      "Mentally compare the count you get with what you would get from <code>ou=People,dc=treedap,dc=com</code> - roughly 13 entries (the OU itself, the Contractors sub-OU, and 11 person accounts). Everything else - workstations, servers, printers, switches, groups, projects, service accounts - is wasted work the server repeats on every login request.",
      "The optimization is a single config value: baseDN from <code>dc=treedap,dc=com</code> to <code>ou=People,dc=treedap,dc=com</code>. No code changes, no schema changes - just pointing the search at the right subtree."
    ],
    flavor: "both" as const,
    insight: "baseDN is the cheapest performance lever you have. A narrow baseDN means less to scan, fewer ACL evaluations, and smaller result sets - regardless of schema or indexing. When latency climbs, check the baseDN before tuning the filter.",
    validateAnswer(answer: string): ValidationResult {
      const n = parseInt(answer.trim(), 10);
      if (n === 85) return { correct: true, feedback: "Correct. 85 entries total in the directory, but the app only needs the 13 entries under ou=People - around 15%. The rest is pure overhead the server walks on every single login. Changing the baseDN reduces the scan by 85%. On a real directory with tens of thousands of entries the gain is proportionally larger - and on an unindexed attribute the difference between a targeted subtree search and a full tree scan can be the difference between milliseconds and seconds." };
      return { correct: false, feedback: "Run (objectClass=*) with scope sub from dc=treedap,dc=com and count every entry returned - OUs, users, groups, computers, servers, printers, switches, service accounts, everything." };
    }
  },

  {
    id: 18,
    title: "The Replication Trap",
    difficulty: "advanced",
    contextType: "jira" as const,
    contextMeta: {
      type: 'jira' as const,
      ticketId: 'TD-428',
      issueType: 'Task' as const,
      priority: 'Medium' as const,
      ticketTitle: 'Quarterly cleanup: disable accounts with no recent logins',
      reporter: 'Compliance (audit)',
    },
    context: "Compliance wants the quarterly cleanup of stale accounts: disable every user that has not logged in for 6 months or more. Today is <strong>2026-04-18</strong>; the threshold is therefore <strong>2025-10-18</strong> (in GeneralizedTime: <code>20251018000000Z</code>).<br><br>A junior engineer drafted the script using <code>lastLogon</code>. A senior pulled them aside before it ran: in Active Directory, <code>lastLogon</code> is per-DC and never replicates - the value you query depends on which DC you happened to hit. A user who logs in only against DC-east will appear stale on DC-west, even though they are perfectly active. The script would have disabled active users.<br><br>The replicated alternative is <code>lastLogonTimestamp</code>: granularity ~14 days (good enough for a 6-month threshold), but consistent across every DC. It is the attribute Microsoft built specifically for stale-account detection.<br><br>For the audit, identify exactly the accounts that have genuinely not logged in across the directory for 6+ months. Avoid the trap: a filter on <code>lastLogon</code> on this DC would return more accounts than it should.",
    task: "Find every person account whose most recent replicated logon is on or before 2025-10-18",
    baseDN: "ou=People,dc=treedap,dc=com",
    scope: "sub",
    expectedDNs: [
      "uid=lisa.parker,ou=People,dc=treedap,dc=com"
    ],
    hints: [
      "You need an AND of two conditions: the entry is a person account, AND the replicated last-logon attribute is on or before 2025-10-18 (in GeneralizedTime: <code>20251018000000Z</code>). The non-replicated <code>lastLogon</code> would let through users who are active on other DCs - do not use it.",
      "The replicated attribute is <code>lastLogonTimestamp</code>. Use the <code>&lt;=</code> operator: <code>(lastLogonTimestamp&lt;=20251018000000Z)</code>. Combine with <code>(objectClass=inetOrgPerson)</code> with an AND.",
      "Try: <code>(&(objectClass=inetOrgPerson)(lastLogonTimestamp&lt;=20251018000000Z))</code>. As an experiment, run the same filter with <code>lastLogon</code> instead of <code>lastLogonTimestamp</code>. That one returns Carol too - but Carol's <code>lastLogonTimestamp</code> is from March 2026, meaning she logged in to another DC two weeks ago. Disabling her would have caused an outage. Congratulations - you have finished every scenario."
    ],
    flavor: "ad" as const,
    solution: "(&(objectClass=inetOrgPerson)(lastLogonTimestamp<=20251018000000Z))",
    insight: "<code>lastLogon</code> is updated on every successful bind on each individual DC and never replicates - by design, to spare replication traffic. <code>lastLogonTimestamp</code> is replicated but only refreshed when the gap between the new value and the stored one exceeds the policy (<code>ms-DS-LogonTimeSyncInterval</code>, default 14 days). For real-time activity checks you must query every DC; for stale-account detection use <code>lastLogonTimestamp</code> and accept the 14-day fuzziness. Cleanup scripts written against <code>lastLogon</code> have repeatedly disabled active users in production - the failure mode is silent until SSO outages arrive in the morning.",
    validate(result: LdapEntry[]): ValidationResult {
      return validateByDNSet(result, this.expectedDNs, '(&(objectClass=inetOrgPerson)(lastLogonTimestamp<=20251018000000Z))');
    }
  },

];
