"use client"

import { Button } from "@dreambase/stardust/button"
import { CheckIcon, XIcon } from "lucide-react"
import { contrastChecks, fixCheck, type ContrastCheck, type ThemeColors } from "./derive"

const hints: Record<ContrastCheck["id"], string> = {
  "on-accent": "Labels on filled buttons",
  "accent-text": "Links and plain buttons",
  ink: "Titles and body text",
  "label-secondary": "Descriptions and values",
  "control-border": "Field and checkbox edges",
}

function Ratio({ check, scheme }: { check: ContrastCheck; scheme: string }) {
  const Icon = check.pass ? CheckIcon : XIcon
  return (
    <span
      className="ts-ratio"
      data-pass={check.pass ? "" : undefined}
      data-fail={check.pass ? undefined : ""}
      title={`${check.fg} on ${check.bg}, needs ${check.target}:1`}
    >
      <Icon aria-hidden="true" strokeWidth={2.6} />
      {check.ratio.toFixed(1)}
      <span className="sd-visually-hidden">
        {` to 1 in ${scheme}, ${check.pass ? "passes" : "falls short of"} ${check.target} to 1`}
      </span>
    </span>
  )
}

function ContrastReport({ colors, onChange }: { colors: ThemeColors; onChange: (colors: ThemeColors) => void }) {
  const light = contrastChecks(colors, "light")
  const dark = contrastChecks(colors, "dark")
  const total = light.length + dark.length
  const failing = [
    ...light.filter((c) => !c.pass).map((c) => ["light", c.id] as const),
    ...dark.filter((c) => !c.pass).map((c) => ["dark", c.id] as const),
  ]

  return (
    <section className="ts-section" aria-labelledby="ts-contrast-title">
      <div className="ts-section-header">
        <h2 id="ts-contrast-title" className="ts-section-title">
          Contrast
        </h2>
        <span className="ts-section-aside" aria-live="polite">
          {failing.length === 0 ? `All ${total} pass` : `${total - failing.length} of ${total} pass`}
        </span>
      </div>
      <div className="ts-group">
        <div className="ts-contrast" role="table" aria-label="Contrast ratios">
          <div className="ts-contrast-head" role="row">
            <span role="columnheader">Pair</span>
            <span role="columnheader">Light</span>
            <span role="columnheader">Dark</span>
          </div>
          {light.map((check, index) => (
            <div key={check.id} className="ts-contrast-row" role="row">
              <span className="ts-contrast-name" role="rowheader">
                <span>
                  {check.label} <span className="sd-label-secondary">· {check.target}:1</span>
                </span>
                <small>{hints[check.id]}</small>
              </span>
              <span className="ts-contrast-cell" role="cell">
                <Ratio check={check} scheme="light" />
              </span>
              <span className="ts-contrast-cell" role="cell">
                <Ratio check={dark[index]!} scheme="dark" />
              </span>
            </div>
          ))}
        </div>
      </div>
      {failing.length > 0 ? (
        <div className="ts-actions">
          <Button
            size="sm"
            variant="tinted"
            onClick={() =>
              onChange(failing.reduce((next, [scheme, id]) => fixCheck(next, scheme, id), colors))
            }
          >
            Fix {failing.length === 1 ? "this pair" : `${failing.length} pairs`}
          </Button>
        </div>
      ) : null}
      <p className="ts-section-footer">
        Text needs 4.5:1 and control edges need 3:1. Secondary text and edges are measured after blending over the
        background.
      </p>
    </section>
  )
}

export { ContrastReport }
