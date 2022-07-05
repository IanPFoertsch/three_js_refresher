// jest.config.js
module.exports = {

  moduleFileExtensions: [
    'js',
    // 'ts',
    'json',
  ],
  testEnvironment: "jsdom",
  // transform: {},
  transformIgnorePatterns: [
    // Required due to errors: "SyntaxError: Cannot use import statement outside a module"
    // source: https://stackoverflow.com/a/68193471
    "node_modules/(?!three/.*)"
  ]
}
