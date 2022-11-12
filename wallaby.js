export default function() {
  return {
    files: [
      "package.json",
      "tsconfig.json",
      "src/**/*.js",
      "!src/main.js",
      "!src/**/*.spec.js",
    ],

    tests: [
      "src/**/*.spec.js",
    ],

    env: {
      type: "node",
      runner: "node",
      params: {
        runner: "--no-warnings",
      },
    },

    testFramework: "mocha",
    symlinkNodeModules: true,
    workers: { restart: true },
  }
}
