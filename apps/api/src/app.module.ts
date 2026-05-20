/**
 * NestJS App Module.
 */
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { PrismaModule } from "./modules/prisma/prisma.module.js";
import { CharacterModule } from "./modules/character/character.module.js";
import { CultivationModule } from "./modules/cultivation/cultivation.module.js";
import { SectModule } from "./modules/sect/sect.module.js";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ".env",
    }),
    PrismaModule,
    CharacterModule,
    CultivationModule,
    SectModule,
  ],
})
export class AppModule {}
