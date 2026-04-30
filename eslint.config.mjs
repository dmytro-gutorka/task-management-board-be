import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import json from '@eslint/json';
import { defineConfig } from 'eslint/config';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import simpleImportSort from 'eslint-plugin-simple-import-sort';

export default defineConfig([
  // ts/js files js rules
  {
    files: ['**/*.{js,mjs,cjs,ts,mts,cts}'],
    plugins: { js },
    extends: ['js/recommended'],
    languageOptions: { globals: globals.node },
    rules: {
      'prettier/prettier': [
        'error',
        {
          singleQuote: true,
          printWidth: 100,
          checkIgnorePragma: true,
        },
      ],
      'no-var': 'error',
      'no-console': 'warn',
      'max-params': ['error', { max: 4 }],
      'default-case': 'error',
      'no-else-return': 'error',
      'no-multi-assign': 'error',
      'no-param-reassign': 'error',
    },
  },

  // TS files typescript rules
  {
    files: ['**/*.{ts,mts,cts}'],
    plugins: { 'typescript-eslint': tseslint },
    extends: ['typescript-eslint/recommendedTypeChecked'],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      '@typescript-eslint/array-type': 'error',
      '@typescript-eslint/prefer-find': 'error',
      '@typescript-eslint/await-thenable': 'error',
      '@typescript-eslint/no-array-delete': 'error',
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unsafe-return': 'error',
      '@typescript-eslint/promise-function-async': 'error',
      '@typescript-eslint/no-empty-object-type': 'off',
      '@typescript-eslint/no-wrapper-object-types': 'error',
      '@typescript-eslint/prefer-reduce-type-parameter': 'error',
      '@typescript-eslint/ban-ts-comment': [
        'error',
        {
          minimumDescriptionLength: 5,
          'ts-check': false,
          'ts-expect-error': 'allow-with-description',
          'ts-ignore': true,
          'ts-nocheck': true,
        },
      ],
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
    },
  },

  // prettier config
  eslintPluginPrettierRecommended,

  // json files
  {
    files: ['**/*.json'],
    plugins: { json },
    language: 'json/json',
    extends: ['json/recommended'],
  },
  {
    files: ['**/*.jsonc', 'tsconfig.json'],
    plugins: { json },
    language: 'json/jsonc',
    extends: ['json/recommended'],
  },

  // sort imports
  {
    files: ['**/*.ts'],
    plugins: { 'simple-import-sort': simpleImportSort },
    rules: {
      'simple-import-sort/exports': 'off',
      'simple-import-sort/imports': [
        'error',
        {
          groups: [
            [
              // External packages
              '^ambient.*',
              'ambient.*',
              '^express',
              'express',
              '^typeorm',
              '^cors',
              '^cookie-parser',
              '^zod',
              '^bcrypt',
              '^jsonwebtoken',
              '^chalk',
              '^node:',

              // App
              '^@app/.*',

              // Infrastructure
              '^@infrastructure/.*',

              // Modules
              '^@modules/.*',

              // Shared
              '^@shared/.*',

              // Types
              '^@types',
              '.*.types\\.js',
              '.*.enum\\.js',

              // Utils
              '^@utils',

              // Validators
              '.*\\.validator\\.js',

              // Schemas
              '.*\\.schema\\.js',

              // Guards
              '.*\\.guard\\.js',

              // Entities
              '.*\\.entity\\.js',

              // Repositories
              '.*\\.repository\\.js',

              // Services
              '.*\\.service\\.js',

              // Controllers
              '.*\\.controller\\.js',

              // Consumers
              '.*\\.consumer\\.js',

              // Middlewares
              '.*\\.middleware\\.js',
              '^@validation-middlewares/.*\\.js',

              // Routers
              '.*\\.router\\.js',

              // Exceptions
              '^@exceptions',
              '.*\\.exception\\.js',

              // Composers
              '.*\\.composer\\.js',
            ],
          ],
        },
      ],
    },
  },
]);
