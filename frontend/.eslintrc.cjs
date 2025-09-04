/**
 * Configuración de ESLint
 * ✅ Regla #11: Automatización de calidad
 * ✅ Regla #9: Consistencia y estilo
 */
module.exports = {
  root: true, // Evita que busque configuraciones en directorios padres
  env: {
    browser: true,
    es2021: true,
    jest: true,
    node: true
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'prettier'
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    },
    ecmaVersion: 12,
    sourceType: 'module'
  },
  plugins: ['react', 'react-hooks', 'prettier'],
  rules: {
    // React
    'react/react-in-jsx-scope': 'off',
    'react/prop-types': 'warn',
    'react/jsx-filename-extension': ['warn', { extensions: ['.jsx'] }],
    'react/jsx-props-no-spreading': 'off',
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    
    // General
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    'prefer-const': 'error',
    'no-var': 'error',
    
    // Prettier
    'prettier/prettier': ['error', {
      endOfLine: 'auto'
    }],
    
    // Nomenclatura (Regla #9)
    'camelcase': ['error', { properties: 'never' }],
    'new-cap': ['error', { newIsCap: true, capIsNew: false }]
  },
  settings: {
    react: {
      version: 'detect'
    }
  }
}