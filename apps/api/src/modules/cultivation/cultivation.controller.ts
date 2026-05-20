/**
 * Cultivation REST controller.
 */
import { Controller, Post, Body, Param, BadRequestException } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse } from "@nestjs/swagger";
import { CultivationService } from "./cultivation.service.js";
import { z } from "zod";

const CultivateSchema = z.object({
  mode: z.enum(["STABLE", "FORCED", "SECLUSION", "SECT"]),
});

@ApiTags("cultivation")
@Controller("cultivation")
export class CultivationController {
  public constructor(private readonly cultivationService: CultivationService) {}

  @Post(":characterId")
  @ApiOperation({ summary: "Cultivate a character" })
  @ApiResponse({ status: 200, description: "Cultivation successful" })
  @ApiResponse({ status: 400, description: "Cannot cultivate" })
  async cultivate(
    @Param("characterId") characterId: string,
    @Body() body: z.infer<typeof CultivateSchema>,
  ) {
    const parsed = CultivateSchema.safeParse(body);
    if (!parsed.success) {
      throw new BadRequestException(parsed.error.message);
    }
    return this.cultivationService.cultivate(characterId, parsed.data.mode);
  }
}
