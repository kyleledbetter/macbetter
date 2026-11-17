import { CodeBlock, CodeBlockContent, CodeBlockCopy } from "macbetter/code-block"

const install = "npm install macbetter"

const log = `2026-06-03T09:41:12.204Z  info  sync   Pulled 128 changes from the shared calendar in 1.8 seconds
2026-06-03T09:41:13.019Z  warn   sync   Skipped 2 events with no start time: "Lantern walk planning", "Volunteer check-in"
2026-06-03T09:41:13.402Z  info   sync   Next sync in 15 minutes
2026-06-03T09:56:13.388Z  info   sync   Pulled 3 changes from the shared calendar in 0.4 seconds
2026-06-03T10:11:13.391Z  info   sync   No changes
2026-06-03T10:26:13.402Z  error  sync   The server took too long to respond; retrying in 30 seconds
2026-06-03T10:26:43.877Z  info   sync   Pulled 1 change from the shared calendar in 0.6 seconds`

export default function Example() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, width: "100%", maxWidth: 560 }}>
      <CodeBlock>
        <CodeBlockCopy />
        <CodeBlockContent>{install}</CodeBlockContent>
      </CodeBlock>
      <CodeBlock wrap lineNumbers maxHeight={150}>
        <CodeBlockContent aria-label="Sync log">{log}</CodeBlockContent>
      </CodeBlock>
    </div>
  )
}
