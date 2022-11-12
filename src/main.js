import "@logseq/libs"

const plugin = await import("../package.json", { assert: { type: "json" } })
  .then(m => m.default)

function main() {
  logseq.App.registerCommandPalette(
    { key: "hypotheseq-version", label: "Show Hypotheseq version" },
    async () => {
      logseq.UI.showMsg(`Hypotheseq v${plugin.version}`)
    },
  )
}

logseq.ready(main).catch(console.error)
