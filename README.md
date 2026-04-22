# TreeDap

An LDAP troubleshooting trainer that runs in your browser.
17 scenarios based on bugs I (and probably you) have hit in production: wrong baseDN, scope set to `one` when it should be `sub`, apps searching for `uid` in an AD-synced tree, bind DNs that no longer exist because someone moved the service account into a new OU, and so on.

Live at [treedap.com](https://treedap.com). No signup, no backend, everything runs client-side.

> **Screenshot 1 (hero)**: a full-page shot of the landing at `treedap.com`. Show the title card, the "Diagnose Your First Incident" CTA, the code panel on the right, and the "17 Scenarios / Live Directory / 0 Signup" stats. Width ~1400px.

## Why

Most LDAP bugs don't raise errors. The bind returns "invalid credentials", the query returns zero entries, the app swallows it and logs `authentication failed`. There are a lot of distinct root causes hiding behind that one message, and the only way I ever learned to distinguish them was by hitting them live.

This project is the hands-on primer I wish I'd had. Every scenario is framed as a ticket, a Slack message, or an email from a teammate. You read the context, poke at the directory, and write a filter that proves the diagnosis. Hints are available but cost a star.

## What's in it

**Three intro levels** covering the minimum vocabulary: entries, DNs, `objectClass`, baseDN + scope.

**Fourteen troubleshooting scenarios** across:

- filter-writing mistakes (wrong attribute, missing NOT, nested groups)
- scope and baseDN misconfigurations (the classic "worked on dev, empty on prod")
- migration pain points (OpenLDAP `uid` vs AD `sAMAccountName`, primary group IDs)
- password policy state you can't see from the app (`pwdAccountLockedTime`, `pwdChangedTime`, `shadowExpire`)
- security audits (anonymous bind exposure, credentials in cleartext)
- performance (why a `dc=root` subtree search with scope=sub is expensive)

**Free Mode** for when you just want to poke the directory without objectives. Same tree, same filter engine, no stars.

> **Screenshot 2 (level screen)**: a mid-scenario shot. Pick Level 5 "The Invisible Contractors" or Level 13 "The Flat Group Problem". Show the Jira/Teams context panel at the top, the directory tree on the left with some nodes highlighted as matches, the filter textarea with a real filter typed in, and the results panel. Width ~1400px.

> **Screenshot 3 (Free Mode)**: the Free Mode sandbox. Show the base DN / scope dropdowns, a filter in the textarea, the example chips row, and a few matched entries in the result list. Width ~1400px.

## Running locally

```bash
git clone https://github.com/saluc28/treedap.git
cd treedap
npm install
npm run dev
```

Open http://localhost:5173.

Build: `npm run build`. Preview build: `npm run preview`. Type check: `npx tsc --noEmit`.

No environment variables, no database, no dependencies outside the lockfile.

## Tech choices

React + TypeScript + Vite. React is aliased to `preact/compat` in `vite.config.ts` to cut the bundle size; it's a small app, there's no reason to ship 120kb of React runtime.

The LDAP engine is hand-written. `src/engine/ldapParser.ts` is an RFC 4515 parser (AND / OR / NOT, presence, equality with `*` wildcards, comparison operators). `src/engine/ldapEngine.ts` walks the in-memory directory applying baseDN + scope + filter. Both files are short enough to read in one sitting. No `ldapjs` or similar, partly because it's fun, mostly because a real LDAP client would have brought Node-only deps into the browser bundle.

Progress lives in `localStorage`. The only session state (current screen, current level) lives in `sessionStorage` so a page refresh doesn't kick you back to the landing.

Directory data is in `src/data/directory.ts`. Fake Corp, ~40 entries, intentionally includes AD-style attributes (`sAMAccountName`, `primaryGroupID`) alongside OpenLDAP-style ones so the AD-specific scenarios are realistic.

## Adding a scenario

All scenarios are entries in `src/data/levels.ts`. Two shapes:

- **FilterLevel**: user writes a filter, the engine runs it, `validate()` compares the returned DN set against `expectedDNs`.
- **InvestigativeLevel**: user explores the tree and submits a number or Yes/No answer, `validateAnswer()` checks it.

For filter-writing scenarios, make sure the expected DN set is achievable with one well-formed filter against the provided baseDN + scope. The engine is strict about what the scope returns, so test by running the filter in Free Mode first.

Context copy lives in the same object. Keep it grounded in a ticket or a message from a colleague, not as abstract instruction. The whole point is that you read "all logins stopped at 03:12" and have to work backwards.

## Contributing

PRs welcome. Useful areas:

- more scenarios, especially around ACL / ACIs, replication lag, referrals
- better AD coverage (`tokenGroups`, `userAccountControl` bit checks, though the engine would need extending)
- better mobile story (right now mobile just shows a "come back on a laptop" wall)
- accessibility (keyboard nav on the directory tree is rudimentary)

Open an issue first if it's a large change so we don't end up working against each other. Small fixes (typos, a single scenario) go straight to a PR.

## License

MIT. Do whatever you want with it. If you run an LDAP course or an onboarding session and this saves you a day of slide prep, that's the payoff.

## Credits

Built by [@saluc28](https://github.com/saluc28). The scenarios are composites of real things I've broken, fixed, or watched someone else fix over the years. Any resemblance to an on-call you actually had is probably not a coincidence.
