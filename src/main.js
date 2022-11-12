import "@logseq/libs"

function main() {
  logseq.UI.showMsg("Hello from Hypotheseq")
}

logseq.ready(main).catch(console.error)
