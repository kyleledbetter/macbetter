"use client"

import { Button } from "macbetter/button"
import { SegmentedControl, SegmentedControlItem } from "macbetter/segmented-control"
import { Switch } from "macbetter/switch"
import { useRef } from "react"
import { useInheritedPlatform } from "./use-platform"

const themes = [
  { id: "ember", name: "Ember", note: "Trinidad on Racing Green" },
  { id: "system", name: "System", note: "Apple blue on true grays" },
  { id: "nebula", name: "Nebula", note: "Violet, rounder corners" },
  { id: "graphite", name: "Graphite", note: "Monochrome, squarer corners" },
] as const

export default function ThemeSwatches() {
  const ref = useRef<HTMLDivElement>(null)
  const platform = useInheritedPlatform(ref)

  return (
    <div ref={ref} className="grid w-full gap-4 [grid-template-columns:repeat(auto-fit,minmax(min(100%,260px),1fr))]">
      {themes.map((theme) => (
        <div
          key={theme.id}
          data-theme={theme.id}
          data-platform={platform}
          data-macbetter=""
          className="flex min-w-0 flex-col gap-4 p-5"
          style={{
            borderRadius: "var(--mb-group-radius)",
            boxShadow: "0 0 0 var(--mb-hairline) var(--mb-separator), var(--mb-shadow-2)",
          }}
        >
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <div className="mb-text-headline">{theme.name}</div>
              <div className="mb-text-footnote mb-label-secondary">{theme.note}</div>
            </div>
            <div className="flex flex-none gap-1" aria-hidden="true">
              {["--mb-accent", "--mb-accent-secondary", "--mb-ink", "--mb-tint"].map((token) => (
                <span
                  key={token}
                  className="size-4 rounded-full"
                  style={{ background: `var(${token})`, boxShadow: "inset 0 0 0 0.5px var(--mb-separator-strong)" }}
                />
              ))}
            </div>
          </div>
          <label className="flex items-center justify-between gap-3">
            Notifications
            <Switch defaultChecked />
          </label>
          <SegmentedControl aria-label={`Sort order, ${theme.name}`} defaultValue="recent" size="sm" block>
            <SegmentedControlItem value="recent">Recent</SegmentedControlItem>
            <SegmentedControlItem value="name">Name</SegmentedControlItem>
            <SegmentedControlItem value="size">Size</SegmentedControlItem>
          </SegmentedControl>
          <div className="flex flex-wrap gap-2">
            <Button variant="filled">Share</Button>
            <Button variant="tinted">Duplicate</Button>
            <Button variant="plain">Edit</Button>
          </div>
        </div>
      ))}
    </div>
  )
}
