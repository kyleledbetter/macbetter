"use client"

import { Button } from "macbetter/button"
import { Menu, MenuContent, MenuGroupLabel, MenuRadioGroup, MenuRadioItem, MenuTrigger } from "macbetter/menu"
import { usePreference } from "@ui-sdk/react/preferences"
import { MoonIcon, SunIcon } from "lucide-react"
import { colorScheme, theme, themeLabels, themes, type ThemeName } from "@/lib/preferences"

function SchemeToggle() {
  const { resolved } = usePreference(colorScheme)
  const next = resolved === "dark" ? "light" : "dark"
  return (
    <Button
      variant="plain"
      tone="neutral"
      shape="circle"
      aria-label={`Switch to ${next} mode`}
      onClick={(event) => colorScheme.set(next, { reason: "press", event: event.nativeEvent })}
    >
      <SunIcon aria-hidden="true" className="hidden [[data-color-scheme=dark]_&]:block" />
      <MoonIcon aria-hidden="true" className="[[data-color-scheme=dark]_&]:hidden" />
    </Button>
  )
}

/** Each theme's accent, as a swatch. Graphite's accent is ink, so it shows both inks. */
const swatches: Record<ThemeName, string> = {
  ember: "linear-gradient(135deg, #f8b16d, #f67f01 55%, #ee5700)",
  system: "linear-gradient(135deg, #3d9bff, #0071e3)",
  nebula: "linear-gradient(135deg, #b9a2ff, #6d3df5)",
  graphite: "linear-gradient(135deg, #f2f2f4 50%, #1f1f23 50%)",
}

function ThemeSwatch({ name }: { name: ThemeName }) {
  return (
    <span
      aria-hidden="true"
      className="inline-block size-3 flex-none rounded-full shadow-[inset_0_0_0_0.5px_rgb(0_0_0/0.25),0_0_0_0.5px_rgb(255_255_255/0.12)]"
      style={{ background: swatches[name] }}
    />
  )
}

function ThemeMenu() {
  const { value } = usePreference(theme)
  const current = (value ?? "ember") as ThemeName
  return (
    <Menu>
      <MenuTrigger
        variant="plain"
        tone="neutral"
        size="md"
        aria-label={`Theme: ${themeLabels[current]}`}
        className="docs-theme-trigger"
      >
        <ThemeSwatch name={current} />
        <span className="hidden lg:inline">{themeLabels[current]}</span>
      </MenuTrigger>
      <MenuContent align="end" className="min-w-[180px]">
        <MenuRadioGroup
          value={current}
          onValueChange={(next, details) => theme.set(next as ThemeName, { reason: "press", event: details.event })}
        >
          <MenuGroupLabel>Theme</MenuGroupLabel>
          {themes.map((name) => (
            <MenuRadioItem key={name} value={name} closeOnSelect>
              <span className="flex items-center gap-2">
                <ThemeSwatch name={name} />
                {themeLabels[name]}
              </span>
            </MenuRadioItem>
          ))}
        </MenuRadioGroup>
      </MenuContent>
    </Menu>
  )
}

export { SchemeToggle, ThemeMenu, ThemeSwatch }
