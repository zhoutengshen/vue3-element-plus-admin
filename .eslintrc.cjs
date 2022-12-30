/* eslint-disable no-undef */
require('@rushstack/eslint-patch/modern-module-resolution')

module.exports = {
  root: true,

  extends: [
    'plugin:vue/vue3-essential',
    'eslint:recommended',
    '@vue/eslint-config-typescript',
    '@vue/eslint-config-prettier',
  ],
  plugins: ['sort-class-members'],
  parserOptions: {
    ecmaVersion: 'latest',
  },
  rules: {
    'prettier/prettier': [
      2,
      {
        endOfLine: 'lf',
        semi: false,
        singleQuote: true,
        bracketSameLine: true,
        tabWidth: 2,
        trailingComma: 'all',
        bracketSpacing: true,
        arrowParens: 'always',
        printWidth: 120,
      },
    ],
    'sort-class-members/sort-class-members': [
      2,
      {
        order: [
          '[static-properties]',
          '[static-methods]',
          '[properties]',
          '[conventional-private-properties]',
          'constructor',
          '[public-methods]',
          '[private-methods]',
        ],
        groups: {
          'public-methods': [{ type: 'method', private: false }],
          'private-methods': [{ type: 'method', private: true }],
        },
      },
    ],
    'vue/multi-word-component-names': [0],
  },
}
