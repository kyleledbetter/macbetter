import { Tabs, TabsList, TabsPanel, TabsTab } from "macbetter/tabs"

const rows = {
  general: [
    ["Show scroll bars", "When scrolling"],
    ["Click in the scroll bar to", "Jump to the next page"],
    ["Default web browser", "Safari"],
  ],
  sharing: [
    ["Computer name", "Kyle’s MacBook Pro"],
    ["File Sharing", "On"],
    ["Screen Sharing", "Off"],
  ],
  network: [
    ["Wi-Fi", "Connected to Macbetter"],
    ["IP address", "192.168.1.24"],
    ["Firewall", "Active"],
  ],
} as const

export default function Example() {
  return (
    <Tabs defaultValue="general" style={{ width: "100%", maxWidth: 460 }}>
      <TabsList aria-label="Settings">
        <TabsTab value="general">General</TabsTab>
        <TabsTab value="sharing">Sharing</TabsTab>
        <TabsTab value="network">Network</TabsTab>
      </TabsList>
      {(Object.keys(rows) as (keyof typeof rows)[]).map((key) => (
        <TabsPanel key={key} value={key}>
          <dl style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: "10px 16px", margin: 0 }}>
            {rows[key].map(([label, value]) => (
              <div key={label} style={{ display: "contents" }}>
                <dt className="mb-label-secondary" style={{ textAlign: "end" }}>{label}:</dt>
                <dd style={{ margin: 0 }}>{value}</dd>
              </div>
            ))}
          </dl>
        </TabsPanel>
      ))}
    </Tabs>
  )
}
