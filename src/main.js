import "@logseq/libs"

import { Annotation } from "./decoders.js"

const plugin = await import("../package.json", { assert: { type: "json" } })
  .then(m => m.default)

function main() {
  logseq.App.registerCommandPalette(
    { key: "hypotheseq-version", label: "Show Hypotheseq version" },
    async () => {
      logseq.UI.showMsg(`Hypotheseq v${plugin.version}`)
    },
  )

  logseq.Editor.registerSlashCommand("Link annotation", async () => {
    window.focus()
    const link = await window.navigator.clipboard.readText()
    await logseq.Editor.insertAtEditingCursor(
      `{{renderer ${link}}}`,
    )
  })

  logseq.App.onMacroRendererSlotted(async ({ payload, slot }) => {
    const [link] = payload.arguments
    const id = /^https:\/\/hyp\.is\/(.+?)\//.exec(link)?.[1]
    if (id) {
      const url = `https://api.hypothes.is/api/annotations/${id}`
      const headers = new Headers({
        Authorization: `Bearer ${HYPOTHESIS_TOKEN}`,
      })

      const data = await fetch(url, { headers })
        .then(result => result.json())
        .then(Annotation.parse)

      const quote = data.target[0].selector.find(s =>
        s.type === "TextQuoteSelector"
      )

      if (quote?.type !== "TextQuoteSelector") {
        throw new Error("No TextQuoteSelector found")
      }

      return logseq.provideUI({
        key: `hypothesis-${id}`,
        slot,
        template:
          `<blockquote style="border-left-color:#BD1C2B"><div class="is-paragraph><span style="user-select:all">${quote.exact.trim()}</span><cite style="font-size:0.75em;white-space:nowrap;float:right;padding-top:0.5em">— <a href=${link}>${
            decodeURI(data.uri)
          }</a></cite></div></blockquote>`,
      })
    }
  })
}

logseq.ready(main).catch(console.error)
