import type { Theory } from '../engine/types';

export const LEVEL_THEORY: Record<number, Theory> = {

  // ── BEGINNER (Levels 1-3) ───────────────────────────────────────────────────

  1: {
    badge: "📘 LDAP Basics",
    title: "What is LDAP and how does a directory work?",
    html: `
      <h3>LDAP: Lightweight Directory Access Protocol</h3>
      <p>LDAP is a protocol for accessing and managing a <strong>directory service</strong>: a specialised database optimised for fast reads, organised as a <strong>tree hierarchy</strong> rather than flat tables like SQL.</p>
      <p>Companies use LDAP to store and query information about users, computers, groups, and services. It is the foundation of corporate identity systems like <strong>Active Directory</strong>, OpenLDAP, and FreeIPA.</p>

      <h3>The Tree Structure</h3>
      <p>Every item in LDAP is called an <strong>entry</strong>. Entries are organised in a hierarchy from a single root down to individual leaves. The TreeDap directory looks like this:</p>
      <div class="concept-code-block">
<span class="dn">dc=treedap,dc=com</span>                        <span class="comment">← root (the whole company)</span>
├── <span class="dn">ou=People</span>                             <span class="comment">← container for user accounts</span>
│   ├── <span class="dn">uid=alice.smith,ou=People,...</span>    <span class="comment">← a user entry</span>
│   └── <span class="dn">uid=bob.johnson,ou=People,...</span>
├── <span class="dn">ou=Groups</span>                             <span class="comment">← container for groups</span>
│   └── <span class="dn">cn=admins,ou=Groups,...</span>           <span class="comment">← a group entry</span>
├── <span class="dn">ou=Services</span>                           <span class="comment">← service/system accounts</span>
└── <span class="dn">ou=Computers</span>                          <span class="comment">← workstations and servers</span>
    ├── <span class="dn">ou=Workstations</span>
    └── <span class="dn">ou=Servers</span></div>

      <p>You can explore this exact structure in the <strong>Directory Tree panel on the left</strong>. Click any entry to inspect its attributes. To see the hierarchy rendered as a proper branching tree, click the <strong>🌳 toggle button</strong> at the top of the tree panel. It turns <span style="color:var(--success);font-weight:600">green</span> when active.</p>

      <h3>The building blocks of every entry</h3>
      <ul>
        <li><strong><code>dn</code></strong> (Distinguished Name): the full unique path to an entry, read left to right from most specific to most general. Example: <code>uid=alice.smith,ou=People,dc=treedap,dc=com</code>.</li>
        <li><strong><code>dc</code></strong> (Domain Component): one piece of the DNS domain name. <code>dc=treedap,dc=com</code> maps to "treedap.com".</li>
        <li><strong><code>ou</code></strong> (Organisational Unit): a container that groups entries, like a folder in a file system.</li>
        <li><strong><code>cn</code></strong> (Common Name): the human-readable name of an entry (e.g. "Alice Smith" for a user, "admins" for a group).</li>
        <li><strong><code>uid</code></strong> (User ID): the login name of a user account.</li>
        <li><strong><code>objectClass</code></strong>: defines the <em>type</em> of entry and which attributes it can have (e.g. <code>inetOrgPerson</code> for users, <code>organizationalUnit</code> for containers, <code>groupOfNames</code> for groups).</li>
      </ul>

      <h3>Scope: how deep to search</h3>
      <p>Every LDAP search has a <strong>baseDN</strong> (where to start) and a <strong>scope</strong> (how deep to go):</p>
      <ul>
        <li><code>base</code>: only the baseDN entry itself</li>
        <li><code>one</code>: direct children of baseDN only (one level down)</li>
        <li><code>sub</code>: baseDN and ALL descendants recursively (most common)</li>
      </ul>
      <div class="concept-code-block"><span class="comment">baseDN: dc=treedap,dc=com  |  scope: one</span>

<span class="comment">Returned ✓  ou=People,dc=treedap,dc=com     (direct child)</span>
<span class="comment">Returned ✓  ou=Groups,dc=treedap,dc=com     (direct child)</span>
<span class="comment">Skipped  ✗  uid=alice.smith,ou=People,...   (too deep)</span></div>

      <div class="concept-callout">
        <div class="concept-callout-label">Real world - networking</div>
        <p>LDAP runs over TCP. The standard port is <code>389</code> (plain text or upgraded with StartTLS). The encrypted variant LDAPS uses port <code>636</code>. Active Directory also exposes the Global Catalog on ports <code>3268</code> (plain) and <code>3269</code> (SSL), which lets you search across an entire multi-domain forest in a single query. Every LDAP operation you write in TreeDap maps directly to a TCP request-response on one of these ports in a real environment.</p>
      </div>
    `
  },

  2: {
    badge: "📘 Finding Users",
    title: "scope=sub, objectClass, and exact match filters",
    html: `
      <h3>scope=sub: searching the whole tree</h3>
      <p>With <code>scope=sub</code>, LDAP searches the baseDN entry and <em>all</em> its descendants recursively. This is the scope you'll use most often when you don't know which OU holds the entry you need.</p>
      <div class="concept-code-block"><span class="comment">baseDN: dc=treedap,dc=com  |  scope: sub</span>

<span class="comment">Returned ✓  ou=People,dc=treedap,dc=com          (child)</span>
<span class="comment">Returned ✓  uid=alice.smith,ou=People,...         (grandchild)</span>
<span class="comment">Returned ✓  cn=ws-alice,ou=Workstations,...       (deep descendant)</span></div>

      <h3>objectClass for user entries</h3>
      <p>User accounts typically have <code>objectClass=inetOrgPerson</code>. This objectClass provides a standard set of person-related attributes:</p>
      <div class="concept-code-block"><span class="attr-name">dn</span>:          <span class="attr-val">uid=alice.smith,ou=People,dc=treedap,dc=com</span>
<span class="attr-name">objectClass</span>: <span class="attr-val">inetOrgPerson</span>
<span class="attr-name">cn</span>:          <span class="attr-val">Alice Smith</span>          <span class="comment">← full name</span>
<span class="attr-name">uid</span>:         <span class="attr-val">alice.smith</span>          <span class="comment">← login ID</span>
<span class="attr-name">mail</span>:        <span class="attr-val">alice@treedap.com</span>    <span class="comment">← email</span>
<span class="attr-name">sn</span>:          <span class="attr-val">Smith</span>                <span class="comment">← surname</span>
<span class="attr-name">department</span>: <span class="attr-val">Engineering</span>
<span class="attr-name">title</span>:       <span class="attr-val">Software Engineer</span></div>

      <h3>Equality Filter</h3>
      <p>The simplest LDAP filter tests if an attribute equals a specific value. LDAP matching is <strong>case-insensitive</strong> for most string attributes:</p>
      <div class="concept-code-block"><span class="comment">Syntax: (attribute=value)</span>

<span class="filter">(uid=alice.smith)</span>          <span class="comment">← match by login name</span>
<span class="filter">(mail=alice@treedap.com)</span>   <span class="comment">← match by email</span>
<span class="filter">(cn=Alice Smith)</span>           <span class="comment">← match by full name</span></div>

      <p>Any attribute you see on an entry can be used in a filter. Click entries in the directory tree to discover their attributes.</p>

      <div class="concept-callout">
        <div class="concept-callout-label">Real world - user lookup</div>
        <p>The most common LDAP operation in production is a user lookup during authentication. When a user logs in, the application does exactly this: a <code>scope=sub</code> search across the entire base domain, filtering by <code>uid</code> or <code>mail</code>, to find the user's DN. It then attempts a <strong>bind</strong> with that DN and the supplied password to verify credentials. Get the filter wrong and login breaks for everyone.</p>
      </div>
    `
  },

  3: {
    badge: "📘 Wildcard and Substring Filters",
    title: "Pattern matching with *",
    html: `
      <h3>The Wildcard Character: <code>*</code></h3>
      <p>LDAP supports <strong>wildcard</strong> searches with <code>*</code>, which matches any sequence of characters (including none). You can place it at the start, end, or anywhere inside a value.</p>

      <div class="concept-code-block"><span class="comment">Prefix wildcard (ends with):</span>
<span class="filter">(cn=*son)</span>          <span class="comment">← cn ends with "son": Johnson, Peterson...</span>

<span class="comment">Suffix wildcard (starts with):</span>
<span class="filter">(cn=M*)</span>            <span class="comment">← cn starts with "M": Miller, Moore...</span>
<span class="filter">(sn=S*)</span>            <span class="comment">← surname starts with S: Smith, Scott...</span>

<span class="comment">Substring (contains):</span>
<span class="filter">(title=*Engineer*)</span> <span class="comment">← title contains "Engineer" anywhere</span>
<span class="filter">(uid=*admin*)</span>      <span class="comment">← uid contains "admin" anywhere</span>
<span class="filter">(mail=*@corp.com)</span>  <span class="comment">← email domain match</span></div>

      <h3>Multi-part wildcards</h3>
      <p>You can use multiple wildcards inside one value:</p>
      <div class="concept-code-block"><span class="filter">(cn=J*D*)</span>  <span class="comment">← starts with J, then D somewhere: "Jane Doe", "Jim Dodson"</span></div>

      <h3>Common use cases</h3>
      <ul>
        <li>Find everyone whose title contains a role keyword (e.g. "Engineer", "Lead", "Senior")</li>
        <li>Find accounts belonging to a domain by matching email suffix</li>
        <li>Search for partial name matches when the exact value is unknown</li>
      </ul>
      <p>Inspect the <code>title</code> attribute of several users in the tree. Notice how job titles are formatted - this tells you where to place the wildcards.</p>
    `
  },

  // ── INTERMEDIATE (Levels 4-6) ───────────────────────────────────────────────

  4: {
    badge: "📘 Boolean AND",
    title: "Combining filters with AND (&)",
    html: `
      <h3>The AND Operator: <code>&</code></h3>
      <p>To require <em>multiple conditions to all be true</em>, use the AND operator <code>&</code>. All sub-filters inside an AND must match for the entry to be returned.</p>

      <div class="concept-code-block"><span class="comment">Syntax: (&(filter1)(filter2)(filter3)...)</span>

<span class="op">(</span><span class="filter">&</span><span class="op">(</span><span class="filter">objectClass=inetOrgPerson</span><span class="op">)(</span><span class="filter">department=Sales</span><span class="op">))</span>

<span class="comment">← matches entries that are users AND in the Sales department</span></div>

      <h3>Rules</h3>
      <ul>
        <li>The <code>&</code> goes INSIDE the outer parentheses, BEFORE the sub-filters</li>
        <li>Each sub-filter has its own parentheses</li>
        <li>You can combine any number of sub-filters</li>
        <li>All of them must match</li>
      </ul>

      <h3>Example with 3 conditions</h3>
      <div class="concept-code-block"><span class="filter">(&(objectClass=inetOrgPerson)(title=Manager)(department=IT))</span>

<span class="comment">← IT managers only (all three must be true)</span></div>

      <div class="concept-callout">
        <div class="concept-callout-label">Real world - provisioning</div>
        <p>Provisioning scripts and SSO connectors use AND filters constantly: <code>(&(objectClass=inetOrgPerson)(active=TRUE))</code> is the standard query to list accounts that should have access. Forgetting the <code>active=TRUE</code> condition means deprovisioned accounts still appear active to downstream systems - a classic source of stale-access incidents.</p>
      </div>
    `
  },

  5: {
    badge: "📘 OR and Presence",
    title: "OR (|) and testing if an attribute exists",
    html: `
      <h3>The OR Operator: <code>|</code></h3>
      <p>To match entries where <em>at least one condition is true</em>, use the OR operator <code>|</code>. If any of the sub-filters match, the entry is returned.</p>

      <div class="concept-code-block"><span class="comment">Syntax: (|(filter1)(filter2)(filter3)...)</span>

<span class="op">(</span><span class="filter">|</span><span class="op">(</span><span class="filter">department=Sales</span><span class="op">)(</span><span class="filter">department=Marketing</span><span class="op">))</span>

<span class="comment">← matches entries in Sales OR Marketing</span></div>

      <h3>AND vs OR at a glance</h3>
      <ul>
        <li><code>&</code>: ALL conditions must match (stricter, narrows results)</li>
        <li><code>|</code>: ANY condition must match (broader, widens results)</li>
      </ul>

      <h3>Presence Filter: <code>(attr=*)</code></h3>
      <p>Not all entries have the same attributes. A presence filter finds entries that <strong>have</strong> a particular attribute, regardless of its value. The lone <code>*</code> means "any value":</p>

      <div class="concept-code-block"><span class="filter">(mobile=*)</span>      <span class="comment">← entry has a mobile number (any value)</span>
<span class="filter">(title=*)</span>       <span class="comment">← entry has a job title set</span>
<span class="filter">(description=*)</span> <span class="comment">← entry has a description</span></div>

      <h3>Combining everything</h3>
      <div class="concept-code-block"><span class="comment">Active users in Sales OR Marketing who have a phone:</span>
<span class="filter">(&(active=TRUE)(|(department=Sales)(department=Marketing))(mobile=*))</span></div>

      <p>Check the directory tree to see which users have a <code>mobile</code> attribute and which ones don't. Optional attributes like <code>mobile</code> are present on some entries and absent on others.</p>
    `
  },

  6: {
    badge: "📘 NOT and Complex Nesting",
    title: "Excluding entries with NOT (!) and combining all operators",
    html: `
      <h3>The NOT Operator: <code>!</code></h3>
      <p>The NOT operator <em>inverts</em> a filter, returning entries that do <strong>NOT</strong> match the inner filter.</p>

      <div class="concept-code-block"><span class="comment">Syntax: (!(filter))</span>

<span class="filter">(!(objectClass=account))</span>  <span class="comment">← entries that are NOT service accounts</span>
<span class="filter">(!(department=Sales))</span>     <span class="comment">← entries NOT in the Sales department</span></div>

      <h3>Important: NOT takes only one sub-filter</h3>
      <p>Unlike AND and OR, NOT only wraps a <strong>single</strong> filter. To negate multiple conditions, nest an OR inside the NOT:</p>
      <div class="concept-code-block"><span class="filter">(!(|(title=Intern)(title=Contractor)))</span>
<span class="comment">← entries that are neither Interns nor Contractors</span></div>

      <h3>Combining AND, OR, and NOT</h3>
      <p>LDAP filters are fully composable. You can nest operators inside each other to express complex logic:</p>
      <div class="concept-code-block"><span class="comment">Active users NOT in Sales or Marketing:</span>
<span class="filter">(&(active=TRUE)(!(|(department=Sales)(department=Marketing))))</span>

<span class="comment">Breaking it down:</span>
<span class="comment">  AND (</span>
<span class="comment">    active = TRUE</span>
<span class="comment">    NOT (</span>
<span class="comment">      OR (</span>
<span class="comment">        department = Sales</span>
<span class="comment">        department = Marketing</span>
<span class="comment">      )</span>
<span class="comment">    )</span>
<span class="comment">  )</span></div>

      <h3>Strategy</h3>
      <ol style="margin:8px 0 12px 20px">
        <li>Start with what is always required - put in AND at the top level</li>
        <li>Identify what should be excluded - put in NOT</li>
        <li>When excluding multiple values - wrap an OR inside the NOT</li>
        <li>Count parentheses: every <code>(</code> needs a matching <code>)</code></li>
      </ol>
    `
  },

  // ── ADVANCED (Levels 7-9) ───────────────────────────────────────────────────

  7: {
    badge: "📘 Groups and Membership",
    title: "DN-valued attributes and group membership lookups",
    html: `
      <h3>The DN (Distinguished Name)</h3>
      <p>Every LDAP entry has a <strong>DN</strong>, its unique full path in the tree, like an absolute file path. For example:</p>
      <div class="concept-code-block"><span class="dn">uid=john.doe,ou=Staff,dc=example,dc=com</span></div>
      <p>Read from right to left: in <code>dc=example,dc=com</code>, inside <code>ou=Staff</code>, the entry with <code>uid=john.doe</code>.</p>

      <h3>objectClass=groupOfNames</h3>
      <p>Groups are separate entries in the directory with their own <code>objectClass</code>:</p>
      <div class="concept-code-block"><span class="attr-name">dn</span>:          <span class="attr-val">cn=developers,ou=Groups,dc=example,dc=com</span>
<span class="attr-name">objectClass</span>: <span class="attr-val">groupOfNames</span>
<span class="attr-name">cn</span>:          <span class="attr-val">developers</span>
<span class="attr-name">member</span>:      <span class="attr-val">uid=john.doe,ou=Staff,dc=example,dc=com</span>
<span class="attr-name">member</span>:      <span class="attr-val">uid=sara.kim,ou=Staff,dc=example,dc=com</span></div>

      <h3>Searching by DN value</h3>
      <p>The <code>member</code> attribute stores <strong>full DNs</strong> as plain string values. You filter on it exactly like any other attribute - just supply the full DN as the value:</p>
      <div class="concept-code-block"><span class="filter">(member=uid=john.doe,ou=Staff,dc=example,dc=com)</span>

<span class="comment">← finds all groups where john.doe is listed as a member</span></div>

      <p>This is an exact match. You need the complete DN. Click on the user's entry in the directory tree to see their full DN in the attribute panel.</p>

      <div class="concept-callout">
        <div class="concept-callout-label">Real world - authorization</div>
        <p>In production, membership lookups are how access control gets enforced. A VPN gateway asks the directory: <em>"is this user a member of <code>cn=vpn-access</code>?"</em> A file server enumerates groups with <code>(objectClass=groupOfNames)</code> then maps them to share permissions. Getting these filters wrong in a provisioning script means users end up with too much access - or none at all. Accuracy here has direct security consequences.</p>
      </div>
    `
  },

  8: {
    badge: "📘 DN-valued Attributes",
    title: "Linking entries across the directory tree",
    html: `
      <h3>DN-valued attributes</h3>
      <p>Some LDAP attributes store a <strong>full DN as their value</strong>. This is how entries in different parts of the tree reference each other without duplicating data.</p>
      <p>You have already seen this with the <code>member</code> attribute on groups. Device entries use the same pattern with <code>owner</code>:</p>
      <div class="concept-code-block"><span class="attr-name">dn</span>:               <span class="attr-val">cn=laptop-042,ou=Workstations,ou=Assets,dc=example,dc=com</span>
<span class="attr-name">objectClass</span>:      <span class="attr-val">device</span>
<span class="attr-name">cn</span>:               <span class="attr-val">laptop-042</span>
<span class="attr-name">operatingSystem</span>: <span class="attr-val">Windows 11</span>
<span class="attr-name">owner</span>:           <span class="attr-val">uid=mark.chen,ou=Staff,dc=example,dc=com</span></div>

      <h3>Filtering by a DN-valued attribute</h3>
      <p>You filter on DN-valued attributes exactly like any other attribute: with an <strong>exact equality match</strong> using the full DN of the target entry.</p>
      <div class="concept-code-block"><span class="comment">Find the machine owned by mark.chen:</span>
<span class="filter">(owner=uid=mark.chen,ou=Staff,dc=example,dc=com)</span>

<span class="comment">Find groups where john.doe is a member:</span>
<span class="filter">(member=uid=john.doe,ou=Staff,dc=example,dc=com)</span></div>

      <h3>Why this matters</h3>
      <p>DN-valued attributes let you answer relationship questions: "which device does this person own?", "which groups is this user in?", "who is the manager of this employee?". They are one of the most powerful features of a well-designed LDAP schema.</p>
      <p>Click on any workstation in the directory tree to see its <code>owner</code> attribute, then build the filter using the assigned user's full DN.</p>

      <div class="concept-callout">
        <div class="concept-callout-label">Real world - ldapsearch command line</div>
        <p>The command-line equivalent of an owner lookup is: <code>ldapsearch -H ldap://srv-ldap01 -x -b "ou=Assets,dc=example,dc=com" -s sub "(owner=uid=mark.chen,ou=Staff,dc=example,dc=com)"</code>. The <code>-H</code> flag is the server URL, <code>-x</code> means anonymous bind, <code>-b</code> is the baseDN, <code>-s</code> is the scope, and the last argument is the filter.</p>
      </div>
    `
  },

  9: {
    badge: "📘 Absence Filters and Full Audit Queries",
    title: "Testing for missing attributes and putting it all together",
    html: `
      <h3>Absence Filter: <code>(!(attr=*))</code></h3>
      <p>You already know that <code>(attr=*)</code> tests for an attribute's <em>presence</em>. To test for its <em>absence</em>, simply wrap that in a NOT:</p>
      <div class="concept-code-block"><span class="filter">(!(fax=*))</span>            <span class="comment">← entry has NO fax number</span>
<span class="filter">(!(pager=*))</span>          <span class="comment">← entry has NO pager number</span>
<span class="filter">(!(employeeNumber=*))</span> <span class="comment">← entry has no employee ID assigned</span></div>

      <h3>Combining for audit queries</h3>
      <p>Absence filters are powerful in audit scenarios - finding accounts that match a condition AND are missing an expected attribute:</p>
      <div class="concept-code-block"><span class="comment">Contractors with no badge number assigned:</span>
<span class="filter">(&(contractType=external)(!(badgeNumber=*)))</span>

<span class="comment">Users with no cost centre assigned:</span>
<span class="filter">(&(objectClass=inetOrgPerson)(!(costCentre=*)))</span></div>

      <h3>Quick reference: all filter types</h3>
      <div class="concept-code-block"><span class="filter">(attr=value)</span>          <span class="comment">← equality</span>
<span class="filter">(attr=val*)</span>           <span class="comment">← prefix wildcard (starts with)</span>
<span class="filter">(attr=*val*)</span>          <span class="comment">← substring (contains)</span>
<span class="filter">(attr=*)</span>              <span class="comment">← presence (attribute exists)</span>
<span class="filter">(!(attr=*))</span>           <span class="comment">← absence (attribute missing)</span>
<span class="filter">(&(f1)(f2)(f3))</span>       <span class="comment">← AND (all must match)</span>
<span class="filter">(|(f1)(f2)(f3))</span>       <span class="comment">← OR (any must match)</span>
<span class="filter">(!(f1))</span>               <span class="comment">← NOT (inverts one filter)</span></div>

      <h3>Strategy for multi-condition filters</h3>
      <ol style="margin:8px 0 12px 20px">
        <li>List every condition the result must satisfy</li>
        <li>Wrap them all in a top-level AND <code>(&amp;...)</code></li>
        <li>For "either/or" conditions, nest an OR inside the AND</li>
        <li>For exclusions, use NOT. Combine with OR when excluding multiple values.</li>
        <li>Count parentheses: each <code>(</code> must have a matching <code>)</code></li>
      </ol>
      <p>Good luck. 🎓</p>
    `
  },

  // ── DIAGNOSTIC (Levels 10-13) ───────────────────────────────────────────────

  10: {
    badge: "🔍 Real-world Debug",
    title: "Why DN values must be exact and complete",
    html: `
      <h3>The DN is not just a path</h3>
      <p>A Distinguished Name is made of <strong>named components</strong>. Each part has an attribute prefix that identifies what kind of value it is:</p>
      <div class="concept-code-block"><span class="comment">Correct DN - every component has its attribute prefix:</span>
<span class="dn">uid=jane.doe,ou=Staff,dc=example,dc=com</span>
<span class="comment">^^^          ^^       ^^</span>
<span class="comment">uid=         ou=      dc=</span>

<span class="comment">Wrong - missing the uid= prefix on the first component:</span>
<span class="dn">jane.doe,ou=Staff,dc=example,dc=com</span></div>

      <h3>Why this causes silent zero results</h3>
      <p>When you filter by a DN-valued attribute like <code>member</code> or <code>owner</code>, LDAP does a <strong>byte-for-byte string comparison</strong> against the stored value. If the stored value is <code>uid=jane.doe,ou=Staff,dc=example,dc=com</code> and your filter uses <code>jane.doe,ou=Staff,dc=example,dc=com</code>, there is no match - no error, no warning, just zero results.</p>

      <h3>How to avoid it</h3>
      <ul>
        <li>Always copy the DN directly from the directory tree attribute panel</li>
        <li>Never reconstruct a DN from memory - one missing prefix breaks everything</li>
        <li>In real tools like <code>ldapsearch</code>, use <code>-b</code> to locate the entry first, then copy its exact DN</li>
      </ul>

      <div class="concept-callout">
        <div class="concept-callout-label">Real world - offboarding scripts</div>
        <p>This is the most common silent bug in offboarding automation. A script builds a DN from a username string without the RDN prefix, the member filter returns nothing, and the script reports "user has no group memberships" - then closes the ticket without removing any access. The account is disabled but still has every group membership intact.</p>
      </div>
    `
  },

  11: {
    badge: "🔍 Real-world Debug",
    title: "LDAP schema varies between implementations",
    html: `
      <h3>The problem with AD knowledge</h3>
      <p>Active Directory is LDAP-compatible but uses its own proprietary schema with class names that don't exist in standard OpenLDAP or FreeIPA:</p>
      <div class="concept-code-block"><span class="comment">Active Directory (Microsoft):</span>
<span class="attr-val">objectClass=user</span>           <span class="comment">← user accounts</span>
<span class="attr-val">objectClass=computer</span>       <span class="comment">← machine accounts</span>
<span class="attr-val">objectClass=group</span>          <span class="comment">← groups</span>

<span class="comment">OpenLDAP / standard LDAP (class names differ):</span>
<span class="attr-val">objectClass=inetOrgPerson</span>   <span class="comment">← user accounts</span>
<span class="attr-val">objectClass=device</span>         <span class="comment">← machines</span>
<span class="attr-val">objectClass=groupOfNames</span>   <span class="comment">← groups</span>
<span class="attr-val">objectClass=?</span>              <span class="comment">← service accounts: inspect the directory</span></div>

      <h3>The only reliable approach</h3>
      <p>Never assume objectClass values. <strong>Always inspect the directory first:</strong></p>
      <ol style="margin:8px 0 12px 20px">
        <li>Expand the relevant OU in the directory tree</li>
        <li>Click an entry of the type you are looking for</li>
        <li>Read its actual <code>objectClass</code> value</li>
        <li>Use that exact value in your filter</li>
      </ol>

      <div class="concept-callout">
        <div class="concept-callout-label">Real world - migrations</div>
        <p>Teams migrating from AD to OpenLDAP (or the reverse) hit this constantly. Provisioning scripts, monitoring tools, and access control integrations that worked for years suddenly return nothing - because every <code>(objectClass=user)</code> filter is now wrong. The fix is mechanical but the discovery is always painful. Check the schema first, every time you connect to a new directory.</p>
      </div>
    `
  },

  12: {
    badge: "🔍 Real-world Debug",
    title: "Attribute values must match exactly what is stored",
    html: `
      <h3>LDAP has no synonym resolution</h3>
      <p>An LDAP equality filter does a <strong>direct string comparison</strong> against the stored value. The directory has no knowledge that "Information Technology" and "IT" refer to the same department, that "Eng" is short for "Engineering", or that "TRUE" and "true" might be the same boolean.</p>

      <div class="concept-code-block"><span class="comment">Stored value in a fictional directory:</span>
<span class="attr-name">department</span>: <span class="attr-val">R&amp;D</span>

<span class="comment">These filters all return zero results:</span>
<span class="filter">(department=Research)</span>                <span class="comment">← wrong value</span>
<span class="filter">(department=Research and Development)</span> <span class="comment">← wrong value</span>
<span class="filter">(department=Research & Dev)</span>          <span class="comment">← wrong value</span>

<span class="comment">This is the only filter that works:</span>
<span class="filter">(department=R&amp;D)</span>                     <span class="comment">← exact match</span></div>

      <h3>Case sensitivity</h3>
      <p>Standard LDAP string matching is <em>case-insensitive</em> for most attributes defined in the core schema (cn, sn, mail, uid...). But custom attributes like <code>department</code> or <code>active</code> may or may not be, depending on the server configuration and the attribute's matching rule. Never rely on case-folding - match the stored case exactly.</p>

      <h3>The one rule</h3>
      <p><strong>Always inspect the directory tree before writing a filter on an unfamiliar attribute.</strong> Click the entry, read the exact stored value, then copy it into your filter. Guessing the value is the most common source of silent zero-result bugs.</p>

      <div class="concept-callout">
        <div class="concept-callout-label">Real world - reporting scripts</div>
        <p>HR and finance teams regularly ask for "all users in department X". If the person writing the script guesses "Sales & Marketing" but the directory stores "Sales" and "Marketing" as two separate values, the report comes back empty - and sometimes that empty report gets submitted as truth. Verify the stored values before building any filter that feeds a report or an access decision.</p>
      </div>
    `
  },

  13: {
    badge: "🔒 Security Insight",
    title: "Disabling an account does not revoke its group memberships",
    html: `
      <h3>Two separate data models</h3>
      <p>In LDAP, <strong>account status</strong> and <strong>group membership</strong> are stored in completely different places and have no automatic relationship:</p>
      <div class="concept-code-block"><span class="comment">Account status - stored on the USER entry:</span>
<span class="attr-name">dn</span>:     <span class="attr-val">uid=tom.reed,ou=Employees,dc=example,dc=com</span>
<span class="attr-name">active</span>: <span class="attr-val">FALSE</span>   <span class="comment">← only this entry is affected</span>

<span class="comment">Group membership - stored on the GROUP entry:</span>
<span class="attr-name">dn</span>:     <span class="attr-val">cn=payroll-access,ou=Groups,dc=example,dc=com</span>
<span class="attr-name">member</span>: <span class="attr-val">uid=tom.reed,ou=Employees,dc=example,dc=com</span>
<span class="comment">← still there. active=FALSE did not touch this.</span></div>

      <h3>What active=FALSE actually does</h3>
      <p>Setting <code>active=FALSE</code> changes one attribute on one entry. That is all. It does not:</p>
      <ul>
        <li>Remove the user from any group's <code>member</code> list</li>
        <li>Invalidate existing sessions or tokens</li>
        <li>Modify permissions granted via group membership</li>
        <li>Prevent systems that don't check <code>active</code> from granting access</li>
      </ul>
      <p>Whether <code>active=FALSE</code> actually blocks a login depends entirely on whether the application performing the bind checks that attribute. Many systems do not.</p>

      <h3>Complete deprovisioning requires two steps</h3>
      <div class="concept-code-block"><span class="comment">Step 1 - disable the account (what most people do):</span>
<span class="filter">modify uid=tom.reed,ou=Employees,dc=example,dc=com</span>
<span class="filter">  replace: active</span>
<span class="filter">  active: FALSE</span>

<span class="comment">Step 2 - remove from every group (what most people forget):</span>
<span class="filter">find all groups where (member=uid=tom.reed,...)</span>
<span class="filter">  then: delete that member value from each group</span></div>

      <p>In practice, step 2 is what provisioning tools and IAM platforms automate. Without it, the membership data survives indefinitely - and any system that grants access by checking group membership will still see the user as authorized.</p>

      <div class="concept-callout">
        <div class="concept-callout-label">Real world - offboarding incidents</div>
        <p>This is one of the most common sources of access control findings in security audits. A sysadmin disables an account in Active Directory or LDAP, closes the offboarding ticket, and marks it done. Months later a penetration tester or auditor discovers the account still appears in privileged groups. The account can't log in interactively - but service-to-service calls that authenticate using Kerberos tickets or LDAP group lookups never checked <code>active</code> at all. The group membership was the actual access control, and it was never cleaned up.</p>
      </div>
    `
  },

  14: {
    badge: "🖥️ Asset Management",
    title: "Cross-branch queries: linking users to their devices",
    html: `
      <h3>LDAP has no joins</h3>
      <p>Unlike a relational database, LDAP cannot join two branches of the tree in a single query. When you need to correlate data from different subtrees - for example, a user's status and their assigned workstation - you run two separate queries and combine the results yourself.</p>

      <h3>The owner attribute</h3>
      <p>Device entries in the Computers branch use the <code>owner</code> attribute to record which user a machine is assigned to. Like the <code>member</code> attribute on group entries, the value is always the full DN of the referenced user:</p>
      <div class="concept-code-block"><span class="attr-name">dn</span>:    <span class="attr-val">cn=laptop-007,ou=Devices,dc=example,dc=com</span>
<span class="attr-name">cn</span>:    <span class="attr-val">laptop-007</span>
<span class="attr-name">owner</span>: <span class="attr-val">uid=alex.morgan,ou=Staff,dc=example,dc=com</span>
<span class="attr-name">operatingSystem</span>: <span class="attr-val">Windows 11</span></div>

      <h3>Finding orphaned devices: a two-step process</h3>
      <p>To find machines assigned to former employees, you need two queries:</p>
      <div class="concept-code-block"><span class="comment">Step 1 - find inactive users (search People branch):</span>
<span class="filter">(active=FALSE)</span>
<span class="comment">→ returns: uid=alex.morgan,ou=Staff,dc=example,dc=com</span>

<span class="comment">Step 2 - search Devices for that owner DN:</span>
<span class="filter">(owner=uid=alex.morgan,ou=Staff,dc=example,dc=com)</span>
<span class="comment">→ returns: cn=laptop-007,ou=Devices,dc=example,dc=com</span></div>

      <h3>Why the stale data exists</h3>
      <p>Deactivating a user account modifies only that user's entry. Device entries are in a completely separate branch of the tree and are never touched automatically. The <code>owner</code> attribute survives deactivation, offboarding, and even account deletion unless it is explicitly updated or removed.</p>

      <div class="concept-callout">
        <div class="concept-callout-label">Real world - asset recovery</div>
        <p>IT teams routinely discover hardware assigned to accounts that were disabled months or years ago. The equipment may have been physically collected, repurposed, or simply lost track of - but the directory entry still shows the original owner. Cross-referencing device ownership against account status is a standard step in hardware refresh projects and security audits.</p>
      </div>
    `
  },

  15: {
    badge: "🔏 Data Retention",
    title: "Presence filters and personal data in LDAP",
    html: `
      <h3>Presence filters: does the attribute exist?</h3>
      <p>Sometimes you need to know whether an attribute is set at all, regardless of its value. LDAP provides the <strong>presence filter</strong> for this: writing <code>*</code> as the value matches any entry where the attribute exists with any non-empty value.</p>
      <div class="concept-code-block"><span class="comment">Equality filter - matches a specific value:</span>
<span class="filter">(department=Finance)</span>

<span class="comment">Presence filter - matches if attribute exists at all:</span>
<span class="filter">(fax=*)</span>

<span class="comment">Combined with AND - inactive users who have a fax number:</span>
<span class="filter">(&(active=FALSE)(fax=*))</span></div>

      <h3>Why disabled accounts retain personal data</h3>
      <p>When an LDAP account is disabled (e.g. <code>active=FALSE</code> is set), only that one attribute changes. Every other attribute on the entry - email, phone numbers, addresses, titles - remains exactly as it was. The directory makes no distinction between an active and a disabled account when it comes to stored data.</p>
      <div class="concept-code-block"><span class="comment">Before offboarding:</span>
<span class="attr-name">dn</span>:     <span class="attr-val">uid=petra.voss,ou=Staff,dc=example,dc=com</span>
<span class="attr-name">active</span>: <span class="attr-val">TRUE</span>
<span class="attr-name">mobile</span>: <span class="attr-val">+49-30-555-0198</span>

<span class="comment">After account is disabled - mobile is untouched:</span>
<span class="attr-name">dn</span>:     <span class="attr-val">uid=petra.voss,ou=Staff,dc=example,dc=com</span>
<span class="attr-name">active</span>: <span class="attr-val">FALSE</span>
<span class="attr-name">mobile</span>: <span class="attr-val">+49-30-555-0198</span>   <span class="comment">← still here</span></div>

      <h3>The compliance angle</h3>
      <p>Regulations such as GDPR require that personal data is not retained beyond its legitimate purpose. A former employee's mobile number in a disabled directory account may qualify as data that should be erased - unless there is a documented retention justification. Auditors use presence filters to surface exactly these cases.</p>

      <div class="concept-callout">
        <div class="concept-callout-label">Real world - GDPR audit findings</div>
        <p>A common audit finding: hundreds of disabled accounts still carry email addresses, phone numbers, and home addresses from employees who left years ago. The accounts were disabled promptly - but no one scrubbed the personal attributes. The fix is either to delete the attributes on offboarding, or to have a documented and time-limited retention policy. Either way, you first need to know how many affected accounts exist - which is exactly what a presence filter tells you.</p>
      </div>
    `
  }
};
