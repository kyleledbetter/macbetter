"use client"

import { Button } from "macbetter/button"
import { CheckIcon, CopyIcon } from "lucide-react"
import { useState } from "react"

function CopyButton({ text, className }: { text: string; className?: string }) {
  const [copied, setCopied] = useState(false)
  return (
    <Button
      variant="plain"
      tone="neutral"
      size="sm"
      shape="circle"
      aria-label={copied ? "Copied" : "Copy code"}
      className={className}
      onClick={async () => {
        await navigator.clipboard.writeText(text)
        setCopied(true)
        setTimeout(() => setCopied(false), 1600)
      }}
    >
      {copied ? <CheckIcon aria-hidden="true" /> : <CopyIcon aria-hidden="true" />}
    </Button>
  )
}

export { CopyButton }
