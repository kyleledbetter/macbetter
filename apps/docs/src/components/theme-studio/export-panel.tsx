"use client"

import { Button } from "macbetter/button"
import { Tabs, TabsList, TabsPanel, TabsTab } from "macbetter/tabs"
import { CheckIcon, LinkIcon, RotateCcwIcon } from "lucide-react"
import { Fragment, useState } from "react"
import { CopyButton } from "@/components/copy-button"
import { encodeTheme, exportCss, exportTypeScript, slugify, type StudioTheme } from "./seeds"

const token = /(--[a-z0-9-]+|#[0-9a-f]{6}\b|"[^"]*"|[{}();,])/gi

/** Just enough highlighting to read the output: property names, strings, and a dot for each color. */
function Highlighted({ code }: { code: string }) {
  return code.split("\n").map((line, lineIndex) => {
    const parts = line.split(token)
    return (
      <Fragment key={lineIndex}>
        {parts.map((part, index) => {
          if (!part) return null
          if (part.startsWith("--")) return <span key={index} className="ts-tok-prop">{part}</span>
          if (/^#[0-9a-f]{6}$/i.test(part))
            return (
              <Fragment key={index}>
                <span aria-hidden="true" className="ts-code-dot" style={{ background: part }} />
                {part}
              </Fragment>
            )
          if (part.startsWith('"')) {
            const hex = part.slice(1, -1)
            return (
              <Fragment key={index}>
                {/^#[0-9a-f]{6}$/i.test(hex) ? (
                  <span aria-hidden="true" className="ts-code-dot" style={{ background: hex }} />
                ) : null}
                <span className="ts-tok-str">{part}</span>
              </Fragment>
            )
          }
          if (/^[{}();,]$/.test(part)) return <span key={index} className="ts-tok-punct">{part}</span>
          return part
        })}
        {"\n"}
      </Fragment>
    )
  })
}

function CodePanel({ code, label }: { code: string; label: string }) {
  return (
    <div className="ts-code">
      <pre tabIndex={0} aria-label={label}>
        <code>
          <Highlighted code={code} />
        </code>
      </pre>
      <CopyButton text={code} className="ts-code-copy" />
    </div>
  )
}

function ExportPanel({ theme, onReset }: { theme: StudioTheme; onReset: () => void }) {
  const [linked, setLinked] = useState(false)
  const slug = slugify(theme.name)

  return (
    <section className="ts-section" aria-labelledby="ts-export-title">
      <div className="ts-section-header">
        <h2 id="ts-export-title" className="ts-section-title">
          Export
        </h2>
        <span className="ts-section-aside">data-theme=&quot;{slug}&quot;</span>
      </div>
      <Tabs defaultValue="css" variant="plain">
        <TabsList aria-label="Format">
          <TabsTab value="css">CSS</TabsTab>
          <TabsTab value="ts">TypeScript</TabsTab>
        </TabsList>
        <TabsPanel value="css">
          <CodePanel code={exportCss(theme)} label={`${slug}.css`} />
        </TabsPanel>
        <TabsPanel value="ts">
          <CodePanel code={exportTypeScript(theme)} label={`${slug}.ts`} />
        </TabsPanel>
      </Tabs>
      <p className="ts-section-footer">
        Load the CSS after macbetter&apos;s stylesheet and set <code>data-theme</code> on any element. Everything else
        derives from these seeds.
      </p>
      <div className="ts-actions">
        <Button
          size="sm"
          onClick={async () => {
            const url = `${location.origin}${location.pathname}#${encodeTheme(theme)}`
            history.replaceState(null, "", url)
            await navigator.clipboard.writeText(url)
            setLinked(true)
            setTimeout(() => setLinked(false), 1600)
          }}
        >
          {linked ? <CheckIcon aria-hidden="true" /> : <LinkIcon aria-hidden="true" />}
          {linked ? "Link copied" : "Copy link"}
        </Button>
        <Button size="sm" variant="plain" tone="neutral" onClick={onReset}>
          <RotateCcwIcon aria-hidden="true" />
          Start over
        </Button>
      </div>
    </section>
  )
}

export { ExportPanel }
