"use client"

import { Suggestion, Suggestions } from "macbetter/suggestion"
import { CalendarDaysIcon, FileTextIcon, LightbulbIcon, MailIcon } from "lucide-react"
import { useState } from "react"

const starters = [
  { text: "Draft a reply to the landlord about the lease renewal", icon: <MailIcon /> },
  { text: "Summarize this week’s meeting notes", icon: <FileTextIcon /> },
  { text: "Plan a long weekend in Porto in March", icon: <CalendarDaysIcon /> },
  { text: "Suggest names for a neighborhood bakery", icon: <LightbulbIcon /> },
]

export default function Example() {
  const [chosen, setChosen] = useState<string | null>(null)
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12, width: "100%", maxWidth: 520 }}>
      <Suggestions aria-label="Suggestions" onSelect={setChosen}>
        {starters.map((starter) => (
          <Suggestion key={starter.text} icon={starter.icon}>
            {starter.text}
          </Suggestion>
        ))}
      </Suggestions>
      <p className="mb-text-footnote mb-label-secondary" style={{ margin: 0 }} aria-live="polite">
        {chosen ? `Sends “${chosen}”` : "Choose a suggestion to send it."}
      </p>
    </div>
  )
}
