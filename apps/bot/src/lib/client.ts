/**
 * Bot client configuration for @sapphire/framework.
 */
import { SapphireClient } from "@sapphire/framework";
import { BudgetIntelligence, type Logger } from "@sapphire/plugin-logger";
import { URL } from "node:url";

export const client = new SapphireClient({
  loadBuiltinCommands: {
    directory: new URL("../commands", import.meta.url),
  },
  loadContextCommands: true,
  loadMentionPrefix: true,
  defaultPrefix: "!",
  caseInsensitiveCommands: true,
  allowedMentions: {
    parse: ["users", "roles"],
    repliedUser: false,
  },
  intents: [
    "Guilds",
    "GuildMessages",
    "GuildMembers",
    "MessageContent",
    "DirectMessages",
  ],
  logger: new BudgetIntelligence({
    level: process.env.LOG_LEVEL ?? "info",
    instance: {
      name: "Thiên Nam Bot",
      version: "0.1.0",
    },
  }),
  listeners: {
    directory: new URL("../listeners", import.meta.url),
  },
});
