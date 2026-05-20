/**
 * Package-level ESLint config for @thien-nam/api.
 * NestJS @Module() decorators legitimately need class references,
 * which @typescript-eslint/consistent-type-imports cannot distinguish
 * from type-only usages. This package-level config overrides the
 * root rule for API source files only.
 */
import rootConfig from "../../eslint.config.mjs";

export default [
  ...rootConfig,
  {
    files: ["src/**/*.ts"],
    rules: {
      // NestJS @Module({ controllers: [X], providers: [Y] }) uses class
      // references as runtime values. TypeScript erases types but
      // @typescript-eslint/consistent-type-imports can't detect this
      // pattern, so we must disable it for this package.
      "@typescript-eslint/consistent-type-imports": "off",
    },
  },
];
