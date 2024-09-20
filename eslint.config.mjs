import pluginJs from "@eslint/js";
import pluginJest from "eslint-plugin-jest";
import globals from "globals";

export default [
  pluginJs.configs.recommended,
  {
    files: ["**/*.js"],
    ...pluginJest.configs["jest/recommended"],
    languageOptions: {
      sourceType: "commonjs",
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.jest,
      },
    },
  },
];
