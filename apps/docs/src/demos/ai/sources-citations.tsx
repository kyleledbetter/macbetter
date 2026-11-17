import { Citation } from "macbetter/sources"

export default function Example() {
  return (
    <div style={{ display: "flex", flexDirection: "column", width: "100%", maxWidth: 560 }}>
      <p style={{ margin: 0, font: "var(--mb-text-body)", lineHeight: 1.55 }}>
        Low tide on Saturday is at 11:40 AM, which leaves the cliff walk open until about 2 PM.
        <Citation
          href="https://tides.example.com/bay"
          site="tides.example.com"
          title="Tide tables for the north bay"
          description="Daily high and low water for the north bay, with sunrise and sunset."
        >
          1
        </Citation>{" "}
        The first ferry back leaves the north pier at 4:15 PM.
        <Citation
          href="https://harbor.example.org/ferry"
          site="harbor.example.org"
          title="Ferry timetable, winter schedule"
          description="Departures from the north and south piers, November through March."
        >
          2
        </Citation>
        <Citation
          href="https://trails.example.com/cliff-walk"
          site="trails.example.com"
          title="Cliff walk: parking and access"
          description="Where to park, which gates close at high tide, and how long each section takes."
        >
          3
        </Citation>
      </p>
    </div>
  )
}
