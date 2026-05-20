/**
 * Interaction handlers — button clicks for cultivation.
 */
import { Listener } from "@sapphire/framework";
import { type ButtonInteraction, EmbedBuilder, MessageFlags } from "discord.js";
import { prisma } from "@thien-nam/db";
import { parseCustomId, EmbedColors } from "../utils/interaction.js";

export class ButtonInteractionListener extends Listener {
  public constructor(context: Listener.Context, options: Listener.Options) {
    super(context, {
      ...options,
      event: "interactionCreate",
    });
  }

  public override async run(interaction: ButtonInteraction) {
    if (!interaction.isButton()) return;

    const parts = parseCustomId(interaction.customId);
    if (!parts) return;

    if (!interaction.customId.startsWith("cultivate:")) return;

    const { action, subAction, targetId } = parts;
    if (action !== "cultivate") return;

    const discordUserId = interaction.user.id;
    const user = await prisma.user.findUnique({
      where: { discordId: discordUserId },
      include: {
        characters: {
          include: {
            realm: true,
            region: true,
            sect: true,
          },
        },
      },
    });

    if (!user || user.characters.length === 0) {
      return interaction.reply({
        content: "Ngươi chưa có nhân vật.",
        flags: MessageFlags.Ephemeral,
      });
    }

    const character = user.characters[0]!;
    if (character.id !== targetId) {
      return interaction.reply({
        content: "Đây không phải nhân vật của ngươi.",
        flags: MessageFlags.Ephemeral,
      });
    }

    await interaction.deferReply({ ephemeral: true });

    try {
      const mode = subAction.toUpperCase();

      if (character.injuryLevel >= 4) {
        return interaction.editReply({
          content: "Trong thuong. Khong the tu luyen.",
        });
      }
      if (character.heartDemon >= 100) {
        return interaction.editReply({
          content: "Tam ma bung phat. Khong the tu luyen.",
        });
      }

      const rng = () => Math.random();

      const modeConfig: Record<string, { multiplier: number; heartDemon: number; riskChance: number; cooldownHours: number }> = {
        STABLE: { multiplier: 0.8, heartDemon: 0, riskChance: 0, cooldownHours: 1 },
        FORCED: { multiplier: 1.5, heartDemon: 8, riskChance: 0.12, cooldownHours: 2 },
        SECLUSION: { multiplier: 3.0, heartDemon: 2, riskChance: 0, cooldownHours: 4 },
        SECT: { multiplier: 1.2, heartDemon: 0, riskChance: 0, cooldownHours: 1 },
      };

      const config = modeConfig[mode];
      if (!config) {
        return interaction.editReply({ content: "Che do khong hop le." });
      }

      const qiMultiplier: Record<string, number> = {
        THANH_VAN_TONG: 1.20, THIEN_Y_DAN_QUOC: 1.20, CHINH_DUONG_TONG: 1.20,
        DAI_VIET: 1.00, TRUNG_NGUYEN: 1.00, TAY_VUC: 1.00, U_MINH: 1.30,
        DONG_HAI: 1.00, BAC_MAC: 0.85, NAM_MAN: 1.00, CON_LON: 1.00,
      };
      const regionMult = qiMultiplier[character.region.id] ?? 1.00;

      const foundationMult = 1 + (character.foundationQuality - 20) / 100;
      const heartDemonPenalty = character.heartDemon < 20 ? 1.00
        : character.heartDemon < 50 ? 0.95
        : character.heartDemon < 80 ? 0.85 : 0.70;

      const hasManual = character.manualId !== null;
      const inSect = character.sectId !== null && mode === "SECT";
      const sectBonus = inSect ? 1.15 : 1.00;
      const manualBonus = hasManual ? 1.10 : 1.00;

      const baseGain = character.realm.pointsPerSubStage;
      let gain = Math.floor(
        baseGain * config.multiplier * regionMult * foundationMult * heartDemonPenalty * manualBonus * sectBonus
      );
      const variance = 0.9 + rng() * 0.2;
      const pointsGained = Math.max(1, Math.floor(gain * variance));

      let heartDemonGained = config.heartDemon;
      if (character.region.id === "U_MINH") heartDemonGained += 2;

      let injury = 0;
      if (mode === "FORCED" && rng() < config.riskChance) injury = 1;

      let stability = 50;
      if (mode === "STABLE") stability += 20;
      else if (mode === "SECLUSION") stability += 30;
      if (character.foundationQuality > 50) stability += 10;
      stability = Math.min(100, stability);

      let spiritStonesGained = 0;
      if (rng() < 0.08 && stability >= 60) {
        spiritStonesGained = 1 + Math.floor(rng() * 5);
      }

      const modeNames: Record<string, string> = {
        STABLE: "On dinh",
        FORCED: "Cuong ep",
        SECLUSION: "Be quan",
        SECT: "Tong mon",
      };

      await prisma.$transaction(async (tx) => {
        await tx.character.update({
          where: { id: character.id },
          data: {
            cultivationPoints: { increment: pointsGained },
            heartDemon: { increment: heartDemonGained },
            lastCultivationAt: new Date(),
          },
        });

        if (injury > 0) {
          await tx.injury.create({
            data: {
              characterId: character.id,
              level: injury,
              type: "NOI_THUONG",
              source: mode,
              expiresAt: new Date(Date.now() + injury * 3 * 86_400_000),
            },
          });
        }

        if (spiritStonesGained > 0) {
          await tx.character.update({
            where: { id: character.id },
            data: { spiritStones: { increment: spiritStonesGained } },
          });
        }

        await tx.cultivationSession.create({
          data: {
            characterId: character.id,
            mode,
            pointsGained,
            heartDemon: heartDemonGained,
            injury,
            spiritStones: spiritStonesGained,
            stability,
          },
        });

        await tx.actionLog.create({
          data: {
            characterId: character.id,
            action: "CULTIVATE",
            details: { mode, points: pointsGained, heartDemon: heartDemonGained, injury, stability },
            publicLog: stability >= 90 && rng() < 0.05,
          },
        });
      });

      const totalPoints = character.realm.pointsPerSubStage * 3;
      const newProgress = Math.round(
        ((character.cultivationPoints + pointsGained) / totalPoints) * 100,
      );
      const progressBar = "#".repeat(Math.floor(newProgress / 10)) + "-".repeat(10 - Math.floor(newProgress / 10));

      const embed = new EmbedBuilder()
        .setTitle("Ket qua tu luyen")
        .setColor(EmbedColors.CULTIVATION)
        .addFields(
          { name: "Che do", value: modeNames[mode] ?? mode, inline: true },
          { name: "Tu vi", value: `+${pointsGained.toLocaleString()}`, inline: true },
          { name: "Tam ma", value: `+${heartDemonGained}`, inline: true },
          {
            name: "Tien do",
            value: `${progressBar} ${newProgress}%\n` +
              `${(character.cultivationPoints + pointsGained).toLocaleString()} / ${totalPoints.toLocaleString()}`,
            inline: false,
          },
        );

      if (injury > 0) {
        embed.addFields({ name: "Chu y", value: `Ban bi thuong cap ${injury}!`, inline: false });
      }

      if (spiritStonesGained > 0) {
        embed.addFields({ name: "Linh thach", value: `+${spiritStonesGained} ST`, inline: false });
      }

      embed.setFooter({ text: `Do on dinh: ${stability}/100` });

      return interaction.editReply({ embeds: [embed], components: [] });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Co loi xay ra";
      return interaction.editReply({ content: `Loi: ${message}`, components: [] });
    }
  }
}
