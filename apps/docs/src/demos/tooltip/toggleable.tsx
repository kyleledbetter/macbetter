import { Button } from "@dreambase/stardust/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@dreambase/stardust/tooltip"
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
      <span style={{ color: "var(--sd-label-secondary)" }}>12.4 of 15 GB used</span>
    </div>
  )
}
