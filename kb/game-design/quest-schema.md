# Quest Schema — Thiên Nam Engine

> How quests are designed and structured.

---

## Quest JSON Schema

```typescript
interface Quest {
  id: string;                        // kebab-case: "hep-y-nguoi-choi"
  name: string;                      // "Hộ tống người chơi"
  type: QuestType;

  narrative: {
    hook: string;                   // How quest is introduced
    objective: string;               // Clear statement of goal
    completion: string;             // Success message
    failure?: string;                // Failure message
  };

  requirements: {
    realmMin?: RealmId;
    itemRequired?: string;
    questCompleted?: string;
  };

  duration: {
    type: "INSTANT" | "TIMED" | "ONGOING";
    hours?: number;
  };

  risk: "NONE" | "LOW" | "MEDIUM" | "HIGH";

  rewards: QuestReward[];

  impact?: {
    factionRelations?: Record<string, number>;
    unlocksQuest?: string;
    closesQuest?: string;
  };
}

type QuestType =
  | "ESCORT"
  | "HUNT"
  | "GATHER"
  | "INVESTIGATE"
  | "MANHUNT"
  | "SECT"
  | "HIDDEN";
```

---

## Quest Examples

### Gathering Quest (Dễ)

```json
{
  "id": "thu-thap-duoc-thao",
  "name": "Thu Thập Dược Thảo",
  "type": "GATHER",
  "narrative": {
    "hook": "Một dược sư ở Linh Khê Cốc cần bạn thu thập 5 cây Dược Thảo từ rừng phía nam.",
    "objective": "Thu thập 5x Dược Thảo và mang về cho dược sư.",
    "completion": "Dược sư mỉm cười: 'Ngươi làm tốt lắm. Đây là thù lao của ngươi.'"
  },
  "requirements": {
    "realmMin": "LUYEN_THE"
  },
  "duration": {
    "type": "TIMED",
    "hours": 24
  },
  "risk": "LOW",
  "rewards": [
    { "type": "SILVER", "amount": 200 },
    { "type": "REPUTATION", "faction": "dai_viet", "amount": 5 }
  ]
}
```

### Hunt Quest (Trung bình)

```json
{
  "id": "diet-yeu-thu-doc",
  "name": "Diệt Yêu Thú Độc",
  "type": "HUNT",
  "narrative": {
    "hook": "Một con yêu thú độc đang quấy phá làng mạc gần Thanh Vân Sơn. Dân làng cần người tiêu diệt nó.",
    "objective": "Tiêu diệt Yêu Thú Độc và mang về 3 mẫu độc dược.",
    "completion": "Con yêu thú đã ngã xuống. Dân làng vui mừng và tặng bạn phần thưởng xứng đáng.",
    "failure": "Con yêu thú đã trốn thoát. Dân làng thất vọng."
  },
  "requirements": {
    "realmMin": "KHI_TUC"
  },
  "duration": {
    "type": "TIMED",
    "hours": 48
  },
  "risk": "MEDIUM",
  "rewards": [
    { "type": "SILVER", "amount": 500 },
    { "type": "ITEM", "itemId": "DOC_NGUYEN_LIEU", "quantity": 3 },
    { "type": "MERIT", "amount": 10 }
  ],
  "impact": {
    "factionRelations": {
      "thanh_van_tong": 5
    }
  }
}
```

### Investigation Quest (Khó)

```json
{
  "id": "dieu-tra-ta-giao",
  "name": "Điều Tra Tà Giáo",
  "type": "INVESTIGATE",
  "narrative": {
    "hook": "Thiên Thành có tin đồn về hoạt động bí mật của Vạn Độc Giáo. Hội đồng cần người điều tra.",
    "objective": "Xác minh tin đồn và thu thập bằng chứng về hoạt động tà giáo.",
    "completion": "Ngươi đã thu thập đủ bằng chứng. Hội đồng sẽ hành động.",
    "failure": "Ngươi đã bị phát hiện. Vạn Độc Giáo biết ngươi đang điều tra."
  },
  "requirements": {
    "realmMin": "LUYEN_HON",
    "reputationMin": { "faction": "trung_nguyen", "amount": 20 }
  },
  "duration": {
    "type": "TIMED",
    "hours": 72
  },
  "risk": "HIGH",
  "rewards": [
    { "type": "SILVER", "amount": 1000 },
    { "type": "REPUTATION", "faction": "trung_nguyen", "amount": 30 },
    { "type": "ITEM", "itemId": "THANH_TAM_DAN", "quantity": 2 }
  ],
  "impact": {
    "factionRelations": {
      "van_doc_giao": -20,
      "trung_nguyen": 15
    },
    "unlocksQuest": "tan-cong-ta-giao-co-so"
  }
}
```

---

## Quest Design Rules

1. **Every quest has a clear goal** — Not vague "help X"
2. **Every quest has meaningful choice** — Even simple quests can have: fight, negotiate, or flee
3. **Every quest has consequence** — Success, partial, or failure each have outcomes
4. **Rewards match risk** — No "slay the dragon" quests with herb rewards
5. **Quests can chain** — Completing one unlocks the next
6. **Quests can conflict** — Some quests are mutually exclusive

---

## Quest Quality Checklist

- [ ] Objective is clear and achievable
- [ ] Risk/reward ratio is appropriate
- [ ] Duration is appropriate for time investment
- [ ] Failure state is defined
- [ ] Rewards don't break economy
- [ ] Impact on world is defined
- [ ] Lore text is consistent with world bible
