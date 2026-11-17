"use client"

import { Message, MessageAction, MessageActionCopy, MessageActions, MessageActionToggle, MessageBubble, MessageContent, MessageMeta } from "macbetter/message"
import { Response } from "macbetter/response"
import { RotateCcwIcon, ThumbsDownIcon, ThumbsUpIcon, Volume2Icon } from "lucide-react"
import { useState } from "react"

const reply =
  "Leave Lisbon by 9 to beat the traffic on the A5. Sintra’s palaces open at 9:30, and Pena gets busy by 11, so start there and save Quinta da Regaleira for the afternoon."

export default function Example() {
  const [rating, setRating] = useState<"good" | "bad" | null>(null)
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24, width: "100%", maxWidth: 560 }}>
      <Message from="user">
        <MessageContent>
          <MessageBubble>What time should we leave for Sintra on Saturday?</MessageBubble>
        </MessageContent>
      </Message>
      <Message from="assistant">
        <MessageContent>
          <Response>
            <p>{reply}</p>
          </Response>
        </MessageContent>
        <MessageActions>
          <MessageActionCopy text={reply} />
          <MessageAction label="Read aloud">
            <Volume2Icon aria-hidden="true" />
          </MessageAction>
          <MessageActionToggle
            label="Good response"
            pressed={rating === "good"}
            onPressedChange={(pressed) => setRating(pressed ? "good" : null)}
          >
            <ThumbsUpIcon aria-hidden="true" />
          </MessageActionToggle>
          <MessageActionToggle
            label="Bad response"
            pressed={rating === "bad"}
            onPressedChange={(pressed) => setRating(pressed ? "bad" : null)}
          >
            <ThumbsDownIcon aria-hidden="true" />
          </MessageActionToggle>
          <MessageAction label="Try again">
            <RotateCcwIcon aria-hidden="true" />
          </MessageAction>
        </MessageActions>
        <MessageMeta>Atlas 4 · 9:41 AM</MessageMeta>
      </Message>
    </div>
  )
}
