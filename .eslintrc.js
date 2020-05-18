module.exports = {
  env: {
    browser: true,
    es6: true,
    node: true
  },
  extends: [
    'standard',
    "plugin:jest/recommended"
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly'
  },
  parserOptions: {
    ecmaVersion: 11
  },
  rules: {
    semi: [2, "always"],
    quotes: [2, "single"]
  },
  plugins: ["jest"]
}
