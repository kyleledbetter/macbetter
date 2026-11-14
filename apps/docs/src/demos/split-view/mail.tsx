import { Sidebar, SidebarItem, SidebarSection } from "@dreambase/stardust/sidebar"
import { SplitView, SplitViewDivider, SplitViewPane } from "@dreambase/stardust/split-view"
import { Window, WindowBody, WindowTitle, WindowTitlebar, WindowTrafficLights } from "@dreambase/stardust/window"
import { ArchiveIcon, FileTextIcon, InboxIcon, SendIcon, Trash2Icon } from "lucide-react"

const mailboxes = [
  { name: "Inbox", icon: InboxIcon, count: 4 },
  { name: "Drafts", icon: FileTextIcon },
  { name: "Sent", icon: SendIcon },
  { name: "Archive", icon: ArchiveIcon },
  { name: "Trash", icon: Trash2Icon },
]

const messages = [
  { from: "Inès Moreau", subject: "Launch checklist", preview: "Everything is green except the App Store screenshots.", time: "9:41 AM", unread: true },
  { from: "Kofi Mensah", subject: "Q3 dashboard", preview: "I added the retention chart you asked for on Friday.", time: "8:12 AM", unread: true },
  { from: "Wren Takahashi", subject: "Re: Offsite", preview: "Thursday works for the whole team. I booked the room.", time: "Yesterday" },
  { from: "Hollis Grant", subject: "Invoice #4189", preview: "Attached is the invoice for the October retainer.", time: "Yesterday" },
]

export default function Example() {
  return (
    <Window aria-label="Mail" style={{ height: 440 }}>
      <WindowTitlebar>
        <WindowTrafficLights />
        <WindowTitle subtitle="4 unread">Inbox</WindowTitle>
      </WindowTitlebar>
      <WindowBody>
        <SplitView>
          <SplitViewPane variant="sidebar" defaultSize="180px" minSize="150px" maxSize="260px" collapsible>
            <Sidebar aria-label="Mailboxes" selection="gray" style={{ height: "100%" }}>
              <SidebarSection>
                {mailboxes.map(({ name, icon: Icon, count }) => (
                  <SidebarItem key={name} href={`#${name.toLowerCase()}`} icon={<Icon />} badge={count} current={name === "Inbox"}>
                    {name}
                  </SidebarItem>
                ))}
              </SidebarSection>
            </Sidebar>
          </SplitViewPane>
          <SplitViewDivider aria-label="Resize mailboxes" />
          <SplitViewPane defaultSize={38} minSize={25}>
            <ul aria-label="Messages" style={{ listStyle: "none", margin: 0, padding: "8px 0" }}>
              {messages.map((message, index) => (
                <li
                  key={message.subject}
                  style={{
                    display: "grid",
                    gap: 2,
                    margin: "0 8px",
                    padding: "10px 12px 10px 18px",
                    borderRadius: "var(--sd-row-radius)",
                    position: "relative",
                    backgroundColor: index === 0 ? "var(--sd-accent)" : undefined,
                    color: index === 0 ? "var(--sd-on-accent)" : undefined,
                    backgroundImage: index === 0 ? undefined : "linear-gradient(var(--sd-separator), var(--sd-separator))",
                    backgroundSize: "calc(100% - 24px) 1px",
                    backgroundPosition: "bottom",
                    backgroundRepeat: "no-repeat",
                  }}
                >
                  <span style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
                    {message.unread ? (
                      <span
                        aria-hidden="true"
                        style={{
                          position: "absolute",
                          left: 6,
                          width: 7,
                          height: 7,
                          borderRadius: 9,
                          background: index === 0 ? "var(--sd-on-accent)" : "var(--sd-accent)",
                        }}
                      />
                    ) : null}
                    <strong className="sd-text-headline">
                      {message.unread ? <span className="sd-visually-hidden">Unread, </span> : null}
                      {message.from}
                    </strong>
                    <span className="sd-text-callout" style={{ opacity: 0.7 }}>{message.time}</span>
                  </span>
                  <span className="sd-text-callout">{message.subject}</span>
                  <span className="sd-text-callout" style={{ opacity: 0.7 }}>{message.preview}</span>
                </li>
              ))}
            </ul>
          </SplitViewPane>
          <SplitViewDivider aria-label="Resize message list" />
          <SplitViewPane minSize={30}>
            <article style={{ padding: "20px 24px", display: "grid", gap: 12 }}>
              <div style={{ display: "grid", gap: 2 }}>
                <span className="sd-text-title-3">Launch checklist</span>
                <span className="sd-text-callout sd-label-secondary">Inès Moreau · To: Design team · 9:41 AM</span>
              </div>
              <p style={{ margin: 0 }}>
                Everything is green except the App Store screenshots. Kofi is reshooting them on the new devices this
                afternoon, so we should be ready to submit tomorrow morning.
              </p>
              <p style={{ margin: 0 }}>Thanks, Inès</p>
            </article>
          </SplitViewPane>
        </SplitView>
      </WindowBody>
    </Window>
  )
}
