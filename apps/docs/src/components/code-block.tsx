import { CopyButton } from "@/components/copy-button"
import { highlight } from "@/lib/highlight"

async function CodeBlock({ code, lang = "tsx", title }: { code: string; lang?: string; title?: string }) {
  const html = await highlight(code, lang)
  return (
    <figure className="docs-code not-prose" data-platform="macos">
      {title ? (
        <figcaption className="docs-code-title">
          {title}
        </figcaption>
      ) : null}
      <div dangerouslySetInnerHTML={{ __html: html }} />
      <CopyButton text={code.trimEnd()} className="!absolute end-2 top-1.5 backdrop-blur" />
    </figure>
  )
}

export { CodeBlock }
