import { createHighlighter, type Highlighter } from "shiki"

let highlighter: Promise<Highlighter> | undefined

function getHighlighter() {
  highlighter ??= createHighlighter({
    themes: ["github-light", "vesper"],
    langs: ["tsx", "ts", "css", "bash", "html", "json", "jsx", "text"],
  })
  return highlighter
}

async function highlight(code: string, lang = "tsx") {
  const shiki = await getHighlighter()
  const known = shiki.getLoadedLanguages().includes(lang) ? lang : "text"
  return shiki.codeToHtml(code.trimEnd(), {
    lang: known,
    themes: { light: "github-light", dark: "vesper" },
    defaultColor: false,
  })
}

export { highlight }
