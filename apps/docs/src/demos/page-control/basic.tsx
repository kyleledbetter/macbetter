"use client"

import { Button } from "@dreambase/stardust/button"
import { PageControl } from "@dreambase/stardust/page-control"
import { CloudIcon, LockIcon, SparklesIcon, ZapIcon } from "lucide-react"
import { useState } from "react"

const pages = [
  { icon: SparklesIcon, title: "Welcome to Dreambase", body: "Ask questions about your data in plain words." },
  { icon: ZapIcon, title: "Answers in seconds", body: "Every chart updates as new rows arrive." },
  { icon: LockIcon, title: "Private by design", body: "Your data stays in your own database." },
  { icon: CloudIcon, title: "Works everywhere", body: "Pick up on your Mac right where you left off." },
]

export default function Example() {
  const [page, setPage] = useState(1)
  const { icon: Icon, title, body } = pages[page - 1]

  return (
    <div style={{ display: "grid", justifyItems: "center", gap: 20, width: "100%", maxWidth: 320, textAlign: "center" }}>
      <Icon aria-hidden="true" style={{ width: 56, height: 56, color: "var(--sd-accent)" }} />
      <div style={{ display: "grid", gap: 6, minHeight: 96 }}>
        <div className="sd-text-title-2">{title}</div>
        <p className="sd-text-body sd-label-secondary" style={{ margin: 0 }}>{body}</p>
      </div>
      <PageControl aria-label="Welcome pages" pageCount={pages.length} page={page} onPageChange={setPage} />
      <Button variant="filled" block onClick={() => setPage((current) => Math.min(current + 1, pages.length))}>
        {page === pages.length ? "Get Started" : "Continue"}
      </Button>
    </div>
  )
}
