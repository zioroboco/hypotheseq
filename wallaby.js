export default function() {
  return {
    files: [
      { pattern: ".env", instrument: false },
      "package.json",
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

    setup: function() {
      require("dotenv").config()
    },

    testFramework: "mocha",
    symlinkNodeModules: true,
    workers: { restart: true },
    runMode: "onsave",
  }
}
