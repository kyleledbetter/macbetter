"use client"

import { Plan, PlanStep } from "macbetter/plan"
import { Reasoning, ReasoningContent, ReasoningTrigger } from "macbetter/reasoning"

export default function Example() {
  return (
    <div style={{ display: "flex", flexDirection: "column", width: "100%", maxWidth: 560 }}>
      <Reasoning duration={12} defaultOpen>
        <ReasoningTrigger />
        <ReasoningContent>
          <Plan aria-label="Steps">
            <PlanStep status="done">Found the March invoices</PlanStep>
            <PlanStep status="done">Matched them to purchase orders</PlanStep>
            <PlanStep status="done" detail="Two orders have no invoice yet">
              Flagged what doesn&apos;t match
            </PlanStep>
          </Plan>
        </ReasoningContent>
      </Reasoning>
    </div>
  )
}
