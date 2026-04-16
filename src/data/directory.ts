import type { LdapEntry } from '../engine/types';

export const DIRECTORY: LdapEntry[] = [

  // ── Root ─────────────────────────────────────────────────────────────────────
  {
    dn: 'dc=treedap,dc=com',
    attributes: { dc: 'treedap', objectClass: ['top', 'domain'], description: 'TreeDap Corp Root' }
  },

  // ── Top-level OUs ────────────────────────────────────────────────────────────
  {
    dn: 'ou=People,dc=treedap,dc=com',
    attributes: { ou: 'People', objectClass: ['top', 'organizationalUnit'], description: 'All user accounts' }
  },
  {
    dn: 'ou=Groups,dc=treedap,dc=com',
    attributes: { ou: 'Groups', objectClass: ['top', 'organizationalUnit'], description: 'Group objects' }
  },
  {
    dn: 'ou=Services,dc=treedap,dc=com',
    attributes: { ou: 'Services', objectClass: ['top', 'organizationalUnit'], description: 'Service accounts' }
  },
  {
    dn: 'ou=Computers,dc=treedap,dc=com',
    attributes: { ou: 'Computers', objectClass: ['top', 'organizationalUnit'], description: 'Workstations and servers' }
  },

  // ── People sub-OUs ───────────────────────────────────────────────────────────
  {
    dn: 'ou=Contractors,ou=People,dc=treedap,dc=com',
    attributes: { ou: 'Contractors', objectClass: ['top', 'organizationalUnit'], description: 'External contractors' }
  },

  // ── Computers sub-OUs ────────────────────────────────────────────────────────
  {
    dn: 'ou=Workstations,ou=Computers,dc=treedap,dc=com',
    attributes: { ou: 'Workstations', objectClass: ['top', 'organizationalUnit'], description: 'Employee workstations' }
  },
  {
    dn: 'ou=Servers,ou=Computers,dc=treedap,dc=com',
    attributes: { ou: 'Servers', objectClass: ['top', 'organizationalUnit'], description: 'Infrastructure servers' }
  },

  // ── Workstations ─────────────────────────────────────────────────────────────
  {
    dn: 'cn=ws-david,ou=Workstations,ou=Computers,dc=treedap,dc=com',
    attributes: {
      objectClass: ['device', 'top'],
      cn: 'ws-david',
      description: 'Dell Latitude - David Brown',
      owner: 'uid=david.brown,ou=People,dc=treedap,dc=com',
      operatingSystem: 'Windows 11',
      l: 'HQ-Floor3',
      serialNumber: 'LAT-2023-005'
    }
  },
  {
    dn: 'cn=ws-lisa,ou=Workstations,ou=Computers,dc=treedap,dc=com',
    attributes: {
      objectClass: ['device', 'top'],
      cn: 'ws-lisa',
      description: 'HP EliteBook - Lisa Parker',
      owner: 'uid=lisa.parker,ou=People,dc=treedap,dc=com',
      operatingSystem: 'Ubuntu 22.04',
      l: 'HQ-Floor2',
      serialNumber: 'HPE-2023-006'
    }
  },
  {
    dn: 'cn=ws-alice,ou=Workstations,ou=Computers,dc=treedap,dc=com',
    attributes: {
      objectClass: ['device', 'top'],
      cn: 'ws-alice',
      description: 'MacBook Pro - Alice Smith',
      owner: 'uid=alice.smith,ou=People,dc=treedap,dc=com',
      operatingSystem: 'macOS 14',
      l: 'HQ-Floor2',
      serialNumber: 'MBP-2024-001'
    }
  },
  {
    dn: 'cn=ws-carol,ou=Workstations,ou=Computers,dc=treedap,dc=com',
    attributes: {
      objectClass: ['device', 'top'],
      cn: 'ws-carol',
      description: 'ThinkPad X1 - Carol White',
      owner: 'uid=carol.white,ou=People,dc=treedap,dc=com',
      operatingSystem: 'Ubuntu 22.04',
      l: 'HQ-Floor2',
      serialNumber: 'TPX1-2024-002'
    }
  },
  {
    dn: 'cn=ws-henry,ou=Workstations,ou=Computers,dc=treedap,dc=com',
    attributes: {
      objectClass: ['device', 'top'],
      cn: 'ws-henry',
      description: 'Dell OptiPlex - Henry Scott',
      owner: 'uid=henry.scott,ou=People,dc=treedap,dc=com',
      operatingSystem: 'Windows 11',
      l: 'HQ-IT',
      serialNumber: 'DEL-2023-003'
    }
  },
  {
    dn: 'cn=ws-bob,ou=Workstations,ou=Computers,dc=treedap,dc=com',
    attributes: {
      objectClass: ['device', 'top'],
      cn: 'ws-bob',
      description: 'Microsoft Surface - Bob Johnson',
      owner: 'uid=bob.johnson,ou=People,dc=treedap,dc=com',
      operatingSystem: 'Windows 11',
      l: 'HQ-HR',
      serialNumber: 'SRF-2023-004'
    }
  },

  // ── Servers ──────────────────────────────────────────────────────────────────
  {
    dn: 'cn=srv-web01,ou=Servers,ou=Computers,dc=treedap,dc=com',
    attributes: {
      objectClass: ['device', 'ipHost', 'top'],
      cn: 'srv-web01',
      description: 'Web Application Server',
      ipHostNumber: '10.0.0.10',
      operatingSystem: 'Ubuntu 22.04',
      l: 'DC-Rack-A1'
    }
  },
  {
    dn: 'cn=srv-ldap01,ou=Servers,ou=Computers,dc=treedap,dc=com',
    attributes: {
      objectClass: ['device', 'ipHost', 'top'],
      cn: 'srv-ldap01',
      description: 'LDAP Directory Server',
      ipHostNumber: '10.0.0.11',
      operatingSystem: 'Debian 12',
      l: 'DC-Rack-A1'
    }
  },
  {
    dn: 'cn=srv-backup01,ou=Servers,ou=Computers,dc=treedap,dc=com',
    attributes: {
      objectClass: ['device', 'ipHost', 'top'],
      cn: 'srv-backup01',
      description: 'Backup and Recovery Server',
      ipHostNumber: '10.0.0.12',
      operatingSystem: 'Rocky Linux 9',
      l: 'DC-Rack-B2'
    }
  },
  {
    dn: 'cn=srv-mail01,ou=Servers,ou=Computers,dc=treedap,dc=com',
    attributes: {
      objectClass: ['device', 'ipHost', 'top'],
      cn: 'srv-mail01',
      description: 'Mail Server',
      ipHostNumber: '10.0.0.13',
      operatingSystem: 'Ubuntu 22.04',
      l: 'DC-Rack-B2'
    }
  },

  // ── People ───────────────────────────────────────────────────────────────────
  {
    dn: 'uid=lisa.parker,ou=People,dc=treedap,dc=com',
    attributes: {
      objectClass: ['inetOrgPerson', 'top'],
      cn: 'Lisa Parker', givenName: 'Lisa', sn: 'Parker', uid: 'lisa.parker',
      mail: 'lisa.parker@treedap.com',
      department: 'Engineering', title: 'Contractor', active: 'FALSE',
      sAMAccountName: 'lisa.parker'
    }
  },
  {
    dn: 'uid=alice.smith,ou=People,dc=treedap,dc=com',
    attributes: {
      objectClass: ['inetOrgPerson', 'top'],
      cn: 'Alice Smith', givenName: 'Alice', sn: 'Smith', uid: 'alice.smith',
      mail: 'alice@treedap.com', mobile: '+1-555-0101',
      department: 'Engineering', title: 'Software Engineer', active: 'TRUE',
      manager: 'uid=eve.davis,ou=People,dc=treedap,dc=com',
      sAMAccountName: 'alice.smith'
    }
  },
  {
    dn: 'uid=bob.johnson,ou=People,dc=treedap,dc=com',
    attributes: {
      objectClass: ['inetOrgPerson', 'top'],
      cn: 'Bob Johnson', givenName: 'Bob', sn: 'Johnson', uid: 'bob.johnson',
      mail: 'bob@treedap.com', mobile: '+1-555-0102',
      department: 'HR', title: 'HR Manager', active: 'TRUE',
      sAMAccountName: 'bob.johnson'
    }
  },
  {
    dn: 'uid=carol.white,ou=People,dc=treedap,dc=com',
    attributes: {
      objectClass: ['inetOrgPerson', 'top'],
      cn: 'Carol White', givenName: 'Carol', sn: 'White', uid: 'carol.white',
      mail: 'carol@treedap.com', mobile: '+1-555-0103',
      department: 'Engineering', title: 'DevOps Engineer', active: 'TRUE',
      manager: 'uid=eve.davis,ou=People,dc=treedap,dc=com',
      sAMAccountName: 'carol.white'
    }
  },
  {
    dn: 'uid=david.brown,ou=People,dc=treedap,dc=com',
    attributes: {
      objectClass: ['inetOrgPerson', 'top'],
      cn: 'David Brown', givenName: 'David', sn: 'Brown', uid: 'david.brown',
      mail: 'david@treedap.com', mobile: '+1-555-0104',
      department: 'Finance', title: 'CFO', active: 'FALSE',
      sAMAccountName: 'david.brown'
    }
  },
  {
    dn: 'uid=eve.davis,ou=People,dc=treedap,dc=com',
    attributes: {
      objectClass: ['inetOrgPerson', 'top'],
      cn: 'Eve Davis', givenName: 'Eve', sn: 'Davis', uid: 'eve.davis',
      mail: 'eve@treedap.com', mobile: '+1-555-0105',
      department: 'Engineering', title: 'CTO', active: 'TRUE',
      sAMAccountName: 'eve.davis'
    }
  },
  {
    dn: 'uid=frank.miller,ou=People,dc=treedap,dc=com',
    attributes: {
      objectClass: ['inetOrgPerson', 'top'],
      cn: 'Frank Miller', givenName: 'Frank', sn: 'Miller', uid: 'frank.miller',
      mail: 'frank@treedap.com', mobile: '+1-555-0106',
      department: 'HR', title: 'Recruiter', active: 'TRUE',
      pwdAccountLockedTime: '20240315143000Z',
      sAMAccountName: 'frank.miller'
    }
  },
  {
    dn: 'uid=grace.lee,ou=People,dc=treedap,dc=com',
    attributes: {
      objectClass: ['inetOrgPerson', 'top'],
      cn: 'Grace Lee', givenName: 'Grace', sn: 'Lee', uid: 'grace.lee',
      mail: 'grace@treedap.com', mobile: '+1-555-0107',
      department: 'Finance', title: 'Controller', active: 'TRUE',
      pwdChangedTime: '20230101120000Z',
      sAMAccountName: 'grace.lee'
    }
  },
  {
    dn: 'uid=henry.scott,ou=People,dc=treedap,dc=com',
    attributes: {
      objectClass: ['inetOrgPerson', 'top'],
      cn: 'Henry Scott', givenName: 'Henry', sn: 'Scott', uid: 'henry.scott',
      mail: 'henry@treedap.com', mobile: '+1-555-0108',
      department: 'IT', title: 'Sysadmin', active: 'TRUE',
      manager: 'uid=alice.smith,ou=People,dc=treedap,dc=com',
      sAMAccountName: 'henry.scott'
    }
  },

  // ── Contractors (sub-OU of People) ───────────────────────────────────────────
  {
    dn: 'uid=tom.harris,ou=Contractors,ou=People,dc=treedap,dc=com',
    attributes: {
      objectClass: ['inetOrgPerson', 'top'],
      cn: 'Tom Harris', givenName: 'Tom', sn: 'Harris', uid: 'tom.harris',
      mail: 'tom.harris@contractor.com', mobile: '+1-555-0201',
      department: 'Engineering', title: 'Contractor', active: 'TRUE',
      manager: 'uid=eve.davis,ou=People,dc=treedap,dc=com',
      sAMAccountName: 'tom.harris'
    }
  },
  {
    dn: 'uid=sara.klein,ou=Contractors,ou=People,dc=treedap,dc=com',
    attributes: {
      objectClass: ['inetOrgPerson', 'top'],
      cn: 'Sara Klein', givenName: 'Sara', sn: 'Klein', uid: 'sara.klein',
      mail: 'sara.klein@contractor.com',
      department: 'IT', title: 'Contractor', active: 'TRUE',
      manager: 'uid=henry.scott,ou=People,dc=treedap,dc=com',
      sAMAccountName: 'sara.klein'
    }
  },

  // ── Groups ───────────────────────────────────────────────────────────────────
  {
    dn: 'cn=admins,ou=Groups,dc=treedap,dc=com',
    attributes: {
      objectClass: ['groupOfNames', 'top'], cn: 'admins',
      member: [
        'uid=alice.smith,ou=People,dc=treedap,dc=com',
        'uid=eve.davis,ou=People,dc=treedap,dc=com',
        'uid=henry.scott,ou=People,dc=treedap,dc=com'
      ]
    }
  },
  {
    dn: 'cn=engineering,ou=Groups,dc=treedap,dc=com',
    attributes: {
      objectClass: ['groupOfNames', 'top'], cn: 'engineering',
      member: [
        'uid=alice.smith,ou=People,dc=treedap,dc=com',
        'uid=carol.white,ou=People,dc=treedap,dc=com',
        'uid=eve.davis,ou=People,dc=treedap,dc=com',
        'uid=david.brown,ou=People,dc=treedap,dc=com',
        'cn=team-backend,ou=Groups,dc=treedap,dc=com'
      ]
    }
  },
  {
    dn: 'cn=hr-team,ou=Groups,dc=treedap,dc=com',
    attributes: {
      objectClass: ['groupOfNames', 'top'], cn: 'hr-team',
      member: [
        'uid=bob.johnson,ou=People,dc=treedap,dc=com',
        'uid=frank.miller,ou=People,dc=treedap,dc=com'
      ]
    }
  },
  {
    dn: 'cn=finance,ou=Groups,dc=treedap,dc=com',
    attributes: {
      objectClass: ['groupOfNames', 'top'], cn: 'finance',
      member: [
        'uid=david.brown,ou=People,dc=treedap,dc=com',
        'uid=grace.lee,ou=People,dc=treedap,dc=com'
      ]
    }
  },
  {
    dn: 'cn=vpn-users,ou=Groups,dc=treedap,dc=com',
    attributes: {
      objectClass: ['groupOfNames', 'top'], cn: 'vpn-users',
      member: [
        'uid=alice.smith,ou=People,dc=treedap,dc=com',
        'uid=carol.white,ou=People,dc=treedap,dc=com',
        'uid=eve.davis,ou=People,dc=treedap,dc=com',
        'uid=henry.scott,ou=People,dc=treedap,dc=com',
        'uid=david.brown,ou=People,dc=treedap,dc=com'
      ]
    }
  },
  {
    dn: 'cn=it-ops,ou=Groups,dc=treedap,dc=com',
    attributes: {
      objectClass: ['groupOfNames', 'top'], cn: 'it-ops',
      member: [
        'uid=henry.scott,ou=People,dc=treedap,dc=com',
        'uid=carol.white,ou=People,dc=treedap,dc=com'
      ]
    }
  },
  {
    dn: 'cn=team-backend,ou=Groups,dc=treedap,dc=com',
    attributes: {
      objectClass: ['groupOfNames', 'top'], cn: 'team-backend',
      description: 'Backend development sub-team (nested inside engineering)',
      member: [
        'uid=frank.miller,ou=People,dc=treedap,dc=com',
        'uid=grace.lee,ou=People,dc=treedap,dc=com'
      ]
    }
  },

  // ── Services ─────────────────────────────────────────────────────────────────
  {
    dn: 'cn=ldap-svc,ou=Services,dc=treedap,dc=com',
    attributes: {
      objectClass: ['account', 'top'], cn: 'ldap-svc', uid: 'ldap-svc',
      description: 'LDAP Service Account',
      shadowExpire: '19754'
    }
  },
  {
    dn: 'cn=backup-svc,ou=Services,dc=treedap,dc=com',
    attributes: {
      objectClass: ['account', 'top'], cn: 'backup-svc', uid: 'backup-svc',
      description: 'Backup Service Account'
    }
  },
  {
    dn: 'cn=mail-svc,ou=Services,dc=treedap,dc=com',
    attributes: {
      objectClass: ['account', 'top'], cn: 'mail-svc', uid: 'mail-svc',
      description: 'Mail Relay Service Account'
    }
  },
  {
    dn: 'cn=monitor-svc,ou=Services,dc=treedap,dc=com',
    attributes: {
      objectClass: ['account', 'top'], cn: 'monitor-svc', uid: 'monitor-svc',
      description: 'Infrastructure Monitoring Service Account'
    }
  },
];
