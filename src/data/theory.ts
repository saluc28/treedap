import type { Theory } from '../engine/types';

export const LEVEL_THEORY: Record<number, Theory> = {

  1: {
    badge: "📖 LDAP Fundamentals",
    title: "What is a directory and how is it structured?",
    html: `
      <h3>LDAP: Lightweight Directory Access Protocol</h3>
      <p>LDAP is a protocol for reading and searching a <strong>directory service</strong> - a database optimised for fast reads, built around a tree structure rather than flat tables. It is the backbone of corporate identity: Active Directory, OpenLDAP, and FreeIPA all speak LDAP.</p>
      <p>In practice you will encounter LDAP any time you deal with user authentication, group-based access control, service accounts, or asset inventory in an enterprise environment.</p>

      <h3>The DN - Distinguished Name</h3>
      <p>Every entry in the directory has a unique address called its <strong>DN (Distinguished Name)</strong>. A DN is a comma-separated list of components read right to left, from the root down to the entry itself:</p>
      <div class="concept-code-block"><span class="dn">uid=alice.smith,ou=People,dc=treedap,dc=com</span></div>
      <p>Reading right to left: company domain <code>treedap.com</code> → container <code>People</code> → user <code>alice.smith</code>. The leftmost component is the entry's own name (its RDN - Relative Distinguished Name).</p>

      <h3>Organizational Units</h3>
      <p><strong>OUs (Organizational Units)</strong> are containers that group related entries. They do not hold data themselves - they exist to organise the tree. Common OUs in a corporate directory:</p>
      <div class="concept-code-block">
<span class="dn">dc=treedap,dc=com</span>
├── <span class="dn">ou=People</span>       <span class="comment">← user accounts</span>
├── <span class="dn">ou=Groups</span>       <span class="comment">← access groups</span>
├── <span class="dn">ou=Services</span>     <span class="comment">← service/app accounts</span>
└── <span class="dn">ou=Computers</span>    <span class="comment">← workstations and servers</span></div>

      <h3>Attributes</h3>
      <p>Every entry is a collection of <strong>attributes</strong> - key/value pairs defined by the entry's schema. Some are mandatory, most are optional. Common attributes you will encounter:</p>
      <ul>
        <li><code>objectClass</code> - declares the type of entry (required on every entry)</li>
        <li><code>uid</code> - login username for person accounts</li>
        <li><code>cn</code> - common name, usually the display name</li>
        <li><code>mail</code> - email address</li>
        <li><code>member</code> - list of DNs that belong to a group</li>
        <li><code>owner</code> - DN of the user responsible for an asset</li>
      </ul>
      <p>Click any entry in the directory tree on the left to inspect its full attribute set.</p>
    `
  },

  2: {
    badge: "🔍 Filters",
    title: "How do LDAP filters work?",
    html: `
      <h3>The Filter Syntax</h3>
      <p>An LDAP filter is a predicate that tells the server which entries to return. The simplest form checks a single attribute:</p>
      <div class="concept-code-block"><span class="filter">(attributeName=value)</span></div>
      <p>Parentheses are always required. The match is case-insensitive for most string attributes.</p>

      <h3>objectClass - the type system</h3>
      <p>The most important attribute to filter on is <code>objectClass</code>. Every entry declares what it is via this attribute, and the value determines which other attributes are allowed or required:</p>
      <div class="concept-code-block">
<span class="filter">(objectClass=inetOrgPerson)</span>   <span class="comment">← person accounts</span>
<span class="filter">(objectClass=groupOfNames)</span>   <span class="comment">← groups</span>
<span class="filter">(objectClass=account)</span>        <span class="comment">← service accounts</span>
<span class="filter">(objectClass=device)</span>         <span class="comment">← computers and devices</span>
<span class="filter">(objectClass=organizationalUnit)</span> <span class="comment">← OU containers</span></div>
      <p><strong>Important:</strong> these class names are schema-defined and differ between implementations. <code>inetOrgPerson</code> is OpenLDAP. Active Directory uses <code>user</code> for the same concept. Always verify the actual objectClass values in the directory you are working with.</p>

      <h3>Filtering on any attribute</h3>
      <p>You can filter on any attribute, not just objectClass:</p>
      <div class="concept-code-block">
<span class="filter">(uid=alice.smith)</span>        <span class="comment">← exact match on login name</span>
<span class="filter">(department=Engineering)</span>  <span class="comment">← match on department</span>
<span class="filter">(mail=*@treedap.com)</span>     <span class="comment">← wildcard: any treedap email</span>
<span class="filter">(mobile=*)</span>              <span class="comment">← presence: has any mobile number</span></div>

      <h3>Combining filters</h3>
      <p>Filters can be combined with boolean operators. The operators wrap their arguments in a prefix notation:</p>
      <div class="concept-code-block">
<span class="filter">(&(objectClass=inetOrgPerson)(active=TRUE))</span>   <span class="comment">← AND</span>
<span class="filter">(|(department=Engineering)(department=IT))</span>    <span class="comment">← OR</span>
<span class="filter">(!(active=FALSE))</span>                             <span class="comment">← NOT</span></div>
      <p>You will build up to these naturally as you work through the troubleshooting scenarios.</p>

      <h3>🌍 In the wild</h3>
      <p>In real environments you never type a bare filter - you pass it to a tool or an SDK. Here is the same <code>(objectClass=inetOrgPerson)</code> filter as you would write it in practice:</p>

      <p><strong>OpenLDAP - ldapsearch:</strong></p>
      <div class="concept-code-block">ldapsearch -x -H ldap://srv-ldap01 \\
  -D "cn=ldap-svc,ou=Services,dc=corp,dc=com" -w secret \\
  -b "ou=People,dc=corp,dc=com" -s sub \\
  "(objectClass=inetOrgPerson)"</div>

      <p><strong>Active Directory - PowerShell:</strong></p>
      <div class="concept-code-block">Get-ADUser -LDAPFilter "(objectClass=user)" \\
  -SearchBase "OU=People,DC=corp,DC=com" \\
  -SearchScope Subtree</div>

      <p>Notice the AD example uses <code>(objectClass=user)</code>, not <code>inetOrgPerson</code>. AD has its own schema - the filter syntax is identical but the class names differ. This is one of the most common sources of confusion when moving between OpenLDAP and AD environments.</p>
    `
  },

  3: {
    badge: "🗺️ BaseDN and Scope",
    title: "How baseDN and scope control what the server searches",
    html: `
      <h3>Two parameters, one very common bug</h3>
      <p>Every LDAP search has two parameters that determine <em>where</em> the server looks - completely independently of the filter. Getting either one wrong means finding nothing even if your filter is perfect. This combination is responsible for a large share of LDAP bugs in production.</p>

      <h3>BaseDN - where the search starts</h3>
      <p>The <strong>baseDN</strong> is the entry in the tree where the server begins its search. It never looks above it, and it never looks in a different branch. If your user accounts live in <code>ou=People</code> but your baseDN is set to <code>ou=Services</code>, the server will dutifully search Services and find nothing - without any error.</p>

      <h3>Scope - how deep to go</h3>
      <p>The <strong>scope</strong> controls how many levels below the baseDN the server will descend:</p>
      <div class="concept-code-block">
<span class="comment">base</span>  - only the baseDN entry itself
<span class="comment">one</span>   - direct children of the baseDN (one level down)
<span class="comment">sub</span>   - the entire subtree below the baseDN (recursive)</div>

      <h3>Visualising the difference</h3>
      <div class="concept-code-block">
<span class="dn">dc=treedap,dc=com</span>          <span class="comment">← baseDN for all examples below</span>
├── <span class="dn">ou=People</span>               <span class="comment">← scope=one finds this</span>
│   ├── <span class="dn">uid=alice.smith</span>     <span class="comment">← scope=sub finds this</span>
│   └── <span class="dn">uid=bob.johnson</span>     <span class="comment">← scope=sub finds this</span>
└── <span class="dn">ou=Groups</span>               <span class="comment">← scope=one finds this</span>
    └── <span class="dn">cn=admins</span>           <span class="comment">← scope=sub finds this</span></div>
      <p>With <code>scope=one</code> from the root you see only the four top-level OUs. Person accounts are a level deeper - <code>scope=one</code> never reaches them. With <code>scope=sub</code> you see everything.</p>

      <h3>The practical rule</h3>
      <p>Use a <strong>specific baseDN</strong> combined with <strong>scope=sub</strong> for almost every real query. A baseDN of <code>dc=treedap,dc=com</code> with scope=sub works but forces the server to scan every entry in the directory. A baseDN of <code>ou=People,dc=treedap,dc=com</code> with scope=sub scans only the People branch - much faster on large directories, and much less likely to accidentally match entries from other branches.</p>

      <h3>🌍 In the wild</h3>
      <p>In ldapsearch, baseDN and scope map directly to the <code>-b</code> and <code>-s</code> flags. These are the two values most often misconfigured in practice:</p>
      <div class="concept-code-block">ldapsearch -x -H ldap://srv-ldap01 \\
  -D "cn=ldap-svc,ou=Services,dc=corp,dc=com" -w secret \\
  -b "ou=People,dc=corp,dc=com" \\   <span class="comment">← baseDN</span>
  -s sub \\                           <span class="comment">← scope: base | one | sub</span>
  "(objectClass=inetOrgPerson)"</div>
      <p>In application config files the same values appear under different names depending on the library - <code>search_base</code>, <code>base_dn</code>, <code>userSearchBase</code> - but they always map to these two LDAP concepts. When a login integration breaks after a directory restructure, these are the first two values to check.</p>
    `
  },

  7: {
    badge: "🔌 Bind DN",
    title: "The bind DN is an address - move the account and it breaks",
    html: `
      <h3>What is a bind DN?</h3>
      <p>Before searching the directory, an application must authenticate. It does this by sending a <strong>bind DN</strong> - the full DN of the account it wants to connect as - plus a password. If the server accepts both, the connection is established and queries can run.</p>
      <p>The bind DN is not just an identifier - it is a precise address in the tree. If the account moves to a different OU, its DN changes completely, and the old DN is gone. The password has not changed, the account has not changed, but the address is wrong and every bind attempt will fail.</p>

      <h3>🌍 In the wild</h3>
      <p>In ldapsearch the bind DN is the <code>-D</code> flag. In application config files it appears under names like <code>bind_dn</code>, <code>manager</code>, <code>userDN</code>, or <code>connection.username</code> depending on the library:</p>
      <div class="concept-code-block">ldapsearch -x -H ldap://srv-ldap01 \\
  -D "cn=ldap-svc,ou=Services,dc=corp,dc=com" \\  <span class="comment">← bind DN</span>
  -w "s3cr3t" \\                                   <span class="comment">← bind password</span>
  -b "ou=People,dc=corp,dc=com" -s sub \\
  "(objectClass=inetOrgPerson)"</div>

      <p>A typical application config (e.g. PAM, nginx-auth-ldap, Grafana):</p>
      <div class="concept-code-block">bind_dn  = cn=ldap-svc,ou=Services,dc=corp,dc=com
bind_pw  = s3cr3t</div>

      <p>After a directory restructure, this is the first thing to audit. Find every place the old DN is hardcoded - config files, environment variables, secrets managers, CI/CD pipelines - and update them all before the next deploy.</p>
    `
  },

};
