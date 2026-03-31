# Specialized Server Building Playbook

# 12-Factor AI Prompting Framework with Subagent Orchestration

> Based on V1-V4 implementation of port-exp-boilerplate  
> Multi-agent approach: Specialized subagents handle specific domains  
> Goal: Build production-grade Node.js/Express/MongoDB servers with AI collaboration

---

## Overview: Multi-Agent Architecture

Instead of one agent doing everything, we orchestrate **specialized subagents**:

```
Orchestrator Agent (You)
    ↓ delegates to
├── Context Analyzer (Pre-Flight)
├── Security Auditor (Phase 1)
├── Implementation Engineer (Phase 2)
├── Documentation Writer (Phase 3)
├── Quality Assurance (Phase 4)
└── Delivery Coordinator (Phase 5)
```

Each subagent has **specific expertise** and **deliverables**.

---

## The 12 Factors with Subagent Tasks

### Factor 1: State Awareness

**Principle**: Know what's already built before adding anything

**Subagent**: Context Analyzer  
**Expertise**: Codebase archaeology, documentation analysis  
**Deliverable**: Analysis Summary document

**Tasks**:

```markdown
## Context Analyzer Tasks

### Phase 0A: Documentation Stack Analysis (15 min)

[ ] Read README.md → Extract: project goals, tech stack, setup instructions
[ ] Read docs/timeline.md → Extract: current V-phase, completed items, next steps
[ ] Read docs/codebase.md → Extract: actual architecture (not promised)
[ ] Read docs/decisions.md → Extract: why things are this way
[ ] Read docs/review.md → Extract: current ratings, known weaknesses
[ ] Read docs/problems.md → Extract: critical bugs blocking work

Output: Documentation Summary

- Project Phase: V[X]
- Architecture Pattern: [MVC/etc]
- Current Tech Stack: [list]
- Known Blockers: [bugs that must be fixed first]
- Next Logical Step: [from timeline]
```

**Verification**:

```bash
[ ] Can explain project purpose in one sentence
[ ] Can list all current models and their relationships
[ ] Can identify the biggest gap between docs and code
```

---

### Factor 2: Verification Over Assumption

**Principle**: Never claim "fixed" without proof

**Subagent**: Quality Assurance  
**Expertise**: Testing, validation, evidence gathering  
**Deliverable**: Verification Report with commands + outputs

**Tasks**:

````markdown
## Quality Assurance Tasks

### For Every Claim Made:

[ ] Write test that would have caught the bug (before fixing)
[ ] Run test to confirm it fails (reproduces bug)
[ ] Fix the bug
[ ] Run test to confirm it passes
[ ] Manual end-to-end test
[ ] Document expected vs actual output

### Required Format:

````markdown
## Verification: [Feature Name]

**Test Written**:

```javascript
// test code here
```
````
````

**Before Fix**:

```bash
$ [test command]
[expected failure output]
```

**After Fix**:

```bash
$ [test command]
[success output]
```

**Manual Verification**:

1. [step 1 command]
   Expected: [what should happen]
   Actual: [what actually happened] ✅
2. [step 2 command]
   Expected: [what should happen]
   Actual: [what actually happened] ✅

````

**Example from this project** (Token Storage Bug):
```markdown
## Verification: Token Storage Fix

**Test Written**:
```javascript
// AuthContext.test.js
it('should store JWT token, not user ID', () => {
  const mockResponse = { token: 'eyJ...', _id: '123' };
  localStorage.setItem('token', mockResponse._id); // Simulate bug

  expect(localStorage.getItem('token')).not.toBe(mockResponse._id);
  expect(localStorage.getItem('token')).toBe(mockResponse.token);
});
````

**Before Fix**:

```bash
$ npm test
FAIL: Expected token to be JWT, got user ID
```

**Fix Applied**:

```diff
- localStorage.setItem('token', data._id);
+ localStorage.setItem('token', data.token);
```

**After Fix**:

```bash
$ npm test
PASS: Token storage uses JWT
```

**Manual Verification**:

1. Login with test user
   Expected: localStorage.token starts with "eyJ"
   Actual: eyJhbGciOiJIUzI1NiIs... ✅
2. Access protected route /api/users/profile
   Expected: Returns user data with 200
   Actual: { \_id: "...", email: "..." } ✅

