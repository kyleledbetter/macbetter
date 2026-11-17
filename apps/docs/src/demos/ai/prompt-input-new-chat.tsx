"use client"

import { Button } from "macbetter/button"
import { ModelPicker } from "macbetter/model-picker"
import {
  PromptInput,
  PromptInputAccessory,
  PromptInputAdd,
  PromptInputAttachments,
  PromptInputButton,
  PromptInputField,
  PromptInputSubmit,
  PromptInputToolbar,
  PromptInputTools,
} from "macbetter/prompt-input"
import { AudioLinesIcon, FolderIcon, MicIcon, PaperclipIcon, PuzzleIcon } from "lucide-react"

const models = [
  { value: "atlas-4", label: "Atlas 4", description: "Best for complex, multi-step work" },
  { value: "atlas-4-mini", label: "Atlas 4 Mini", description: "Fastest for everyday questions" },
]
const efforts = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
]

export default function Example() {
  return (
    <PromptInput size="lg" style={{ maxWidth: 680 }}>
      <PromptInputAttachments />
      <PromptInputField placeholder="How can I help you today?" />
      <PromptInputToolbar>
        <PromptInputTools>
          <PromptInputAdd />
        </PromptInputTools>
        <PromptInputTools>
          <ModelPicker models={models} efforts={efforts} defaultEffort="medium" />
          <PromptInputButton aria-label="Dictate">
            <MicIcon aria-hidden="true" />
          </PromptInputButton>
          <PromptInputButton aria-label="Voice mode">
            <AudioLinesIcon aria-hidden="true" />
          </PromptInputButton>
          <PromptInputSubmit />
        </PromptInputTools>
      </PromptInputToolbar>
      <PromptInputAccessory>
        <Button variant="plain" tone="neutral" size="sm">
          <FolderIcon aria-hidden="true" />
          Choose project
        </Button>
        <Button variant="plain" tone="neutral" size="sm">
          <PaperclipIcon aria-hidden="true" />
          Files
        </Button>
        <Button variant="plain" tone="neutral" size="sm">
          <PuzzleIcon aria-hidden="true" />
          Plugins
        </Button>
        <Button variant="plain" tone="neutral" size="sm">
          Work locally
        </Button>
      </PromptInputAccessory>
    </PromptInput>
  )
}
