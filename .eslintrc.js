module.exports = {
  // Specifies the ESLint parser for TypeScript
  parser: '@typescript-eslint/parser',

  // Specifies parser options that ESLint will use to parse the code
  parserOptions: {
    // Points to the tsconfig.json file
    project: 'tsconfig.json',
    // The root directory for the tsconfig.json file
    tsconfigRootDir: __dirname,
    // Sets the source type to module for ECMAScript modules
    sourceType: 'module',
  },

  // Defines the plugins to be used by ESLint
  plugins: ['@typescript-eslint/eslint-plugin'],

  // Extends the list of ESLint configurations with the specified configurations
  extends: [
    'prettier',
    // TypeScript ESLint recommended rules
    'plugin:@typescript-eslint/recommended',
    // Enables eslint-plugin-prettier and displays prettier errors as ESLint errors.
    'plugin:prettier/recommended',
  ],

  // Specifies that the configuration is the root configuration and ESLint should not look further up
  root: true,

  // Defines global variables
  env: {
    node: true, // Defines global variables for Node.js
    jest: true, // Defines global variables for Jest
  },

  // Specifies the files and directories ESLint will ignore
  ignorePatterns: [
    '.eslintrc.js',
    'dist/', // ESLint will ignore files in 'dist' directory
    'node_modules/', // ESLint will ignore files in 'node_modules' directory
    // Add any other paths that you wish ESLint to ignore
  ],

  // Specifies ESLint rules and their configurations
  rules: {
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'warn',
    '@typescript-eslint/explicit-module-boundary-types': 'warn',
    '@typescript-eslint/no-explicit-any': 'warn',
    // Add any other rule configurations you want
  },

  // If you have specific files you would like to apply a different configuration to,
  // you can do so by using the 'overrides' key
  overrides: [
    // Example:
    // {
    //   files: ['*.js'],
    //   rules: {
    //     '@typescript-eslint/no-var-requires': 'off',
    //   },
    // },
  ],
};
