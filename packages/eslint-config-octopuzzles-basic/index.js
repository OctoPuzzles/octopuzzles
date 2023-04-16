module.exports = {
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'turbo', 'prettier'],
  plugins: ['import'],
  rules: {
    'no-console': 'warn',
    'no-nested-ternary': 'error',
    'no-await-in-loop': 'warn',
    'no-const-assign': 'warn',
    'import/no-duplicates': 'error',
    'no-var': 'error',
    'prefer-const': 'error',
    eqeqeq: ['error', 'always', { null: 'never' }],
    '@typescript-eslint/no-non-null-assertion': 'error',
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': 'error',
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/no-for-in-array': 'error',
    '@typescript-eslint/strict-boolean-expressions': 'error',
    'no-return-await': 'warn',
    '@typescript-eslint/explicit-function-return-type': [
      'error',
      {
        allowExpressions: true,
        allowTypedFunctionExpressions: true,
        allowHigherOrderFunctions: true
      }
    ],
    '@typescript-eslint/consistent-type-imports': 'error'
  }
};
