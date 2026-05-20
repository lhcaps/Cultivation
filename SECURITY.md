# Security Policy — Thiên Nam Engine

> This file defines security practices for this project. All contributors must follow these guidelines.

---

## Reporting Security Issues

If you discover a security vulnerability in Thiên Nam Engine:

1. **Do NOT** open a public GitHub issue
2. **Email** the project maintainer directly
3. **Include** steps to reproduce, impact assessment, and suggested fix
4. **Wait** for acknowledgment before disclosing

---

## Secrets Management

### Rules

- **Never commit secrets** — API keys, tokens, passwords, database URLs
- **Use `.env.example`** — Template with placeholder values, no real secrets
- **`.env` is in `.gitignore`** — Never remove it
- **Rotate secrets immediately** if exposed

### Required Secrets

| Secret | Where Stored | Who Has Access |
|--------|-------------|----------------|
| `DISCORD_TOKEN` | GitHub Secrets / Hosting env | Maintainer |
| `DATABASE_URL` | Hosting env | Maintainer |
| `REDIS_URL` | Hosting env | Maintainer |
| `JWT_SECRET` | Hosting env | Maintainer |
| `NEXTAUTH_SECRET` | Hosting env | Maintainer |

---

## Dependency Security

### Dependencies Are Scanned

- **Dependabot** enabled for automated PRs on security updates
- **pnpm audit** runs in CI on every PR
- **Audit failures block merge** — Security patches must be applied within 7 days

### Adding Dependencies

Before adding a new dependency:

1. Check the package's maintenance status and download count
2. Review its permissions (`npm ls` for deep dependencies)
3. Check `npm audit` after adding
4. Prefer packages with few transitive dependencies

---

## Access Control

### Admin Roles

| Role | Level | Access |
|------|-------|--------|
| Thiên Đế | 1 | Full access |
| Nam Tào | 2 | Game management |
| Bắc Đẩu | 3 | Player + event management |
| Thái Thượng | 4 | Read-only + support |
| Địa Quan | 5 | Probationary |

Admin role assignments are stored in the database, not hardcoded.

---

## Input Validation

### All External Input Must Be Validated

- **Discord interactions** — Validate `interaction.user.id` matches character owner
- **API requests** — Zod schema validation on every endpoint
- **Database queries** — Prisma parameterized queries (automatic)
- **File uploads** — Not currently supported; if added, validate type and size

---

## Data Privacy

### Player Data

- Discord user IDs stored for account linking
- Character names, stats, and actions stored for gameplay
- **No personal data** beyond Discord ID and username
- **No data sold or shared** with third parties
- **Data export** — Players can request their data export via admin

### Admin Audit Logs

- All admin actions logged with admin ID, target, reason, and evidence
- Logs retained indefinitely
- Logs are append-only (no deletions)

---

## Rate Limiting

| Endpoint | Limit | Reason |
|----------|-------|--------|
| `/api/cultivate` | 10/min | Prevent farming |
| `/api/breakthrough` | 5/hour | High-stakes action |
| `/api/encounter` | 10/hour | Prevent exploit |
| Admin endpoints | 10/min | Prevent abuse |

---

## Discord Security

### Bot Token

- Stored as `DISCORD_TOKEN` environment variable
- **Never logged** — Not even in error messages
- **Never shared** — Each deployment gets its own token

### Button Replay Prevention

Every interactive component uses a nonce in `custom_id` to prevent replay attacks. See `.cursor/rules/080-security-and-audit.mdc`.

---

## Security Review Checklist

Before each release:

- [ ] All dependencies updated
- [ ] No secrets in git history
- [ ] Rate limiting active
- [ ] Admin role checks enforced
- [ ] Input validation on all endpoints
- [ ] Audit logs for all mutations
- [ ] Secrets rotated since last release
