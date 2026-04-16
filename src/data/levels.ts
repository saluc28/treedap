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
    context: "Before touching any query, you need to understand what you are looking at. An LDAP directory is a tree of entries. Every entry has a unique address called a DN (Distinguished Name) - think of it as a file path but read right to left. The root of this directory is <code>dc=treedap,dc=com</code>. Directly under it sit four containers called Organizational Units (OUs): one for people, one for groups, one for services, one for computers. Expand the tree on the left and click a few entries to see their attributes. The Concept panel above has more detail whenever you need it.",
    task: "How many Organizational Units exist as direct children of dc=treedap,dc=com?",
    baseDN: "dc=treedap,dc=com",
    scope: "one",
    answerType: "number" as const,
    answerPrompt: "How many OUs are direct children of dc=treedap,dc=com?",
    hints: [
      "Run the filter <code>(objectClass=organizationalUnit)</code>. Every container in an LDAP directory declares itself as an <code>organizationalUnit</code> via its <code>objectClass</code> attribute.",
      "The baseDN is <code>dc=treedap,dc=com</code> and scope is <code>one</code> - so you are only looking at direct children of the root, one level deep. Sub-containers inside People or Computers are not included.",
      "Count the results. Each one is a top-level OU - a logical grouping that tells you how this organisation has divided its directory."
    ],
    validateAnswer(answer: string): ValidationResult {
      const n = parseInt(answer.trim(), 10);
      if (n === 4) return { correct: true, feedback: "Correct. Four OUs at the top level: People, Groups, Services, Computers. This is a typical flat structure for a small organisation. In larger enterprises you might find dozens of OUs nested several levels deep - which is exactly why scope and baseDN matter so much when you write a query." };
      if (n < 4) return { correct: false, feedback: "There are more. Run (objectClass=organizationalUnit) and count every result returned." };
      return { correct: false, feedback: "Too many. Make sure scope is set to one - you should only be seeing direct children of the root, not entries deeper in the tree." };
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
    validate(result: LdapEntry[]): ValidationResult {
      return validateByDNSet(result, this.expectedDNs, '(objectClass=inetOrgPerson)');
    }
  },

  {
    id: 3,
    title: "BaseDN and Scope",
    difficulty: "beginner",
    context: "Every LDAP query has two parameters that control where the server looks - and getting either wrong means finding nothing even if your filter is perfect. The <strong>baseDN</strong> is the entry where the search starts. The server never looks above it. The <strong>scope</strong> controls how deep it goes from there: <code>base</code> checks only the baseDN entry itself, <code>one</code> checks its direct children only, <code>sub</code> descends recursively through the entire subtree. This exercise uses <code>scope=one</code> from the root. Think about what that means before you run anything.",
    task: "Run (objectClass=inetOrgPerson) and report how many person accounts scope=one finds from dc=treedap,dc=com",
    baseDN: "dc=treedap,dc=com",
    scope: "one",
    answerType: "number" as const,
    answerPrompt: "How many person accounts does scope=one return from dc=treedap,dc=com?",
    hints: [
      "Run <code>(objectClass=inetOrgPerson)</code> and count the results. Think about what scope <code>one</code> means: it only searches the direct children of <code>dc=treedap,dc=com</code>. Are any person accounts stored directly there?",
      "The direct children of the root are the four top-level OUs: People, Groups, Services, Computers. Person accounts live inside the People OU - which is a level deeper. Scope <code>one</code> stops before it ever reaches them.",
      "The answer makes the point clearly. This is exactly the kind of misconfiguration that produces zero results with a perfectly correct filter - and it is one of the most common LDAP bugs in production apps."
    ],
    validateAnswer(answer: string): ValidationResult {
      const n = parseInt(answer.trim(), 10);
      if (n === 0) return { correct: true, feedback: "Correct. Zero results - not because the filter is wrong, but because scope=one from the root only sees the four top-level OUs. Person accounts are inside ou=People, which is one level deeper than scope=one will go. The fix is scope=sub, or a more specific baseDN like ou=People,dc=treedap,dc=com with scope=sub. You will see this exact mistake in several of the upcoming scenarios." };
      return { correct: false, feedback: "Run the filter and look at the result count. With scope=one from dc=treedap,dc=com, what are the direct children you can actually reach?" };
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
      reporter: 'Fabio Marini (IT Helpdesk)',
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
      from: 'Luca Ferretti',
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
      sender: 'Valentina Greco',
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
      sender: 'Marco Bianchi',
      senderRole: 'Backend Developer',
      avatarColor: '#0078d4',
      timestamp: 'Today 15:33',
    },
    context: "We just migrated to an AD-synced LDAP directory. My app uses <code>(uid=alice.smith)</code> as the login filter - worked perfectly on the old pure OpenLDAP setup. Now zero results for every user. I checked, the accounts are all there in the tree. Nothing in the filter itself looks wrong to me. In Active Directory and AD-synced directories, the canonical login attribute is <code>sAMAccountName</code>, not <code>uid</code>. Pure OpenLDAP environments use <code>uid</code>. Both attributes exist in this directory after the sync - but <code>sAMAccountName</code> is the one AD-aware systems rely on.",
    task: "Find Alice Smith's account using the AD login attribute",
    baseDN: "ou=People,dc=treedap,dc=com",
    scope: "sub",
    expectedDNs: ["uid=alice.smith,ou=People,dc=treedap,dc=com"],
    hints: [
      "Click Alice's entry in the tree and look at every attribute. After the AD sync, a new attribute was added alongside <code>uid</code>. It stores the same login name under the attribute name that Active Directory uses.",
      "In AD environments, <code>sAMAccountName</code> is the login attribute - the equivalent of <code>uid</code> in OpenLDAP. When an app migrates from pure OpenLDAP to AD-synced LDAP, changing the filter attribute from <code>uid</code> to <code>sAMAccountName</code> is almost always required.",
      "Try: <code>(sAMAccountName=alice.smith)</code>. The app's config needs a single value change: the filter template goes from <code>(uid=%s)</code> to <code>(sAMAccountName=%s)</code>."
    ],
    validate(result: LdapEntry[]): ValidationResult {
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
      reporter: 'Giulia Mancini (Product)',
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
    validate(result: LdapEntry[]): ValidationResult {
      return validateByDNSet(result, this.expectedDNs, '(&(objectClass=inetOrgPerson)(!(manager=*)))');
    }
  },

  // ── ADVANCED (Levels 10-16) ──────────────────────────────────────────────────

  {
    id: 10,
    title: "Active But Blocked",
    difficulty: "advanced",
    contextType: "teams" as const,
    contextMeta: {
      type: 'teams' as const,
      sender: 'Frank Miller',
      senderRole: 'Recruiter - HR',
      avatarColor: '#c43e1c',
      timestamp: 'Today 08:51',
    },
    context: "Hi, I cannot log in since yesterday evening. IT reset my password this morning and confirmed it is correct. I can see my account is active in the system. I tried three times and still get 'authentication failed'. Can you check what is wrong? The app code checks <code>active=TRUE</code> before allowing login, and Frank's account has exactly that. But <code>active</code> is an application-level attribute - it has nothing to do with the directory's own lockout mechanism. A directory can lock an account independently after too many failed attempts, regardless of <code>active</code>.",
    task: "Investigate Frank Miller's account - is it locked by the directory's password policy?",
    baseDN: "ou=People,dc=treedap,dc=com",
    scope: "sub",
    answerType: "boolean" as const,
    answerPrompt: "Is Frank Miller's account locked by a directory password policy?",
    hints: [
      "The <code>active</code> attribute is application-defined - it is checked by the app logic, not by LDAP itself. The directory has its own lockout mechanism stored in a different attribute.",
      "OpenLDAP's password policy overlay records lockouts in the <code>pwdAccountLockedTime</code> attribute. If this attribute is present on an entry, the account is locked at the directory level regardless of any application-side checks.",
      "Run <code>(uid=frank.miller)</code> and inspect Frank's entry carefully. Look for any attribute related to password or lockout state."
    ],
    validateAnswer(answer: string): ValidationResult {
      if (answer === 'Yes') return { correct: true, feedback: "Correct. Frank's entry has <code>pwdAccountLockedTime</code> set, which means the directory's password policy overlay has locked the account after repeated failed attempts. The app only checks <code>active=TRUE</code> and misses this entirely. The fix: the app must handle LDAP error code 53 (unwillingToPerform) or 49 with sub-code 775 (account locked), not just check the active attribute." };
      return { correct: false, feedback: "Look more carefully. Run a query for Frank's account and read all the attributes returned. There is one that indicates a directory-level lockout." };
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
    validateAnswer(answer: string): ValidationResult {
      if (answer === 'Yes') return { correct: true, feedback: "Correct. Grace's pwdChangedTime is set to 20230101120000Z - January 2023. With a 365-day password policy, her password expired in January 2024. The app receives LDAP error 49 sub-code 773 (password expired) but surfaces it as 'invalid credentials', giving Grace no actionable feedback. The fix: handle error 773 explicitly and prompt the user to change their password, rather than showing a generic login failure." };
      return { correct: false, feedback: "Run (uid=grace.lee) and read every attribute. There is one that tells you when her password was last changed - and how long ago that was." };
    }
  },

  {
    id: 12,
    title: "The Expired Service Account",
    difficulty: "advanced",
    contextType: "email" as const,
    contextMeta: {
      type: 'email' as const,
      from: 'Monitoring System',
      fromRole: 'Automated Alert',
      subject: '[CRITICAL] LDAP authentication failure - all services down',
      date: 'Wed, 15 Apr 2026, 00:03',
    },
    context: "At midnight all services that use LDAP authentication stopped working simultaneously. The LDAP server is up and reachable. Manual queries work fine. The common factor: every affected service authenticates using the <code>ldap-svc</code> service account. Service account passwords can expire just like user passwords - and when they do, the bind fails with 'invalid credentials' even if the password itself has not changed. The <code>shadowExpire</code> attribute stores the account expiry date as a number of days since the Unix epoch (1 Jan 1970).",
    task: "Check whether the ldap-svc service account has an expiry attribute set",
    baseDN: "ou=Services,dc=treedap,dc=com",
    scope: "sub",
    answerType: "boolean" as const,
    answerPrompt: "Does the ldap-svc account have a shadowExpire attribute set?",
    hints: [
      "Search for the ldap-svc entry and read its attributes. Use <code>(cn=ldap-svc)</code> and inspect the result in the results panel.",
      "The <code>shadowExpire</code> attribute stores an expiry date as days since the Unix epoch. Its presence alone indicates that an expiry policy is in effect on this account.",
      "Try: <code>(&(cn=ldap-svc)(shadowExpire=*))</code>. If this returns the entry, the expiry attribute is set."
    ],
    validateAnswer(answer: string): ValidationResult {
      if (answer === 'Yes') return { correct: true, feedback: "Correct. ldap-svc has shadowExpire set to 19754 (days since epoch), which corresponds to early 2024 - the account has been expired for months. Every bind attempt fails at the server level before any application logic runs. The fix: reset the service account credentials and either remove shadowExpire or set it to a future date. Best practice: give service accounts non-expiring passwords and monitor them via a secrets manager rather than relying on LDAP shadow attributes." };
      return { correct: false, feedback: "Look again. Run (cn=ldap-svc) and read every attribute in the result. There is one that indicates an expiry policy is set on this account." };
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
    context: "Hi, I still can't access the engineering portal. My manager told me I should have access because I'm in the engineering group via the backend team. The access control checks <code>(member=frank.miller-dn)</code> directly on the <code>cn=engineering</code> group entry. Standard LDAP search does not follow nested group membership. <code>cn=team-backend</code> is listed as a member of <code>cn=engineering</code>, and Frank is a member of <code>cn=team-backend</code> - but that chain is invisible to a flat <code>member</code> check.",
    task: "Check whether Frank Miller is a direct member of the engineering group",
    baseDN: "ou=Groups,dc=treedap,dc=com",
    scope: "sub",
    answerType: "boolean" as const,
    answerPrompt: "Is Frank Miller a direct (non-nested) member of the engineering group?",
    hints: [
      "Search the Groups OU for the engineering group entry and look at its <code>member</code> attribute values. Direct members are listed there as full DNs. If Frank's DN is not in that list, he is not a direct member.",
      "Try <code>(&(cn=engineering)(member=uid=frank.miller,ou=People,dc=treedap,dc=com))</code>. If this returns the engineering group, Frank is a direct member. If it returns nothing, he is not.",
      "Zero results from that filter means Frank is only reachable through a nested group. Standard LDAP has no recursive memberOf expansion - the app's access check will always return false for Frank unless it is updated to resolve nested groups."
    ],
    validateAnswer(answer: string): ValidationResult {
      if (answer === 'No') return { correct: true, feedback: "Correct. Frank is only in cn=team-backend, which is itself listed as a member of cn=engineering. Standard LDAP does not resolve this chain. The app's filter (member=frank-dn) on the engineering group returns nothing. Fix options: (1) add Frank directly to engineering, (2) implement recursive group expansion in the app, or (3) use an LDAP server with memberOf overlay that handles nesting automatically." };
      return { correct: false, feedback: "Run the filter and check the result. Look at the engineering group's member values directly - does Frank's exact DN appear there, or only cn=team-backend?" };
    }
  },

  {
    id: 14,
    title: "Open to Everyone",
    difficulty: "advanced",
    contextType: "email" as const,
    contextMeta: {
      type: 'email' as const,
      from: 'Marco Ferrara',
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
      from: 'Riccardo Sartori',
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
    validate(result: LdapEntry[]): ValidationResult {
      return validateByDNSet(result, this.expectedDNs, '(objectClass=account)');
    }
  },

  {
    id: 16,
    title: "The Full Tree Tax",
    difficulty: "advanced",
    contextType: "jira" as const,
    contextMeta: {
      type: 'jira' as const,
      ticketId: 'TD-389',
      issueType: 'Task' as const,
      priority: 'Medium' as const,
      ticketTitle: 'Login latency spike under load - LDAP search timeout',
      reporter: 'APM Alert (automated)',
    },
    context: "Under load, user login takes 6-8 seconds and occasionally times out. Profiling shows the bottleneck is the LDAP search. The app uses <code>baseDN=dc=treedap,dc=com</code>, scope <code>sub</code>, filter <code>(objectClass=inetOrgPerson)</code>. The LDAP server scans every single entry in the directory to evaluate the filter - computers, servers, service accounts, groups, OUs - before returning the few person accounts it is actually looking for. The fix is obvious once you measure the gap: restrict the baseDN to the OU that actually contains your users.",
    task: "Compare the total entries scanned from the root vs from ou=People - report the total count from the root",
    baseDN: "dc=treedap,dc=com",
    scope: "sub",
    answerType: "number" as const,
    answerPrompt: "How many total entries exist under dc=treedap,dc=com (run filter (objectClass=*) with scope sub)?",
    hints: [
      "Use filter <code>(objectClass=*)</code> - this matches every entry in the directory regardless of type. Combined with baseDN <code>dc=treedap,dc=com</code> and scope <code>sub</code>, it tells you exactly how many entries the server must scan for any root-level query.",
      "Then run the same filter from <code>ou=People,dc=treedap,dc=com</code>. Compare the two counts - the difference is the wasted work the server does on every login request.",
      "The optimization is simply changing one config value: baseDN from <code>dc=treedap,dc=com</code> to <code>ou=People,dc=treedap,dc=com</code>. No code changes, no schema changes - just pointing the search at the right subtree."
    ],
    validateAnswer(answer: string): ValidationResult {
      const n = parseInt(answer.trim(), 10);
      if (n === 40) return { correct: true, feedback: "Correct. 40 entries total in the directory, but the app only needs the 13 entries under ou=People (the OU itself, the Contractors sub-OU, and 11 person accounts). Changing the baseDN reduces the scan by 67%. On a real directory with tens of thousands of entries the gain is proportionally larger - and on an unindexed attribute the difference between a targeted subtree search and a full tree scan can be the difference between milliseconds and seconds." };
      return { correct: false, feedback: "Run (objectClass=*) with scope sub from dc=treedap,dc=com and count every entry returned - OUs, users, groups, computers, services, everything." };
    }
  },

];
