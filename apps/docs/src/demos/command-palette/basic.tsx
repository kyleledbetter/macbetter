"use client"

import {
  Command,
  CommandInput,
  CommandPalette,
  CommandPaletteContent,
  CommandPaletteTrigger,
} from "@dreambase/stardust/command-palette"
import { useState } from "react"
import { Results } from "./results"

export default function Example() {
  const [open, setOpen] = useState(false)

  return (
    <CommandPalette open={open} onOpenChange={setOpen}>
      <CommandPaletteTrigger>Search</CommandPaletteTrigger>
      <CommandPaletteContent title="Search apps and actions">
        <Command
          onAction={(value) => {
            console.log(value)
            setOpen(false)
          }}
        >
          <CommandInput aria-label="Search apps and actions" placeholder="Spotlight Search" />
          <Results />
        </Command>
      </CommandPaletteContent>
    </CommandPalette>
  )
}
