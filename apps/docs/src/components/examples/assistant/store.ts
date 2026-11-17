"use client"

import type { PromptInputStatus } from "macbetter/prompt-input"
import * as React from "react"
import { plugins, recents as initialRecents, type Recent } from "./data"
import { q3Thread, scriptFor, type AssistantTurn, type Script, type Turn } from "./script"

/*
 * One store for the whole example, outside React, so the Mac window, the
 * iPhone and the gallery thumbnails show the same chats. It also plays the
 * scripted replies: each step runs on a timer and updates the live turn.
 */

type Screen = "chat" | "new" | "plugins" | "skills"

type State = {
  screen: Screen
  chatId: string
  recents: Recent[]
  threads: Record<string, Turn[]>
  status: PromptInputStatus
  installed: string[]
  /** Text waiting in the composer, like a skill handed over from "Try in chat". */
  draft: string
  project: string | null
}

let state: State = {
  screen: "chat",
  chatId: initialRecents[0].id,
  recents: initialRecents,
  threads: { [initialRecents[0].id]: q3Thread },
  status: "ready",
  installed: plugins.filter((plugin) => plugin.installed).map((plugin) => plugin.id),
  draft: "",
  project: null,
}

const listeners = new Set<() => void>()

function set(next: (current: State) => State) {
  state = next(state)
  for (const listener of listeners) listener()
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

function useAssistant() {
  return React.useSyncExternalStore(subscribe, () => state, () => state)
}

/** The turns of a chat. Chats other than the main one open on their short saved exchange. */
function threadOf(current: State, id: string): Turn[] {
  const saved = current.threads[id]
  if (saved) return saved
  const recent = current.recents.find((entry) => entry.id === id)
  if (!recent?.prompt || !recent.reply) return []
  return [
    { id: `${id}-1`, from: "user", text: recent.prompt },
    { id: `${id}-2`, from: "assistant", parts: [{ kind: "markdown", text: recent.reply }] },
  ]
}

function titleOf(current: State) {
  return current.recents.find((entry) => entry.id === current.chatId)?.title ?? "New chat"
}

/* ── Navigation ──────────────────────────────────────────────────── */

function go(screen: Screen) {
  set((s) => ({ ...s, screen }))
}

function openChat(id: string) {
  set((s) => ({ ...s, screen: "chat", chatId: id }))
}

function newChat(options: { draft?: string; project?: string | null } = {}) {
  set((s) => ({ ...s, screen: "new", draft: options.draft ?? "", project: options.project ?? null }))
}

function setDraft(draft: string) {
  set((s) => ({ ...s, draft }))
}

function setProject(project: string | null) {
  set((s) => ({ ...s, project }))
}

function togglePlugin(id: string) {
  set((s) => ({
    ...s,
    installed: s.installed.includes(id) ? s.installed.filter((entry) => entry !== id) : [...s.installed, id],
  }))
}

/* ── The scripted reply ──────────────────────────────────────────── */

let timers: ReturnType<typeof setTimeout>[] = []
let waiting: { allowed: string; denied: string; resume: () => void } | null = null

function later(ms: number, run: () => void) {
  timers.push(setTimeout(run, ms))
}

function clearTimers() {
  timers.forEach(clearTimeout)
  timers = []
}

/** Changes the live turn of the open chat. */
function updateLive(change: (turn: AssistantTurn) => AssistantTurn) {
  set((s) => {
    const thread = threadOf(s, s.chatId)
    return {
      ...s,
      threads: {
        ...s.threads,
        [s.chatId]: thread.map((turn) => (turn.from === "assistant" && turn.live ? change(turn) : turn)),
      },
    }
  })
}

function appendText(turn: AssistantTurn, text: string): AssistantTurn {
  const parts = [...turn.parts]
  const last = parts[parts.length - 1]
  if (last?.kind === "markdown") parts[parts.length - 1] = { kind: "markdown", text: last.text + text }
  else parts.push({ kind: "markdown", text })
  return { ...turn, parts }
}

/** Streams text a few characters at a time, the way tokens arrive. */
function stream(text: string, done: () => void) {
  let index = 0
  const tick = () => {
    const size = 3 + Math.floor(Math.random() * 6)
    const chunk = text.slice(index, index + size)
    index += size
    updateLive((turn) => appendText(turn, chunk))
    if (index < text.length) later(28, tick)
    else done()
  }
  set((s) => ({ ...s, status: "streaming" }))
  later(28, tick)
}

function finish() {
  clearTimers()
  waiting = null
  updateLive((turn) => ({ ...turn, live: false }))
  set((s) => ({ ...s, status: "ready" }))
}

function run(script: Script, index: number, startedAt: number) {
  const step = script.steps[index]
  if (!step) {
    finish()
    return
  }
  const next = () => run(script, index + 1, startedAt)

  if (step.kind === "think") {
    updateLive((turn) => ({ ...turn, reasoning: { state: "running", duration: 0, text: step.text } }))
    later(step.ms, () => {
      updateLive((turn) => ({
        ...turn,
        reasoning: { state: "done", duration: Math.max(1, Math.round((Date.now() - startedAt) / 1000)), text: step.text },
      }))
      next()
    })
    return
  }

  if (step.kind === "tool") {
    set((s) => ({ ...s, status: "streaming" }))
    updateLive((turn) => ({
      ...turn,
      tools: { summary: script.summary, steps: [...(turn.tools?.steps ?? []), { ...step.step, status: "running" }] },
    }))
    later(step.ms, () => {
      updateLive((turn) => ({
        ...turn,
        tools: turn.tools && {
          ...turn.tools,
          steps: turn.tools.steps.map((entry) => (entry.id === step.step.id ? { ...entry, status: "done" } : entry)),
        },
      }))
      next()
    })
    return
  }

  if (step.kind === "confirm") {
    updateLive((turn) => ({ ...turn, confirmation: { ...step.ask, state: "pending" } }))
    waiting = { allowed: step.allowed, denied: step.denied, resume: next }
    return
  }

  if (step.kind === "text") {
    stream(step.text, next)
    return
  }

  updateLive((turn) => ({ ...turn, sources: step.sources }))
  later(120, next)
}

/** Answers the live turn's confirmation and carries on with the script. */
function answer(choice: "once" | "always" | "deny") {
  const pending = waiting
  if (!pending) return
  waiting = null
  const allowed = choice !== "deny"
  updateLive((turn) => ({
    ...turn,
    confirmation: turn.confirmation && {
      ...turn.confirmation,
      state: allowed ? "allowed" : "denied",
      outcome: choice === "always" ? "Always allowed for Calendar" : allowed ? "Allowed once" : "Denied",
    },
  }))
  if (allowed) {
    updateLive((turn) => ({
      ...turn,
      tools: turn.tools && {
        ...turn.tools,
        steps: [...turn.tools.steps, { id: "create", verb: "Created event", object: "Q3 review", glyph: "calendar", status: "running" }],
      },
    }))
  }
  later(allowed ? 900 : 300, () => {
    if (allowed) {
      updateLive((turn) => ({
        ...turn,
        tools: turn.tools && {
          ...turn.tools,
          steps: turn.tools.steps.map((entry) => (entry.id === "create" ? { ...entry, status: "done" } : entry)),
        },
      }))
    }
    stream(allowed ? pending.allowed : pending.denied, pending.resume)
  })
}

/** Sends a message: from a new chat it starts one, then the scripted reply plays. */
function send(text: string) {
  const prompt = text.trim()
  if (!prompt || state.status === "submitted" || state.status === "streaming") return
  clearTimers()
  waiting = null

  if (state.screen !== "chat") {
    const id = `chat-${Date.now()}`
    const title = prompt.length > 42 ? `${prompt.slice(0, 40).trimEnd()}…` : prompt
    set((s) => ({
      ...s,
      screen: "chat",
      chatId: id,
      draft: "",
      recents: [{ id, title, project: s.project ?? undefined }, ...s.recents],
      threads: { ...s.threads, [id]: [] },
    }))
  }

  const stamp = Date.now()
  const script = scriptFor(prompt)
  set((s) => ({
    ...s,
    status: "submitted",
    draft: "",
    threads: {
      ...s.threads,
      [s.chatId]: [
        ...threadOf(s, s.chatId),
        { id: `user-${stamp}`, from: "user", text: prompt },
        { id: `reply-${stamp}`, from: "assistant", parts: [], live: true },
      ],
    },
  }))
  later(700, () => run(script, 0, stamp))
}

/** Stops the reply where it is. */
function stop() {
  clearTimers()
  waiting = null
  updateLive((turn) => ({
    ...turn,
    live: false,
    stopped: true,
    reasoning: turn.reasoning && { ...turn.reasoning, state: "done" },
    tools: turn.tools && {
      ...turn.tools,
      steps: turn.tools.steps.map((entry) => (entry.status === "running" ? { ...entry, status: "error" } : entry)),
    },
    confirmation: turn.confirmation?.state === "pending" ? undefined : turn.confirmation,
  }))
  set((s) => ({ ...s, status: "ready" }))
}

export {
  answer,
  go,
  newChat,
  openChat,
  send,
  setDraft,
  setProject,
  stop,
  threadOf,
  titleOf,
  togglePlugin,
  useAssistant,
}
export type { Screen, State }
