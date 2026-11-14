"use client"

import { Button } from "macbetter/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "macbetter/tooltip"
import { InfoIcon } from "lucide-react"

export default function Example() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
      <span>Storage</span>
      <Tooltip toggleable>
        <TooltipTrigger render={<Button variant="plain" size="sm" shape="circle" aria-label="About storage" />}>
          <InfoIcon aria-hidden="true" />
        </TooltipTrigger>
        <TooltipContent>Files in the Trash still use storage.</TooltipContent>
      </Tooltip>
      <span style={{ color: "var(--mb-label-secondary)" }}>12.4 of 15 GB used</span>
    </div>
  )
}
