"use client"

import { Button } from "macbetter/button"
import { Chat, ChatContent, ChatScrollButton, ChatViewport } from "macbetter/chat"
import { Message, MessageBubble, MessageContent } from "macbetter/message"
import { Response, ResponseCaret } from "macbetter/response"
import { useEffect, useRef, useState } from "react"

const history = [
  { id: 1, from: "user", text: "We land in Porto at 2 on Friday. What should we do first?" },
  {
    id: 2,
    from: "assistant",
    text: "Drop your bags and walk down to the Ribeira. The light on the river is best late in the afternoon, and the cafés along the quay stay open until late.",
  },
  { id: 3, from: "user", text: "Is it worth crossing to Gaia the same day?" },
  {
    id: 4,
    from: "assistant",
    text: "Yes. Walk across the lower deck of the Dom Luís I bridge, then take the cable car up for the view back over the old town. Most port lodges take walk-ins until 6.",
  },
  { id: 5, from: "user", text: "And dinner?" },
] as const

const reply =
  "Book somewhere in Miragaia, a short walk west of the Ribeira and quieter in the evening. Grilled sardines and vinho verde are the classic order. If you'd rather not book, the food stalls at the Mercado do Bolhão stay open until 8 and cover a little of everything. Finish with a walk back along the river once the bridge lights come on."

export default function Example() {
  const [streamed, setStreamed] = useState<string | null>(null)
  const timer = useRef<ReturnType<typeof setInterval>>(undefined)
  useEffect(() => () => clearInterval(timer.current), [])
  const streaming = streamed !== null && streamed.length < reply.length

  function stream() {
    clearInterval(timer.current)
    let length = 0
    setStreamed("")
    timer.current = setInterval(() => {
      length += 4
      setStreamed(reply.slice(0, length))
      if (length >= reply.length) clearInterval(timer.current)
    }, 40)
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12, width: "100%", maxWidth: 640 }}>
      <div style={{ display: "flex", height: 360, borderRadius: 12, background: "var(--mb-bg)", boxShadow: "0 0 0 0.5px var(--mb-separator-strong)" }}>
        <Chat busy={streaming}>
          <ChatViewport aria-label="Trip to Porto">
            <ChatContent>
              {history.map((turn) =>
                turn.from === "user" ? (
                  <Message key={turn.id} from="user">
                    <MessageContent>
                      <MessageBubble>{turn.text}</MessageBubble>
                    </MessageContent>
                  </Message>
                ) : (
                  <Message key={turn.id} from="assistant">
                    <MessageContent>
                      <Response>
                        <p>{turn.text}</p>
                      </Response>
                    </MessageContent>
                  </Message>
                )
              )}
              {streamed !== null ? (
                <Message from="assistant">
                  <MessageContent>
                    <Response streaming={streaming}>
                      <p>
                        {streamed}
                        {streaming ? <ResponseCaret /> : null}
                      </p>
                    </Response>
                  </MessageContent>
                </Message>
              ) : null}
            </ChatContent>
          </ChatViewport>
          <ChatScrollButton />
        </Chat>
      </div>
      <Button onClick={stream} disabled={streaming} style={{ alignSelf: "flex-start" }}>
        Stream the reply
      </Button>
    </div>
  )
}
