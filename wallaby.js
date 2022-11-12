export default function() {
  return {
    files: [
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
    },

    workers: { restart: true },
  }
}
