import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Seed Realms
  console.log("Seeding realms...");
  const realms = [
    { id: "LUYEN_THE", name: "Luyện Thể", nameLatin: "Mortality", pointsPerSubStage: 1000, baseBreakthroughRate: 1.0, order: 1 },
    { id: "KHI_TUC", name: "Khí Tức", nameLatin: "Breath", pointsPerSubStage: 3000, baseBreakthroughRate: 0.95, order: 2 },
    { id: "LUYEN_HON", name: "Luyện Hồn", nameLatin: "Soul", pointsPerSubStage: 9000, baseBreakthroughRate: 0.90, order: 3 },
    { id: "TRUC_MACH", name: "Trúc Mạch", nameLatin: "Foundation", pointsPerSubStage: 27000, baseBreakthroughRate: 0.85, order: 4 },
    { id: "KIM_DAN", name: "Kim Đan", nameLatin: "Gold Core", pointsPerSubStage: 81000, baseBreakthroughRate: 0.75, order: 5 },
    { id: "NGUYEN_ANH", name: "Nguyên Anh", nameLatin: "Nascent Soul", pointsPerSubStage: 243000, baseBreakthroughRate: 0.60, order: 6 },
    { id: "HOA_THAN", name: "Hóa Thần", nameLatin: "Spirit Transmute", pointsPerSubStage: 729000, baseBreakthroughRate: 0.45, order: 7 },
    { id: "TRU_THAN", name: "Trú Thần", nameLatin: "Spirit Abiding", pointsPerSubStage: 2187000, baseBreakthroughRate: 0.30, order: 8 },
    { id: "DAI_THUA", name: "Đại Thừa", nameLatin: "Mahayana", pointsPerSubStage: 6561000, baseBreakthroughRate: 0.15, order: 9 },
    { id: "NGU_BAT_TON", name: "Ngũ Bất Tôn", nameLatin: "Transcendent", pointsPerSubStage: 19683000, baseBreakthroughRate: 0.05, order: 10 },
  ];

  for (const realm of realms) {
    await prisma.realm.upsert({
      where: { order: realm.order },
      update: realm,
      create: realm,
    });
  }
  console.log(`✓ ${realms.length} realms seeded`);

  // Seed Regions
  console.log("Seeding regions...");
  const regions = [
    { id: "DAI_VIET", name: "Đại Việt", qiMultiplier: 1.0, heartDemonPerDay: 0, description: "Thủ đô tu tiên, y dược, thủy công", element: "THUY" },
    { id: "TRUNG_NGUYEN", name: "Trung Nguyên", qiMultiplier: 1.0, heartDemonPerDay: 0, description: "Chính trị, nhiệm vụ, võ công", element: "HOA" },
    { id: "TAY_VUC", name: "Tây Vực", qiMultiplier: 1.0, heartDemonPerDay: 0, description: "Thương lộ, hỏa công, cằn cỗi", element: "HOA" },
    { id: "U_MINH", name: "U Minh", qiMultiplier: 1.3, heartDemonPerDay: 2, description: "Tâm ma, quỷ vật, âm u", element: "THO" },
    { id: "DONG_HAI", name: "Đông Hải", qiMultiplier: 1.0, heartDemonPerDay: 0, description: "Hải thương, bí đảo, hải tặc", element: "THUY" },
    { id: "BAC_MAC", name: "Bắc Mạc", qiMultiplier: 0.85, heartDemonPerDay: 0, description: "Kỵ chiến, săn thú, băng tuyết", element: "KIM" },
    { id: "NAM_MAN", name: "Nam Man", qiMultiplier: 1.0, heartDemonPerDay: 0, description: "Độc, cổ, dược liệu", element: "MOC" },
    { id: "CON_LON", name: "Côn Lôn", qiMultiplier: 1.0, heartDemonPerDay: 0, description: "Kiếm đạo, băng tuyết, linh khí", element: "KIM" },
  ];

  for (const region of regions) {
    await prisma.region.upsert({
      where: { id: region.id },
      update: region,
      create: region,
    });
  }
  console.log(`✓ ${regions.length} regions seeded`);

  // Seed Items
  console.log("Seeding items...");
  const items = [
    // Pills
    { id: "THANH_TAM_DAN", name: "Thanh Tâm Đan", description: "Giảm tâm ma 5 điểm", type: "PILL", rarity: "COMMON", value: 25, stackable: true },
    { id: "TRUC_MACH_DAN", name: "Trúc Mạch Đan", description: "Hỗ trợ đột phá Trúc Mạch", type: "PILL", rarity: "UNCOMMON", value: 100, stackable: true },
    { id: "KIM_DAN", name: "Kim Đan", description: "Hỗ trợ đột phá Kim Đan", type: "PILL", rarity: "RARE", value: 400, stackable: true },
    { id: "HOI_HUONG_DAN", name: "Hồi Hương Đan", description: "Hồi HP 50%", type: "PILL", rarity: "COMMON", value: 30, stackable: true },
    { id: "GIAI_DOC_DAN", name: "Giải Độc Đan", description: "Trị trúng độc", type: "PILL", rarity: "COMMON", value: 20, stackable: true },
    // Ingredients
    { id: "DƯỢC_THẢO", name: "Dược Thảo", description: "Nguyên liệu luyện đan cơ bản", type: "INGREDIENT", rarity: "COMMON", value: 10, stackable: true },
    { id: "LINH_THẢO", name: "Linh Thảo", description: "Nguyên liệu luyện đan cao cấp", type: "INGREDIENT", rarity: "UNCOMMON", value: 50, stackable: true },
    { id: "NGUYÊN_LIỆU_KIM_DAN", name: "Nguyên Liệu Kim Đan", description: "Nguyên liệu luyện Kim Đan", type: "INGREDIENT", rarity: "RARE", value: 200, stackable: true },
    // Equipment
    { id: "THANH_VAN_KIEM", name: "Thanh Vân Kiếm", description: "Kiếm sắt tôi Thanh Vân Tông", type: "WEAPON", rarity: "UNCOMMON", value: 100, durability: 100 },
    { id: "PHÁP_PHỤC_BẠCH", name: "Pháp Phục Bạch", description: "Trang phục tu tiên", type: "ARMOR", rarity: "COMMON", value: 50, durability: 80 },
  ];

  for (const item of items) {
    await prisma.item.upsert({
      where: { id: item.id },
      update: item,
      create: item,
    });
  }
  console.log(`✓ ${items.length} items seeded`);

  // Seed Manuals
  console.log("Seeding manuals...");
  const manuals = [
    { id: "THANH_VAN_QUYET", name: "Thanh Vân Quyết", description: "Công pháp thủy hệ cơ bản", element: "THUY", realmReq: "LUYEN_THE", type: "CULTIVATION" },
    { id: "TRUNG_NGUYEN_CHINH_QUYET", name: "Trung Nguyên Chính Quyết", description: "Công pháp hỏa hệ cơ bản", element: "HOA", realmReq: "LUYEN_THE", type: "CULTIVATION" },
    { id: "TAY_VUC_HOA_QUYET", name: "Tây Vực Hỏa Quyết", description: "Công pháp hỏa hệ Tây Vực", element: "HOA", realmReq: "KHI_TUC", type: "CULTIVATION" },
    { id: "BANG_TUYET_KIẾM_PHU", name: "Băng Tuyết Kiếm Phổ", description: "Công pháp kiếm đạo Côn Lôn", element: "KIM", realmReq: "KHI_TUC", type: "CULTIVATION" },
    { id: "BAC_MAC_VÕ_QUYET", name: "Bắc Mạc Võ Quyết", description: "Công pháp võ hệ Bắc Mạc", element: "KIM", realmReq: "LUYEN_THE", type: "CULTIVATION" },
    { id: "NAM_MAN_DOC_QUYET", name: "Nam Man Độc Quyết", description: "Công pháp độc hệ Nam Man", element: "MOC", realmReq: "LUYEN_HON", type: "CULTIVATION" },
    { id: "U_MINH_QUỶ_QUYET", name: "U Minh Quỷ Quyết", description: "Công pháp tà hệ U Minh", element: "THO", realmReq: "LUYEN_HON", type: "CULTIVATION" },
  ];

  for (const manual of manuals) {
    await prisma.manual.upsert({
      where: { id: manual.id },
      update: manual,
      create: manual,
    });
  }
  console.log(`✓ ${manuals.length} manuals seeded`);

  // Seed Alchemy Recipes
  console.log("Seeding alchemy recipes...");
  const recipes = [
    {
      id: "THANH_TAM_DAN_RECIPE",
      name: "Thanh Tâm Đan",
      description: "Đan dược giảm tâm ma",
      difficulty: "EASY",
      baseStability: 60,
      basePurity: 40,
      baseOutput: 50,
      resultItemId: "THANH_TAM_DAN",
      spiritStoneCost: 0,
    },
    {
      id: "TRUC_MACH_DAN_RECIPE",
      name: "Trúc Mạch Đan",
      description: "Hỗ trợ đột phá Trúc Mạch",
      difficulty: "MEDIUM",
      baseStability: 45,
      basePurity: 35,
      baseOutput: 40,
      resultItemId: "TRUC_MACH_DAN",
      spiritStoneCost: 10,
    },
    {
      id: "KIM_DAN_RECIPE",
      name: "Kim Đan",
      description: "Hỗ trợ đột phá Kim Đan",
      difficulty: "HARD",
      baseStability: 35,
      basePurity: 30,
      baseOutput: 35,
      resultItemId: "KIM_DAN",
      spiritStoneCost: 50,
    },
  ];

  for (const recipe of recipes) {
    await prisma.alchemyRecipe.upsert({
      where: { id: recipe.id },
      update: recipe,
      create: recipe,
    });
  }
  console.log(`✓ ${recipes.length} alchemy recipes seeded`);

  // Seed Sects
  console.log("Seeding sects...");
  const sects = [
    // Đại Việt (10)
    { id: "THANH_VAN_TONG", name: "Thanh Vân Tông", alignment: "CHINH", rank: 3, headquartersRegionId: "DAI_VIET", description: "Tông môn thủy hệ danh chính" },
    { id: "THIEN_Y_DAN_QUOC", name: "Thiên Y Đan Quốc", alignment: "CHINH", rank: 3, headquartersRegionId: "DAI_VIET", description: "Y dược, luyện đan" },
    { id: "LINH_KHE_COC", name: "Linh Khê Cốc", alignment: "TRUNG", rank: 4, headquartersRegionId: "DAI_VIET", description: "Linh khí, tụ khí" },
    { id: "HONG_LIEN_GIAO", name: "Hồng Liên Giáo", alignment: "TA", rank: 4, headquartersRegionId: "DAI_VIET", description: "Tà đạo, hồn phách" },
    { id: "CỬU_CHÂU_MÔN", name: "Cửu Châu Môn", alignment: "TRUNG", rank: 4, headquartersRegionId: "DAI_VIET", description: "Đa công, thương" },
    { id: "VÕ ĐANG_PHAI", name: "Võ Đang Phái", alignment: "CHINH", rank: 3, headquartersRegionId: "DAI_VIET", description: "Võ công, kiếm" },
    { id: "MINH_GIAO", name: "Minh Giáo", alignment: "TA", rank: 4, headquartersRegionId: "DAI_VIET", description: "Điều tra, quỷ vật" },
    { id: "THIEN_LONG_TONG", name: "Thiên Long Tông", alignment: "CHINH", rank: 3, headquartersRegionId: "DAI_VIET", description: "Long công, thủy" },
    { id: "LẠC_VIÊN_PA", name: "Lạc Viên Pa", alignment: "TRUNG", rank: 5, headquartersRegionId: "DAI_VIET", description: "Cổ xưa, bí ẩn" },
    { id: "BẠCH_VÂN_QUÁN", name: "Bạch Vân Quán", alignment: "CHINH", rank: 5, headquartersRegionId: "DAI_VIET", description: "Thanh tâm, yên lặng" },
    // Trung Nguyên (10)
    { id: "CHINH_DƯƠNG_TONG", name: "Chính Dương Tông", alignment: "CHINH", rank: 2, headquartersRegionId: "TRUNG_NGUYEN", description: "Chính khí, võ" },
    { id: "THAI_HÒA_MÔN", name: "Thái Hòa Môn", alignment: "CHINH", rank: 2, headquartersRegionId: "TRUNG_NGUYEN", description: "Đại đồng, võ" },
    { id: "THANH_CHINH_KIEM_TONG", name: "Thanh Chính Kiếm Tông", alignment: "CHINH", rank: 3, headquartersRegionId: "TRUNG_NGUYEN", description: "Kiếm đạo, chính trị" },
    { id: "VÕ_LÂM_CHINH_TONG", name: "Võ Lâm Chính Tông", alignment: "CHINH", rank: 3, headquartersRegionId: "TRUNG_NGUYEN", description: "Võ công, đoàn kết" },
    { id: "THIEN_HA_PHẠI", name: "Thiên Hạ Phái", alignment: "TRUNG", rank: 4, headquartersRegionId: "TRUNG_NGUYEN", description: "Tự do, đa dạng" },
    { id: "TINH_VÕ_CÁC", name: "Tinh Võ Các", alignment: "TRUNG", rank: 4, headquartersRegionId: "TRUNG_NGUYEN", description: "Kỵ chiến, thể lực" },
    { id: "CÀN_KHÔN_ĐƯỜNG", name: "Càn Khôn Đường", alignment: "CHINH", rank: 3, headquartersRegionId: "TRUNG_NGUYEN", description: "Trận pháp, tính toán" },
    { id: "TRUNG_NGUYEN_DẤU_PHỦ", name: "Trung Nguyên Đấu Phủ", alignment: "TRUNG", rank: 4, headquartersRegionId: "TRUNG_NGUYEN", description: "Đấu trường, huyết chiến" },
    { id: "LƯỠNG_ĐAO_HỘI", name: "Lưỡng Đao Hội", alignment: "TRUNG", rank: 5, headquartersRegionId: "TRUNG_NGUYEN", description: "Kết minh, võ" },
    { id: "HỒNG_KỲ_DƯỢC_HỘI", name: "Hồng Kỳ Dược Hội", alignment: "TRUNG", rank: 4, headquartersRegionId: "TRUNG_NGUYEN", description: "Dược học, hợp tác" },
    // Tây Vực (6)
    { id: "HỎA_VÂN_CỐC", name: "Hỏa Vân Cốc", alignment: "TRUNG", rank: 3, headquartersRegionId: "TAY_VUC", description: "Hỏa công, luyện đan" },
    { id: "VẠN_ĐỘC_GIÁO", name: "Vạn Độc Giáo", alignment: "TA", rank: 3, headquartersRegionId: "TAY_VUC", description: "Độc công, ám sát" },
    { id: "THƯƠNG_LỘ_TONG", name: "Thương Lộ Tông", alignment: "TRUNG", rank: 4, headquartersRegionId: "TAY_VUC", description: "Thương nghiệp, đàm phán" },
    { id: "THIẾT_SA_MÔN", name: "Thiết Sa Môn", alignment: "TRUNG", rank: 4, headquartersRegionId: "TAY_VUC", description: "Kim công, thể lực" },
    { id: "MỘC_DƯỢC_TONG", name: "Mộc Dược Tông", alignment: "TRUNG", rank: 5, headquartersRegionId: "TAY_VUC", description: "Dược liệu, trị liệu" },
    { id: "HUYẾT_SA_CỐC", name: "Huyết Sa Cốc", alignment: "TA", rank: 3, headquartersRegionId: "TAY_VUC", description: "Huyết công, hấp thụ" },
    // U Minh (5)
    { id: "U_MINH_MÔN", name: "U Minh Môn", alignment: "TA", rank: 2, headquartersRegionId: "U_MINH", description: "Hồn phách, quỷ thuật" },
    { id: "MA_GIAO", name: "Ma Giáo", alignment: "TA", rank: 2, headquartersRegionId: "U_MINH", description: "Ma công, hủy diệt" },
    { id: "HUYẾT_HẢI_MÔN", name: "Huyết Hải Môn", alignment: "TA", rank: 3, headquartersRegionId: "U_MINH", description: "Huyết công, trả thù" },
    { id: "THẬP_DIỆN_LA_SÁT", name: "Thập Diện La Sát", alignment: "TA", rank: 3, headquartersRegionId: "U_MINH", description: "Sát phạt, quỷ thuật" },
    { id: "U_HỒN_CỐC", name: "U Hồn Cốc", alignment: "TA", rank: 4, headquartersRegionId: "U_MINH", description: "Triệu hồi, hồn tế" },
    // Đông Hải (6)
    { id: "LONG_MÔN", name: "Long Môn", alignment: "CHINH", rank: 2, headquartersRegionId: "DONG_HAI", description: "Long công, thủy" },
    { id: "HẢI_VÕ_TONG", name: "Hải Võ Tông", alignment: "TRUNG", rank: 3, headquartersRegionId: "DONG_HAI", description: "Hải chiến, võ công" },
    { id: "BÍ_ĐẢO_LIÊN_MINH", name: "Bí Đảo Liên Minh", alignment: "TRUNG", rank: 3, headquartersRegionId: "DONG_HAI", description: "Bí ẩn, kho báu" },
    { id: "VẠN_THUYỀN_HỘI", name: "Vạn Thuyền Hội", alignment: "TRUNG", rank: 4, headquartersRegionId: "DONG_HAI", description: "Thương hải, kết nối" },
    { id: "LƯU_HOA_CUNG", name: "Lưu Hoa Cung", alignment: "TRUNG", rank: 5, headquartersRegionId: "DONG_HAI", description: "Nghệ thuật, hấp dẫn" },
    { id: "HẢI_TẶC_LIÊN_MINH", name: "Hải Tặc Liên Minh", alignment: "TA", rank: 4, headquartersRegionId: "DONG_HAI", description: "Cướp biển, tự do" },
    // Bắc Mạc (5)
    { id: "BẮC_MẠC_KỴ_ĐOÀN", name: "Bắc Mạc Kỵ Đoàn", alignment: "TRUNG", rank: 3, headquartersRegionId: "BAC_MAC", description: "Kỵ chiến, nhanh nhẹn" },
    { id: "BĂNG_HÀ_TONG", name: "Băng Hà Tông", alignment: "CHINH", rank: 3, headquartersRegionId: "BAC_MAC", description: "Băng công, phòng ngự" },
    { id: "SƠN_DƯƠNG_CUNG", name: "Sơn Dương Cung", alignment: "TRUNG", rank: 4, headquartersRegionId: "BAC_MAC", description: "Cung chiến, đột kích" },
    { id: "HUYẾT_NHUYỄN_TONG", name: "Huyết Nhuyễn Tông", alignment: "TRUNG", rank: 5, headquartersRegionId: "BAC_MAC", description: "Huyết công, biến hình" },
    { id: "MẠC_DAO_CỐC", name: "Mạc Dao Cốc", alignment: "TRUNG", rank: 4, headquartersRegionId: "BAC_MAC", description: "Dao công, ám sát" },
    // Nam Man (5)
    { id: "NAM_MAN_DOC_MÔN", name: "Nam Man Độc Môn", alignment: "TA", rank: 3, headquartersRegionId: "NAM_MAN", description: "Độc công, dược" },
    { id: "THẢO_ĐƯỜNG", name: "Thảo Đường", alignment: "CHINH", rank: 3, headquartersRegionId: "NAM_MAN", description: "Dược liệu, trị liệu" },
    { id: "CỔ_ĐỈNH_TONG", name: "Cổ Đỉnh Tông", alignment: "TRUNG", rank: 3, headquartersRegionId: "NAM_MAN", description: "Cổ phẫu, khảo cổ" },
    { id: "THÚ_VƯƠNG_HỘI", name: "Thú Vương Hội", alignment: "TRUNG", rank: 4, headquartersRegionId: "NAM_MAN", description: "Thú triệu, yêu thuật" },
    { id: "LAM_MY_CUNG", name: "Lam My Cung", alignment: "TRUNG", rank: 5, headquartersRegionId: "NAM_MAN", description: "Ảo thuật, mê hoặc" },
    // Côn Lôn (3)
    { id: "CON_LON_KIẾM_TONG", name: "Côn Lôn Kiếm Tông", alignment: "CHINH", rank: 2, headquartersRegionId: "CON_LON", description: "Kiếm đạo, băng công" },
    { id: "BĂNG_TUYẾT_ĐỘNG", name: "Băng Tuyết Động", alignment: "CHINH", rank: 3, headquartersRegionId: "CON_LON", description: "Băng ngọc, tu luyện" },
    { id: "TUYẾT_NGUYỆT_ĐÀM", name: "Tuyết Nguyệt Đàm", alignment: "TRUNG", rank: 4, headquartersRegionId: "CON_LON", description: "Kiếm ảnh, ảo diệu" },
  ];

  for (const sect of sects) {
    await prisma.sect.upsert({
      where: { name: sect.name },
      update: sect,
      create: sect,
    });
  }
  console.log(`✓ ${sects.length} sects seeded`);

  // Seed encounters
  console.log("Seeding encounters...");
  const encounters = [
    // Đại Việt
    { id: "DV_DƯỢC_NÔNG", regionId: "DAI_VIET", name: "Dược Nông Gặp Gỡ", description: "Bạn gặp một dược nông bị thương", realmMin: "LUYEN_THE", realmMax: "KIM_DAN", weight: 30, choices: JSON.stringify([{ label: "Giúp đỡ", effects: { silver: 50, reputation: 5 } }, { label: "Bỏ qua", effects: { luckBonus: 2 } }]) },
    { id: "DV_KỲ_NGỘ", regionId: "DAI_VIET", name: "Kỳ Ngộ Thiên Tài", description: "Bạn gặp một thiên tài tu tiên", realmMin: "LUYEN_THE", realmMax: "NGUYEN_ANH", weight: 15, choices: JSON.stringify([{ label: "Nhận truyền thừa", effects: { cultivationPoints: 500, heartDemon: -5 } }, { label: "Từ chối", effects: { reputation: 2 } }]) },
    { id: "DV_YÊU_THÚ", regionId: "DAI_VIET", name: "Yêu Thú Xuất Hiện", description: "Một con yêu thú xuất hiện", realmMin: "LUYEN_THE", realmMax: "KHI_TUC", weight: 25, choices: JSON.stringify([{ label: "Chiến đấu", effects: { cultivationPoints: 100, riskInjuryChance: 0.1 } }, { label: "Bỏ chạy", effects: { luckBonus: -2 } }]) },
    // Trung Nguyên
    { id: "CN_NHIỆM_VỤ", regionId: "TRUNG_NGUYEN", name: "Nhiệm Vụ Hội Đồng", description: "Hội đồng tông môn cần người giúp", realmMin: "KHI_TUC", realmMax: "KIM_DAN", weight: 20, choices: JSON.stringify([{ label: "Nhận nhiệm vụ", effects: { silver: 200, reputation: 10 } }, { label: "Từ chối", effects: { reputation: -5 } }]) },
    // Tây Vực
    { id: "TW_THƯƠNG_NHÂN", regionId: "TAY_VUC", name: "Thương Nhân Gặp Gỡ", description: "Một thương nhân trên sa mạc", realmMin: "LUYEN_HON", realmMax: "KIM_DAN", weight: 20, choices: JSON.stringify([{ label: "Giao dịch", effects: { spiritStones: 5, silver: -100 } }, { label: "Cướp bóc", effects: { silver: 200, reputation: -20 } }]) },
    // U Minh
    { id: "UM_QUỶ_VẬT", regionId: "U_MINH", name: "Quỷ Vật U Minh", description: "Một quỷ vật âm u xuất hiện", realmMin: "TRUC_MACH", realmMax: "HOA_THAN", weight: 25, choices: JSON.stringify([{ label: "Đối đầu", effects: { cultivationPoints: 300, riskInjuryChance: 0.25, heartDemon: 5 } }, { label: "Chạy trốn", effects: { heartDemon: 2 } }]) },
    // Nam Man
    { id: "NM_DƯỢC_THẢO", regionId: "NAM_MAN", name: "Dược Thảo Quý Hiếm", description: "Bạn phát hiện một cây dược thảo quý", realmMin: "LUYEN_THE", realmMax: "KIM_DAN", weight: 20, choices: JSON.stringify([{ label: "Thu thập", effects: { itemGain: ["DƯỢC_THẢO"] } }, { label: "Nghiên cứu", effects: { cultivationPoints: 200, reputation: 5 } }]) },
    // Côn Lôn
    { id: "CL_KIẾM_KỲ_NGỘ", regionId: "CON_LON", name: "Kiếm Kỳ Ngộ", description: "Một tàn kiếm cắm trên tuyết", realmMin: "KHI_TUC", realmMax: "NGUYEN_ANH", weight: 10, choices: JSON.stringify([{ label: "Rút kiếm", effects: { cultivationPoints: 500, reputation: 10 } }, { label: "Để nguyên", effects: { luckBonus: 5 } }]) },
  ];

  for (const encounter of encounters) {
    await prisma.encounter.upsert({
      where: { id: encounter.id },
      update: encounter,
      create: encounter,
    });
  }
  console.log(`✓ ${encounters.length} encounters seeded`);

  console.log("\n✅ Database seeding completed!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
