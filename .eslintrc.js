module.exports = {
  root: true,
  env: {
    node: true
  },
  'extends': [
    'plugin:react/recommended',
    'eslint:recommended'
  ],
  parserOptions: {
    ecmaVersion: 2020
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    
    'no-restricted-globals': [
      'error',
      {
        name: 'location',
        message: 'Don’t use location in production code.',
        except: process.env.NODE_ENV !== 'production' ? ['ngrok.io'] : [],
      },
    ],
  }
}
