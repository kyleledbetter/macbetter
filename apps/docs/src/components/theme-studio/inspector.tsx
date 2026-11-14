"use client"

import { Button } from "@dreambase/stardust/button"
import { ColorWell } from "@dreambase/stardust/color-well"
import { SegmentedControl, SegmentedControlItem } from "@dreambase/stardust/segmented-control"
import { Select, SelectContent, SelectItem, SelectTrigger } from "@dreambase/stardust/select"
import { Slider } from "@dreambase/stardust/slider"
import { TextField } from "@dreambase/stardust/text-field"
import { Radio, RadioGroup } from "@ui-sdk/react/radio"
import { WandSparklesIcon } from "lucide-react"
import { useEffect, useState } from "react"
import { ColorRow } from "./color-row"
import { ContrastReport } from "./contrast-report"
import { deriveFromAccent, normalizeHex, type ColorKey, type Scheme, type ThemeColors } from "./derive"
import { ExportPanel } from "./export-panel"
import { fontIds, fonts, presets, type FontId, type Preset, type StudioTheme } from "./seeds"

type InspectorProps = {
  theme: StudioTheme
  presetId: string | null
  scheme: Scheme
  onSchemeChange: (scheme: Scheme) => void
  onPreset: (preset: Preset) => void
  /** Any edit by hand: the theme stops matching its preset. */
  onEdit: (theme: StudioTheme) => void
  onReset: () => void
}

const groups: Array<{ title: string; footer?: string; rows: Array<[ColorKey, string]> }> = [
  {
    title: "Brand",
    rows: [
      ["accent", "Accent"],
      ["onAccent", "Text on accent"],
      ["accentText", "Accent as text"],
      ["accentSecondary", "Second accent"],
    ],
  },
  {
    title: "Surfaces",
    footer: "Labels, separators and control edges are mixed from Text. Fills and materials are mixed from Fill tint.",
    rows: [
      ["ink", "Text"],
      ["bg", "Background"],
      ["bgSecondary", "Grouped background"],
      ["bgTertiary", "Grouped cells"],
      ["bgElevated", "Menus and sheets"],
      ["bgSidebar", "Sidebar"],
      ["tint", "Fill tint"],
    ],
  },
  {
    title: "Status",
    rows: [
      ["green", "Green, for success and switches"],
      ["red", "Red, for destructive actions"],
    ],
  },
]

function PresetSwatch({ preset }: { preset: Preset }) {
  const half = (scheme: Scheme) => {
    const c = (key: ColorKey) => preset.colors[key][scheme]
    return (
      <span className="ts-preset-half" style={{ background: c("bg") }}>
        <i style={{ width: "80%", background: c("ink"), opacity: 0.85 }} />
        <i style={{ width: "55%", background: c("ink"), opacity: 0.4 }} />
        <b style={{ background: c("accent"), borderRadius: `${3 * preset.radiusScale}px` }} />
      </span>
    )
  }
  return (
    <span className="ts-preset-swatch" aria-hidden="true">
      {half("light")}
      {half("dark")}
    </span>
  )
}

function Section({
  title,
  aside,
  footer,
  children,
}: {
  title: string
  aside?: React.ReactNode
  footer?: React.ReactNode
  children: React.ReactNode
}) {
  const id = `ts-${title.toLowerCase().replace(/\W+/g, "-")}`
  return (
    <section className="ts-section" aria-labelledby={id}>
      <div className="ts-section-header">
        <h2 id={id} className="ts-section-title">
          {title}
        </h2>
        {aside ? <span className="ts-section-aside">{aside}</span> : null}
      </div>
      {children}
      {footer ? <p className="ts-section-footer">{footer}</p> : null}
    </section>
  )
}

