"use client"

import { MenuItem, MenuItemIcon } from "macbetter/menu"
import { ModelPicker } from "macbetter/model-picker"
import {
  PromptInput,
  PromptInputAdd,
  PromptInputAttachments,
  PromptInputButton,
  PromptInputField,
  type PromptInputStatus,
  PromptInputSubmit,
  PromptInputToolbar,
  PromptInputTools,
} from "macbetter/prompt-input"
import { CameraIcon, FolderIcon, MicIcon } from "lucide-react"
import { useEffect, useRef, useState } from "react"

const models = [
  { value: "atlas-4", label: "Atlas 4", description: "Best for complex, multi-step work" },
  { value: "atlas-4-mini", label: "Atlas 4 Mini", description: "Fastest for everyday questions" },
]
const efforts = [
  { value: "low", label: "Low" },
  { value: "high", label: "High" },
]

export default function Example() {
  const [status, setStatus] = useState<PromptInputStatus>("ready")
  const [sent, setSent] = useState<string | null>(null)
  const timers = useRef<ReturnType<typeof setTimeout>[]>([])
  useEffect(() => () => timers.current.forEach(clearTimeout), [])

  // Stands in for a model: submitted, then streaming, then done.
  function send(text: string) {
    setSent(text)
    setStatus("submitted")
    timers.current = [setTimeout(() => setStatus("streaming"), 700), setTimeout(() => setStatus("ready"), 4200)]
  }
  function stop() {
    timers.current.forEach(clearTimeout)
    setStatus("ready")
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12, width: "100%", maxWidth: 640 }}>
      <PromptInput status={status} glow onSubmit={({ text }) => send(text)} onStop={stop}>
        <PromptInputAttachments />
        <PromptInputField placeholder="Ask anything" />
        <PromptInputToolbar>
          <PromptInputTools>
            <PromptInputAdd>
              <MenuItem value="camera">
                <MenuItemIcon>
                  <CameraIcon aria-hidden="true" />
                </MenuItemIcon>
                Take a photo
              </MenuItem>
              <MenuItem value="project">
                <MenuItemIcon>
                  <FolderIcon aria-hidden="true" />
                </MenuItemIcon>
                Add from a project
              </MenuItem>
            </PromptInputAdd>
          </PromptInputTools>
          <PromptInputTools>
            <ModelPicker models={models} efforts={efforts} defaultEffort="high" />
            <PromptInputButton aria-label="Dictate">
              <MicIcon aria-hidden="true" />
            </PromptInputButton>
            <PromptInputSubmit />
          </PromptInputTools>
        </PromptInputToolbar>
      </PromptInput>
      <p className="mb-text-footnote mb-label-secondary" style={{ margin: 0 }} aria-live="polite">
        {status === "ready" ? (sent ? `Sent “${sent}”` : "Return sends. Shift-Return adds a line.") : "Replying… press Stop to end it."}
      </p>
    </div>
  )
}
