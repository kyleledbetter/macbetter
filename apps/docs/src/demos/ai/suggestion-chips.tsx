"use client"

import { Suggestion, Suggestions } from "macbetter/suggestion"
import { useState } from "react"

const followUps = ["Make it shorter", "Add a packing list", "Find vegetarian restaurants", "Turn it into a table", "What if it rains?"]

export default function Example() {
  const [chosen, setChosen] = useState<string | null>(null)
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20, width: "100%", maxWidth: 520 }}>
      <Suggestions aria-label="Follow-up suggestions" layout="chips" onSelect={setChosen}>
        {followUps.map((text) => (
          <Suggestion key={text}>{text}</Suggestion>
        ))}
      </Suggestions>
      <Suggestions aria-label="Follow-up suggestions, one line" layout="chips" overflow="scroll" onSelect={setChosen}>
        {followUps.map((text) => (
          <Suggestion key={text}>{text}</Suggestion>
        ))}
      </Suggestions>
      <p className="mb-text-footnote mb-label-secondary" style={{ margin: 0 }} aria-live="polite">
        {chosen ? `Sends “${chosen}”` : "Choose a chip to send it."}
      </p>
    </div>
  )
}
