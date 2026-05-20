# Thiên Nam Võ Lục — Admin Rules

> **Thiên Đạo quyết**: Thiên Đạo tuy có quyền năng vô hạn, nhưng mọi hành động đều phải ghi chép. Che giấu là phản bội thiên đạo.
>
> — *Chương 1, Điều 99, Quyển Thiên*

---

## Table of Contents

1. [Admin Roles and Permissions](#1-admin-roles-and-permissions)
2. [Command Categories](#2-command-categories)
3. [Prohibited Actions](#3-prohibited-actions)
4. [Audit Logging Requirements](#4-audit-logging-requirements)
5. [Event Management](#5-event-management)
6. [Player Management](#6-player-management)
7. [Economy Intervention](#7-economy-intervention)
8. [Sect Management](#8-sect-management)
9. [World Configuration](#9-world-configuration)
10. [Emergency Procedures](#10-emergency-procedures)
11. [Reporting Requirements](#11-reporting-requirements)

---

## 1. Admin Roles and Permissions

### 1.1 Role Hierarchy

| Role | Level | Symbol | Permissions |
|------|-------|--------|-------------|
| **Thiên Đế** (Supreme) | 1 | 👑 | All permissions, can assign other admins |
| **Nam Tào** (Operations) | 2 | 🌟 | All game management, cannot assign admins |
| **Bắc Đẩu** (Senior GM) | 3 | ⚔️ | Player management, event management, no economy |
| **Thái Thượng** (GM) | 4 | 🛡️ | Player support, limited item give, no economy |
| **Địa Quan** (Trial GM) | 5 | 🔰 | Read-only, player support requests only |

### 1.2 Role Assignment Rules

- Only **Thiên Đế** can promote to level 1-3
- Promotion to level 4 requires 2 level 2+ approvals
- Level 5 is probationary for 30 days
- All role assignments are logged in `admin_audit_logs`
- Demotions require written justification in audit log

### 1.3 Discord Role Mapping

| Game Role | Discord Role Name | Notes |
|-----------|-------------------|-------|
| Thiên Đế | `Thiên Đế` | Must have `Administrator` permission |
| Nam Tào | `Nam Tào` | Must have `Manage Server` permission |
| Bắc Đẩu | `Bắc Đẩu` | Must have `Moderate Members` permission |
| Thái Thượng | `Thái Thượng` | Must have `View Audit Log` permission |
| Địa Quan | `Địa Quan` | Must have `Read Messages` permission |

---

## 2. Command Categories

### 2.1 Player Management Commands

| Command | Level | Description | Audit Required |
|---------|-------|-------------|---------------|
| `/admin player info` | 4+ | View player profile and stats | Yes |
| `/admin player ban` | 3+ | Ban player from server | Yes |
| `/admin player unban` | 3+ | Remove ban | Yes |
| `/admin player mute` | 4+ | Mute in game channels | Yes |
| `/admin player kick` | 3+ | Kick from server | Yes |
| `/admin player teleport` | 4+ | Move player to region | Yes |
| `/admin player reset` | 2+ | Reset character to Luyện Thể | Yes |
| `/admin player delete` | 1+ | Delete character permanently | Yes |

### 2.2 Item Commands

| Command | Level | Description | Audit Required |
|---------|-------|-------------|---------------|
| `/admin give` | 3+ | Give item to player | Yes |
| `/admin give-bulk` | 2+ | Give item to multiple players | Yes |
| `/admin remove-item` | 3+ | Remove item from player | Yes |
| `/admin set-currency` | 2+ | Set player currency directly | Yes |
| `/admin add-currency` | 3+ | Add currency to player | Yes |
| `/admin spawn-loot` | 3+ | Spawn loot chest at location | Yes |

### 2.3 World Management Commands

| Command | Level | Description | Audit Required |
|---------|-------|-------------|---------------|
| `/admin announce` | 3+ | Send server-wide announcement | Yes |
| `/admin whisper` | 4+ | Send message to specific player | Yes |
| `/admin set-status` | 3+ | Set server status | Yes |
| `/admin spawn-boss` | 2+ | Spawn world boss | Yes |
| `/admin spawn-event` | 2+ | Trigger world event | Yes |
| `/admin end-event` | 2+ | End active event early | Yes |
| `/admin open-dungeon` | 3+ | Open restricted dungeon | Yes |
| `/admin close-region` | 2+ | Close region for maintenance | Yes |

### 2.4 Sect Commands

| Command | Level | Description | Audit Required |
|---------|-------|-------------|---------------|
| `/admin sect create` | 2+ | Create new sect | Yes |
| `/admin sect dissolve` | 1+ | Dissolve sect | Yes |
| `/admin sect promote` | 3+ | Promote sect rank | Yes |
| `/admin sect set-leader` | 2+ | Change sect leader | Yes |
| `/admin sect treasury` | 3+ | Modify sect treasury | Yes |
| `/admin sect declare-war` | 1+ | Force declare war | Yes |

### 2.5 Economy Commands

| Command | Level | Description | Audit Required |
|---------|-------|-------------|---------------|
| `/admin economy adjust` | 2+ | Global economy adjustment | Yes |
| `/admin economy set-rate` | 1+ | Set exchange rates | Yes |
| `/admin economy audit` | 2+ | Generate economy report | Yes |
| `/admin refund` | 3+ | Refund player purchase | Yes |
| `/admin item-limit` | 2+ | Set item spawn limits | Yes |

### 2.6 Read-Only Commands

| Command | Level | Description | Audit Required |
|---------|-------|-------------|---------------|
| `/admin logs` | 4+ | View action logs | Yes |
| `/admin audit-logs` | 3+ | View admin audit logs | Yes |
| `/admin stats` | 4+ | View server statistics | Yes |
| `/admin economy-report` | 3+ | View economy report | Yes |

---

## 3. Prohibited Actions

### 3.1 Absolute Prohibitions (No Exceptions)

| Prohibited Action | Reason | Penalty for Violation |
|-------------------|--------|----------------------|
| Give Ngũ Bất Tôn-level items to personal friends | Pay-to-win, destroys game | Immediate demotion to level 5 |
| Modify own character stats | Conflict of interest | Immediate demotion to level 5 |
| Delete competitor's character during event | Unfair advantage | Termination + account ban |
| Create fake events to funnel rewards | Fraud | Termination + account ban |
| Share player data with external parties | Privacy violation | Termination + legal action |
| Give currency above 1000 spirit stones in single action | Economy exploitation | Written warning first offense |
| Use admin commands for personal RP | Abuse of power | 1-week suspension |

### 3.2 Conditional Prohibitions (Requires Approval)

| Action | Approval Required | Notes |
|--------|------------------|-------|
| Give any item above Trúc Mạch Đan | Level 1 approval | 48-hour waiting period |
| Reset character | Level 2 approval + player request | Must have screenshot evidence |
| Ban for exploit | Level 2 approval | Must have evidence documented |
| Economy adjustment >5% | Level 1 approval | 7-day notice to players |
| Dissolve sect | Level 1 approval + community vote | 30-day appeal period |

### 3.3 Admin Behavior Rules

1. **Impersonation prohibited** — Admins must clearly indicate admin status when using commands
2. **Private data** — Player real names, IPs, emails are confidential
3. **Conflict of interest** — Admins must recuse from actions affecting their own characters
4. **Fair enforcement** — Same rules apply to all players regardless of relationship
5. **Transparent communication** — Explain reasons for actions when possible

---

## 4. Audit Logging Requirements

### 4.1 Required Fields for Every Admin Action

```typescript
interface AdminAuditLog {
  id: string;
  adminId: string;           // Discord user ID of admin
  adminRole: AdminRole;       // Role level at time of action
  action: AdminAction;        // Enum of all admin actions
  targetType: 'player' | 'sect' | 'item' | 'event' | 'world';
  targetId: string;           // ID of affected entity
  targetName: string;         // Human-readable name
  previousValue: any;         // Value before change (for modifications)
  newValue: any;              // Value after change
  reason: string;             // Written justification (required for level 1-3)
  supportingEvidence: string; // URL to screenshot, log, etc.
  ipAddress?: string;        // Admin's IP for security (optional)
  createdAt: DateTime;
}
```

### 4.2 Audit Log Retention

| Log Type | Retention | Storage |
|----------|-----------|---------|
| Admin audit logs | Forever | Primary database + monthly backup |
| Player action logs | 365 days | Primary database |
| Combat logs | 90 days | Primary database |
| Economy transaction logs | Forever | Primary database + monthly backup |
| Session logs | 30 days | Log files |

### 4.3 Audit Log Access

| Role | Access Level |
|------|-------------|
| Thiên Đế | Full access, can delete logs (with reason) |
| Nam Tào | Full access |
| Bắc Đẩu | Last 90 days only |
| Thái Thượng | Last 30 days, own actions only |
| Địa Quan | None |

### 4.4 Audit Log Review

- **Weekly**: Nam Tào reviews random sample of 10 actions from each admin
- **Monthly**: Full audit report generated and stored
- **Quarterly**: External review of audit compliance
- **On-demand**: Any admin can request audit of their own actions

---

## 5. Event Management

### 5.1 Event Categories

| Category | Approval Level | Duration | Player Notice |
|----------|---------------|----------|---------------|
| **Minor** (daily bonus, small loot) | 3+ | 1-24 hours | 1-hour notice |
| **Medium** (mini-boss, bonus missions) | 2+ | 1-7 days | 24-hour notice |
| **Major** (world boss, war season) | 1+ | 7-30 days | 7-day notice |
| **Seasonal** (quarterly events) | 1+ | 30 days | 14-day notice |

### 5.2 Event Creation Workflow

```
1. Draft event in admin panel (draft mode)
   → Level 3+ can draft minor events
   → Level 2+ can draft medium events
   → Level 1+ can draft major events

2. Preview event
   → Test on 10% of server for 24 hours
   → Monitor metrics

3. Schedule event
   → Set start time (minimum notice period)
   → Set end time

4. Execute event
   → Automatic execution via worker jobs
   → Real-time monitoring

5. Close event
   → Generate summary report
   → Distribute rewards
   → Archive event data
```

### 5.3 Event Rollback

If an event causes unintended issues:

1. **Immediate pause** — Stop event via `/admin end-event` (no approval needed)
2. **Assess** — Determine scope of issue within 1 hour
3. **Decide** — Level 2+ decides rollback vs fix
4. **Execute** — If rollback:
   - Revert all rewards distributed
   - Compensate affected players fairly
   - Document in audit log
5. **Report** — Public announcement explaining issue

### 5.4 World Boss Spawn Rules

| Boss Type | Spawn Cooldown | Max Active | Approval Level |
|-----------|---------------|-----------|----------------|
| Regional boss | 24 hours | 1 per region | Level 3+ |
| Server boss | 7 days | 1 at a time | Level 2+ |
| Seasonal boss | 30 days | 1 per season | Level 1+ |

---

## 6. Player Management

### 6.1 Ban Policy

**Types of bans:**

| Type | Duration | Appeals | Notes |
|------|----------|---------|-------|
| Warning | N/A | N/A | No restriction, just on record |
| Temp Ban | 1-30 days | After 50% served | Chat restriction + game actions |
| Permanent Ban | Forever | After 1 year | Complete account termination |

**Ban reasons:**
- Exploiting bugs (warning → temp ban → permanent)
- Harassment (warning → temp ban → permanent)
- Real-money trading (immediate permanent)
- Spam/advertising (mute → temp ban → permanent)
- Impersonating admin (temp ban → permanent)
- Using hacks/automation (immediate permanent)

**Ban workflow:**
1. Collect evidence (screenshots, logs)
2. Issue warning or ban with reason
3. Log in admin_audit_logs
4. Send DM to player with reason (if possible)
5. Post in admin channel

### 6.2 Character Reset Policy

Character reset is **never automatic** and requires:

1. Player-written request (in-game or DM)
2. Level 2+ approval
3. 48-hour cooling-off period
4. Player confirms again after cooling-off

**Reset consequences (must be disclosed to player):**
- All cultivation points → 0
- All items → lost (can keep silver up to 1000)
- All manuals → lost
- All sect membership → lost
- All missions → failed
- Realm → Luyện Thể sơ kỳ
- Foundation quality → 20 (base)
- Achievement/titles → preserved

### 6.3 Compensation Policy

**When to compensate:**
- Server-side bugs causing item/currency loss
- Admin mistakes affecting multiple players
- Planned maintenance exceeding 24 hours
- Data corruption not player's fault

**Compensation limits:**
| Situation | Max Compensation | Approval Level |
|-----------|------------------|----------------|
| Item loss (common) | Replace item | Level 4+ |
| Item loss (rare) | Replace + bonus | Level 3+ |
| Currency loss | Replace up to 500 ST | Level 3+ |
| Major gameplay bug | Case-by-case | Level 2+ |
| Catastrophic failure | Case-by-case | Level 1+ |

**Compensation documentation:**
```
Compensation Record:
- Player: [name]
- Issue: [description]
- Evidence: [link]
- Compensation: [items/currency]
- Approved by: [admin]
- Approved at: [datetime]
- Notification sent: [yes/no]
```

---

## 7. Economy Intervention

### 7.1 Economy Adjustment Thresholds

| Adjustment Type | Size | Approval | Notice Period |
|----------------|------|----------|---------------|
| Individual refund | <100 ST | Level 3+ | None |
| Individual refund | 100-500 ST | Level 2+ | None |
| Global multiplier | <5% | Level 2+ | 24 hours |
| Global multiplier | 5-20% | Level 1+ | 7 days |
| Currency creation | <10,000 ST total | Level 2+ | None |
| Currency creation | >10,000 ST total | Level 1+ | 7 days |

### 7.2 Anti-Inflation Measures

When economy is unhealthy (see game-balancing.md):

1. **Stage 1**: Increase sink costs by 10-20%
2. **Stage 2**: Reduce reward rates by 10-20%
3. **Stage 3**: Introduce new sink (limited-time item)
4. **Stage 4**: Level 1+ decision on currency removal event

### 7.3 Item Spawn Limits

| Item Tier | Weekly Spawn Limit | Override Approval |
|-----------|-------------------|-------------------|
| Common (Hạ Phẩm) | Unlimited | N/A |
| Uncommon (Trung Phẩm) | 500/week | Level 3+ |
| Rare (Thượng Phẩm) | 100/week | Level 2+ |
| Legendary (Cực Phẩm) | 10/week | Level 1+ |
| Mythic (Ấn Kiếp) | 1/month | Level 1+ |

---

## 8. Sect Management

### 8.1 Sect Creation

New sects can be created by players via `/sect create` with:
- 5 founding members
- 1000 Spirit Stones deposit
- Admin approval required for rank 3+ sects

**Admin-created sects** (for storyline):
- Level 2+ approval required
- Must be documented in world bible
- Cannot compete with player sects for top leaderboard

### 8.2 Sect Dissolution

**Voluntary dissolution:**
- All members leave
- Treasury distributed to members (proportional to merit)
- 7-day grace period

**Forced dissolution:**
- Level 1+ approval only
- Valid reasons:
  - Exploiting game mechanics systematically
  - Harassment coordinated from sect leadership
  - Inactive for 90+ days (all members inactive)
- 30-day appeal period
- Treasury → 50% to charity (other sect), 50% to player refunds

### 8.3 Sect War Intervention

Admins **cannot** force end a sect war early unless:
- One side requests mutual withdrawal
- Technical issues prevent fair combat
- Player safety concerns

---

## 9. World Configuration

### 9.1 Configurable Parameters

The following can be changed via admin panel without code deployment:

| Parameter | Min | Max | Default | Affects |
|-----------|-----|-----|---------|---------|
| Daily reset hour (UTC) | 0 | 23 | 0 | Daily rewards, cooldowns |
| Season duration (days) | 14 | 60 | 30 | Season cycle |
| Max characters per user | 1 | 5 | 3 | Character creation |
| Breakthrough cooldown (days) | 1 | 7 | 2 | Breakthrough pacing |
| Cultivation cooldown (hours) | 0.5 | 4 | 1 | Cultivation pacing |
| Base daily reward (silver) | 50 | 500 | 100 | Economy |
| Encounter luck bonus cap | 0 | 50 | 20 | Encounter rates |

### 9.2 Configuration Change Workflow

1. Draft change in admin panel
2. See preview of affected players/content
3. Schedule change (immediate or future)
4. Execute change
5. Monitor for 7 days
6. Rollback if issues arise

### 9.3 Code-Only Parameters

The following require code changes (not admin panel):

- Realm definitions
- Base breakthrough rates
- Core stat formulas
- Combat damage calculations
- Item database schemas
- Sect rank structures

---

## 10. Emergency Procedures

### 10.1 Emergency Levels

| Level | Definition | Response Time | Commander |
|-------|-----------|---------------|-----------|
| **P0 — Critical** | Server down, data loss, security breach | Immediate | Any Level 1 |
| **P1 — High** | Major feature broken, exploit active | 1 hour | Level 2+ |
| **P2 — Medium** | Minor feature broken, bug affecting >10% | 4 hours | Level 3+ |
| **P3 — Low** | Cosmetic bug, minor issue | 24 hours | Level 4+ |

### 10.2 P0 Emergency Actions

1. **Assess** — Determine scope within 15 minutes
2. **Contain** — Disable affected feature or shut down if needed
3. **Communicate** — Post status update in #announcements
4. **Fix** — Deploy hotfix or rollback
5. **Verify** — Confirm fix works
6. **Post-mortem** — Document within 24 hours

### 10.3 Exploit Response

When an exploit is discovered:

1. **Silence** — Do not announce publicly
2. **Patch** — Fix the exploit code-side immediately
3. **Compensate** — Roll back affected data if possible
4. **Punish** — Ban exploiters per ban policy
5. **Notify** — Announce fix without details of exploit method
6. **Learn** — Add test case to prevent recurrence

### 10.4 Database Backup

- **Hourly**: Incremental backup to secondary server
- **Daily**: Full backup at 3 AM UTC
- **Weekly**: Archive backup to cold storage
- **Test**: Restore test monthly to verify backup integrity

---

## 11. Reporting Requirements

### 11.1 Required Reports

| Report | Frequency | Recipient | Creator |
|--------|----------|-----------|---------|
| Weekly activity summary | Every Monday | Admin channel | Level 2+ (rotating) |
| Monthly economy report | 1st of month | Admin channel + public | Level 2+ |
| Quarterly audit review | Every 3 months | Level 1 only | Nam Tào |
| Incident report | As needed | Admin channel | Any admin involved |
| Player complaint summary | Weekly | Admin channel | Level 4+ |

### 11.2 Report Contents

**Weekly summary:**
- Active users (new, returning, lost)
- Top 5 leaderboard positions
- Economy health indicators
- Active events summary
- Open tickets/complaints
- Notable incidents

**Monthly economy report:**
- Total currency in circulation
- Currency generation vs sink ratio
- Item price index
- Exploit attempts detected
- Admin action summary
- Recommendations for next month

### 11.3 Public Communication

All public announcements must:
- Be reviewed by Level 2+ before posting
- Be archived in #announcements-archive
- Use the official bot account (not personal account)
- Follow the template:

```
═══════════════════════════════════
📜 [Event Name]

[Description of what's happening]

⏰ Duration: [start] to [end]
🎁 Rewards: [summary]
📋 Details: [link to full rules]

═══════════════════════════════════
```
