"use client"

import { Button } from "@dreambase/stardust/button"
import { useEffect, useRef, useState } from "react"

const tokens = [
  ["--sd-control-height-sm", "Small control"],
  ["--sd-control-height", "Control"],
  ["--sd-control-height-lg", "Large control"],
  ["--sd-row-height", "List row"],
  ["--sd-menu-item-height", "Menu item"],
  ["--sd-hit-target", "Minimum hit target"],
  ["--sd-icon-size", "Icon"],
  ["--sd-bar-height", "Toolbar or navigation bar"],
  ["--sd-content-padding", "Content margin"],
] as const

const heights = { sm: "--sd-control-height-sm", md: "--sd-control-height", lg: "--sd-control-height-lg" }

export default function Metrics() {
  const probe = useRef<HTMLDivElement>(null)
  const [values, setValues] = useState<Record<string, number>>({})

  useEffect(() => {
    const element = probe.current
    const host = element?.closest<HTMLElement>("[data-platform]")
    if (!element || !host) return
    const read = () => {
      const next: Record<string, number> = {}
      for (const [token] of tokens) {
        element.style.width = `var(${token})`
        next[token] = element.getBoundingClientRect().width
      }
      setValues(next)
    }
    read()
    const observer = new MutationObserver(read)
    observer.observe(host, { attributes: true, attributeFilter: ["data-platform"] })
    return () => observer.disconnect()
  }, [])

  return (
    <div className="flex w-full flex-col gap-6">
      <div ref={probe} aria-hidden="true" className="invisible absolute h-0" />
      <div className="docs-table-wrap !my-0">
        <table className="w-full text-[13px]">
          <thead>
            <tr className="text-start text-label">
              <th className="px-3 py-2 text-start font-semibold">Token</th>
              <th className="px-3 py-2 text-start font-semibold">Use</th>
              <th className="px-3 py-2 text-end font-semibold">Value</th>
            </tr>
          </thead>
          <tbody>
            {tokens.map(([token, use]) => (
              <tr key={token} className="border-t border-separator">
                <td className="px-3 py-2">
                  <code className="font-mono text-[12px] whitespace-nowrap text-label">{token}</code>
                </td>
                <td className="px-3 py-2 text-label-secondary">{use}</td>
                <td className="px-3 py-2 text-end font-mono text-[12px] text-label tabular-nums">
                  {values[token] !== undefined ? `${values[token]}px` : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-8">
        {(["sm", "md", "lg"] as const).map((size) => (
          <div key={size} className="flex flex-col items-center gap-2">
            <div className="relative flex items-center justify-center">
              <span
                aria-hidden="true"
                className="pointer-events-none absolute rounded-[6px] border border-dashed border-accent-text"
                style={{
                  insetInline: 0,
                  insetBlock: `calc(min(0px, var(${heights[size]}) - var(--sd-hit-target)) / 2)`,
                }}
              />
              <Button size={size}>Reply</Button>
            </div>
            <span className="font-mono text-[11px] text-label-tertiary">size=&quot;{size}&quot;</span>
          </div>
        ))}
      </div>
    </div>
  )
}
