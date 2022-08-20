// jest.config.js
module.exports = {
  setupFilesAfterEnv: ["./tests/setup_jest.js"],
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