````

---

### Factor 3: Documentation Synchronization
**Principle**: Code and docs move in lockstep

**Subagent**: Documentation Writer
**Expertise**: Technical writing, consistency checking
**Deliverable**: Updated docs matching code changes

**Tasks**:
```markdown
## Documentation Writer Tasks

### After EVERY Code Change:

[ ] Update README.md:
  - If new endpoint: Add to API table
  - If new env var: Add to Environment section
  - If setup changed: Update Quick Start

[ ] Update docs/codebase.md:
  - If architecture changed: Update diagrams
  - If new middleware: Add to stack section
  - If new model: Add to data flow

[ ] Update docs/timeline.md:
  - Mark item complete with ✅
  - Add commit hash
  - Include "What was implemented" section

[ ] Update docs/review.md:
  - Update ratings if quality improved
  - Move fixed weaknesses to "Resolved"
  - Add new weaknesses if found

### Consistency Checks:
[ ] API endpoints in README match routes/index.js
[ ] Architecture in codebase.md matches actual folder structure
[ ] Tech stack versions match package.json
[ ] All code examples in docs actually work

### Required Footer in Each Doc:
```markdown
---
**Last Updated**: [Date]
**Commit**: [hash]
**Status**: [current state]
---
````

````

**Example Workflow** (Adding Health Endpoint):
```markdown
## Documentation Updates for /api/health

### README.md Changes:
```diff
| GET    | `/api/projects`       | Get all projects    |
| GET    | `/api/projects/:id`   | Get single project  |
+| GET    | `/api/health`         | Health check        |
````

### docs/codebase.md Changes:

```diff
### API Endpoints
...
++ ### Monitoring
++ - GET /api/health - Returns system status, database connection, memory usage
```

### docs/timeline.md Changes:

```diff
### V4 Validation Checklist
+- ⏳ Health check endpoint responding
++- ✅ Health check endpoint responding (status, uptime, memory, DB status)
++  - Commit: `14d6c1a`
```

### docs/review.md Changes:

```diff
### Weaknesses (V4 Opportunities)
++ 1. ~~No health monitoring~~ ✅ FIXED
++    - Added /api/health endpoint
++    - Returns database status and memory usage
```

---

### Factor 4: Security-First Development

**Principle**: Every feature starts with security questions

**Subagent**: Security Auditor  
**Expertise**: Threat modeling, vulnerability assessment, OWASP  
**Deliverable**: Security Assessment Report

**Tasks**:

````markdown
## Security Auditor Tasks

### For EVERY Endpoint Created or Modified:

[ ] Input Validation Assessment:

- What data types are expected?
- What could a malicious user send?
- Are there length limits?
- Is XSS possible?

[ ] Authorization Assessment:

- Who should access this endpoint?
- Is authentication required?
- What roles are allowed?
- Are we checking role server-side?

[ ] Data Exposure Assessment:

- What data is returned?
- Are passwords/secrets included?
- Can users see other users' data?
- Is sensitive data logged?

[ ] Rate Limiting Assessment:

- Could this be brute-forced?
- Should we add rate limiting?
- What are appropriate limits?

[ ] Output Sanitization:

- Is user input escaped?
- Could this enable XSS?
- Are error messages safe?

### Required Output:

```markdown
## Security Assessment: [Endpoint]

**Endpoint**: METHOD /path

**Input Validation**:

- Validation rules: [list]
- XSS protection: [method]
- Injection prevention: [method]

**Authorization**:

- Required: Yes/No
- Roles allowed: [list]
- Implementation: [middleware/inline]

**Data Exposure**:

- Returns: [fields]
- Excludes: [sensitive fields]
- Logs: [what gets logged]

**Rate Limiting**:

- Applied: Yes/No
- Window: [time]
- Max requests: [number]
- Skip successful: Yes/No

**Risk Level**: 🔴 Critical / 🟠 High / 🟡 Medium / 🟢 Low
```
````

### OWASP Top 10 Check for Each Feature:

[ ] Injection (NoSQL, SQL, Command)
[ ] Broken Authentication
[ ] Sensitive Data Exposure
[ ] XML External Entities (XXE)
[ ] Broken Access Control
[ ] Security Misconfiguration
[ ] Cross-Site Scripting (XSS)
[ ] Insecure Deserialization
[ ] Using Components with Known Vulnerabilities
[ ] Insufficient Logging & Monitoring

