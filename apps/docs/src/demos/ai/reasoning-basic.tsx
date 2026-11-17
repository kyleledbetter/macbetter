import { Reasoning, ReasoningContent, ReasoningTrigger } from "macbetter/reasoning"

export default function Example() {
  return (
    <div style={{ display: "flex", flexDirection: "column", width: "100%", maxWidth: 560 }}>
      <Reasoning duration={121} defaultOpen>
        <ReasoningTrigger>Worked for 2m 1s</ReasoningTrigger>
        <ReasoningContent>
          <p>
            The question is whether the Lisbon office can host the offsite in March. I need the room capacity, the
            dates already booked, and the team&apos;s size.
          </p>
          <p>
            The calendar shows the large room free from March 10 to 13. The team list has 26 people, and the room
            seats 30, so it fits with space for two guests.
          </p>
        </ReasoningContent>
      </Reasoning>
    </div>
  )
}
