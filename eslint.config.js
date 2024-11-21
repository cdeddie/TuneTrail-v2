import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import pluginVue from "eslint-plugin-vue";

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    files: ["**/*.{js,mjs,cjs,ts,vue}"],
  },
  {
    ignores: ["src/components/ui/**"], // Ignore shadcn components
  },
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        SpotifyApi: "readonly",
        DEV_BASE_URL: "readonly",
        PROD_BASE_URL: "readonly",
      },
    },
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  ...pluginVue.configs["flat/essential"],
  {
    files: ["**/*.vue"],
    languageOptions: {
      parserOptions: {
        parser: tseslint.parser,
      },
    },
    rules: {
      "vue/multi-word-component-names": "off",
      "no-undef": "error",
    },
  },
];
