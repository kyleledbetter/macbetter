import { Source, Sources, SourcesContent, SourcesTrigger } from "macbetter/sources"

const sources = [
  { href: "https://tides.example.com/bay", site: "tides.example.com", title: "Tide tables for the north bay" },
  { href: "https://harbor.example.org/ferry", site: "harbor.example.org", title: "Ferry timetable, winter schedule" },
  { href: "https://weather.example.net/coast", site: "weather.example.net", title: "Coastal forecast for the weekend" },
  { href: "https://trails.example.com/cliff-walk", site: "trails.example.com", title: "Cliff walk: parking and access" },
]

export default function Example() {
  return (
    <div style={{ display: "flex", flexDirection: "column", width: "100%", maxWidth: 560 }}>
      <Sources defaultOpen>
        <SourcesTrigger count={sources.length} />
        <SourcesContent>
          {sources.map((source) => (
            <Source key={source.href} href={source.href} site={source.site}>
              {source.title}
            </Source>
          ))}
        </SourcesContent>
      </Sources>
    </div>
  )
}
