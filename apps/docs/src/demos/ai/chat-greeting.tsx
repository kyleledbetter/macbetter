"use client"

import { ChatGreeting } from "macbetter/chat"
import { ModelPicker } from "macbetter/model-picker"
import {
  PromptInput,
  PromptInputAdd,
  PromptInputButton,
  PromptInputField,
  PromptInputSubmit,
  PromptInputToolbar,
  PromptInputTools,
} from "macbetter/prompt-input"
import { Suggestion, Suggestions } from "macbetter/suggestion"
import { CalendarDaysIcon, FileTextIcon, MailIcon, MicIcon, SparklesIcon } from "lucide-react"
import { useState } from "react"

const models = [
  { value: "atlas-4", label: "Atlas 4", description: "Best for complex, multi-step work" },
  { value: "atlas-4-mini", label: "Atlas 4 Mini", description: "Fastest for everyday questions" },
]

export default function Example() {
  const [text, setText] = useState("")
  return (
    <ChatGreeting icon={<SparklesIcon />} title="Good morning, Maya" level={2} style={{ paddingBlock: 32 }}>
      <PromptInput size="lg" value={text} onValueChange={setText} onSubmit={() => {}}>
        <PromptInputField placeholder="How can I help you today?" />
        <PromptInputToolbar>
          <PromptInputTools>
            <PromptInputAdd />
          </PromptInputTools>
          <PromptInputTools>
            <ModelPicker models={models} />
            <PromptInputButton aria-label="Dictate">
              <MicIcon aria-hidden="true" />
            </PromptInputButton>
            <PromptInputSubmit />
          </PromptInputTools>
        </PromptInputToolbar>
      </PromptInput>
      <Suggestions aria-label="Suggestions" onSelect={setText}>
        <Suggestion icon={<MailIcon />}>Draft a reply to the landlord about the lease</Suggestion>
        <Suggestion icon={<FileTextIcon />}>Summarize this week’s meeting notes</Suggestion>
        <Suggestion icon={<CalendarDaysIcon />}>Plan a long weekend in Porto</Suggestion>
      </Suggestions>
    </ChatGreeting>
  )
}
