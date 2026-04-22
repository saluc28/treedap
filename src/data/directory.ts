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
      department: 'Engineering', title: 'Software Engineer', active: 'FALSE',
      sAMAccountName: 'lisa.parker', primaryGroupID: '513'
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
      sAMAccountName: 'alice.smith', primaryGroupID: '513'
    }
  },
  {
    dn: 'uid=bob.johnson,ou=People,dc=treedap,dc=com',
    attributes: {
      objectClass: ['inetOrgPerson', 'top'],
      cn: 'Bob Johnson', givenName: 'Bob', sn: 'Johnson', uid: 'bob.johnson',
      mail: 'bob@treedap.com', mobile: '+1-555-0102',
      department: 'HR', title: 'HR Manager', active: 'TRUE',
      sAMAccountName: 'bob.johnson', primaryGroupID: '513'
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
      sAMAccountName: 'carol.white', primaryGroupID: '513'
    }
  },
  {
    dn: 'uid=david.brown,ou=People,dc=treedap,dc=com',
    attributes: {
      objectClass: ['inetOrgPerson', 'top'],
      cn: 'David Brown', givenName: 'David', sn: 'Brown', uid: 'david.brown',
      mail: 'david@treedap.com', mobile: '+1-555-0104',
      department: 'Finance', title: 'CFO', active: 'FALSE',
      sAMAccountName: 'david.brown', primaryGroupID: '513'
    }
  },
  {
    dn: 'uid=eve.davis,ou=People,dc=treedap,dc=com',
    attributes: {
      objectClass: ['inetOrgPerson', 'top'],
      cn: 'Eve Davis', givenName: 'Eve', sn: 'Davis', uid: 'eve.davis',
      mail: 'eve@treedap.com', mobile: '+1-555-0105',
      department: 'Engineering', title: 'CTO', active: 'TRUE',
      sAMAccountName: 'eve.davis', primaryGroupID: '513'
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
      sAMAccountName: 'frank.miller', primaryGroupID: '513'
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
      sAMAccountName: 'grace.lee', primaryGroupID: '513'
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
      sAMAccountName: 'henry.scott', primaryGroupID: '513'
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
      sAMAccountName: 'tom.harris', primaryGroupID: '514'
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
      sAMAccountName: 'sara.klein', primaryGroupID: '514'
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

  // ── Printers sub-OU (under Computers) ────────────────────────────────────────
  {
    dn: 'ou=Printers,ou=Computers,dc=treedap,dc=com',
    attributes: { ou: 'Printers', objectClass: ['top', 'organizationalUnit'], description: 'Office printers' }
  },
  {
    dn: 'cn=prn-floor2,ou=Printers,ou=Computers,dc=treedap,dc=com',
    attributes: {
      objectClass: ['device', 'top'], cn: 'prn-floor2',
      description: 'HP LaserJet - Floor 2 shared', l: 'HQ-Floor2', serialNumber: 'HPL-2022-101'
    }
  },
  {
    dn: 'cn=prn-floor3,ou=Printers,ou=Computers,dc=treedap,dc=com',
    attributes: {
      objectClass: ['device', 'top'], cn: 'prn-floor3',
      description: 'HP LaserJet - Floor 3 shared', l: 'HQ-Floor3', serialNumber: 'HPL-2022-102'
    }
  },
  {
    dn: 'cn=prn-reception,ou=Printers,ou=Computers,dc=treedap,dc=com',
    attributes: {
      objectClass: ['device', 'top'], cn: 'prn-reception',
      description: 'Brother MFC - Reception', l: 'HQ-Lobby', serialNumber: 'BRO-2023-014'
    }
  },
  {
    dn: 'cn=prn-hr,ou=Printers,ou=Computers,dc=treedap,dc=com',
    attributes: {
      objectClass: ['device', 'top'], cn: 'prn-hr',
      description: 'Brother MFC - HR wing', l: 'HQ-HR', serialNumber: 'BRO-2023-015'
    }
  },
  {
    dn: 'cn=prn-finance,ou=Printers,ou=Computers,dc=treedap,dc=com',
    attributes: {
      objectClass: ['device', 'top'], cn: 'prn-finance',
      description: 'Canon imageRUNNER - Finance', l: 'HQ-Finance', serialNumber: 'CAN-2023-022'
    }
  },

  // ── Network sub-OU (under Computers) ─────────────────────────────────────────
  {
    dn: 'ou=Network,ou=Computers,dc=treedap,dc=com',
    attributes: { ou: 'Network', objectClass: ['top', 'organizationalUnit'], description: 'Routers, switches, firewalls and access points' }
  },
  {
    dn: 'cn=rtr-core01,ou=Network,ou=Computers,dc=treedap,dc=com',
    attributes: {
      objectClass: ['device', 'ipHost', 'top'], cn: 'rtr-core01',
      description: 'Core router', ipHostNumber: '10.0.0.1', l: 'DC-Rack-A1'
    }
  },
  {
    dn: 'cn=rtr-edge01,ou=Network,ou=Computers,dc=treedap,dc=com',
    attributes: {
      objectClass: ['device', 'ipHost', 'top'], cn: 'rtr-edge01',
      description: 'Edge router (internet gateway)', ipHostNumber: '10.0.0.2', l: 'DC-Rack-A1'
    }
  },
  {
    dn: 'cn=sw-core01,ou=Network,ou=Computers,dc=treedap,dc=com',
    attributes: {
      objectClass: ['device', 'ipHost', 'top'], cn: 'sw-core01',
      description: 'Core switch', ipHostNumber: '10.0.0.3', l: 'DC-Rack-A2'
    }
  },
  {
    dn: 'cn=sw-floor2,ou=Network,ou=Computers,dc=treedap,dc=com',
    attributes: {
      objectClass: ['device', 'ipHost', 'top'], cn: 'sw-floor2',
      description: 'Access switch - Floor 2', ipHostNumber: '10.0.2.1', l: 'HQ-Floor2'
    }
  },
  {
    dn: 'cn=sw-floor3,ou=Network,ou=Computers,dc=treedap,dc=com',
    attributes: {
      objectClass: ['device', 'ipHost', 'top'], cn: 'sw-floor3',
      description: 'Access switch - Floor 3', ipHostNumber: '10.0.3.1', l: 'HQ-Floor3'
    }
  },
  {
    dn: 'cn=fw-dmz01,ou=Network,ou=Computers,dc=treedap,dc=com',
    attributes: {
      objectClass: ['device', 'ipHost', 'top'], cn: 'fw-dmz01',
      description: 'DMZ firewall', ipHostNumber: '10.0.0.4', l: 'DC-Rack-A1'
    }
  },
  {
    dn: 'cn=ap-hq01,ou=Network,ou=Computers,dc=treedap,dc=com',
    attributes: {
      objectClass: ['device', 'ipHost', 'top'], cn: 'ap-hq01',
      description: 'Wireless AP - HQ floors', ipHostNumber: '10.0.10.1', l: 'HQ-Ceiling'
    }
  },

  // ── Additional servers ───────────────────────────────────────────────────────
  {
    dn: 'cn=srv-web02,ou=Servers,ou=Computers,dc=treedap,dc=com',
    attributes: {
      objectClass: ['device', 'ipHost', 'top'], cn: 'srv-web02',
      description: 'Web Application Server (replica)', ipHostNumber: '10.0.0.20',
      operatingSystem: 'Ubuntu 22.04', l: 'DC-Rack-A1'
    }
  },
  {
    dn: 'cn=srv-web03,ou=Servers,ou=Computers,dc=treedap,dc=com',
    attributes: {
      objectClass: ['device', 'ipHost', 'top'], cn: 'srv-web03',
      description: 'Web Application Server (canary)', ipHostNumber: '10.0.0.21',
      operatingSystem: 'Ubuntu 22.04', l: 'DC-Rack-A1'
    }
  },
  {
    dn: 'cn=srv-dns01,ou=Servers,ou=Computers,dc=treedap,dc=com',
    attributes: {
      objectClass: ['device', 'ipHost', 'top'], cn: 'srv-dns01',
      description: 'Primary DNS resolver', ipHostNumber: '10.0.0.30',
      operatingSystem: 'Debian 12', l: 'DC-Rack-A2'
    }
  },
  {
    dn: 'cn=srv-dns02,ou=Servers,ou=Computers,dc=treedap,dc=com',
    attributes: {
      objectClass: ['device', 'ipHost', 'top'], cn: 'srv-dns02',
      description: 'Secondary DNS resolver', ipHostNumber: '10.0.0.31',
      operatingSystem: 'Debian 12', l: 'DC-Rack-B1'
    }
  },
  {
    dn: 'cn=srv-db01,ou=Servers,ou=Computers,dc=treedap,dc=com',
    attributes: {
      objectClass: ['device', 'ipHost', 'top'], cn: 'srv-db01',
      description: 'PostgreSQL primary', ipHostNumber: '10.0.0.40',
      operatingSystem: 'Rocky Linux 9', l: 'DC-Rack-B1'
    }
  },
  {
    dn: 'cn=srv-db02,ou=Servers,ou=Computers,dc=treedap,dc=com',
    attributes: {
      objectClass: ['device', 'ipHost', 'top'], cn: 'srv-db02',
      description: 'PostgreSQL replica', ipHostNumber: '10.0.0.41',
      operatingSystem: 'Rocky Linux 9', l: 'DC-Rack-B2'
    }
  },
  {
    dn: 'cn=srv-app01,ou=Servers,ou=Computers,dc=treedap,dc=com',
    attributes: {
      objectClass: ['device', 'ipHost', 'top'], cn: 'srv-app01',
      description: 'Node application server', ipHostNumber: '10.0.0.50',
      operatingSystem: 'Ubuntu 22.04', l: 'DC-Rack-A2'
    }
  },
  {
    dn: 'cn=srv-app02,ou=Servers,ou=Computers,dc=treedap,dc=com',
    attributes: {
      objectClass: ['device', 'ipHost', 'top'], cn: 'srv-app02',
      description: 'Node application server', ipHostNumber: '10.0.0.51',
      operatingSystem: 'Ubuntu 22.04', l: 'DC-Rack-A2'
    }
  },
  {
    dn: 'cn=srv-ci01,ou=Servers,ou=Computers,dc=treedap,dc=com',
    attributes: {
      objectClass: ['device', 'ipHost', 'top'], cn: 'srv-ci01',
      description: 'Jenkins CI controller', ipHostNumber: '10.0.0.60',
      operatingSystem: 'Ubuntu 22.04', l: 'DC-Rack-B2'
    }
  },
  {
    dn: 'cn=srv-gitlab01,ou=Servers,ou=Computers,dc=treedap,dc=com',
    attributes: {
      objectClass: ['device', 'ipHost', 'top'], cn: 'srv-gitlab01',
      description: 'GitLab self-hosted', ipHostNumber: '10.0.0.61',
      operatingSystem: 'Debian 12', l: 'DC-Rack-B2'
    }
  },
  {
    dn: 'cn=srv-proxy01,ou=Servers,ou=Computers,dc=treedap,dc=com',
    attributes: {
      objectClass: ['device', 'ipHost', 'top'], cn: 'srv-proxy01',
      description: 'HAProxy load balancer', ipHostNumber: '10.0.0.70',
      operatingSystem: 'Alpine Linux', l: 'DC-Rack-A1'
    }
  },
  {
    dn: 'cn=srv-vpn01,ou=Servers,ou=Computers,dc=treedap,dc=com',
    attributes: {
      objectClass: ['device', 'ipHost', 'top'], cn: 'srv-vpn01',
      description: 'OpenVPN access server', ipHostNumber: '10.0.0.80',
      operatingSystem: 'Debian 12', l: 'DC-Rack-A1'
    }
  },
  {
    dn: 'cn=srv-log01,ou=Servers,ou=Computers,dc=treedap,dc=com',
    attributes: {
      objectClass: ['device', 'ipHost', 'top'], cn: 'srv-log01',
      description: 'Elasticsearch log aggregator', ipHostNumber: '10.0.0.90',
      operatingSystem: 'Ubuntu 22.04', l: 'DC-Rack-B1'
    }
  },
  {
    dn: 'cn=srv-monitor01,ou=Servers,ou=Computers,dc=treedap,dc=com',
    attributes: {
      objectClass: ['device', 'ipHost', 'top'], cn: 'srv-monitor01',
      description: 'Prometheus + Grafana', ipHostNumber: '10.0.0.91',
      operatingSystem: 'Ubuntu 22.04', l: 'DC-Rack-B1'
    }
  },

  // ── Additional functional groups ─────────────────────────────────────────────
  {
    dn: 'cn=all-staff,ou=Groups,dc=treedap,dc=com',
    attributes: {
      objectClass: ['groupOfNames', 'top'], cn: 'all-staff',
      description: 'Umbrella group - contains every department group (deep nesting)',
      member: [
        'cn=engineering,ou=Groups,dc=treedap,dc=com',
        'cn=hr-team,ou=Groups,dc=treedap,dc=com',
        'cn=finance,ou=Groups,dc=treedap,dc=com'
      ]
    }
  },
  {
    dn: 'cn=sre-oncall,ou=Groups,dc=treedap,dc=com',
    attributes: {
      objectClass: ['groupOfNames', 'top'], cn: 'sre-oncall',
      description: 'SRE on-call rotation',
      member: [
        'uid=henry.scott,ou=People,dc=treedap,dc=com',
        'uid=carol.white,ou=People,dc=treedap,dc=com'
      ]
    }
  },
  {
    dn: 'cn=security-team,ou=Groups,dc=treedap,dc=com',
    attributes: {
      objectClass: ['groupOfNames', 'top'], cn: 'security-team',
      member: [
        'uid=henry.scott,ou=People,dc=treedap,dc=com',
        'uid=eve.davis,ou=People,dc=treedap,dc=com'
      ]
    }
  },
  {
    dn: 'cn=team-frontend,ou=Groups,dc=treedap,dc=com',
    attributes: {
      objectClass: ['groupOfNames', 'top'], cn: 'team-frontend',
      description: 'Frontend development sub-team',
      member: [
        'uid=alice.smith,ou=People,dc=treedap,dc=com',
        'uid=carol.white,ou=People,dc=treedap,dc=com'
      ]
    }
  },
  {
    dn: 'cn=team-infra,ou=Groups,dc=treedap,dc=com',
    attributes: {
      objectClass: ['groupOfNames', 'top'], cn: 'team-infra',
      description: 'Infrastructure team',
      member: [
        'uid=henry.scott,ou=People,dc=treedap,dc=com',
        'uid=carol.white,ou=People,dc=treedap,dc=com'
      ]
    }
  },
  {
    dn: 'cn=team-data,ou=Groups,dc=treedap,dc=com',
    attributes: {
      objectClass: ['groupOfNames', 'top'], cn: 'team-data',
      description: 'Data platform team',
      member: [
        'uid=eve.davis,ou=People,dc=treedap,dc=com',
        'uid=grace.lee,ou=People,dc=treedap,dc=com'
      ]
    }
  },
  {
    dn: 'cn=engineering-leads,ou=Groups,dc=treedap,dc=com',
    attributes: {
      objectClass: ['groupOfNames', 'top'], cn: 'engineering-leads',
      member: [
        'uid=alice.smith,ou=People,dc=treedap,dc=com',
        'uid=eve.davis,ou=People,dc=treedap,dc=com'
      ]
    }
  },
  {
    dn: 'cn=finance-leads,ou=Groups,dc=treedap,dc=com',
    attributes: {
      objectClass: ['groupOfNames', 'top'], cn: 'finance-leads',
      member: [
        'uid=david.brown,ou=People,dc=treedap,dc=com',
        'uid=grace.lee,ou=People,dc=treedap,dc=com'
      ]
    }
  },
  {
    dn: 'cn=oncall-primary,ou=Groups,dc=treedap,dc=com',
    attributes: {
      objectClass: ['groupOfNames', 'top'], cn: 'oncall-primary',
      description: 'Primary on-call responder',
      member: ['uid=henry.scott,ou=People,dc=treedap,dc=com']
    }
  },
  {
    dn: 'cn=alumni,ou=Groups,dc=treedap,dc=com',
    attributes: {
      objectClass: ['groupOfNames', 'top'], cn: 'alumni',
      description: 'Former employees (kept for historical audit trail)',
      member: ['uid=lisa.parker,ou=People,dc=treedap,dc=com']
    }
  },
  {
    dn: 'cn=devops,ou=Groups,dc=treedap,dc=com',
    attributes: {
      objectClass: ['groupOfNames', 'top'], cn: 'devops',
      member: [
        'uid=henry.scott,ou=People,dc=treedap,dc=com',
        'uid=carol.white,ou=People,dc=treedap,dc=com'
      ]
    }
  },

  // ── Projects sub-OU (under Groups) ───────────────────────────────────────────
  {
    dn: 'ou=Projects,ou=Groups,dc=treedap,dc=com',
    attributes: { ou: 'Projects', objectClass: ['top', 'organizationalUnit'], description: 'Cross-functional project groups' }
  },
  {
    dn: 'cn=project-phoenix,ou=Projects,ou=Groups,dc=treedap,dc=com',
    attributes: {
      objectClass: ['groupOfNames', 'top'], cn: 'project-phoenix',
      description: 'Platform rewrite initiative',
      member: [
        'uid=alice.smith,ou=People,dc=treedap,dc=com',
        'uid=carol.white,ou=People,dc=treedap,dc=com',
        'uid=tom.harris,ou=Contractors,ou=People,dc=treedap,dc=com'
      ]
    }
  },
  {
    dn: 'cn=project-atlas,ou=Projects,ou=Groups,dc=treedap,dc=com',
    attributes: {
      objectClass: ['groupOfNames', 'top'], cn: 'project-atlas',
      description: 'Architecture refresh',
      member: [
        'uid=eve.davis,ou=People,dc=treedap,dc=com',
        'uid=alice.smith,ou=People,dc=treedap,dc=com'
      ]
    }
  },
  {
    dn: 'cn=project-helios,ou=Projects,ou=Groups,dc=treedap,dc=com',
    attributes: {
      objectClass: ['groupOfNames', 'top'], cn: 'project-helios',
      description: 'Finance automation',
      member: [
        'uid=carol.white,ou=People,dc=treedap,dc=com',
        'uid=grace.lee,ou=People,dc=treedap,dc=com'
      ]
    }
  },
  {
    dn: 'cn=project-orion,ou=Projects,ou=Groups,dc=treedap,dc=com',
    attributes: {
      objectClass: ['groupOfNames', 'top'], cn: 'project-orion',
      description: 'Helpdesk tooling',
      member: [
        'uid=tom.harris,ou=Contractors,ou=People,dc=treedap,dc=com',
        'uid=sara.klein,ou=Contractors,ou=People,dc=treedap,dc=com'
      ]
    }
  },
  {
    dn: 'cn=new-hires-q1,ou=Projects,ou=Groups,dc=treedap,dc=com',
    attributes: {
      objectClass: ['groupOfNames', 'top'], cn: 'new-hires-q1',
      description: 'Q1 onboarding cohort',
      member: [
        'uid=tom.harris,ou=Contractors,ou=People,dc=treedap,dc=com',
        'uid=sara.klein,ou=Contractors,ou=People,dc=treedap,dc=com'
      ]
    }
  },
];
