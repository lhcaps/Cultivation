/**
 * Sect API integration tests — verify sect membership rules.
 */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { SectService } from "./sect.service.js";

const mockPrisma = {
  $transaction: vi.fn(),
};

describe("SectService", () => {
  let service: SectService;

  beforeEach(() => {
    vi.clearAllMocks();
    service = new SectService(mockPrisma as never);
  });

  describe("joinSect", () => {
    it("rejects character already in this sect", async () => {
      mockPrisma.$transaction.mockImplementation(async (fn: Function) =>
        fn({
          character: { findUnique: vi.fn().mockResolvedValue({ id: "char-1", sectId: "sect-1" }) },
          sect: { findUnique: vi.fn().mockResolvedValue({ id: "sect-1", isInviteOnly: false }) },
          actionLog: { create: vi.fn() },
        }),
      );

      await expect(service.joinSect("char-1", "sect-1")).rejects.toThrow("Already a member");
    });

    it("rejects join attempt on invite-only sect", async () => {
      mockPrisma.$transaction.mockImplementation(async (fn: Function) =>
        fn({
          character: { findUnique: vi.fn().mockResolvedValue({ id: "char-1", sectId: null }) },
          sect: { findUnique: vi.fn().mockResolvedValue({ id: "sect-invite", isInviteOnly: true }) },
          actionLog: { create: vi.fn() },
        }),
      );

      await expect(service.joinSect("char-1", "sect-invite")).rejects.toThrow("invite-only");
    });

    it("succeeds when joining a public sect", async () => {
      mockPrisma.$transaction.mockImplementation(async (fn: Function) =>
        fn({
          character: { findUnique: vi.fn().mockResolvedValue({ id: "char-1", sectId: null }), update: vi.fn().mockResolvedValue({ id: "char-1", sectId: "sect-public" }) },
          sect: { findUnique: vi.fn().mockResolvedValue({ id: "sect-public", isInviteOnly: false }) },
          actionLog: { create: vi.fn().mockResolvedValue({ id: "log-1" }) },
        }),
      );

      const result = await service.joinSect("char-1", "sect-public");
      expect(result.sectId).toBe("sect-public");
    });

    it("throws when character not found", async () => {
      mockPrisma.$transaction.mockImplementation(async (fn: Function) =>
        fn({
          character: { findUnique: vi.fn().mockResolvedValue(null) },
          sect: { findUnique: vi.fn() },
        }),
      );

      await expect(service.joinSect("nonexistent", "sect-1")).rejects.toThrow("not found");
    });

    it("throws when sect not found", async () => {
      mockPrisma.$transaction.mockImplementation(async (fn: Function) =>
        fn({
          character: { findUnique: vi.fn().mockResolvedValue({ id: "char-1", sectId: null }) },
          sect: { findUnique: vi.fn().mockResolvedValue(null) },
        }),
      );

      await expect(service.joinSect("char-1", "nonexistent")).rejects.toThrow("not found");
    });

    it("writes action log on successful join", async () => {
      let txCtx: Record<string, unknown> = {};
      mockPrisma.$transaction.mockImplementation(async (fn: Function) =>
        fn(
          (txCtx = {
            character: {
              findUnique: vi.fn().mockResolvedValue({ id: "char-1", sectId: null }),
              update: vi.fn().mockResolvedValue({ id: "char-1", sectId: "sect-1" }),
            },
            sect: { findUnique: vi.fn().mockResolvedValue({ id: "sect-1", isInviteOnly: false }) },
            actionLog: { create: vi.fn().mockResolvedValue({ id: "log-1" }) },
          }),
        ),
      );

      await service.joinSect("char-1", "sect-1");

      const actionLogCreate = txCtx.actionLog?.create as ReturnType<typeof vi.fn>;
      expect(actionLogCreate).toHaveBeenCalledWith({
        data: expect.objectContaining({
          characterId: "char-1",
          action: "SECT_JOIN",
        }),
      });
    });
  });
});
