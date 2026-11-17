"use client"

import { Plan, PlanStep, PlanTitle } from "macbetter/plan"

export default function Example() {
  return (
    <div style={{ display: "flex", flexDirection: "column", width: "100%", maxWidth: 480 }}>
      <Plan>
        <PlanTitle>Move the billing tables</PlanTitle>
        <PlanStep status="done">Back up the production database</PlanStep>
        <PlanStep status="done" detail="1.2 million rows, checksums match">
          Copy invoices to the new table
        </PlanStep>
        <PlanStep status="skipped" detail="No archived rows since 2022">
          Copy archived invoices
        </PlanStep>
        <PlanStep status="active">Switch reads to the new table</PlanStep>
        <PlanStep>Remove the old table</PlanStep>
      </Plan>
    </div>
  )
}
