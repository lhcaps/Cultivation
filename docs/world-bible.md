# Thiên Nam Võ Lục — World Bible

> **Thiên Đạo quyết**: Mọi quy tắc trong thế giới này được ghi chép đầy đủ. Không thiên đạo nào được phép thay đổi luật nghiêm trọng mà không có thiên chu.
>
> — *Chương 1, Điều 1, Quyển Thiên*

---

## Table of Contents

1. [Lore Overview](#1-lore-overview)
2. [Cosmology](#2-cosmology)
3. [Ten Realms of Cultivation](#3-ten-realms-of-cultivation)
4. [Eight Regions](#4-eight-regions)
5. [Fifty Sects](#5-fifty-sects)
6. [Five Resource Types](#6-five-resource-types)
7. [Pantheon of NPCs](#7-pantheon-of-npcs)
8. [Faction Allegiance](#8-faction-allegiance)
9. [Heavenly Tribulation](#9-heavenly-tribulation)
10. [World Timeline](#10-world-timeline)
11. [Naming Conventions](#11-naming-conventions)
12. [World Constants](#12-world-constants)

---

## 1. Lore Overview

### 1.1 The World — Thiên Nam

Thiên Nam là một thế giới tu tiên cổ xưa, nơi con người và yêu thú cùng tranh đấu để đạt tới cảnh giới siêu nhân. Vạn năm trước, **Thiên Đế** đánh bại **Ngũ Hành Quỷ Vương** và chia thiên hạ thành tám vùng đất. Từ đó, các tông môn được thành lập, mỗi tông mang theo một triết lý tu luyện riêng biệt.

### 1.2 The Three Great Powers

| Power | Domain | Color | Symbol |
|-------|--------|-------|--------|
| **Thiên Đạo** | Governance & Balance | Gold | Thiên ấn |
| **Chính Đạo** | Righteous cultivation | White/Silver | Chính khí |
| **Tà Đạo** | Demonic cultivation | Black/Purple | Ma khí |

### 1.3 The Void

Bên ngoài tám vùng là **Hư Không Biên Giới** — nơi các cảnh giới cao nhất có thể đi tới, nhưng ngay cả **Đại Thừa** cũng chưa chinh phục được.

---

## 2. Cosmology

### 2.1 The Heavenly Stairway

```
Ngũ Bất Tôn (Transcendent)
    ↑
Đại Thừa (Mahayana)
    ↑
Tiểu Thừa (Lesser Ascension)
    ↑
Hóa Thần (Deity Transformation)
    ↑
Trú Thần (Spiritual Abiding)
    ↑
Anh Kiệt (Hero)
    ↑
Luyện Khí (Qi Refining)
```

### 2.2 Elemental Affinities

| Element | Sign | Bonus Region | Weakness | Compatible Pills |
|---------|------|-------------|----------|-----------------|
| **Kim** (Metal) | White Tiger | Tây Vực | Mộc | Thanh Tâm Đan |
| **Mộc** (Wood) | Azure Dragon | Nam Man | Thổ | Thanh Tâm Đan |
| **Thủy** (Water) | Black Tortoise | Đại Việt | Hỏa | Thanh Tâm Đan |
| **Hỏa** (Fire) | Vermilion Bird | Trung Nguyên | Thủy | Thanh Tâm Đan |
| **Thổ** (Earth) | Yellow Dragon | Bắc Mạc | Kim | Thanh Tâm Đan |

---

## 3. Ten Realms of Cultivation

> **Lưu ý Thiên Đạo**: Cảnh giới là nền tảng game. Mọi tính toán tu vi, đột phá, và nội dung gameplay đều dựa trên bảng này. Không hardcode trong command — mọi cảnh giới được lưu trong DB và seed từ data.

| # | Tên | Tên Latin | Sub-stages | Foundation Quality | Breakthrough Base Rate |
|---|-----|-----------|-----------|-------------------|----------------------|
| 1 | **Luyện Thể** | Mortality | Sơ/Trung/Hậu | 0% | 100% (start) |
| 2 | **Khí Tức** | Breath | Sơ/Trung/Hậu | 5% | 95% |
| 3 | **Luyện Hồn** | Soul | Sơ/Trung/Hậu | 10% | 90% |
| 4 | **Trúc Mạch** | Foundation | Sơ/Trung/Hậu | 15% | 85% |
| 5 | **Kim Đan** | Gold Core | Sơ/Trung/Hậu | 20% | 75% |
| 6 | **Nguyên Anh** | Nascent Soul | Sơ/Trung/Hậu | 25% | 60% |
| 7 | **Hóa Thần** | Spirit Transmute | Sơ/Trung/Hậu | 30% | 45% |
| 8 | **Trú Thần** | Spirit Abiding | Sơ/Trung/Hậu | 35% | 30% |
| 9 | **Đại Thừa** | Mahayana | Sơ/Trung/Hậu | 40% | 15% |
| 10 | **Ngũ Bất Tôn** | Transcendent | — | 50% | 5% |

### 3.1 Realm Mechanics

**Cảnh giới con (Sub-stages)**

Mỗi cảnh giới chia thành 3 giai đoạn: **Sơ kỳ**, **Trung kỳ**, **Hậu kỳ**. Mỗi kỳ cần `cultivationPoints / 3` tu vi để vượt qua.

**Foundation Quality (Căn cơ)**

Căn cơ ảnh hưởng trực tiếp tới:
- Bonus tu vi khi tu luyện
- Tỉ lệ đột phá thành công
- Khả năng chịu tâm ma
- Chất lượng đan dược tự luyện

Căn cơ tăng khi: đột phá thành công, dùng Thanh Tâm Đan, hoàn thành kỳ ngộ hiếm.

**Breakthrough Rate**

Công thức tổng:

```
actualRate = baseRate
  × foundationMultiplier      // +1% per 5 quality
  × heartDemonPenalty        // -5% per 10 heartDemon
  × injuryPenalty            // -10% per level of injury
  × locationBonus           // +10% at sect headquarters
  × pillBonus              // +15% with appropriate pill
```

---

## 4. Eight Regions

| # | Tên | Climate | Specialty | Sect Bonus | Natural Hazard | Element |
|---|-----|---------|----------|------------|----------------|---------|
| 1 | **Đại Việt** | Ôn hòa | Y dược, Thủy công | +10% alchemy | — | Thủy |
| 2 | **Trung Nguyên** | Khí hậu nghiêng | Nhiệm vụ, Chính trị | +15% reputation gain | — | Hỏa |
| 3 | **Tây Vực** | Khô cằn | Thương lộ, Hỏa công | +10% combat | Sandstorm event | Hỏa |
| 4 | **U Minh** | Âm u | Tâm ma, Quỷ vật | +20% heart demon | Soul decay daily | Thổ |
| 5 | **Đông Hải** | Hải dương | Hải thương, Bí đảo | +10% encounter luck | Typhoon season | Thủy |
| 6 | **Bắc Mạc** | Lạnh giá | Kỵ chiến, Săn thú | +10% physical stats | Blizzard weekly | Kim |
| 7 | **Nam Man** | Nhiệt đới | Độc, Cổ, Dược | +15% alchemy | Plague season | Mộc |
| 8 | **Côn Lôn** | Băng tuyết | Kiếm đạo, Linh khí | +10% sword manual | Avalanche | Kim |

### 4.1 Region Details

#### Đại Việt
- **Thủ đô tu tiên**: Linh Khê Cốc
- **Đặc sản**: Thanh Tâm Đan, Linh Chi
- **Lãnh đạo cũ**: Hội Yên Môn (giải thể sau sự kiện Nhâm Thọ 2024)
- **Thế lực hiện tại**: Thiên Y Đan Quốc, Thanh Vân Tông

#### Trung Nguyên
- **Thủ đô tu tiên**: Thiên Thành
- **Đặc sản**: Chính khí, Võ công
- **Đặc điểm**: Nơi tập trung các tông môn Chính Đạo lớn
- **Thế lực hiện tại**: Chính Dương Tông, Thái Hòa Môn

#### Tây Vực
- **Thủ đô tu tiên**: Hồ Lương Trại
- **Đặc sản**: Lưu ly đan, thiết thương
- **Đặc điểm**: Con đường Tơ Hồng dẫn qua đây
- **Thế lực hiện tại**: Hỏa Vân Cốc, Vạn Độc Giáo

#### U Minh
- **Thủ đô tu tiên**: U Đế Sơn
- **Đặc sản**: Hồn phách, Ma khí
- **Đặc điểm**: Tu luyện ở đây tăng tâm ma +2/ngày
- **Thế lực hiện tại**: U Minh Môn, Ma Giáo

#### Đông Hải
- **Thủ đô tu tiên**: Côn Lôn Thành
- **Đặc sản**: Hải sâm, Long cốt, Bảo vật
- **Đặc điểm**: 70% là biển, nhiều bí đảo
- **Thế lực hiện tại**: Long Môn, Hải Võ Tông

#### Bắc Mạc
- **Thủ đô tu tiên**: Bắc Phong Trại
- **Đặc sản**: Huyết tinh, Yêu thú băng
- **Đặc điểm**: Dân cư du mục, tôn trọng sức mạnh
- **Thế lực hiện tại**: Bắc Mạc Kỵ Đoàn, Băng Hà Tông

#### Nam Man
- **Thủ đô tu tiên**: Nam Chiếu Sơn
- **Đặc sản**: Độc dược, Cổ phẫu, Dược thảo
- **Đặc điểm**: Rừng rậm, sông ngòi, nhiều thú dữ
- **Thế lực hiện tại**: Nam Man Độc Môn, Thảo Đường

#### Côn Lôn
- **Thủ đô tu tiên**: Kiếm Phong Trại
- **Đặc sản**: Băng ngọc, Kiếm phổ, Linh khí băng
- **Đặc điểm**: Lãnh thổ kiếm đạo khắc nghiệt nhất
- **Thế lực hiện tại**: Côn Lôn Kiếm Tông, Băng Tuyết Động

---

## 5. Fifty Sects

> **Quy tắc**: Mỗi tông môn phải có: tên, vùng, hệ công, loại (Chính/Tà/Trung lập), rank (1-5 sao), và 3 phúc lợi. Không tông môn nào giống hệt tông môn khác.

### 5.1 Rank System

| Rank | Title | Min Members | Max Members | Sect Benefit Pool | Member Cap | Recruitment |
|------|-------|-------------|------------|-------------------|------------|-------------|
| ★ | Huyền thoại | — | 1 | Tiên sơn | 10 | By invitation |
| ★★ | Cường thịnh | 20 | 50 | Siêu cấp | 50 | High entry barrier |
| ★★★ | Đại tông | 10 | 20 | Cao cấp | 30 | Application |
| ★★★★ | Tiểu tông | 5 | 10 | Trung cấp | 20 | Open |
| ★★★★★ | Lục tổ | 1 | 5 | Sơ cấp | 10 | Open |

### 5.2 Sect List — Đại Việt (10 sects)

| ID | Tên | Type | Rank | Specialty | HQ Region | Benefit 1 | Benefit 2 | Benefit 3 |
|----|-----|------|------|-----------|-----------|-----------|-----------|-----------|
| DV-001 | **Thanh Vân Tông** | Chính | ★★★ | Thủy công | Đại Việt | +10% cultivation speed | Healing efficiency +20% | River sect aura |
| DV-002 | **Thiên Y Đan Quốc** | Chính | ★★★ | Y dược, Luyện đan | Đại Việt | Alchemy quality +25% | Pill ingredients cost -20% | Heal faster |
| DV-003 | **Linh Khê Cốc** | Trung | ★★★★ | Linh khí, Tụ khí | Đại Việt | Natural qi +15% | Sect territory buff | Meditation bonus |
| DV-004 | **Hồng Liên Giáo** | Tà | ★★★★ | Tà đạo, Hồn phách | Đại Việt | Soul cultivation +20% | Heart demon resist +10% | Dark secrets |
| DV-005 | **Cửu Châu Môn** | Trung | ★★★★ | Đa công, Thương | Đại Việt | Reputation gain +15% | Trade bonus | Multiple manuals |
| DV-006 | **Võ Đang Phái** | Chính | ★★★ | Võ công, Kiếm | Đại Việt | Combat stats +15% | Sword techniques +20% | Martial discipline |
| DV-007 | **Minh Giáo** | Tà | ★★★★ | Điều tra, Quỷ vật | Đại Việt | Encounter rate +20% | Trap detection | Intel gathering |
| DV-008 | **Thiên Long Tông** | Chính | ★★★ | Long công, Thủy | Đại Việt | Dragon qi +20% | HP regen +10% | Dragon legacy |
| DV-009 | **Lạc Viên Pa** | Trung | ★★★★★ | Cổ xưa, Bí ẩn | Đại Việt | Ancient techniques | Historical knowledge | Mysterious aura |
| DV-010 | **Bạch Vân Quán** | Chính | ★★★★★ | Thanh tâm, Yên lặng | Đại Việt | Heart demon -5/cycle | Meditation bonus | Purity aura |

### 5.3 Sect List — Trung Nguyên (10 sects)

| ID | Tên | Type | Rank | Specialty | HQ Region | Benefit 1 | Benefit 2 | Benefit 3 |
|----|-----|------|------|-----------|-----------|-----------|-----------|-----------|
| CN-001 | **Chính Dương Tông** | Chính | ★★ | Chính khí, Võ | Trung Nguyên | Justice power +30% | Evil resist +20% | Righteous aura |
| CN-002 | **Thái Hòa Môn** | Chính | ★★ | Đại đồng, Võ | Trung Nguyên | Alliance strength +20% | Peace aura | Balance buff |
| CN-003 | **Thanh Chính Kiếm Tông** | Chính | ★★★ | Kiếm đạo, Chính trị | Trung Nguyên | Sword damage +20% | Political influence +15% | Honor gain |
| CN-004 | **Võ Lâm Chính Tông** | Chính | ★★★ | Võ công, Đoàn kết | Trung Nguyên | Combat +10% all | Leadership +20% | Sect unity |
| CN-005 | **Thiên Hạ Phái** | Trung | ★★★★ | Tự do, Đa dạng | Trung Nguyên | Flexible training | No restrictions | Freedom aura |
| CN-006 | **Tinh Võ Các** | Trung | ★★★★ | Kỵ chiến, Thể lực | Trung Nguyên | Physical +15% | Mount combat +25% | Cavalry strength |
| CN-007 | **Càn Khôn Đường** | Chính | ★★★ | Trận pháp, Tính toán | Trung Nguyên | Formation mastery +25% | Strategy bonus +20% | Tactical insight |
| CN-008 | **Trung Nguyên Đấu Phủ** | Trung | ★★★★ | Đấu trường, Huyết chiến | Trung Nguyên | PvP damage +15% | Glory gain +30% | Bloodlust aura |
| CN-009 | **Lưỡng Đao Hội** | Trung | ★★★★★ | Kết minh, Võ | Trung Nguyên | Brotherhood +10% | Dual wield +15% | Loyalty buff |
| CN-010 | **Hồng Kỳ Dược Hội** | Trung | ★★★★ | Dược học, Hợp tác | Trung Nguyên | Herb efficiency +20% | Group crafting +15% | Cooperative aura |

### 5.4 Sect List — Tây Vực (6 sects)

| ID | Tên | Type | Rank | Specialty | HQ Region | Benefit 1 | Benefit 2 | Benefit 3 |
|----|-----|------|------|-----------|-----------|-----------|-----------|-----------|
| TW-001 | **Hỏa Vân Cốc** | Trung | ★★★ | Hỏa công, Luyện đan | Tây Vực | Fire cultivation +20% | Fire pill +15% | Flame aura |
| TW-002 | **Vạn Độc Giáo** | Tà | ★★★ | Độc công, ám sát | Tây Vực | Poison damage +30% | Stealth +20% | Venom mastery |
| TW-003 | **Thương Lộ Tông** | Trung | ★★★★ | Thương nghiệp, Đàm phán | Tây Vực | Trade profit +25% | Caravan bonus +20% | Merchant connections |
| TW-004 | **Thiết Sa Môn** | Trung | ★★★★ | Kim công, Thể lực | Tây Vực | Metal body +20% | Defense +15% | Iron will |
| TW-005 | **Mộc Dược Tông** | Trung | ★★★★★ | Dược liệu, Trị liệu | Tây Vực | Herb mastery | Healing +10% | Nature connection |
| TW-006 | **Huyết Sa Cốc** | Tà | ★★★ | Huyết công, Hấp thụ | Tây Vực | Lifesteal +15% | Blood cultivation +20% | Crimson power |

### 5.5 Sect List — U Minh (5 sects)

| ID | Tên | Type | Rank | Specialty | HQ Region | Benefit 1 | Benefit 2 | Benefit 3 |
|----|-----|------|------|-----------|-----------|-----------|-----------|-----------|
| UM-001 | **U Minh Môn** | Tà | ★★ | Hồn phách, Quỷ thuật | U Minh | Soul power +30% | Ghost summon +15% | Shadow realm access |
| UM-002 | **Ma Giáo** | Tà | ★★ | Ma công, Hủy diệt | U Minh | Demonic cultivation +25% | Fear aura +20% | Destruction power |
| UM-003 | **Huyết Hải Môn** | Tà | ★★★ | Huyết công, Trả thù | U Minh | Blood power +25% | Vengeance +20% | Blood path |
| UM-004 | **Thập Diện La Sát** | Tà | ★★★ | Sát phạt, Quỷ thuật | U Minh | Kill bonus +20% | Terror +15% | Wrath mastery |
| UM-005 | **U Hồn Cốc** | Tà | ★★★★ | Triệu hồi, Hồn tế | U Minh | Summoning +20% | Spirit bond +15% | Necromancy |

### 5.6 Sect List — Đông Hải (6 sects)

| ID | Tên | Type | Rank | Specialty | HQ Region | Benefit 1 | Benefit 2 | Benefit 3 |
|----|-----|------|------|-----------|-----------|-----------|-----------|-----------|
| DH-001 | **Long Môn** | Chính | ★★ | Long công, Thủy | Đông Hải | Dragon bloodline +25% | Sea combat +20% | Ocean mastery |
| DH-002 | **Hải Võ Tông** | Trung | ★★★ | Hải chiến, Võ công | Đông Hải | Naval combat +25% | Treasure hunting +15% | Maritime strength |
| DH-003 | **Bí Đảo Liên Minh** | Trung | ★★★ | Bí ẩn, Kho báu | Đông Hải | Secret discovery +30% | Treasure bonus +20% | Exploration aura |
| DH-004 | **Vạn Thuyền Hội** | Trung | ★★★★ | Thương hải, Kết nối | Đông Hải | Shipping profit +30% | Network +25% | Trade connections |
| DH-005 | **Lưu Hoa Cung** | Trung | ★★★★★ | Nghệ thuật, Hấp dẫn | Đông Hải | Charm +25% | Diplomacy +20% | Artistic grace |
| DH-006 | **Hải Tặc Liên Minh** | Tà | ★★★★ | Cướp biển, Tự do | Đông Hải | Plunder +30% | Navigation +20% | Pirate code |

### 5.7 Sect List — Bắc Mạc (5 sects)

| ID | Tên | Type | Rank | Specialty | HQ Region | Benefit 1 | Benefit 2 | Benefit 3 |
|----|-----|------|------|-----------|-----------|-----------|-----------|-----------|
| BM-001 | **Bắc Mạc Kỵ Đoàn** | Trung | ★★★ | Kỵ chiến, Nhanh nhẹn | Bắc Mạc | Mounted combat +30% | Speed +20% | Cavalry strength |
| BM-002 | **Băng Hà Tông** | Chính | ★★★ | Băng công, Phòng ngự | Bắc Mạc | Ice techniques +25% | Defense +15% | Frost aura |
| BM-003 | **Sơn Dương Cung** | Trung | ★★★★ | Cung chiến, Đột kích | Bắc Mạc | Ranged damage +25% | Accuracy +20% | Precision |
| BM-004 | **Huyết Nhuyễn Tông** | Trung | ★★★★★ | Huyết công, Biến hình | Bắc Mạc | Shapeshift +20% | Blood power +15% | Adaptability |
| BM-005 | **Mạc Dao Cốc** | Trung | ★★★★ | Dao công, Ám sát | Bắc Mạc | Dagger +30% | Stealth +25% | Precision strike |

### 5.8 Sect List — Nam Man (5 sects)

| ID | Tên | Type | Rank | Specialty | HQ Region | Benefit 1 | Benefit 2 | Benefit 3 |
|----|-----|------|------|-----------|-----------|-----------|-----------|-----------|-----------|
| NM-001 | **Nam Man Độc Môn** | Tà | ★★★ | Độc công, Dược | Nam Man | Poison mastery +30% | Toxin resistance +20% | Venom arts |
| NM-002 | **Thảo Đường** | Chính | ★★★ | Dược liệu, Trị liệu | Nam Man | Herb mastery +25% | Healing +20% | Nature wisdom |
| NM-003 | **Cổ Đỉnh Tông** | Trung | ★★★ | Cổ phẫu, Khảo cổ | Nam Man | Artifact knowledge +25% | Ancient power +15% | Archaeology |
| NM-004 | **Thú Vương Hội** | Trung | ★★★★ | Thú triệu, Yêu thuật | Nam Man | Beast taming +30% | Animal combat +20% | Wild strength |
| NM-005 | **Lam My Cung** | Trung | ★★★★★ | Ảo thuật, Mê hoặc | Nam Man | Illusion +25% | Charm +20% | Mind tricks |

### 5.9 Sect List — Côn Lôn (3 sects)

| ID | Tên | Type | Rank | Specialty | HQ Region | Benefit 1 | Benefit 2 | Benefit 3 |
|----|-----|------|------|-----------|-----------|-----------|-----------|-----------|
| CL-001 | **Côn Lôn Kiếm Tông** | Chính | ★★ | Kiếm đạo, Băng công | Côn Lôn | Sword mastery +30% | Ice sword +20% | Frost blade |
| CL-002 | **Băng Tuyết Động** | Chính | ★★★ | Băng ngọc, Tu luyện | Côn Lôn | Ice cultivation +25% | Cold resistance +30% | Glacier power |
| CL-003 | **Tuyết Nguyệt Đàm** | Trung | ★★★★ | Kiếm ảnh, Ảo diệu | Côn Lôn | Sword shadow +25% | Illusion sword +20% | Moonlit blade |

---

## 6. Five Resource Types

| # | Resource | Icon | Acquisition | Sink | Max Stack | Description |
|---|----------|------|-------------|------|-----------|-------------|
| 1 | **Bạc** (Silver) | <:silver:> | Quests, daily, combat loot | Repair, travel, NPC shop | 99,999,999 | Tiền tệ cơ bản của người tu tiên |
| 2 | **Linh Thạch** (Spirit Stone) | <:spiritstone:> | Breakthrough, alchemy, rare drop | Advancement, pills, manuals | 9,999,999 | Tiền tệ tu tiên dùng cho công pháp và đan dược cao cấp |
| 3 | **Công Huân** (Merit) | <:merit:> | Sect contribution, justice kills | Sect shop, rank up | 999,999 | Tích lũy qua hoạt động tông môn |
| 4 | **Danh Vọng** (Reputation) | <:rep:> | Quests, events, public deeds | Reputation-only items, leaderboard | 99,999 | Đo lường danh tiếng trong thế giới |
| 5 | **Thiên Đạo Ấn** (Heaven's Seal) | <:heavenseal:> | World boss, season reward, admin | Season-exclusive items, titles | 999 | Tiền tệ event hiếm, chỉ có trong thời gian sự kiện |

### 6.1 Resource Flow

```
ACQUISITION                    SINK
─────────────                  ──────
Daily cultivation    →         Repair cauldron
Quest completion     →         Travel between regions
World event reward   →         Buy manuals
Combat loot          →         Alchemy ingredients
Sect salary          →         Sect shop items
Season reward        →         Reputation items
Admin grant          →         Advancement boost
```

---

## 7. Pantheon of NPCs

### 7.1 Celestial Bureaucracy

| Name | Title | Realm | Region | Role | Interaction |
|------|-------|-------|--------|------|-------------|
| **Thiên Đế** | The Heavenly Sovereign | Ngũ Bất Tôn | Thiên Cung | Supreme ruler | Admin persona |
| **Nam Tào** | Manager of Life | Đại Thừa | Thiên Cung | Manages cultivation | World events |
| **Bắc Đẩu** | Director of Fate | Hóa Thần | Thiên Cung | Leaderboard manager | Rankings |
| **Thái Thượng Lão Quân** | Elder Celestial | Đại Thừa | Trung Nguyên | Elder advisor | Random events |
| **Đông Phương Sóc** | Eastern Sage | Nguyên Anh | Đại Việt | Hidden master | Secret encounters |

### 7.2 Regional NPCs

| Name | Type | Region | Role | Quest Giver | Shop |
|------|------|--------|------|-------------|------|
| **Lương Y Quỳnh** | Y师 | Đại Việt | Healer | Yes | Yes |
| **Trang Sử** | Philosopher | Trung Nguyên | Lore | Yes | No |
| **Hồ Ly Tinh** | Fox Spirit | Đông Hải | Trickster | Yes | Yes |
| **Bắc Thái** | Trader | Bắc Mạc | Merchant | Yes | Yes |
| **Độc Nhân** | Poison Master | Nam Man | Alchemy | Yes | Yes |
| **Kiếm Linh** | Sword Spirit | Côn Lôn | Combat trainer | Yes | No |
| **U Hồn Sứ** | Ghost Messenger | U Minh | Information broker | Yes | Yes |
| **Hải Vương** | Sea King | Đông Hải | Dungeon access | Yes | Yes |
| **Sa Nhân** | Sand Sorcerer | Tây Vực | Fortune teller | Yes | Yes |

---

## 8. Faction Allegiance

### 8.1 Factions

| Faction | Alignment | Color | Member Sects | Hostile To |
|---------|-----------|-------|-------------|------------|
| **Thiên Đạo** | Neutral | Gold | Admin-controlled | N/A |
| **Chính Đạo Liên Minh** | Lawful Good | White | Thanh Vân, Chính Dương, Võ Đang, Băng Hà, Côn Lôn Kiếm Tông, Long Môn, Thiên Y | Tà Đạo, Ma Giáo |
| **Tà Đạo Liên Minh** | Chaotic Evil | Purple | Vạn Độc, Ma Giáo, Huyết Hải, Huyết Sa, U Minh Môn | Chính Đạo |
| **Trung Lập Hội** | True Neutral | Gray | Thương Lộ, Thiên Hạ Phái, Hải Võ, Càn Khôn, Cổ Đỉnh | — |

### 8.2 Faction Relations Matrix

|          | Chính Đạo | Tà Đạo | Trung Lập |
|----------|-----------|--------|-----------|
| **Chính Đạo** | +100 | -80 | +20 |
| **Tà Đạo** | -80 | +100 | 0 |
| **Trung Lập** | +20 | 0 | +50 |

Faction choice affects:
- Available missions
- NPC dialogue
- Encounter outcomes
- Leaderboard categories
- Public log messages

---

## 9. Heavenly Tribulation

### 9.1 Tribulation Types

| Tribulation | Trigger | Effect | Mitigation |
|-------------|---------|--------|------------|
| **Thiên Lôi Kiếp** | Breakthrough Kim Đan+ | HP damage, random stat loss | Thunder Ward Talisman |
| **Tâm Ma Kiếp** | Heart demon >= 50 | Random failure, stat drain | Purification Pill |
| **Khí Mạch Nghịch Lưu** | Forced cultivation | Internal injury | Sect master support |
| **Cừu Nhân Đột Kích** | PK flag | Interruption, possible death | Sect protection |
| **Dược Độc Phản Phệ** | Pill overdose | Poison status | Antidote |
| **Đan Kiếp** | High-tier alchemy | Catastrophic failure | 3+ assistants, sect formation |

### 9.2 Tribulation Severity

```
Minor tribulation:   Effect lasts 1-3 hours
Moderate tribulation: Effect lasts 1-3 days
Severe tribulation:  Effect lasts 1-2 weeks, stat reduction
Catastrophic tribulation: Character death, rebirth required
```

---

## 10. World Timeline

| Era | Years | Major Events |
|-----|-------|-------------|
| **Thái Sơ** | -10000 to -8000 | Thiên Đế đánh bại Ngũ Hành Quỷ Vương |
| **Thượng Cổ** | -8000 to -3000 | Các tông môn thành lập, Tu Tiên bắt đầu phổ biến |
| **Trung Cổ** | -3000 to 0 | Đại chiến Tà-Chính lần thứ nhất |
| **Hạ Cổ** | 0 to 3000 | Thiên Nam Engine khởi tạo (2025) |
| **Hiện Đại** | 3000 to present | Nhâm Thọ 2024 — Biến động Thiên Đạo |

---

## 11. Naming Conventions

### 11.1 Character Names

- Full name: 2-4 ký tự Hán-Việt
- Common formats: Họ + Tên đệm + Tên chính
- Examples: **Lý Hàn**, **Tô Minh Châu**, **Dương Vũ Sinh**

### 11.2 Sect Names

- Format: [Đặc điểm] + [Loại tông môn]
- Examples: Thanh Vân Tông, Hỏa Vân Cốc, U Minh Môn
- Suffixes: Tông (sect), Cốc (valley), Môn (gate), Phái (school), Cung (palace)

### 11.3 Region Names

- Full world: Thiên Nam Võ Lục
- Sub-regions: Linh Khê Cốc, Thiên Thành, Hồ Lương Trại
- Dungeon names: [Adjective] + [Type]: Tiên Cốc Bí Đảo, U Hồn Quật

### 11.4 Item Names

- Format: [Phẩm] + [Loại] + [Tên riêng]
- Examples: Thượng Phẩm Trúc Mạch Đan, Cực Phẩm Thanh Tâm Đan
- Prefixes: Thất (7th), Lục (6th), Ngũ (5th)...

---

## 12. World Constants

These constants are the **source of truth** for all game calculations. Changing them requires admin audit log.

### 12.1 Cultivation Constants

```typescript
const CULTIVATION_CONSTANTS = {
  BASE_EXP_PER_SESSION: 100,
  HEART_DEMON_PER_FORCED_CULTIVATE: 8,
  HEART_DEMON_PER_DAY_UMINH: 2,
  HEART_DEMON_DECAY_PER_DAY: 1,
  HEART_DEMON_THRESHOLD: 50,        // Risk starts here
  HEART_DEMON_CRITICAL: 80,         // Breakthrough penalty active
  FOUNDATION_QUALITY_MAX: 100,
  BASE_FOUNDATION_GAIN_BREAKTHROUGH: 5,
  CULTIVATION_SESSION_DURATION_HOURS: 8,
  CULTIVATION_COOLDOWN_HOURS: 1,
  SEASONAL_CULTIVATION_BONUS: 1.15,  // Spring/Summer
  SEASONAL_CULTIVATION_PENALTY: 0.85 // Winter
};
```

### 12.2 Combat Constants

```typescript
const COMBAT_CONSTANTS = {
  BASE_HP: 100,
  BASE_QI: 50,
  HP_PER_REALM: 50,
  QI_PER_REALM: 25,
  BASE_ATTACK: 10,
  BASE_DEFENSE: 5,
  BASE_SPEED: 10,
  BASE_CRIT_RATE: 0.05,
  CRIT_MULTIPLIER: 1.5,
  INJURY_HP_PENALTY: 0.10,  // Per level
  INJURY_DURATION_DAYS: 3,
  DEATH_REBIRTH_EXP_PENALTY: 0.10
};
```

### 12.3 Economy Constants

```typescript
const ECONOMY_CONSTANTS = {
  DAILY_SILVER_BASE: 100,
  QUEST_SILVER_MIN: 50,
  QUEST_SILVER_MAX: 5000,
  ITEM_DECAY_RATE: 0.05,     // Per day for consumables
  REPAIR_COST_RATIO: 0.20,   // 20% of item value
  SECT_TAX_RATE: 0.10,       // 10% of member earnings
  AUCTION_FEE: 0.05,         // 5% listing fee
  SELL_BACK_RATIO: 0.50,     // 50% of item value
  DAILY_SPIRIT_STONE_CHANCE: 0.01  // 1% chance per cultivation
};
```

### 12.4 Time Constants

```typescript
const TIME_CONSTANTS = {
  DAILY_RESET_HOUR: 0,           // Midnight UTC
  WEEKLY_RESET_DAY: 0,            // Sunday
  SEASON_DURATION_DAYS: 30,
  DUNGEON_LOCKOUT_HOURS: 24,
  COOLDOWN_TICK_MINUTES: 5,
  ACTION_LOG_RETENTION_DAYS: 365,
  ADMIN_AUDIT_RETENTION_DAYS: 9999
};
```
