/**
 * Cultivation module for NestJS API.
 */
import { Module } from "@nestjs/common";
import { CultivationController } from "./cultivation.controller.js";
import { CultivationService } from "./cultivation.service.js";
import { CharacterModule } from "../character/character.module.js";

@Module({
  imports: [CharacterModule],
  controllers: [CultivationController],
  providers: [CultivationService],
  exports: [CultivationService],
})
export class CultivationModule {}