function Inspector({ theme, presetId, scheme, onSchemeChange, onPreset, onEdit, onReset }: InspectorProps) {
  const [seed, setSeed] = useState(theme.colors.accent.light)
  const [seedDraft, setSeedDraft] = useState(seed)
  // A new preset or a shared link moves the starting color with it.
  const accent = theme.colors.accent.light
  useEffect(() => {
    setSeed(accent)
    setSeedDraft(accent)
  }, [accent])

  const setColor = (key: ColorKey, hex: string) =>
    onEdit({ ...theme, colors: { ...theme.colors, [key]: { ...theme.colors[key], [scheme]: hex } } })

  const commitSeed = () => {
    const hex = normalizeHex(seedDraft)
    if (hex) setSeed(hex)
    setSeedDraft(hex ?? seed)
  }

  return (
    <div className="ts-inspector-inner">
      <header className="ts-intro">
        <h1>Theme Studio</h1>
        <p>
          Pick a starting point, then change any seed. The preview is built from real Stardust components, so what
          you see is what ships.
        </p>
      </header>

      <Section title="Presets">
        <RadioGroup
          aria-label="Preset"
          className="ts-presets"
          value={presetId ?? ""}
          onValueChange={(value) => {
            const preset = presets.find((p) => p.id === value)
            if (preset) onPreset(preset)
          }}
        >
          {presets.map((preset) => (
            <Radio key={preset.id} value={preset.id} className="ts-preset" title={preset.description}>
              <PresetSwatch preset={preset} />
              {preset.label}
            </Radio>
          ))}
        </RadioGroup>
      </Section>

      <Section
        title="Start from one color"
        footer="Builds every color seed from this one: text on the accent picked by contrast, the accent darkened or lightened until it reads as text, and neutrals tinted toward its hue."
      >
        <div className="ts-group">
          <div className="ts-row">
            <label htmlFor="ts-seed" className="ts-row-label">
              Brand color
            </label>
            <div className="ts-row-control">
              <TextField
                id="ts-seed"
                size="sm"
                className="ts-hex"
                value={seedDraft}
                spellCheck={false}
                autoComplete="off"
                aria-invalid={normalizeHex(seedDraft) === null || undefined}
                onChange={(event) => setSeedDraft(event.currentTarget.value)}
                onBlur={commitSeed}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    const hex = normalizeHex(seedDraft)
                    if (hex) {
                      setSeed(hex)
                      onEdit({ ...theme, colors: deriveFromAccent(hex) })
                    }
                  }
                }}
              />
              <ColorWell
                aria-label="Brand color"
                size="sm"
                alpha={false}
                side="right"
                align="center"
                value={seed}
                onValueChange={(next) => {
                  const hex = normalizeHex(next)
                  if (hex) {
                    setSeed(hex)
                    setSeedDraft(hex)
                  }
                }}
              />
            </div>
          </div>
          <div className="ts-row">
            <span className="ts-row-label sd-label-secondary">Replaces the colors below</span>
            <Button size="sm" variant="filled" onClick={() => onEdit({ ...theme, colors: deriveFromAccent(seed) })}>
              <WandSparklesIcon aria-hidden="true" />
              Generate
            </Button>
          </div>
        </div>
      </Section>

      <Section title="Colors" footer={`You're editing the ${scheme} appearance. The preview follows.`}>
        <SegmentedControl
          block
          size="sm"
          aria-label="Appearance to edit"
          value={scheme}
          onValueChange={(value) => value && onSchemeChange(value as Scheme)}
        >
          <SegmentedControlItem value="light">Light</SegmentedControlItem>
          <SegmentedControlItem value="dark">Dark</SegmentedControlItem>
        </SegmentedControl>
      </Section>

      {groups.map((group) => (
        <Section key={group.title} title={group.title} footer={group.footer}>
          <div className="ts-group">
            {group.rows.map(([key, label]) => (
              <ColorRow
                key={key}
                label={label}
                value={(theme.colors as ThemeColors)[key][scheme]}
                onChange={(hex) => setColor(key, hex)}
              />
            ))}
          </div>
        </Section>
      ))}

      <Section title="Shape and type">
        <div className="ts-group">
          <div className="ts-row" data-stack="">
            <span id="ts-radius-label" className="ts-row-label">
              Corner radius
            </span>
            <div className="ts-slider-row">
              <Slider
                size="sm"
                min={0.5}
                max={1.6}
                step={0.05}
                value={theme.radiusScale}
                aria-labelledby="ts-radius-label"
                thumbLabel="Corner radius"
                onValueChange={(value) => onEdit({ ...theme, radiusScale: Math.round((value as number) * 100) / 100 })}
              />
              <span className="ts-value" aria-hidden="true">
                {theme.radiusScale.toFixed(2)}×
              </span>
            </div>
          </div>
          <div className="ts-row">
            <span id="ts-font-label" className="ts-row-label">
              Font
            </span>
            <Select
              value={theme.font}
              onValueChange={(value) => value && onEdit({ ...theme, font: value as FontId })}
            >
              <SelectTrigger size="sm" aria-labelledby="ts-font-label" style={{ width: 150 }} />
              <SelectContent>
                {fontIds.map((id) => (
                  <SelectItem
                    key={id}
                    value={id}
                    style={{ fontFamily: fonts[id].display ?? fonts[id].font ?? "var(--sd-font)" }}
                  >
                    {fonts[id].label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </Section>

      <Section title="Name">
        <div className="ts-group">
          <div className="ts-row">
            <label htmlFor="ts-theme-name" className="ts-row-label">
              Theme name
            </label>
            <TextField
              id="ts-theme-name"
              size="sm"
              value={theme.name}
              spellCheck={false}
              autoComplete="off"
              style={{ width: 150 }}
              onChange={(event) => onEdit({ ...theme, name: event.currentTarget.value })}
            />
          </div>
        </div>
      </Section>

      <ContrastReport colors={theme.colors} onChange={(colors) => onEdit({ ...theme, colors })} />

      <ExportPanel theme={theme} onReset={onReset} />
    </div>
  )
}

export { Inspector }
