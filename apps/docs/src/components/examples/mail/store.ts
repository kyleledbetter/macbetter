"use client"

import * as React from "react"
import { messages as initialMessages, type MailboxId, type Message } from "./data"

type ComposeMode = "new" | "reply" | "reply-all" | "forward"
type Compose = { mode: ComposeMode; message?: Message } | null

function useMailStore() {
  const [messages, setMessages] = React.useState(initialMessages)
  const [compose, setCompose] = React.useState<Compose>(null)

  const update = React.useCallback((id: string, patch: Partial<Message>) => {
    setMessages((list) => list.map((m) => (m.id === id ? { ...m, ...patch } : m)))
  }, [])

  const unreadIn = React.useCallback(
    (mailbox: MailboxId) => messages.filter((m) => m.mailbox === mailbox && m.unread).length,
    [messages]
  )

  /** Runs a message action by name, from a menu, a toolbar or the command palette. */
  const act = React.useCallback(
    (action: string, message: Message | undefined) => {
      if (action === "compose") return setCompose({ mode: "new" })
      if (!message) return
      switch (action) {
        case "reply":
        case "reply-all":
        case "forward":
          setCompose({ mode: action, message })
          break
        case "toggle-read":
          update(message.id, { unread: !message.unread })
          break
        case "toggle-flag":
          update(message.id, { flagged: !message.flagged })
          break
        case "archive":
          update(message.id, { mailbox: "archive", unread: false })
          break
        case "junk":
          update(message.id, { mailbox: "junk" })
          break
        case "trash":
          update(message.id, { mailbox: "trash" })
          break
      }
    },
    [update]
  )

  return { messages, update, unreadIn, act, compose, setCompose }
}

type MailStore = ReturnType<typeof useMailStore>

function composeDefaults(compose: NonNullable<Compose>) {
  const m = compose.message
  if (!m || compose.mode === "new") return { to: "", subject: "", body: "" }
  const quoted = `\n\nOn ${m.date === "Today" ? `today at ${m.time}` : m.date}, ${m.from} wrote:\n> ${m.body.join("\n> ")}`
  if (compose.mode === "forward") return { to: "", subject: `Fwd: ${m.subject}`, body: quoted }
  return {
    to: compose.mode === "reply-all" ? `${m.from}, ${m.to}` : m.from,
    subject: m.subject.startsWith("Re:") ? m.subject : `Re: ${m.subject}`,
    body: quoted,
  }
}

export { composeDefaults, useMailStore }
export type { Compose, ComposeMode, MailStore }
