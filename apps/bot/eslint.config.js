/**
 * Package-level ESLint config for @thien-nam/bot.
 * Extends root config with package-specific overrides.
 */
import rootConfig from "../../eslint.config.mjs";

export default [
  ...rootConfig,
  {
    ignores: ["dist/**", "node_modules/**"],
  },
];
