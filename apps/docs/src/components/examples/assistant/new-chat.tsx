"use client"

import { Artwork } from "macbetter/artwork"
import { ChatGreeting } from "macbetter/chat"
import { Suggestion, Suggestions } from "macbetter/suggestion"
import { CalendarClockIcon, PlaneIcon, TrainFrontIcon } from "lucide-react"
import * as React from "react"
import { person, recentOutputs } from "./data"
import { openChat, send } from "./store"

function greeting() {
  return `Good morning, ${person.first}`
}

function StarterSuggestions({ layout }: { layout: "list" | "chips" }) {
  return (
    <Suggestions aria-label="Suggestions" layout={layout} overflow="scroll" onSelect={send}>
      <Suggestion icon={<CalendarClockIcon />}>Find a time for the Q3 review with Jonah and Priya</Suggestion>
      <Suggestion icon={<PlaneIcon />}>Plan a long weekend in Porto in March</Suggestion>
      <Suggestion icon={<TrainFrontIcon />}>Compare the train and a flight from Madrid to Porto</Suggestion>
    </Suggestions>
  )
}

function RecentOutputs() {
  const titleId = React.useId()
  return (
    <section className="ex-ai-outputs" aria-labelledby={titleId}>
      <h2 id={titleId} className="ex-ai-outputs-title">
        Recent outputs
      </h2>
      <ul className="ex-ai-outputs-grid">
        {recentOutputs.map((output) => (
          <li key={output.title}>
            <button type="button" className="ex-ai-output" onClick={() => openChat(output.chat)}>
              <Artwork seed={output.seed} palette={output.palette} aspect={16 / 10} radius="inherit" className="ex-ai-output-art" />
              <span className="ex-ai-output-title">{output.title}</span>
              <span className="ex-ai-output-time">{output.time}</span>
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}

/** The Mac's new chat: a greeting, the large composer, starters and recent outputs. */
function MacNewChat({ composer }: { composer: React.ReactNode }) {
  return (
    <div className="ex-ai-new">
      <ChatGreeting title={greeting()} level={1} className="ex-ai-greeting">
        {composer}
        <StarterSuggestions layout="list" />
      </ChatGreeting>
      <RecentOutputs />
    </div>
  )
}

/** The iPhone's new chat: a greeting with starters, above the floating composer. */
function PhoneNewChat() {
  return (
    <div className="ex-ai-new-phone">
      <ChatGreeting title={greeting()} level={1} className="ex-ai-greeting">
        <StarterSuggestions layout="list" />
      </ChatGreeting>
    </div>
  )
}

export { MacNewChat, PhoneNewChat }
