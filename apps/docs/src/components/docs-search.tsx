"use client"

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandGroupLabel,
  CommandInput,
  CommandItem,
  CommandItemIcon,
  CommandList,
  CommandPalette,
  CommandPaletteContent,
  CommandPaletteTrigger,
} from "@dreambase/stardust/command-palette"
import { usePreference } from "@ui-sdk/react/preferences"
import {
  ArrowUpRightIcon,
  BoxIcon,
  FileTextIcon,
  HashIcon,
  LayoutGridIcon,
  MoonIcon,
  PaletteIcon,
  SunIcon,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { useMemo, useState } from "react"
import type { SearchEntry } from "@/lib/docs"
import { colorScheme, theme, themeLabels, themes, type ThemeName } from "@/lib/preferences"
import { ThemeSwatch } from "@/components/theme-controls"

type Row = {
  value: string
  label: string
  /** Muted text after the label: a description, or the page a heading is on. */
  detail?: string
  icon: React.ReactNode
  score: number
}

type Group = { label: string; rows: Row[] }

const suggested = ["/docs/introduction", "/docs/installation", "/docs/components", "/docs/theming", "/docs/platforms"]

function tokensOf(query: string) {
  return query.toLowerCase().trim().split(/\s+/).filter(Boolean)
}

/** How well `text` matches one token: a word that starts with it beats text that merely contains it. */
function hit(text: string | undefined, token: string): number {
  if (!text) return 0
  const lower = text.toLowerCase()
  if (lower.startsWith(token)) return 3
  if (new RegExp(`(^|[^\\p{L}\\p{N}])${escape(token)}`, "u").test(lower)) return 2
  return lower.includes(token) ? 1 : 0
}

const escape = (text: string) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")

function scorePage(entry: SearchEntry, tokens: string[], query: string) {
  let score = 0
  for (const token of tokens) {
    const title = hit(entry.title, token)
    const heading = Math.max(0, ...entry.headings.map((h) => hit(h.text, token)))
    const section = hit(entry.section, token)
    const description = hit(entry.description, token)
    if (title < 2 && heading < 2 && description < 2 && section < 2) return 0
    if (!title && !heading && description < 2) return 0
    score += title * 30 + heading * 4 + section * 3 + description * 2
  }
  const title = entry.title.toLowerCase()
  if (title === query) score += 400
  else if (title.startsWith(query)) score += 200
  return score
}

function iconFor(entry: SearchEntry) {
  if (entry.href === "/docs/components") return <LayoutGridIcon />
  if (entry.href.startsWith("/docs/components/")) return <BoxIcon />
  return <FileTextIcon />
}

function Highlighted({ text, tokens }: { text: string; tokens: string[] }) {
  if (!tokens.length) return <>{text}</>
  const pattern = new RegExp(`(${tokens.map(escape).join("|")})`, "gi")
  return <>{text.split(pattern).map((part, index) => (index % 2 ? <mark key={index}>{part}</mark> : part))}</>
}

type DocsSearchProps = { entries: SearchEntry[] }

function DocsSearch({ entries }: DocsSearchProps) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [platform, setPlatform] = useState<string>("macos")
  const scheme = usePreference(colorScheme).resolved
  const current = (usePreference(theme).value ?? "dreambase") as ThemeName

  const commands = useMemo<Row[]>(() => {
    const next = scheme === "dark" ? "light" : "dark"
    return [
      {
        value: "go:/docs/components",
        label: "Browse all components",
        icon: <LayoutGridIcon />,
        score: 0,
      },
      {
        value: "go:/themes",
        label: "Go to Themes",
        detail: "Build and preview a theme",
        icon: <PaletteIcon />,
        score: 0,
      },
      {
        value: "go:/examples",
        label: "Go to Examples",
        detail: "Whole apps built with Stardust",
        icon: <ArrowUpRightIcon />,
        score: 0,
      },
      {
        value: "open:https://github.com/DreambaseAI/stardust",
        label: "Open GitHub",
        detail: "DreambaseAI/stardust",
        icon: <ArrowUpRightIcon />,
        score: 0,
      },
      {
        value: `scheme:${next}`,
        label: `Switch to ${next} mode`,
        icon: next === "dark" ? <MoonIcon /> : <SunIcon />,
        score: 0,
      },
      ...themes
        .filter((name) => name !== current)
        .map((name) => ({
          value: `theme:${name}`,
          label: `Theme: ${themeLabels[name]}`,
          detail: "Change the accent, type and shape",
          icon: <ThemeSwatch name={name} />,
          score: 0,
        })),
    ]
  }, [scheme, current])

  const tokens = useMemo(() => tokensOf(query), [query])

  const groups = useMemo<Group[]>(() => {
    const pageRow = (entry: SearchEntry, score = 0): Row => ({
      value: `go:${entry.href}`,
      label: entry.title,
      detail: entry.description,
      icon: iconFor(entry),
      score,
    })

    if (!tokens.length) {
      const pages = suggested
        .map((href) => entries.find((entry) => entry.href === href))
        .filter((entry): entry is SearchEntry => Boolean(entry))
      return [
        { label: "Suggested", rows: pages.map((entry) => pageRow(entry)) },
        {
          label: "Go to",
          rows: commands.filter((row) => row.value.startsWith("go:") || row.value.startsWith("open:")).slice(1),
        },
        {
          label: "Appearance",
          rows: commands.filter((row) => /^(scheme|theme):/.test(row.value)),
        },
      ]
    }

    const q = tokens.join(" ")
    const bySection = new Map<string, Row[]>()
    for (const entry of entries) {
      const score = scorePage(entry, tokens, q)
      if (!score) continue
      const rows = bySection.get(entry.section) ?? []
      rows.push(pageRow(entry, score))
      bySection.set(entry.section, rows)
    }
    const pageGroups = [...bySection].map(([label, rows]) => ({
      label,
      rows: rows.sort((a, b) => b.score - a.score),
    }))
    pageGroups.sort((a, b) => b.rows[0]!.score - a.rows[0]!.score)

    const sections: Row[] = []
    for (const entry of entries) {
      for (const heading of entry.headings) {
        const inHeading = tokens.map((token) => hit(heading.text, token))
        if (!inHeading.some((score) => score >= 2)) continue
        if (!tokens.every((token, i) => inHeading[i] || hit(entry.title, token))) continue
        sections.push({
          value: `go:${entry.href}#${heading.id}`,
          label: heading.text,
          detail: entry.title,
          icon: <HashIcon />,
          score: inHeading.reduce((sum, score) => sum + score, 0) + (hit(entry.title, tokens[0]!) ? 2 : 0),
        })
      }
    }
    sections.sort((a, b) => b.score - a.score)

    const actions = commands.filter((row) =>
      tokens.every((token) => hit(row.label, token) || hit(row.detail, token) >= 2),
    )

    // A page can match in two sections; command values must stay unique across the list.
    const seen = new Set<string>()
    return [
      ...pageGroups,
      { label: "On a page", rows: sections.slice(0, 8) },
      { label: "Commands", rows: actions },
    ]
      .map((group) => ({
        ...group,
        rows: group.rows.filter((row) => !seen.has(row.value) && Boolean(seen.add(row.value))),
      }))
      .filter((group) => group.rows.length)
  }, [entries, tokens, commands])

  const run = (value: string) => {
    const [kind, ...rest] = value.split(":")
    const target = rest.join(":")
    setOpen(false)
    if (kind === "go") router.push(target)
    else if (kind === "open") window.open(target, "_blank", "noopener,noreferrer")
    else if (kind === "scheme") colorScheme.set(target as "light" | "dark")
    else if (kind === "theme") theme.set(target as ThemeName)
  }

  return (
    <CommandPalette
      open={open}
      onOpenChange={(next) => {
        if (next) setPlatform(document.documentElement.dataset.platform ?? "macos")
        else setQuery("")
        setOpen(next)
      }}
    >
      <CommandPaletteTrigger aria-label="Search documentation" className="docs-search-trigger">
        Search docs
      </CommandPaletteTrigger>
      <div data-platform={platform} className="contents">
        <CommandPaletteContent title="Search documentation" className="docs-palette">
          <Command filter={false} query={query} onQueryChange={setQuery} onAction={run} loop>
            <CommandInput aria-label="Search documentation" placeholder="Search documentation" />
            <CommandEmpty>
              <span className="block text-label">No results for “{query.trim()}”</span>
              <span className="mt-1 block text-[13px]">Try a component name, like Sheet or Toolbar.</span>
            </CommandEmpty>
            <CommandList>
              {groups.map((group) => (
                <CommandGroup key={group.label}>
                  <CommandGroupLabel>{group.label}</CommandGroupLabel>
                  {group.rows.map((row) => (
                    <CommandItem key={row.value} value={row.value} label={row.label}>
                      <CommandItemIcon>{row.icon}</CommandItemIcon>
                      <span className="docs-palette-label">
                        <Highlighted text={row.label} tokens={tokens} />
                      </span>
                      {row.detail ? <span className="docs-palette-detail">{row.detail}</span> : null}
                    </CommandItem>
                  ))}
                </CommandGroup>
              ))}
            </CommandList>
          </Command>
          <div aria-hidden="true" className="docs-palette-footer">
            <span>
              <kbd>↑</kbd>
              <kbd>↓</kbd> to move
            </span>
            <span>
              <kbd>↩</kbd> to open
            </span>
            <span>
              <kbd>esc</kbd> to close
            </span>
          </div>
        </CommandPaletteContent>
      </div>
    </CommandPalette>
  )
}

export { DocsSearch }
