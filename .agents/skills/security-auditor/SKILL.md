---
name: security-auditor
description: Audits code for security vulnerabilities, validates admin permissions, and reviews audit logs for Thiên Nam Engine.
---

# Skill: Security Auditor

## Purpose

Audits code for security vulnerabilities, validates admin permission enforcement, reviews audit log completeness, and ensures security best practices are followed for Thiên Nam Engine.

## When to Use

- Pre-release security review
- Reviewing PRs for security implications
- Validating admin role enforcement
- Checking audit log coverage
- Investigating potential exploits
- Validating rate limiting implementation

## Inputs Expected

- Code to audit (file paths, module, or PR changes)
- Audit type: full review, targeted, or incident response

## Workflow

### Code Security Review

1. Read the code under review
2. Check for security issues:

| Category | Check |
|----------|-------|
| Injection | No `$queryRaw` with unsanitized input |
| Auth | Admin role checked on every endpoint |
| Input validation | Zod schema on every API input |
| Secrets | No hardcoded tokens, keys, or URLs |
| Rate limiting | Rate limiter on sensitive endpoints |
| Logging | No sensitive data in logs |
| CORS | Allowed origins configured |
| Error handling | No stack traces exposed to client |

3. Run security checks:

```bash
# Check for secrets in git
git log --all -p -S "DISCORD_TOKEN=" -- .
git log --all -p -S "DATABASE_URL=" -- .

# Check for hardcoded secrets
grep -r "process.env\." --include="*.ts" apps/ | grep -v "\.d\.ts"

# Check dependencies
pnpm audit
```

4. Document findings:

```
## Security Audit: [Module]

### PASS
- [x] Admin role check present
- [x] Input validated with Zod
- [x] Rate limiting active

### FAIL
- [ ] Missing rate limit on `/api/cultivate` — FIX: add rate limiter
- [ ] No admin role check on `/api/admin/items/give` — FIX: add middleware

### WARNINGS
- [!] `$queryRaw` used in `character.service.ts:45` — review for injection
```

### Admin Permission Review

1. List all admin API routes
2. Verify each has role check:

```typescript
// MUST have this pattern
export async function POST(req: Request) {
  const session = await getServerSession();
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const roleLevel = getRoleLevel(session.adminRole);
  if (roleLevel > requiredLevel) {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }
  // ...
}
```

3. Check permission matrix:

| Action | Required Level | Routes |
|--------|---------------|--------|
| Create event | 3+ | `POST /api/admin/events` |
| Give item | 3+ | `POST /api/admin/items/give` |
| Adjust economy | 2+ | `POST /api/admin/economy/*` |
| View audit logs | 4+ | `GET /api/admin/audit` |
| Manage admins | 1 | `POST /api/admin/roles/*` |

### Audit Log Coverage Review

1. List all mutation points (create, update, delete)
2. Verify each creates an audit log entry:

| Mutation | ActionLog | AdminAuditLog | Required? |
|----------|-----------|--------------|-----------|
| Cultivate | ✅ | N/A | Yes |
| Breakthrough | ✅ | N/A | Yes |
| Give item | N/A | ✅ | Yes |
| Teleport player | N/A | ✅ | Yes |
| Read-only query | ❌ | N/A | No |

### Rate Limiting Review

1. Identify rate-limited endpoints
2. Verify limits are appropriate:

| Endpoint | Current Limit | Recommended |
|----------|-------------|-------------|
| `/api/cultivate` | 10/min | ✅ Correct |
| `/api/breakthrough` | 5/hour | ✅ Correct |
| `/api/encounter` | 10/hour | ✅ Correct |
| Admin endpoints | 10/min | ✅ Correct |

### Incident Response

If a security incident is reported:

1. Identify affected code/data
2. Assess impact scope
3. Check audit logs for related activity
4. Recommend immediate containment
5. Document timeline and actions taken

## Output Format

- Security audit report in `SECURITY.md` or new file
- Findings categorized by severity: CRITICAL, HIGH, MEDIUM, LOW
- Recommendations with specific fix instructions
- Mitigation timeline

## Quality Bar

- All admin routes have role checks
- All mutations have audit logs
- All API inputs validated with Zod
- No secrets in git history
- Rate limiting on all sensitive endpoints
- No SQL injection vulnerabilities
- Findings documented with severity and fix recommendation

## Anti-Patterns

- Not checking admin role before mutations
- Missing audit logs on mutations
- Exposing stack traces in error messages
- Logging sensitive data (passwords, tokens)
- Not rate-limiting sensitive endpoints
- Trusting client input without validation
- Hardcoding admin IDs or roles

## Related Files

- `apps/api/src/modules/` (all API routes)
- `apps/admin/src/app/api/admin/` (admin routes)
- `.cursor/rules/080-security-and-audit.mdc`
- `SECURITY.md`
- `.cursor/rules/050-admin-panel.mdc`
