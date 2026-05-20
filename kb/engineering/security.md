# Security Practices — Thiên Nam Engine

## Secrets

- **Never commit secrets** to git
- **`.env` is in `.gitignore`**
- **`.env.example`** has placeholder values only

## Admin Role Enforcement

Every admin API route checks role level before mutation.

```typescript
export function requireAdminLevel(minLevel: number) {
  return async (req, res, next) => {
    const roleLevel = getRoleLevel(session.adminRole);
    if (roleLevel > minLevel) {
      return res.status(403).json({ error: "Forbidden" });
    }
    next();
  };
}
```

## Rate Limiting

| Endpoint | Limit | Window |
|----------|-------|--------|
| `/api/cultivate` | 10 | per minute |
| `/api/breakthrough` | 5 | per hour |
| `/api/encounter` | 10 | per hour |
| Admin endpoints | 10 | per minute |

## Button Replay Prevention

```typescript
// Check nonce cache
const processed = await cache.get(`processed:${customId}`);
if (processed) {
  return reply({ content: "Đã xử lý rồi.", flags: Ephemeral });
}
await cache.set(`processed:${customId}`, "1", { ex: 300 });
```
