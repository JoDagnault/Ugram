import tsPlugin from '@typescript-eslint/eslint-plugin';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import tsParser from '@typescript-eslint/parser';
import globals from 'globals';

export default [
    {
        files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
        languageOptions: {
            ecmaVersion: 2021,
            sourceType: 'module',
            parser: tsParser,
        },
        plugins: {
            '@typescript-eslint': tsPlugin,
        },
        rules: {
            semi: ['error', 'always'],
            quotes: ['error', 'single', { avoidEscape: true }],
            'no-trailing-spaces': 'error',
            'no-multi-spaces': 'error',
            eqeqeq: ['error', 'always'],
            'no-duplicate-case': 'error',
        },
    },

    {
        files: [
            'frontend/**/*.ts',
            'frontend/**/*.tsx',
            'frontend/**/*.js',
            'frontend/**/*.jsx',
        ],
        languageOptions: {
            globals: {
                ...globals.browser,
            },
        },
        plugins: {
            react: reactPlugin,
            'react-hooks': reactHooksPlugin,
        },
        rules: {
            'no-console': 'warn',
            'no-debugger': 'error',
            'react/jsx-uses-react': 'off',
            'react/react-in-jsx-scope': 'off',
            'react-hooks/rules-of-hooks': 'error',
            'react-hooks/exhaustive-deps': 'warn',
        },
        settings: {
            react: {
                version: 'detect',
            },
        },
    },

    {
        files: ['backend/**/*.ts', 'backend/**/*.js'],
        languageOptions: {
            globals: {
                ...globals.node,
                process: 'readonly',
                console: 'readonly',
                __dirname: 'readonly',
                __filename: 'readonly',
            },
        },
        rules: {
            'no-console': 'off',
            'no-undef': 'off',
            'no-unused-vars': 'off',
            '@typescript-eslint/no-unused-vars': 'warn',
        },
    },

    {
        ignores: [
            '**/node_modules/**',
            '**/dist/**',
            '**/build/**',
            '**/.vite/**',
            'frontend/dist/**',
            'backend/dist/**',
        ],
    },
];
