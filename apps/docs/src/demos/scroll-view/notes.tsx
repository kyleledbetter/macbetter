import { ScrollView } from "@dreambase/stardust/scroll-view"

const notes = [
  { version: "26.1", date: "Nov 12", text: "Lists remember their scroll position when you come back from a detail view." },
  { version: "26.0.3", date: "Oct 29", text: "Tables keep their selection when the sort order changes." },
  { version: "26.0.2", date: "Oct 15", text: "Outline views expand every child when you Option-click a disclosure triangle." },
  { version: "26.0.1", date: "Oct 2", text: "Carousels pause rotation while the pointer is over them." },
  { version: "26.0", date: "Sep 15", text: "Overlay scrollbars widen under the pointer and fade once you stop scrolling." },
  { version: "25.4", date: "Aug 20", text: "Disclosure groups animate their height with the system spring." },
  { version: "25.3", date: "Jul 30", text: "Cards use continuous corners where the browser supports them." },
]

export default function Example() {
  return (
    <ScrollView aria-label="Release notes" variant="bordered" style={{ width: "100%", maxWidth: 420, height: 260 }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 14, padding: 16 }}>
        {notes.map((note) => (
          <article key={note.version}>
            <div style={{ display: "flex", justifyContent: "space-between", font: "var(--sd-text-headline)" }}>
              <span>Version {note.version}</span>
              <span style={{ color: "var(--sd-label-secondary)", fontWeight: 400 }}>{note.date}</span>
            </div>
            <div style={{ marginTop: 2, color: "var(--sd-label-secondary)" }}>{note.text}</div>
          </article>
        ))}
      </div>
    </ScrollView>
  )
}
