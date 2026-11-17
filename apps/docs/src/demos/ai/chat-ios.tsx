"use client"

import { Chat, ChatContent, ChatScrollButton, ChatViewport } from "macbetter/chat"
import { DeviceFrame } from "macbetter/device-frame"
import { Message, MessageBubble, MessageContent } from "macbetter/message"
import {
  PromptInput,
  PromptInputAdd,
  PromptInputButton,
  PromptInputField,
  PromptInputSubmit,
  PromptInputToolbar,
  PromptInputTools,
} from "macbetter/prompt-input"
import { Response } from "macbetter/response"
import { MicIcon } from "lucide-react"
import type { CSSProperties } from "react"

const turns = [
  { id: 1, from: "user", text: "How long do I boil eggs for jammy yolks?" },
  {
    id: 2,
    from: "assistant",
    text: "Six and a half minutes from a rolling boil, then straight into ice water for two minutes. The whites set and the yolks stay soft in the middle.",
  },
  { id: 3, from: "user", text: "Straight from the fridge?" },
  {
    id: 4,
    from: "assistant",
    text: "Yes. Cold eggs are what the timing assumes. Lower them in gently with a spoon so they don't crack, and add 30 seconds if they're extra large.",
  },
  { id: 5, from: "user", text: "Can I peel them the next day?" },
  {
    id: 6,
    from: "assistant",
    text: "You can. Keep them in their shells in the fridge and peel just before you eat them. Peeling under running water helps the shell slip off.",
  },
] as const

export default function Example() {
  return (
    <DeviceFrame scale={0.78} role="group" aria-label="A conversation on iPhone">
      <Chat style={{ "--mb-chat-inset-bottom": "120px", paddingTop: "var(--mb-safe-top)" } as CSSProperties}>
        <ChatViewport aria-label="Cooking">
          <ChatContent>
            {turns.map((turn) => (
              <Message key={turn.id} from={turn.from}>
                <MessageContent>
                  {turn.from === "user" ? (
                    <MessageBubble>{turn.text}</MessageBubble>
                  ) : (
                    <Response>
                      <p>{turn.text}</p>
                    </Response>
                  )}
                </MessageContent>
              </Message>
            ))}
          </ChatContent>
        </ChatViewport>
        <ChatScrollButton />
        <PromptInput floating>
          <PromptInputField placeholder="Ask anything" />
          <PromptInputToolbar>
            <PromptInputTools>
              <PromptInputAdd />
            </PromptInputTools>
            <PromptInputTools>
              <PromptInputButton aria-label="Dictate">
                <MicIcon aria-hidden="true" />
              </PromptInputButton>
              <PromptInputSubmit />
            </PromptInputTools>
          </PromptInputToolbar>
        </PromptInput>
      </Chat>
    </DeviceFrame>
  )
}
