/**
 * Sect module for NestJS API.
 */
import { Module } from "@nestjs/common";
import { SectController } from "./sect.controller.js";
import { SectService } from "./sect.service.js";

@Module({
  controllers: [SectController],
  providers: [SectService],
  exports: [SectService],
})
export class SectModule {}
