"use client"

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandGroupLabel,
  CommandInput,
  CommandItem,
  CommandItemIcon,
  CommandList,
  CommandPalette,
  CommandPaletteContent,
  CommandPaletteTrigger,
} from "@dreambase/stardust/command-palette"
import { BookOpenIcon, BoxIcon, PaletteIcon, SwatchBookIcon } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { theme, themeLabels, themes } from "@/lib/preferences"

const pages = [
  { value: "/docs/introduction", label: "Introduction", icon: BookOpenIcon },
  { value: "/docs/installation", label: "Installation", icon: BoxIcon },
  { value: "/docs/theming", label: "Theming", icon: PaletteIcon },
]

function SearchTile() {
  const [open, setOpen] = useState(false)
  const router = useRouter()

  return (
    <div className="lp-tile-search">
      <CommandPalette open={open} onOpenChange={setOpen}>
        <CommandPaletteTrigger shortcut="mod+j">Search docs and themes</CommandPaletteTrigger>
        <CommandPaletteContent title="Search docs and themes">
          <Command
            onAction={(value) => {
              setOpen(false)
              if (value.startsWith("theme:")) theme.set(value.slice(6) as (typeof themes)[number])
              else router.push(value)
            }}
          >
            <CommandInput aria-label="Search docs and themes" placeholder="Search docs and themes" />
            <CommandEmpty>No results</CommandEmpty>
            <CommandList>
              <CommandGroup>
                <CommandGroupLabel>Docs</CommandGroupLabel>
                {pages.map((page) => (
                  <CommandItem key={page.value} value={page.value} label={page.label}>
                    <CommandItemIcon>
                      <page.icon />
                    </CommandItemIcon>
                    {page.label}
                  </CommandItem>
                ))}
              </CommandGroup>
              <CommandGroup>
                <CommandGroupLabel>Switch theme</CommandGroupLabel>
                {themes.map((name) => (
                  <CommandItem key={name} value={`theme:${name}`} label={`${themeLabels[name]} theme`}>
                    <CommandItemIcon>
                      <SwatchBookIcon />
                    </CommandItemIcon>
                    {themeLabels[name]} theme
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </CommandPaletteContent>
      </CommandPalette>
      <p className="lp-tile-hint">Click it, or use its shortcut from anywhere on this page.</p>
    </div>
  )
}

export { SearchTile }
