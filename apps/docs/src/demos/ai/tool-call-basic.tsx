"use client"

import { DescriptionDetails, DescriptionItem, DescriptionList, DescriptionTerm } from "macbetter/description-list"
import {
  ToolActivity,
  ToolActivityContent,
  ToolActivitySummary,
  ToolCall,
  ToolCallDetail,
  ToolCallSection,
  ToolCallTitle,
} from "macbetter/tool-call"
import { DatabaseIcon } from "lucide-react"

export default function Example() {
  return (
    <div style={{ display: "flex", flexDirection: "column", width: "100%", maxWidth: 560 }}>
      <ToolActivity defaultOpen>
        <ToolActivitySummary icon={<DatabaseIcon />}>Used Dataroom, read a file · 29s</ToolActivitySummary>
        <ToolActivityContent>
          <ToolCall>
            <ToolCallTitle verb="Loaded skill">dataroom-query</ToolCallTitle>
          </ToolCall>
          <ToolCall>
            <ToolCallTitle verb="Read">data-workflows.md</ToolCallTitle>
          </ToolCall>
          <ToolCall>
            <ToolCallTitle>Searching the catalog for usage tables.</ToolCallTitle>
          </ToolCall>
          <ToolCall defaultOpen>
            <ToolCallTitle verb="Listed datasets">Context: inventorying existing datasets before building the report</ToolCallTitle>
            <ToolCallDetail>
              <ToolCallSection title="Request">
                <DescriptionList layout="stacked" size="sm">
                  <DescriptionItem>
                    <DescriptionTerm>Workspace</DescriptionTerm>
                    <DescriptionDetails mono>finance-reporting</DescriptionDetails>
                  </DescriptionItem>
                  <DescriptionItem>
                    <DescriptionTerm>Context</DescriptionTerm>
                    <DescriptionDetails>Inventorying existing datasets before building the report</DescriptionDetails>
                  </DescriptionItem>
                </DescriptionList>
              </ToolCallSection>
              <ToolCallSection title="Response">
                <DescriptionList size="sm">
                  <DescriptionItem>
                    <DescriptionTerm>Datasets</DescriptionTerm>
                    <DescriptionDetails>14</DescriptionDetails>
                  </DescriptionItem>
                  <DescriptionItem>
                    <DescriptionTerm>Updated</DescriptionTerm>
                    <DescriptionDetails>Today, 8:12 AM</DescriptionDetails>
                  </DescriptionItem>
                  <DescriptionItem>
                    <DescriptionTerm>Largest</DescriptionTerm>
                    <DescriptionDetails mono>usage_daily</DescriptionDetails>
                  </DescriptionItem>
                </DescriptionList>
              </ToolCallSection>
            </ToolCallDetail>
          </ToolCall>
        </ToolActivityContent>
      </ToolActivity>
    </div>
  )
}
