/**
 * Thiên Nam Engine — Discord Bot Entry Point
 * Uses @sapphire/framework with slash commands
 */
import "dotenv/config";
import { SapphireClient } from "@sapphire/framework";
import { GatewayIntentBits } from "discord.js";

const token = process.env.DISCORD_TOKEN;
if (!token) {
  console.error("[Bot] DISCORD_TOKEN environment variable is not set");
  process.exit(1);
}

const client = new SapphireClient({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.DirectMessages,
  ],
  loadMessageCommandListeners: false,
});

client.once("ready", () => {
  console.log(`[Bot] Logged in as ${client.user?.tag}`);
});

client.on("warn", (info) => {
  console.warn("[Bot] Warning:", info);
});

client.on("error", (error) => {
  console.error("[Bot] Error:", error);
});

async function main() {
  try {
    await client.login(token);
  } catch (error) {
    console.error("[Bot] Failed to login:", error);
    process.exit(1);
  }
}

main();
