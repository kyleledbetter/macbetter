"use client"

import { Chat, ChatContent, ChatGreeting, ChatScrollButton, ChatViewport } from "macbetter/chat"
import {
  Message,
  MessageAction,
  MessageActionCopy,
  MessageActions,
  MessageBubble,
  MessageContent,
  MessageMeta,
} from "macbetter/message"
import { ModelPicker } from "macbetter/model-picker"
import {
  PromptInput,
  PromptInputAdd,
  PromptInputButton,
  PromptInputField,
  type PromptInputStatus,
  PromptInputSubmit,
  PromptInputToolbar,
  PromptInputTools,
} from "macbetter/prompt-input"
import { Suggestion, Suggestions } from "macbetter/suggestion"
import { CalendarDaysIcon, MailIcon, MicIcon, RotateCcwIcon, SparklesIcon, UtensilsIcon } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { Markdown } from "@/components/ai/markdown"

type Turn = { id: number; from: "user" | "assistant"; text: string }

const models = [
  { value: "atlas-4", label: "Atlas 4", description: "Best for complex, multi-step work" },
  { value: "atlas-4-mini", label: "Atlas 4 Mini", description: "Fastest for everyday questions" },
]

// A canned reply stands in for the model, so the demo needs no API key.
const script = `Here's a plan for **a long weekend in Porto**.

## Friday

1. Check in near São Bento and walk down to the Ribeira.
2. Cross the lower deck of the Dom Luís I bridge to Gaia.
3. Dinner in Miragaia: grilled sardines and vinho verde.

## Saturday

- Morning at the Mercado do Bolhão.
- Afternoon tram to the beach at Foz.

| Day | Walking | Budget |
| --- | --- | --- |
| Friday | 6 km | €70 |
| Saturday | 9 km | €85 |

Want me to turn this into a calendar?`

export default function Example() {
  const [turns, setTurns] = useState<Turn[]>([])
  const [status, setStatus] = useState<PromptInputStatus>("ready")
  const [text, setText] = useState("")
  const timer = useRef<ReturnType<typeof setInterval>>(undefined)
  useEffect(() => () => clearInterval(timer.current), [])

  function send(prompt: string) {
    const id = Date.now()
    setTurns((current) => [...current, { id, from: "user", text: prompt }, { id: id + 1, from: "assistant", text: "" }])
    setStatus("submitted")
    let length = 0
    clearInterval(timer.current)
    timer.current = setInterval(() => {
      length += 6
      setStatus(length >= script.length ? "ready" : "streaming")
      setTurns((current) =>
        current.map((turn) => (turn.id === id + 1 ? { ...turn, text: script.slice(0, length) } : turn))
      )
      if (length >= script.length) clearInterval(timer.current)
    }, 40)
  }

  function stop() {
    clearInterval(timer.current)
    setStatus("ready")
  }

  const busy = status === "submitted" || status === "streaming"
  const composer = (
    <PromptInput
      size={turns.length ? "md" : "lg"}
      status={status}
      glow
      value={text}
      onValueChange={setText}
      onSubmit={({ text: prompt }) => send(prompt)}
      onStop={stop}
    >
      <PromptInputField placeholder={turns.length ? "Reply" : "How can I help you today?"} />
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
  )

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        maxWidth: 860,
        height: 600,
        overflow: "hidden",
        borderRadius: 12,
        background: "var(--mb-bg)",
        boxShadow: "0 0 0 0.5px var(--mb-separator-strong)",
      }}
    >
      {turns.length === 0 ? (
        <div style={{ display: "flex", flex: 1, alignItems: "center" }}>
          <ChatGreeting icon={<SparklesIcon />} title="Good morning, Maya" level={2}>
            {composer}
            <Suggestions aria-label="Suggestions" onSelect={send}>
              <Suggestion icon={<CalendarDaysIcon />}>Plan a long weekend in Porto</Suggestion>
              <Suggestion icon={<UtensilsIcon />}>Find a dinner spot near the river</Suggestion>
              <Suggestion icon={<MailIcon />}>Draft a note to the hotel about a late check-in</Suggestion>
            </Suggestions>
          </ChatGreeting>
        </div>
      ) : (
        <>
          <Chat busy={busy}>
            <ChatViewport aria-label="Weekend in Porto">
              <ChatContent>
                {turns.map((turn, index) =>
                  turn.from === "user" ? (
                    <Message key={turn.id} from="user">
                      <MessageContent>
                        <MessageBubble>{turn.text}</MessageBubble>
                      </MessageContent>
                    </Message>
                  ) : (
                    <Message key={turn.id} from="assistant">
                      <MessageContent>
                        <Markdown streaming={busy && index === turns.length - 1}>{turn.text}</Markdown>
                      </MessageContent>
                      {busy && index === turns.length - 1 ? null : (
                        <>
                          <MessageActions>
                            <MessageActionCopy text={turn.text} />
                            <MessageAction label="Try again" onClick={() => send(turns[index - 1]?.text ?? "")}>
                              <RotateCcwIcon aria-hidden="true" />
                            </MessageAction>
                          </MessageActions>
                          <MessageMeta>Atlas 4</MessageMeta>
                        </>
                      )}
                    </Message>
                  )
                )}
              </ChatContent>
            </ChatViewport>
            <ChatScrollButton />
          </Chat>
          <div style={{ width: "100%", maxWidth: 768, margin: "0 auto", padding: "0 24px 20px", boxSizing: "border-box" }}>
            {composer}
          </div>
        </>
      )}
    </div>
  )
}
