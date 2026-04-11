import type { GlossaryTerm } from '../engine/types';

export const GLOSSARY_TERMS: GlossaryTerm[] = [
  // ── Fondamentali ──────────────────────────────────────────────
  {
    code: "LDAP",
    short: "Lightweight Directory Access Protocol",
    body: `<p><strong>LDAP</strong> is a protocol (set of rules) for accessing and managing a <strong>directory service</strong>. Think of it as a phonebook on steroids: a database optimized for fast reads, organized as a tree hierarchy.</p>
    <p>Companies use LDAP to manage user accounts, computers, groups, and access policies. It's the foundation of Active Directory (Windows), OpenLDAP, and FreeIPA.</p>
    <div class="example-block">ldap://ldap.treedap.com:389</div>`
  },
  {
    code: "DN",
    short: "Distinguished Name: unique path to an entry",
    body: `<p>The <strong>DN</strong> is the full unique identifier of an entry in the directory. It's like an absolute file path, telling you exactly where the entry lives in the tree.</p>
    <p>A DN is built by reading the RDN of each level from left (specific) to right (general):</p>
    <div class="example-block">uid=alice.smith,ou=People,dc=treedap,dc=com</div>
    <p>This means: in domain <code>treedap.com</code>, inside <code>ou=People</code>, the entry identified by <code>uid=alice.smith</code>.</p>`
  },
  {
    code: "RDN",
    short: "Relative Distinguished Name: one level of the DN",
    body: `<p>An <strong>RDN</strong> is one component of a DN, the identifier for one level of the tree. For example <code>uid=alice.smith</code> is the RDN within its parent OU.</p>
    <div class="example-block">uid=alice.smith  ← RDN
ou=People        ← parent's RDN
dc=treedap          ← grandparent's RDN
dc=com           ← root's RDN</div>`
  },
  {
    code: "dc",
    short: "Domain Component: part of a domain name",
    body: `<p><strong>dc</strong> stands for Domain Component. It splits a DNS domain name into components. So the domain <code>treedap.com</code> becomes <code>dc=treedap,dc=com</code> in LDAP.</p>
    <p>The root of the LDAP tree is almost always a set of dc components representing the organization's domain.</p>
    <div class="example-block">dc=treedap,dc=com  →  treedap.com
dc=corp,dc=example,dc=org  →  corp.example.org</div>`
  },
  {
    code: "ou",
    short: "Organizational Unit: a container/folder",
    body: `<p><strong>ou</strong> stands for Organizational Unit. It's a container entry used to organize other entries into groups, similar to folders in a filesystem.</p>
    <p>Common OUs include: <code>ou=People</code> (users), <code>ou=Groups</code> (groups), <code>ou=Services</code> (service accounts), <code>ou=Computers</code>.</p>
    <div class="example-block">ou=People,dc=treedap,dc=com
ou=Groups,dc=treedap,dc=com
ou=IT,ou=Departments,dc=treedap,dc=com</div>`
  },
  // ── Attributi comuni ──────────────────────────────────────────
  {
    code: "attribute",
    short: "A key=value property of an entry",
    body: `<p>An <strong>attribute</strong> is a property of an LDAP entry, a key/value pair. Attributes can be single-valued or multi-valued (e.g., a user can have multiple email addresses).</p>
    <div class="example-block">cn: Alice Smith       ← single value
mail: alice@treedap.com  ← single value
objectClass: inetOrgPerson
objectClass: top      ← multi-value (two objectClasses)</div>`
  },
  {
    code: "objectClass",
    short: "Defines the type/schema of an entry",
    body: `<p><strong>objectClass</strong> is one of the most important attributes in LDAP. It defines what <em>type</em> of object an entry is, and which attributes it must/may have.</p>
    <p>An entry can have multiple objectClasses (each adds more attributes). Every entry must have at least <code>top</code>.</p>
    <div class="example-block">objectClass: inetOrgPerson  ← user/person
objectClass: groupOfNames   ← group with members
objectClass: account        ← service/system account
objectClass: organizationalUnit  ← a folder/OU</div>`
  },
  {
    code: "cn",
    short: "Common Name: the display name of an entry",
    body: `<p><strong>cn</strong> stands for Common Name. It's the human-readable name of an entry. For users, it's typically their full name. For groups and OUs, it's the name of the group/unit.</p>
    <div class="example-block">cn=Alice Smith      ← a user's full name
cn=admins           ← a group name
cn=ldap-service     ← a service account name</div>`
  },
  {
    code: "uid",
    short: "User ID: login username",
    body: `<p><strong>uid</strong> stands for User ID. It's the unique login name for a user account, like a username. It's often used as the RDN for user entries.</p>
    <div class="example-block">uid=alice.smith
uid=bob.johnson
uid=henry.scott</div>`
  },
  {
    code: "sn",
    short: "Surname: last name",
    body: `<p><strong>sn</strong> stands for Surname. It stores just the last name (family name) of a person. Used alongside <code>cn</code> (full name) and <code>givenName</code> (first name).</p>
    <div class="example-block">sn=Smith    (for Alice Smith)
sn=Johnson  (for Bob Johnson)</div>`
  },
  {
    code: "givenName",
    short: "First name of a person",
    body: `<p><strong>givenName</strong> stores the first name (given name) of a person. Used alongside <code>sn</code> (surname) and <code>cn</code> (full name).</p>
    <div class="example-block">givenName: Alice   (for Alice Smith)
givenName: Bob     (for Bob Johnson)</div>
    <p>To find everyone named "Alice": <code>(givenName=Alice)</code></p>`
  },
  {
    code: "mail",
    short: "Email address attribute",
    body: `<p><strong>mail</strong> stores the email address of an entry. It is provided by the <code>inetOrgPerson</code> objectClass and can hold multiple values (one per address).</p>
    <div class="example-block">mail: alice.smith@treedap.com</div>
    <p>Useful filter examples:</p>
    <div class="example-block">(mail=alice.smith@treedap.com)   ← exact match
(mail=*@treedap.com)             ← all treedap users
(mail=*)                         ← anyone with an email</div>`
  },
  {
    code: "title",
    short: "Job title of a person",
    body: `<p><strong>title</strong> stores the job title of a user entry, e.g. "Software Engineer", "Manager", "Director".</p>
    <div class="example-block">title: Software Engineer
title: IT Manager
title: System Administrator</div>
    <p>Useful with wildcards: <code>(title=*Manager*)</code> finds anyone whose title contains "Manager".</p>`
  },
  {
    code: "department",
    short: "Department the user belongs to",
    body: `<p><strong>department</strong> stores the name of the department a user belongs to. It comes from the <code>inetOrgPerson</code> objectClass.</p>
    <div class="example-block">department: Engineering
department: Human Resources
department: IT Operations</div>
    <p>Filter example: <code>(department=Engineering)</code> finds all engineers.</p>`
  },
  // ── ObjectClass specifici ─────────────────────────────────────
  {
    code: "inetOrgPerson",
    short: "Standard objectClass for user accounts",
    body: `<p><strong>inetOrgPerson</strong> is the most common objectClass for user accounts. It provides attributes like: <code>cn</code>, <code>sn</code>, <code>uid</code>, <code>mail</code>, <code>mobile</code>, <code>title</code>, <code>department</code>.</p>
    <p>To find all users: <code>(objectClass=inetOrgPerson)</code></p>
    <p>It inherits from <code>organizationalPerson</code> which inherits from <code>person</code> which inherits from <code>top</code>.</p>`
  },
  {
    code: "groupOfNames",
    short: "objectClass for groups with named members",
    body: `<p><strong>groupOfNames</strong> is the standard objectClass for LDAP groups. Each group lists its members via the <code>member</code> attribute, where every value is the full DN of a member entry.</p>
    <p>Required attributes: <code>cn</code> (group name), at least one <code>member</code>.</p>
    <div class="example-block">dn: cn=admins,ou=Groups,dc=treedap,dc=com
objectClass: groupOfNames
cn: admins
member: uid=alice.smith,ou=People,dc=treedap,dc=com</div>
    <p>To find all groups: <code>(objectClass=groupOfNames)</code></p>`
  },
  {
    code: "member",
    short: "Attribute listing group members (by DN)",
    body: `<p>The <strong>member</strong> attribute is used in groups (objectClass=groupOfNames) to list who belongs to the group. Each value is the <strong>full DN</strong> of a member entry.</p>
    <div class="example-block">cn=admins,ou=Groups,dc=treedap,dc=com
  member: uid=alice.smith,ou=People,dc=treedap,dc=com
  member: uid=eve.davis,ou=People,dc=treedap,dc=com</div>
    <p>To find groups that a user belongs to, search with: <code>(member=&lt;user's full DN&gt;)</code></p>`
  },
  // ── Ricerca ───────────────────────────────────────────────────
  {
    code: "baseDN",
    short: "Starting point for the search",
    body: `<p>The <strong>baseDN</strong> tells LDAP <em>where</em> to start searching in the tree. The search will only look at or below this entry.</p>
    <div class="example-block">baseDN: dc=treedap,dc=com          ← search whole tree
baseDN: ou=People,dc=treedap,dc=com ← only users subtree
baseDN: ou=Groups,dc=treedap,dc=com ← only groups subtree</div>`
  },
  {
    code: "scope",
    short: "How deep to search from baseDN",
    body: `<p><strong>scope</strong> controls how many levels below the baseDN to search:</p>
    <ul>
      <li><code>base</code>: only the baseDN entry itself</li>
      <li><code>one</code>: direct children of baseDN (one level down)</li>
      <li><code>sub</code>: baseDN and ALL descendants (full subtree)</li>
    </ul>
    <p>In most searches you want <code>sub</code> (subtree), the default in most LDAP tools.</p>`
  },
  {
    code: "filter",
    short: "A search expression to match entries",
    body: `<p>A <strong>filter</strong> is an expression you write to search the directory. It always goes in parentheses. The basic forms are:</p>
    <div class="example-block">(attr=value)     ← equality
(attr=val*)      ← wildcard (starts with)
(attr=*)         ← presence (attr exists)
(&(f1)(f2))      ← AND (both must match)
(|(f1)(f2))      ← OR (either matches)
(!(f))           ← NOT (must not match)</div>`
  },
  {
    code: "wildcard (*)",
    short: "Match any characters in a filter value",
    body: `<p>The <strong>*</strong> wildcard in a filter value matches zero or more characters. It can appear at the start, end, or middle of a value.</p>
    <div class="example-block">(cn=Alice*)      ← starts with "Alice"
(cn=*Smith)      ← ends with "Smith"
(cn=*li*)        ← contains "li"
(mail=*)         ← presence: attribute exists</div>
    <p>A lone <code>*</code> is a <strong>presence filter</strong>. It matches any entry that has the attribute at all, regardless of value.</p>`
  },
  // ── Operatori logici ──────────────────────────────────────────
  {
    code: "AND (&)",
    short: "Logical AND: all conditions must match",
    body: `<p>The <strong>&amp;</strong> operator combines multiple filters so that <em>all</em> of them must match. It wraps two or more sub-filters.</p>
    <div class="example-block">(&(objectClass=inetOrgPerson)(department=Engineering))
← users AND in Engineering

(&(objectClass=inetOrgPerson)(title=*Manager*)(department=IT))
← IT users whose title contains "Manager"</div>
    <p>You can nest AND/OR/NOT operators to build complex queries.</p>`
  },
  {
    code: "OR (|)",
    short: "Logical OR: at least one condition must match",
    body: `<p>The <strong>|</strong> operator combines multiple filters so that <em>at least one</em> of them must match.</p>
    <div class="example-block">(|(department=Engineering)(department=IT))
← users in Engineering OR IT

(|(uid=alice.smith)(uid=bob.johnson))
← either Alice or Bob</div>
    <p>OR is useful when searching across multiple possible values of the same attribute.</p>`
  },
  {
    code: "NOT (!)",
    short: "Logical NOT: negates a condition",
    body: `<p>The <strong>!</strong> operator negates a filter, matching entries that do <em>not</em> satisfy the inner condition. It takes exactly one sub-filter.</p>
    <div class="example-block">(!(objectClass=inetOrgPerson))
← entries that are NOT users

(&(objectClass=inetOrgPerson)(!(department=HR)))
← users who are NOT in HR</div>
    <p>NOT is often combined with AND to exclude a subset from broader results.</p>`
  },
];
