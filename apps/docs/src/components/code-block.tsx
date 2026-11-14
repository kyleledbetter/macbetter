import { CopyButton } from "@/components/copy-button"
import { highlight } from "@/lib/highlight"

async function CodeBlock({ code, lang = "tsx", title }: { code: string; lang?: string; title?: string }) {
  const html = await highlight(code, lang)
  return (
    <figure className="docs-code not-prose" data-platform="macos">
      {title ? (
        <figcaption className="flex h-10 items-center border-b border-separator px-4 font-mono text-[12px] text-label-secondary">
          {title}
        </figcaption>
      ) : null}
      <div dangerouslySetInnerHTML={{ __html: html }} />
      <CopyButton text={code.trimEnd()} className="!absolute end-2 top-1.5 backdrop-blur" />
    </figure>
  )
}

export { CodeBlock }
