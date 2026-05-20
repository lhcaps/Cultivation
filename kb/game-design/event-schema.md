# Event Schema — Thiên Nam Engine

> How events are designed and structured in this project.

---

## Event as Dual-Natured Object

Every event has two aspects that must be created together:

1. **Narrative** — The story players experience
2. **Data** — The game mechanics that make it work

```
{
  narrative: { announcement, progress[], completion },
  data: { id, type, scope, effects, rewards, requirements }
}
```

Both must be consistent. Narrative must match data. Data must enable narrative.

---

## Event JSON Schema

```typescript
interface WorldEvent {
  id: string;                          // kebab-case: "world-boss-van-doc-giao"
  name: string;                         // "Vạn Độc Giáo Nổi Dậy"
  type: EventType;
  scope: Scope;
  region?: RegionId;
  faction?: FactionId;
  startAt: Date;
  endAt: Date;

  narrative: {
    announcement: string;               // 2-4 sentences
    progress?: string[];                // Progress messages
    completion: string;                 // Summary
    failure?: string;                  // If it can fail
  };

  data: {
    effects: EventEffect[];
    rewards: EventReward[];
    requirements: EventRequirement;
  };
}
```

---

## Event Types

### Personal (Personal scope)

**Trigger:** `/encounter`, `/mission`, RNG

```json
{
  "type": "ENCOUNTER",
  "scope": "PERSONAL",
  "narrative": {
    "announcement": "Trên đường tu luyện, bạn gặp một lão nhân..."
  },
  "data": {
    "effects": [
      { "type": "BUFF", "target": "PLAYER", "effect": { "cultivationSpeed": 1.1 } }
    ],
    "rewards": [
      { "type": "CURRENCY", "currency": { "type": "SILVER", "amount": 100 } }
    ],
    "requirements": {}
  }
}
```

### Regional (Region scope)

**Trigger:** Admin spawn or scheduled

```json
{
  "type": "REGIONAL_BOSS",
  "scope": "REGION",
  "region": "TAY_VUC",
  "narrative": {
    "announcement": "Một cơn bão cát bất thường đang hình thành ở Tây Vực...",
    "completion": "Cơn bão đã tan. Những tu sĩ dũng cảm đã ngăn chặn thảm họa."
  },
  "data": {
    "effects": [
      { "type": "DEBUFF", "target": "REGION", "effect": { "encounterRate": 1.5 } }
    ],
    "rewards": [
      { "type": "CURRENCY", "currency": { "type": "SILVER", "amount": 500 } }
    ],
    "requirements": { "realmMin": "KHI_TUC" }
  }
}
```

### Server (Server scope)

**Trigger:** Scheduled or admin spawn

```json
{
  "type": "SEASON",
  "scope": "SERVER",
  "name": "Đại Hội Võ Lâm",
  "narrative": {
    "announcement": "Thiên Đạo truyền âm: Đại Hội Võ Lâm sắp bắt đầu...",
    "completion": "Đại Hội đã kết thúc. Những chiến binh xuất sắc nhất đã được vinh danh."
  },
  "data": {
    "effects": [
      { "type": "BUFF", "target": "ALL", "effect": { "breakthroughRate": 1.2 } }
    ],
    "rewards": [
      { "type": "TITLE", "title": { "id": "dai-hoi-vo-lim", "name": "Đại Hội Võ Lâm Đệ Nhất" } }
    ],
    "requirements": { "realmMin": "LUYEN_HON" }
  }
}
```

---

## Event Design Checklist

- [ ] Has narrative for all states
- [ ] Game data matches narrative
- [ ] Rewards don't break economy
- [ ] Duration appropriate
- [ ] Can be rolled back
- [ ] Logged in WorldEvent table
- [ ] Preview in admin panel

---

## Writing Event Narrative

### Announcement Format

```
**Thiên Đạo truyền âm:**

[Event name] đã bắt đầu!

[lore paragraph — 2-4 sentences establishing the event]

Thời gian: [duration]
Cách tham gia: [mechanism]
Phần thưởng: [preview]
```

### Progress Messages

Each progress message is 1-2 sentences:

```
**Lượt 1:** [Brief update on event progress]
**Lượt 2:** [Escalation or development]
```

### Completion

```
**Thiên Đạo truyền âm:**
[Event name] đã kết thúc.

[lore summary — 2-3 sentences]
```

---

## Example: World Boss Event

```json
{
  "id": "boss-hai-vuong",
  "name": "Hải Vương Trỗi Dậy",
  "type": "WORLD_BOSS",
  "scope": "SERVER",
  "narrative": {
    "announcement": "Thiên Đạo truyền âm:\n\nNgươi tu tiên Đông Hải, hãy nghe rõ:\n\nHải Vương, con rồng biển cổ đại, đã thức dậy từ giấc ngủ ngàn năm. Nó mang theo cơn thịnh nộ của đại dương và sự khát máu vô tận.\n\nHãy cùng chung sức, hoặc Đông Hải sẽ chìm trong hỗn loạn!\n\nThời gian: 72 giờ\nPhần thưởng: Hải Vương Lông, Danh hiệu Hải Vương Chiến Thắng",
    "completion": "Thiên Đạo truyền âm:\n\nHải Vương đã bị đánh bại! Những tu sĩ Đông Hải đã chứng minh sức mạnh đoàn kết của mình. Nhưng đại dương sâu thẳm vẫn còn nhiều bí mật chưa được khám phá..."
  },
  "data": {
    "effects": [
      {
        "type": "DEBUFF",
        "target": "REGION",
        "region": "DONG_HAI",
        "effect": { "encounterRate": 2.0 }
      }
    ],
    "rewards": [
      {
        "type": "ITEM",
        "item": { "id": "HAI_VUONG_LONG", "chance": 0.1 }
      },
      {
        "type": "TITLE",
        "title": { "id": "hai-vuong-chien-thang", "name": "Hải Vương Chiến Thắng" }
      }
    ],
    "requirements": { "realmMin": "KHI_TUC" }
  }
}
```
