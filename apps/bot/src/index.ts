/**
 * Thiên Nam Engine — Discord Bot
 * Entry point using @sapphire/framework
 */
import "@sapphire/framework";
import { Container } from "@sapphire/pieces";
import { BudgetIntelligence } from "@sapphire/plugin-logger";

declare module "@sapphire/framework" {
  interface Container {
    db: import("@thien-nam/db").prisma;
  }
}

declare module "payload" {
  // eslint-disable-next-line no-var
  var __ DEV__?: boolean;
}

// @ts-expect-error -- intentional global augmentation
var __DEV__ = process.env.NODE_ENV !== "production";

async function main() {
  // Load environment
  const { error: loadEnvError } = await import("dotenv/config");
  if (loadEnvError && process.env.NODE_ENV !== "production") {
    console.warn("[Env] dotenv not loaded, continuing...");
  }

  // Verify Discord token
  const token = process.env.DISCORD_TOKEN;
  if (!token) {
    throw new Error("DISCORD_TOKEN environment variable is not set");
  }

  // Initialize database
  const { prisma } = await import("@thien-nam/db");
  Container.db = prisma;

  // Boot the bot
  const bot = await Container.client.login(token);
  return bot;
}

main().catch((error) => {
  Container.logger.fatal(error);
  process.exit(1);
});
