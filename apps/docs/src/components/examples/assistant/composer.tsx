"use client"

import { Button } from "macbetter/button"
import { Menu, MenuContent, MenuGroupLabel, MenuItem, MenuItemIcon, MenuRadioGroup, MenuRadioItem, MenuSeparator, MenuTrigger } from "macbetter/menu"
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
import { BookOpenIcon, CameraIcon, EyeOffIcon, FolderIcon, MicIcon, PaperclipIcon, PuzzleIcon } from "lucide-react"
import * as React from "react"
import { efforts, models, projects } from "./data"
import { VoiceIcon } from "./icons"
import { go, send, setDraft, setProject, stop, useAssistant } from "./store"

function AddMenu() {
  return (
    <PromptInputAdd
      onAction={(value) => {
        if (value === "skill") go("skills")
      }}
    >
      <MenuItem value="screenshot">
        <MenuItemIcon>
          <CameraIcon />
        </MenuItemIcon>
        Take a Screenshot
      </MenuItem>
      <MenuSeparator />
      <MenuItem value="skill">
        <MenuItemIcon>
          <BookOpenIcon />
        </MenuItemIcon>
        Use a Skill…
      </MenuItem>
    </PromptInputAdd>
  )
}

function Trailing({ compact }: { compact?: boolean }) {
  return (
    <PromptInputTools>
      <ModelPicker models={models} efforts={efforts} defaultEffort="high" size={compact ? "sm" : "md"} />
      <PromptInputButton aria-label="Dictate">
        <MicIcon aria-hidden="true" />
      </PromptInputButton>
      {compact ? null : (
        <PromptInputButton aria-label="Voice Mode">
          <VoiceIcon aria-hidden="true" />
        </PromptInputButton>
      )}
      <PromptInputSubmit />
    </PromptInputTools>
  )
}

/** The tall composer of a new chat, with context chips attached under it. */
function NewChatComposer({ compact }: { compact?: boolean }) {
  const { draft, status, project } = useAssistant()
  const [temporary, setTemporary] = React.useState(false)
  const chosen = projects.find((entry) => entry.id === project)
  return (
    <PromptInput
      size="lg"
      status={status}
      value={draft}
      onValueChange={setDraft}
      onSubmit={({ text }) => send(text)}
      onStop={stop}
      className="ex-ai-composer-lg"
    >
      <PromptInputAttachments />
      <PromptInputField placeholder="How can I help you today?" />
      <PromptInputToolbar>
        <PromptInputTools>
          <AddMenu />
        </PromptInputTools>
        <Trailing compact={compact} />
      </PromptInputToolbar>
      <PromptInputAccessory>
        <Menu>
          <MenuTrigger variant="plain" tone="neutral" size="sm" className="ex-ai-chip">
            <FolderIcon aria-hidden="true" />
            {chosen ? chosen.name : "Choose project"}
          </MenuTrigger>
          <MenuContent align="start">
            <MenuRadioGroup value={project ?? "none"} onValueChange={(value) => setProject(value === "none" ? null : String(value))}>
              <MenuGroupLabel>Projects</MenuGroupLabel>
              <MenuRadioItem value="none" closeOnSelect>
                No Project
              </MenuRadioItem>
              {projects.map((entry) => (
                <MenuRadioItem key={entry.id} value={entry.id} closeOnSelect>
                  {entry.name}
                </MenuRadioItem>
              ))}
            </MenuRadioGroup>
          </MenuContent>
        </Menu>
        <Button variant="plain" tone="neutral" size="sm" className="ex-ai-chip">
          <PaperclipIcon aria-hidden="true" />
          Files
        </Button>
        <Button variant="plain" tone="neutral" size="sm" className="ex-ai-chip" onClick={() => go("plugins")}>
          <PuzzleIcon aria-hidden="true" />
          Plugins
        </Button>
        <Button
          variant="plain"
          tone={temporary ? "accent" : "neutral"}
          size="sm"
          className="ex-ai-chip"
          aria-pressed={temporary}
          onClick={() => setTemporary(!temporary)}
        >
          <EyeOffIcon aria-hidden="true" />
          Temporary
        </Button>
      </PromptInputAccessory>
    </PromptInput>
  )
}

/** The composer under a conversation. It glows while the reply is on its way. */
function ReplyComposer({
  floating,
  compact,
  placeholder = "Reply to Assistant",
}: {
  floating?: boolean
  compact?: boolean
  placeholder?: string
}) {
  const { draft, status } = useAssistant()
  return (
    <PromptInput
      size="md"
      glow
      floating={floating}
      status={status}
      value={draft}
      onValueChange={setDraft}
      onSubmit={({ text }) => send(text)}
      onStop={stop}
    >
      <PromptInputAttachments />
      <PromptInputField placeholder={placeholder} />
      <PromptInputToolbar>
        <PromptInputTools>
          <AddMenu />
        </PromptInputTools>
        <Trailing compact={compact} />
      </PromptInputToolbar>
    </PromptInput>
  )
}

export { NewChatComposer, ReplyComposer }
