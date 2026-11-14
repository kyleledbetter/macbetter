"use client"

import { Button } from "macbetter/button"
import { Tooltip, TooltipContent, TooltipShortcut, TooltipTrigger } from "macbetter/tooltip"
import { BoldIcon, ItalicIcon, UnderlineIcon } from "lucide-react"

const styles = [
  { label: "Bold", shortcut: "mod+b", Icon: BoldIcon },
  { label: "Italic", shortcut: "mod+i", Icon: ItalicIcon },
  { label: "Underline", shortcut: "mod+u", Icon: UnderlineIcon },
]

export default function Example() {
  return (
    <div style={{ display: "flex", gap: 4 }}>
      {styles.map(({ label, shortcut, Icon }) => (
        <Tooltip key={label} shortcut={shortcut}>
          <TooltipTrigger render={<Button variant="plain" tone="neutral" shape="circle" aria-label={label} />}>
            <Icon aria-hidden="true" />
          </TooltipTrigger>
          <TooltipContent>
            {label}
            <TooltipShortcut />
          </TooltipContent>
        </Tooltip>
      ))}
    </div>
  )
}
