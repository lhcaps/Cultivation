/**
 * Interaction handlers — button clicks for cultivation.
 * Delegates to core game engine for all game logic.
 */
import { Listener } from "@sapphire/framework";
import { type ButtonInteraction, EmbedBuilder } from "discord.js";
import { prisma } from "@thien-nam/db";
import { resolveCultivation, canCultivate, type Rng } from "@thien-nam/core/rules";
import type { CultivationMode, CharacterState } from "@thien-nam/core/types/index.js";
import { EmbedColors } from "../utils/interaction.js";

export class ButtonInteractionListener extends Listener {
  public constructor(context: Listener.Context, options: Listener.Options) {
    super(context, {
      ...options,
      event: "interactionCreate",
    });
  }

  public override async run(interaction: ButtonInteraction) {
    if (!interaction.isButton()) return;

    if (!interaction.customId.startsWith("cultivate:")) return;

    await interaction.deferReply({ ephemeral: true });

    const parts = interaction.customId.split(":");
    if (parts.length < 3) {
      return interaction.editReply({ content: "Custom ID khong hop le." });
    }

    const targetId = parts[2]!;
    const rawMode = parts[1]!.toUpperCase();
    if (rawMode !== "STABLE" && rawMode !== "FORCED" && rawMode !== "SECLUSION" && rawMode !== "SECT") {
      return interaction.editReply({ content: "Che do khong hop le." });
    }
    const mode = rawMode as CultivationMode;

    const discordUserId = interaction.user.id;

    // Verify Discord user owns this character
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
      return interaction.editReply({
        content: "Ngươi chưa có nhân vật.",
      });
    }

    const character = user.characters[0]!;
    if (character.id !== targetId) {
      return interaction.editReply({
        content: "Đây không phải nhân vật của ngươi.",
      });
    }

    try {
      // Build CharacterState from Prisma data
      const characterState = {
        id: character.id,
        discordUserId,
        name: character.name,
        realm: character.realmId as CharacterState["realm"],
        subStage: character.subStage as CharacterState["subStage"],
        cultivationPoints: character.cultivationPoints,
        foundationQuality: character.foundationQuality,
        heartDemon: character.heartDemon,
        injuryLevel: character.injuryLevel as CharacterState["injuryLevel"],
        region: character.regionId as CharacterState["region"],
        sectId: character.sectId,
        manualId: character.manualId,
        currentHp: character.currentHp,
        maxHp: character.maxHp,
        currentQi: character.currentQi,
        maxQi: character.maxQi,
        silver: character.silver,
        spiritStones: character.spiritStones,
        merit: character.merit,
        reputation: character.reputation,
        heavenSeals: character.heavenSeals,
        luck: character.luck,
        element: character.element as CharacterState["element"],
        lastCultivationAt: character.lastCultivationAt,
        lastHeartDemonAt: character.lastHeartDemonAt,
      };

      // Delegate blocking checks to core
      canCultivate(characterState, mode);

      // Delegate game logic to core with injected RNG
      const rng: Rng = { next: Math.random };
      const result = resolveCultivation(characterState, mode, null, rng);

      // Persist all changes atomically
      await prisma.$transaction(async (tx) => {
        // Update character stats
        await tx.character.update({
          where: { id: character.id },
          data: {
            cultivationPoints: { increment: result.pointsGained },
            heartDemon: { increment: result.heartDemonGained },
            lastCultivationAt: new Date(),
            ...(result.injury > 0 ? { injuryLevel: { increment: result.injury } } : {}),
          },
        });

        // Create injury record if any
        if (result.injury > 0) {
          await tx.injury.create({
            data: {
              characterId: character.id,
              level: result.injury,
              type: "NOI_THUONG",
              source: mode,
              expiresAt: new Date(Date.now() + result.injury * 3 * 86_400_000),
            },
          });
        }

        // Award spirit stones if any
        if (result.spiritStonesGained > 0) {
          await tx.character.update({
            where: { id: character.id },
            data: { spiritStones: { increment: result.spiritStonesGained } },
          });
        }

        // Record cultivation session
        await tx.cultivationSession.create({
          data: {
            characterId: character.id,
            mode,
            pointsGained: result.pointsGained,
            heartDemon: result.heartDemonGained,
            injury: result.injury,
            spiritStones: result.spiritStonesGained,
            stability: result.stability,
          },
        });

        // Audit log — always written
        await tx.actionLog.create({
          data: {
            characterId: character.id,
            action: "CULTIVATE",
            details: {
              mode,
              points: result.pointsGained,
              heartDemon: result.heartDemonGained,
              injury: result.injury,
              stability: result.stability,
              publicLog: result.shouldPublicLog,
            },
            publicLog: result.shouldPublicLog,
          },
        });
      });

      // Build response embed
      const totalPoints = character.realm.pointsPerSubStage * 3;
      const newProgress = Math.round(
        ((character.cultivationPoints + result.pointsGained) / totalPoints) * 100,
      );
      const progressBar =
        "#".repeat(Math.floor(newProgress / 10)) +
        "-".repeat(10 - Math.floor(newProgress / 10));

      const modeNames: Record<string, string> = {
        STABLE: "On dinh",
        FORCED: "Cuong ep",
        SECLUSION: "Be quan",
        SECT: "Tong mon",
      };

      const embed = new EmbedBuilder()
        .setTitle("Ket qua tu luyen")
        .setColor(EmbedColors.CULTIVATION)
        .addFields(
          { name: "Che do", value: modeNames[mode] ?? mode, inline: true },
          { name: "Tu vi", value: `+${result.pointsGained.toLocaleString()}`, inline: true },
          { name: "Tam ma", value: `+${result.heartDemonGained}`, inline: true },
          {
            name: "Tien do",
            value:
              `${progressBar} ${newProgress}%\n` +
              `${(character.cultivationPoints + result.pointsGained).toLocaleString()} / ${totalPoints.toLocaleString()}`,
            inline: false,
          },
        );

      if (result.injury > 0) {
        embed.addFields({
          name: "Chu y",
          value: `Ban bi thuong cap ${result.injury}!`,
          inline: false,
        });
      }

      if (result.spiritStonesGained > 0) {
        embed.addFields({
          name: "Linh thach",
          value: `+${result.spiritStonesGained} ST`,
          inline: false,
        });
      }

      if (result.shouldPublicLog && result.publicLogMessage) {
        embed.setDescription(result.publicLogMessage);
      }

      embed.setFooter({ text: `Do on dinh: ${result.stability}/100` });

      return interaction.editReply({ embeds: [embed], components: [] });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Co loi xay ra";
      return interaction.editReply({ content: `Loi: ${message}`, components: [] });
    }
  }
}