````

**Example from this project** (Registration Endpoint):
```markdown
## Security Assessment: POST /api/users/register

**Input Validation**:
- Email: Validated with isEmail(), normalized
- Password: 8+ chars, complexity requirements (upper, lower, number)
- Role: Restricted to ["user"] only (no admin escalation)

**Authorization**:
- Required: No (this is the registration endpoint)
- Public access: Yes
- Note: Rate limited to prevent abuse

**Data Exposure**:
- Returns: { _id, email, role, token }
- Excludes: password (never returned)
- Logs: Registration attempt (not password)

**Rate Limiting**:
- Applied: Yes
- Window: 15 minutes
- Max requests: 5
- Message: "Too many registration attempts"

**Security Checks**:
✅ Input validation prevents NoSQL injection
✅ Role escalation blocked (can't register as admin)
✅ Password requirements prevent weak passwords
✅ Rate limiting prevents brute force
✅ CORS restricted to CLIENT_URL

**Risk Level**: 🟢 Low (well protected)
````

---

### Factor 5: Explicit Anti-Patterns

**Principle**: Know what not to do based on painful lessons

**Subagent**: Security Auditor + Implementation Engineer  
**Expertise**: Pattern recognition, code review, mistake prevention  
**Deliverable**: Anti-Pattern Checklist (must pass before finishing)

**Tasks**:

````markdown
## Anti-Pattern Prevention Tasks

### Before Marking ANY Task Complete:

[ ] Check Forbidden Patterns:

- [ ] No hardcoded data in controllers (use DB)
- [ ] No storing wrong token value (data.token, not data.\_id)
- [ ] No skipping validation "for now"
- [ ] No ignoring async errors
- [ ] No trusting client-side role values
- [ ] No open CORS in production
- [ ] No missing rate limiting on auth
- [ ] No returning stack traces in production
- [ ] No storing passwords in JWT
- [ ] No documentation drift

### If Any Pattern Found:

[ ] Document in problems.md
[ ] Fix immediately
[ ] Write regression test
[ ] Commit the fix

### Forbidden Patterns Reference:

| Pattern                                       | Why Forbidden                                  | Lesson from V1-V4                      |
| --------------------------------------------- | ---------------------------------------------- | -------------------------------------- |
| ❌ Storing `data._id` instead of `data.token` | Auth appears to work but protected routes fail | Always verify token storage end-to-end |
| ❌ Hardcoded data in controllers              | No dynamic content management                  | Always use database models             |
| ❌ No input validation "for now"              | Privilege escalation, XSS attacks              | Security is never "for later"          |
| ❌ Skipping error handling                    | Uncaught exceptions crash server               | Every async needs try-catch            |
| ❌ Ignoring async/await errors                | Silent failures, data loss                     | Always await and handle errors         |
| ❌ Storing passwords in JWT                   | Security breach if token leaked                | JWT only stores ID + metadata          |
| ❌ Trusting client-side role                  | User can register as admin                     | Validate role server-side only         |
| ❌ Open CORS in production                    | CSRF attacks, data theft                       | Restrict to known origins              |
| ❌ Missing rate limiting                      | Brute force, DDoS                              | Protect all auth endpoints             |
| ❌ Documentation drift                        | New developers confused                        | Docs are code - keep synced            |
| ❌ Large, multi-feature commits               | Can't rollback, hard to review                 | One concern per commit                 |
| ❌ "It works on my machine"                   | Production always different                    | Use Docker for consistency             |

### Required Sign-off:

```markdown
## Anti-Pattern Checklist: [Feature]

[ ] No hardcoded data
[ ] Token storage correct
[ ] Validation implemented
[ ] Error handling complete
[ ] Security measures applied
[ ] Documentation synchronized

**Status**: ✅ All checks passed / ⏳ [X] items pending
**Checked by**: [Subagent name]
**Date**: [timestamp]
```
````

````

---

### Factor 6: Granular Commit Discipline
**Principle**: Small, reviewable, reversible commits

**Subagent**: Implementation Engineer
**Expertise**: Git workflows, atomic commits, clean history
**Deliverable**: Commit sequence with proper messages

**Tasks**:
```markdown
## Implementation Engineer Tasks

