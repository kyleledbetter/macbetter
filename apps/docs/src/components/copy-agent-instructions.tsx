"use client"

import { Button, type ButtonProps } from "macbetter/button"
import { CheckIcon, CopyIcon } from "lucide-react"
import { useState } from "react"
import { agentInstructions } from "@/lib/agent-instructions"

/** Copies a brief that tells a coding agent how to install and set up macbetter. */
function CopyAgentInstructions(props: Omit<ButtonProps, "onClick" | "children">) {
  const [copied, setCopied] = useState(false)
  return (
    <Button
      {...props}
      onClick={async () => {
        await navigator.clipboard.writeText(agentInstructions)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      }}
    >
      {copied ? <CheckIcon aria-hidden="true" /> : <CopyIcon aria-hidden="true" />}
      <span aria-live="polite">{copied ? "Copied" : "Copy agent instructions"}</span>
    </Button>
  )
}

export { CopyAgentInstructions }
