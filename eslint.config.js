import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import pluginReactHooks from "eslint-plugin-react-hooks";
import pluginReactRefresh from "eslint-plugin-react-refresh";

export default [
  { files: ["**/*.{js,mjs,cjs,ts,tsx}"], languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: ['./tsconfig.json', './tsconfig.node.json'],
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    // Configuration for react-related files
    files: ["**/*.{js,mjs,cjs,ts,tsx}"],
    ...pluginReact.configs.recommended,
    settings: {
      react: {
        version: "detect", // Automatically detect the React version
      },
    },
    rules: {
      // suppress errors on missing imports
      "react/react-in-jsx-scope": "off",
      "react/jsx-uses-react": "off",
      'react/prop-types': 'off', // Disable prop-types for functional components
      '@typescript-eslint/no-explicit-any': 'warn', // Allow any for now, but warn
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }], // Warn on unused vars, ignore _ prefixed args
    },
  },
  {
    // Configuration for react-hooks
    files: ["**/*.{js,mjs,cjs,ts,tsx}"],
    ...pluginReactHooks.configs.recommended,
  },
  },
  pluginReactRefresh.configs.recommended,
];
