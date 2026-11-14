"use client"

import { Glass } from "macbetter/glass"
import { SegmentedControl, SegmentedControlItem } from "macbetter/segmented-control"
import { usePreference } from "@ui-sdk/react/preferences"
import { MoonIcon, SunIcon } from "lucide-react"
import { colorScheme, theme, themeLabels, themes, type ThemeName } from "@/lib/preferences"

/** The hero's signature control: re-skins the whole page, which is the point. */
function ThemeSwitcher() {
  const { value } = usePreference(theme)
  const { resolved } = usePreference(colorScheme)

  return (
    <Glass shape="capsule" className="lp-switcher" data-platform="macos" role="group" aria-label="Try a theme">
      <span className="lp-switcher-label" aria-hidden="true">
        Theme
      </span>
      <SegmentedControl
        aria-label="Theme"
        value={value}
        onValueChange={(next, details) => next && theme.set(next as ThemeName, details)}
        className="lp-switcher-themes"
      >
        {themes.map((name) => (
          <SegmentedControlItem key={name} value={name}>
            <span aria-hidden="true" className="lp-switcher-swatch" data-theme={name} />
            {themeLabels[name]}
          </SegmentedControlItem>
        ))}
      </SegmentedControl>
      <span aria-hidden="true" className="lp-switcher-divider" />
      <SegmentedControl
        aria-label="Appearance"
        value={resolved}
        onValueChange={(next, details) => next && colorScheme.set(next as "light" | "dark", details)}
        className="lp-switcher-scheme"
      >
        <SegmentedControlItem value="light" aria-label="Light">
          <SunIcon aria-hidden="true" />
        </SegmentedControlItem>
        <SegmentedControlItem value="dark" aria-label="Dark">
          <MoonIcon aria-hidden="true" />
        </SegmentedControlItem>
      </SegmentedControl>
    </Glass>
  )
}

export { ThemeSwitcher }
