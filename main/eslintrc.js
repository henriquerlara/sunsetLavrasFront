module.exports = {
    root: true,
    env: {
      node: true
    },
    extends: [
      'plugin:vue/vue3-essential',
      'eslint:recommended',
      '@vue/typescript/recommended'
    ],
    parserOptions: {
      ecmaVersion: 2020
    },
    rules: {
      'vue/multi-word-component-names': 'off' // Desativa a regra de nomes de componentes com mais de uma palavra
    }
  }
  