### Commit Planning:
[ ] Break work into atomic units (one concern each)
[ ] Estimate: Small (1 commit), Medium (2-3), Large (4+)
[ ] Identify dependencies (what must come first)

### Commit Execution:
[ ] Each commit leaves code in working state
[ ] Each commit is independently reviewable
[ ] Each commit can be rolled back without breaking others

### Required Commit Format:
````

type(scope): description under 50 chars

What changed and why:

- Point 1
- Point 2

Verification:

- Test: [command]
- Expected: [output]

Fixes: [issue # or "N/A"]
Docs: [files updated]
Co-authored-by: [subagent names]

```

### Types:
- `feat`: New feature
- `fix`: Bug fix
- `security`: Security improvement
- `perf`: Performance optimization
- `docs`: Documentation only
- `test`: Adding/updating tests
- `refactor`: Code restructuring

### Forbidden Patterns:
❌ "Various changes"
❌ "WIP: partial implementation"
❌ "Fixed auth AND added validation AND updated docs"
❌ "Update" (too vague)
❌ "Fix stuff" (what stuff?)

### Example Commit Sequence (V4 Database Indexing):

**Commit 1**:
```

perf(database): Add indexes to User model

- Add role index for admin queries
- Note: email already has unique constraint (auto-indexed)
- Removed duplicate explicit email index

Verification:

- Test: Check indexes in MongoDB Compass
- Expected: role_1 index visible

Fixes: N/A (optimization)
Docs: codebase.md, timeline.md

```

**Commit 2**:
```

perf(database): Add indexes to Project model

- Add compound index for category+featured filtering
- Add featured index for featured projects queries
- Add createdAt index for sorting
- Add timestamps: true for tracking

Verification:

- Test: Query projects by category with featured sort
- Expected: Query uses index, execution time < 10ms

Fixes: N/A (optimization)
Docs: codebase.md, timeline.md

```

**Commit 3**:
```

perf(database): Add indexes to ContactMessage model

- Add compound read+createdAt index for admin queries
- Add email index for contact lookups

Verification:

- Test: Admin dashboard loads messages sorted by unread first
- Expected: Query uses index, fast response

Fixes: N/A (optimization)
Docs: codebase.md, timeline.md

````

### Verification:
```bash
[ ] git log shows logical sequence
[ ] Each commit message explains why
[ ] Can checkout any single commit and code works
[ ] Can revert any single commit without breaking others
````

---

### Factor 7: Testing as First-Class

**Principle**: Every bug fix needs a regression test

**Subagent**: Quality Assurance  
**Expertise**: Test-driven development, coverage analysis, edge cases  
**Deliverable**: Test suite with coverage report

**Tasks**:

````markdown
## Quality Assurance Tasks

### For Every Bug Fix:

[ ] Write failing test that reproduces the bug (BEFORE fixing)
[ ] Run test to confirm it fails
[ ] Fix the bug
[ ] Run test to confirm it passes
[ ] Commit test + fix together

### For Every Feature:

[ ] Write test that verifies feature works
[ ] Test happy path (normal usage)
[ ] Test edge cases (empty input, max length, special chars)
[ ] Test error cases (invalid data, missing fields)
[ ] Test security cases (unauthorized access, injection attempts)

### Test Coverage Targets:

- Models: 90%+
- Controllers: 80%+
- Middleware: 70%+
- Overall: 75%+

### Required Test Structure:

```javascript
describe("[Feature]", () => {
  describe("Happy Path", () => {
    it("should [expected behavior]", async () => {
      // Test code
    });
  });

  describe("Edge Cases", () => {
    it("should handle [edge case]", async () => {
      // Test code
    });
  });

  describe("Error Cases", () => {
    it("should reject [invalid input]", async () => {
      // Test code
    });
  });

  describe("Security", () => {
    it("should prevent [attack vector]", async () => {
      // Test code
    });
  });
});
```
````

### Example from this project (Auth Token Bug):

```javascript
// AuthContext.test.js
describe("Token Storage", () => {
  describe("Happy Path", () => {
    it("should store JWT token on login", async () => {
      const mockResponse = { token: "eyJ...", _id: "123" };

      await login(mockResponse);

      expect(localStorage.getItem("token")).toBe(mockResponse.token);
      expect(localStorage.getItem("token")).not.toBe(mockResponse._id);
    });
  });

  describe("Error Cases", () => {
    it("should not store user ID instead of token", async () => {
      // This test would have caught the bug!
      const mockResponse = { token: "eyJ...", _id: "123" };

      await login(mockResponse);

      const stored = localStorage.getItem("token");
      expect(stored).toMatch(/^eyJ/); // JWT starts with eyJ
      expect(stored).not.toBe("123");
    });
  });
});
```

### Verification:

```bash
[ ] npm test passes (100%)
[ ] Coverage meets targets
[ ] New tests added for new features
[ ] Regression tests added for bug fixes
```

---

### Factor 8: Incremental Validation

**Principle**: Verify each small step, not just the end result

**Subagent**: Quality Assurance + Implementation Engineer  
**Expertise**: Smoke testing, integration testing, validation protocols  
**Deliverable**: Validation Report after each commit

**Tasks**:

````markdown
## Incremental Validation Tasks

### After EVERY Commit:

[ ] Server starts without errors
[ ] Existing tests still pass
[ ] New feature works as expected
[ ] Health endpoint returns 200
[ ] No console errors
[ ] Git status clean

### Validation Commands:

```bash
# Always run these after each commit
[ ] npm test                    # All tests pass
[ ] npm run lint               # No lint errors
[ ] curl http://localhost:5001/api/health  # Server healthy
[ ] git status                 # Clean working tree
[ ] npm audit                  # No vulnerabilities
```
````

### Phase-Based Validation:

**V1 (Foundation)**:

- [ ] Server starts
- [ ] Database connects
- [ ] Basic routes respond
- [ ] Models are defined

**V2 (Security)**:

- [ ] Auth endpoints work
- [ ] Protected routes reject unauthorized
- [ ] Validation prevents bad input
- [ ] Rate limiting blocks abuse

**V3 (Quality)**:

- [ ] Test suite passes (50%+ coverage)
- [ ] Error handling works
- [ ] Logging active
- [ ] Admin dashboard functional

**V4 (Performance)**:

- [ ] Caching improves response time
- [ ] Compression reduces size
- [ ] Docker builds successfully
- [ ] Health check responds
- [ ] CI/CD pipeline runs

### Validation Evidence:

````markdown
## Validation: [Commit Description]

**Commit**: [hash]

**Tests**:

```bash
$ npm test
Test Suites: X passed, X total
Tests:       Y passed, Y total
Coverage:    Z%
Status:      ✅ PASS
```
````

**Lint**:

```bash
$ npm run lint
✅ 0 errors, 0 warnings
```

**Health Check**:

```bash
$ curl http://localhost:5001/api/health
{
  "status": "ok",
  "database": "connected",
  ...
}
Status: ✅ HEALTHY
```

**Feature Test**:

```bash
$ [test command]
[output showing feature works]
Status: ✅ WORKING
```

````

---

### Factor 9: Production Mindset
**Principle**: Design for scale from day one

**Subagent**: Implementation Engineer + DevOps Specialist
**Expertise**: Scalability, performance, monitoring, deployment
**Deliverable**: Production Readiness Assessment

**Tasks**:
```markdown
## Production Readiness Tasks

### Continuous Questions:
[ ] Would this work under load?
[ ] What breaks first as scale increases?
[ ] How do we monitor this?
[ ] How do we debug failures in production?
[ ] Is this horizontally scalable?
[ ] What's the rollback plan?

### Production Checklist:

**Performance**:
[ ] Database indexes on frequently queried fields
[ ] Response caching for read-heavy endpoints
[ ] Compression enabled
[ ] Pagination for large lists
[ ] Connection pooling configured

**Monitoring**:
[ ] Health check endpoint
[ ] Application metrics (response times, error rates)
[ ] Database monitoring
[ ] Log aggregation
[ ] Alerting for critical errors

**Deployment**:
[ ] Docker containerization
[ ] CI/CD pipeline
[ ] Environment variable management
[ ] Database migration strategy
[ ] Backup and recovery plan

**Security**:
[ ] Secrets not in code
[ ] HTTPS everywhere
[ ] Rate limiting
[ ] Input validation
[ ] Regular security audits

### Required Assessment:
```markdown
## Production Readiness: [Feature]

**Scalability**:
- Can handle: [X] concurrent users
- Bottleneck: [what will break first]
- Mitigation: [how to scale]

**Monitoring**:
- Metrics exposed: [list]
- Alerts configured: Yes/No
- Dashboard: [link/location]

**Deployment**:
- Dockerized: Yes/No
- CI/CD: Yes/No
- Rollback time: [X] minutes
- Downtime required: Yes/No

**Risk Level**: 🔴 High / 🟠 Medium / 🟢 Low
````

---

### Factor 10: Decision Logging

**Principle**: Record why choices were made

**Subagent**: Documentation Writer  
**Expertise**: Technical decision records, architectural rationale  
**Deliverable**: Decision Log entry for each significant choice

**Tasks**:

````markdown
## Decision Logging Tasks

### For Every Architectural Decision:

[ ] What was decided
[ ] Why (trade-offs considered)
[ ] When (date/commit)
[ ] Status (active/deprecated)

### Required Format:

```markdown
## [Decision Title]

**Decision**: [What was chosen]

**Context**: [The problem we were solving]

**Options Considered**:

1. [Option 1] - Pros: [list], Cons: [list]
2. [Option 2] - Pros: [list], Cons: [list]
3. [Option 3] - Pros: [list], Cons: [list]

**Decision**: We chose [Option X] because [primary reason]

**Trade-offs**:

- ✅ Benefit: [positive outcome]
- ⚠️ Cost: [negative outcome]

**Status**: ✅ Active / ⏳ Deprecated / 🔄 Under Review

**Date**: [timestamp]
**Commit**: [hash]
```
````

### Example from this project:

```markdown
## Use JWT over Sessions for Authentication

**Decision**: Implement stateless JWT authentication

**Context**: Need authentication that scales and works with REST APIs

**Options Considered**:

1. Express Sessions (Stateful)
   - Pros: Simple, well-understood, automatic session management
   - Cons: Requires session store (Redis/Mongo), harder to scale horizontally, sticky sessions needed
2. JWT (Stateless)
   - Pros: No server-side storage needed, easy to scale horizontally, works across services
   - Cons: Token size larger than session ID, can't revoke tokens instantly, secret rotation complex

3. OAuth 2.0 with external provider
   - Pros: Industry standard, delegation of auth to experts
   - Cons: Overkill for portfolio template, adds external dependency, harder to learn

**Decision**: JWT (Option 2)

**Trade-offs**:

- ✅ Stateless = easy horizontal scaling
- ✅ No session store needed
- ⚠️ Tokens can't be revoked instantly (mitigation: short expiration)
- ⚠️ Larger payload size (mitigation: only store ID + role)

**Status**: ✅ Active (working well in V1-V4)

**Date**: 2026-03-15
**Commit**: V1 initial setup
```

````

---

### Factor 11: Critical Self-Review
**Principle**: Find your own mistakes before others do

**Subagent**: Quality Assurance (acting as critic)
**Expertise**: Code review, gap analysis, risk assessment
**Deliverable**: Critical Self-Review Report

**Tasks**:
```markdown
## Critical Self-Review Tasks

### Answer These 7 Questions Honestly:

1. **What did I assume that might be wrong?**
   [List assumptions and how to verify them]

2. **What's the weakest part of this implementation?**
   [Identify the most fragile code]

3. **What would break first under load?**
   [Identify bottlenecks]

4. **What's still hardcoded that should be dynamic?**
   [Find magic numbers/strings]

5. **What security did I skip "for now"?**
   [Be honest about shortcuts]

6. **Where are docs already outdated?**
   [Check for drift]

7. **Would I bet my job this works in production?**
   [If no, what's missing?]

### Required Format:
```markdown
## Critical Self-Review: [Phase/Feature]

### Question 1: Assumptions
**Assumption**: [what I assumed]
**Risk**: [what if it's wrong]
**Verification**: [how to check]

### Question 2: Weakest Part
**Weakness**: [what's fragile]
**Impact**: [what breaks]
**Mitigation**: [how to strengthen]

### Question 3: Scalability
**Bottleneck**: [what fails first]
**Threshold**: [at what scale]
**Solution**: [how to fix]

### Question 4: Hardcoded Values
**Found**: [list of magic values]
**Should be**: [config/env vars]
**Action**: [fix or document]

### Question 5: Security Shortcuts
**Skipped**: [what security was deferred]
**Risk**: [potential vulnerability]
**Plan**: [when to address]

### Question 6: Documentation Drift
**Outdated**: [which docs]
**Mismatch**: [what's wrong]
**Fix**: [update required]

### Question 7: Production Readiness
**Confidence**: [0-100%]
**Blockers**: [what's preventing 100%]
**Next Steps**: [what to do]

### Action Items:
[ ] Fix critical issues immediately
[ ] Document acceptable risks
[ ] Schedule follow-up work
````

**Example from this project (V3 phase)**:

```markdown
## Critical Self-Review: V3 Implementation

### Question 1: Assumptions

**Assumption**: Test coverage of 50% is "good enough"
**Risk**: Edge cases not tested, regressions possible
**Verification**: Review coverage report for untested paths

### Question 2: Weakest Part

**Weakness**: Admin dashboard has no tests
**Impact**: Changes could break admin features unnoticed
**Mitigation**: Add integration tests for admin routes

### Question 3: Scalability

**Bottleneck**: Contact messages list loads all at once
**Threshold**: > 1000 messages will slow down
**Solution**: Add pagination (V4 or V5)

### Question 4: Hardcoded Values

**Found**: Cache TTL hardcoded to 300 seconds
**Should be**: Configurable via environment variable
**Action**: Move to env config (V4)

### Question 5: Security Shortcuts

**Skipped**: Input validation on GET query parameters
**Risk**: Could enable injection attacks via query strings
**Plan**: Add validation middleware to all routes (V4)

### Question 6: Documentation Drift

**Outdated**: README API endpoints table missing new routes
**Mismatch**: /health endpoint not documented
**Fix**: Update README before committing V4

### Question 7: Production Readiness

**Confidence**: 75%
**Blockers**: No Docker setup, no CI/CD, no monitoring
**Next Steps**: Implement V4 (DevOps phase)

### Action Items:

[ ] Add admin dashboard tests
[ ] Update README API table
[ ] Move cache TTL to env vars
[ ] Proceed with V4 implementation
```

---

### Factor 12: Reversibility

**Principle**: Prefer changes that can be undone

**Subagent**: Implementation Engineer  
**Expertise**: Git workflows, rollback procedures, safe deployments  
**Deliverable**: Rollback Plan for each significant change

**Tasks**:

````markdown
## Reversibility Tasks

### For Every Significant Change:

[ ] Can this be undone in under 5 minutes?
[ ] Is there a working backup (git commit)?
[ ] Can we rollback without data loss?
[ ] Is there a feature flag option?
[ ] Document rollback procedure

### Rollback Plan Template:

````markdown
## Rollback Plan: [Feature/Change]

**Change**: [what was implemented]
**Commit**: [hash range]

### How to Rollback:

**Option 1: Git Revert (Recommended)**

```bash
git revert [commit-hash]
# Or for range:
git revert [oldest-hash]^..[newest-hash]
```
````
````

**Option 2: Checkout Previous State**

```bash
git checkout [commit-before-change]
```

**Option 3: Feature Flag (If Implemented)**

```javascript
if (process.env.ENABLE_NEW_FEATURE === "true") {
  // new code
} else {
  // old code
}
```

### Data Migration Rollback:

**If database schema changed**:

- [ ] Migration down script prepared
- [ ] Backup taken before migration
- [ ] Rollback tested

### Recovery Time:

- **Code rollback**: [X] minutes
- **Database rollback**: [X] minutes
- **Full recovery**: [X] minutes

### Verification After Rollback:

[ ] Application starts
[ ] Health check passes
[ ] Core functionality works
[ ] No data corruption

````

### Example from this project (Database Indexes):
```markdown
## Rollback Plan: Database Indexing (V4)

**Change**: Added indexes to User, Project, ContactMessage models
**Commits**: 2d77d10, 4e18c2a, 14d6c1a

### How to Rollback:

**Option 1: Revert Commits**
```bash
git revert 14d6c1a
git revert 4e18c2a
git revert 2d77d10
````

**Impact**: Indexes will be removed on next deployment. Performance will degrade but app continues working.

**Option 2: Drop Indexes Manually**

```javascript
// If immediate rollback needed
db.users.dropIndex("role_1");
db.projects.dropIndex("category_1_featured_-1");
// etc.
```

### Data Impact:

- **No data loss**: Indexes are performance optimization only
- **Performance**: Queries will be slower without indexes
- **Application**: Continues functioning normally

### Recovery Time:

- **Code rollback**: 2 minutes
- **Index rebuild**: 5-10 minutes (if rolling forward again)
- **No downtime required**

### Verification After Rollback:

[ ] Application starts successfully
[ ] Database queries still work (just slower)
[ ] Health check endpoint responds
[ ] No errors in logs

```

---

## Multi-Agent Orchestration Workflow

### How the 6 Subagents Work Together:

```

1. ORCHESTRATOR receives user request
   ↓
2. CONTEXT ANALYZER runs Pre-Flight (Factor 1)
   → Produces: Analysis Summary
   ↓
3. SECURITY AUDITOR runs Critical Bug Hunt (Factor 4)
   → Produces: Security Assessment
   ↓
4. IMPLEMENTATION ENGINEER builds features (Factors 6, 8, 9, 12)
   → Produces: Working code + granular commits
   ↓
5. DOCUMENTATION WRITER updates docs (Factor 3)
   → Produces: Synchronized documentation
   ↓
6. QUALITY ASSURANCE verifies everything (Factors 2, 7, 11)
   → Produces: Verification reports + test results
   ↓
7. DELIVERY COORDINATOR presents to user (Factor 5)
   → Produces: Delivery Summary

````

### Communication Protocol:

Each subagent outputs structured markdown that next subagent consumes:

```markdown
## [Subagent Name] Output

**Input**: [What they received]
**Tasks Completed**: [checklist]
**Output**: [deliverable]
**Handoff Notes**: [what next subagent needs to know]
**Blockers**: [any issues]
**Confidence**: [0-100%]
````

### Quality Gates:

Before handing off to next subagent:

- [ ] All checklist items complete
- [ ] Verification evidence provided
- [ ] Confidence > 80%
- [ ] No blockers (or blockers documented)

---

## Quick Reference: Building Another Server

### To Build [New Server Name]:

1. **Create project structure** (Context Analyzer)
   - Copy template structure
   - Update README with new project name
   - Set up package.json dependencies

2. **Run Pre-Flight** (Context Analyzer)
   - Read all docs
   - Check current state
   - Identify gaps

3. **Security Audit** (Security Auditor)
   - Review auth requirements
   - Plan validation strategy
   - Design security model

4. **Implement V1** (Implementation Engineer + QA)
   - Basic CRUD
   - Database models
   - Basic routes

5. **Document V1** (Documentation Writer)
   - Update all 4 docs files
   - Mark V1 complete

6. **Self-Review** (QA)
   - Answer 7 questions
   - Fix issues
   - Verify everything

7. **Deliver V1** (Delivery Coordinator)
   - Present to user
   - Get feedback
   - Plan V2

8. **Repeat for V2, V3, V4**
   - Following specialized subagent tasks above

---

## Success Metrics

### How to know this playbook is working:

✅ **No critical bugs in production** (caught in Phase 1 or 4)
✅ **Documentation always accurate** (synchronized with code)
✅ **Commits are reviewable** (granular, single concern)
✅ **Security is proactive** (not reactive)
✅ **Rollbacks are easy** (reversible changes)
✅ **Team can onboard quickly** (docs explain everything)

---

**Version**: 1.0
**Based on**: V1-V4 of port-exp-boilerplate
**Status**: Validated through implementation
**Ready for**: Next server project

---

## Using This Playbook

### For a New Server Project:

1. Copy this file to `docs/specialized-server.md`
2. Customize the [Project Name] placeholders
3. Adjust tech stack if different (PostgreSQL instead of MongoDB, etc.)
4. Follow the 12 factors in order
5. Use subagent task lists as checklists
6. Document your own anti-patterns as you find them
7. Evolve the playbook based on what works

### Example Customization:

If building with PostgreSQL instead of MongoDB:

- Context Analyzer checks `pg` package instead of `mongoose`
- Security Auditor checks SQL injection instead of NoSQL injection
- Implementation Engineer uses `pg` or `knex` instead of Mongoose
- All other factors remain the same

---

**Last Updated**: After V4 completion  
**Next Review**: After next server project implementation
