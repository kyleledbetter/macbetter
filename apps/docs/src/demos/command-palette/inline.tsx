"use client"

import { Command, CommandInput } from "@dreambase/stardust/command-palette"
import { Results } from "./results"

export default function Example() {
  return (
    <div style={{ width: "min(560px, 100%)" }}>
      <Command onAction={(value) => console.log(value)}>
        <CommandInput aria-label="Search apps and actions" placeholder="Search apps and actions" />
        <Results />
      </Command>
    </div>
  )
}
