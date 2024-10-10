import globals from "globals";
import pluginJs from "@eslint/js";
import prettierPlugin from "eslint-plugin-prettier";
import prettierConfig from "eslint-config-prettier";

export default [
  {
    // Definindo o ambiente para permitir as variáveis globais do navegador
    languageOptions: {
      globals: {
        ...globals.browser,
      },
    },
  },
  // Configuração recomendada do ESLint para JavaScript
  pluginJs.configs.recommended,
  // Configuração recomendada do Prettier para prevenir conflitos de formatação
  prettierConfig,
  {
    // Plugins e regras personalizadas
    plugins: {
      prettier: prettierPlugin,
    },
    rules: {
      // Regras ESLint personalizadas
      "no-unused-vars": "warn", // Aviso para variáveis não usadas
    },
  },
];
