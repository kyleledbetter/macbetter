import { Button } from "macbetter/button"
import { Toolbar, ToolbarButton } from "macbetter/toolbar"
import { Window, WindowBody, WindowTitle, WindowTitlebar, WindowTitlebarTrailing } from "macbetter/window"
import { HistoryIcon, MessageSquareIcon, UserPlusIcon } from "lucide-react"

export default function Example() {
  return (
    <Window aria-label="Q3 Launch Plan" style={{ maxWidth: 760, height: 400 }}>
      <WindowTitlebar>
        <WindowTitle align="center" subtitle="Edited 2 minutes ago">
          Q3 Launch Plan
        </WindowTitle>
        <WindowTitlebarTrailing>
          <Toolbar aria-label="Document">
            <ToolbarButton aria-label="Version history">
              <HistoryIcon aria-hidden="true" />
            </ToolbarButton>
            <ToolbarButton aria-label="Comments">
              <MessageSquareIcon aria-hidden="true" />
            </ToolbarButton>
            <Button variant="filled" size="sm">
              <UserPlusIcon aria-hidden="true" />
              Share
            </Button>
          </Toolbar>
        </WindowTitlebarTrailing>
      </WindowTitlebar>
      <WindowBody style={{ background: "var(--mb-bg-secondary)", padding: "24px 16px" }}>
        <article
          style={{
            maxWidth: 520,
            margin: "0 auto",
            padding: "28px 32px",
            borderRadius: 8,
            background: "var(--mb-bg)",
            boxShadow: "var(--mb-shadow-1)",
          }}
        >
          <h1 className="mb-text-title-1" style={{ margin: "0 0 4px" }}>
            Q3 Launch Plan
          </h1>
          <p className="mb-text-subheadline mb-label-secondary" style={{ margin: "0 0 16px" }}>
            Owner: Priya Raman · Launch date: September 18
          </p>
          <p className="mb-text-body" style={{ margin: "0 0 12px" }}>
            We ship the new billing page to every workspace on the 18th. Support gets the help articles a week
            early, and sales gets a recorded walkthrough the Monday before.
          </p>
          <p className="mb-text-body" style={{ margin: 0 }}>
            Open questions: do annual plans get the new invoice layout on day one, and who owns the migration
            email for customers still on the legacy plan?
          </p>
        </article>
      </WindowBody>
    </Window>
  )
}
