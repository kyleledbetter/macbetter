import { DeviceFrame } from "macbetter/device-frame"
import { Toolbar, ToolbarButton, ToolbarSearchField } from "macbetter/toolbar"
import { ListFilterIcon, SquarePenIcon } from "lucide-react"

const messages = [
  { from: "Inès Moreau", subject: "Brand review moved to Thursday", time: "9:12" },
  { from: "Kofi Mensah", subject: "Q3 metrics are in", time: "8:47" },
  { from: "Wren Takahashi", subject: "Offsite photos", time: "Yesterday" },
  { from: "Hollis Grant", subject: "Contract signed", time: "Yesterday" },
  { from: "Macbetter", subject: "Your weekly data digest", time: "Monday" },
  { from: "Ana Lima", subject: "Re: onboarding flow", time: "Sunday" },
]

export default function Example() {
  return (
    <DeviceFrame scale={0.78} role="group" aria-label="Mail on iPhone">
      <div style={{ position: "relative", overflow: "hidden" }}>
        <div style={{ height: "100%", overflowY: "auto", padding: "64px 0 110px" }}>
          <div className="mb-text-large-title" style={{ padding: "0 16px 8px" }}>
            Inbox
          </div>
          {messages.map((message) => (
            <div
              key={message.subject}
              style={{ padding: "10px 16px 10px 0", marginLeft: 16, borderBottom: "0.5px solid var(--mb-separator)" }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
                <span className="mb-text-headline">{message.from}</span>
                <span className="mb-text-subheadline mb-label-secondary">{message.time}</span>
              </div>
              <div className="mb-text-subheadline">{message.subject}</div>
            </div>
          ))}
        </div>
        <Toolbar
          aria-label="Mailbox"
          variant="floating"
          style={{ position: "absolute", insetInline: 16, bottom: 24 }}
        >
          <ToolbarButton aria-label="Filter">
            <ListFilterIcon aria-hidden="true" />
          </ToolbarButton>
          <ToolbarSearchField aria-label="Search mail" />
          <ToolbarButton aria-label="New Message">
            <SquarePenIcon aria-hidden="true" />
          </ToolbarButton>
        </Toolbar>
      </div>
    </DeviceFrame>
  )
}
