module.exports = {
  root: true,
  env: {
    browser: true,
    node: true
  },
  overrides: [
    {
      files: ["*.vue"],
      processor: "vue/.vue"
    }
  ],
  parserOptions: {
    parser: 'babel-eslint'
  },
  extends: [
    '@nuxtjs',
    'plugin:nuxt/recommended'
  ],
  // add your custom rules here
  rules: {
  }
}
