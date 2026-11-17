"use client"

import { CodeBlock, CodeBlockContent } from "macbetter/code-block"
import {
  ToolActivity,
  ToolActivityContent,
  ToolActivitySummary,
  ToolCall,
  ToolCallDetail,
  ToolCallSection,
  ToolCallTitle,
} from "macbetter/tool-call"
import { WrenchIcon } from "lucide-react"

export default function Example() {
  return (
    <div style={{ display: "flex", flexDirection: "column", width: "100%", maxWidth: 560 }}>
      <ToolActivity defaultOpen>
        <ToolActivitySummary icon={<WrenchIcon />} active>
          Running 4 steps
        </ToolActivitySummary>
        <ToolActivityContent>
          <ToolCall status="done">
            <ToolCallTitle verb="Read">q3-forecast.csv</ToolCallTitle>
          </ToolCall>
          <ToolCall status="error">
            <ToolCallTitle verb="Queried">billing.invoices_2023</ToolCallTitle>
            <ToolCallDetail>
              <ToolCallSection title="Response">
                <CodeBlock>
                  <CodeBlockContent>{`relation "billing.invoices_2023" does not exist`}</CodeBlockContent>
                </CodeBlock>
              </ToolCallSection>
            </ToolCallDetail>
          </ToolCall>
          <ToolCall status="running">
            <ToolCallTitle verb="Queried">billing.invoices</ToolCallTitle>
          </ToolCall>
          <ToolCall status="pending">
            <ToolCallTitle verb="Write">forecast-summary.md</ToolCallTitle>
          </ToolCall>
        </ToolActivityContent>
      </ToolActivity>
    </div>
  )
}
