"use client"

import { Button } from "macbetter/button"
import {
  Outline,
  OutlineGroup,
  OutlineItem,
  OutlineItemIcon,
  OutlineItemLabel,
  OutlineItemText,
} from "macbetter/outline"
import { Select, SelectContent, SelectItem, SelectList, SelectTrigger } from "macbetter/select"
import { toast } from "macbetter/toast"
import { Window, WindowBody, WindowSidebar, WindowTitlebar, WindowTrafficLights } from "macbetter/window"
import { CheckIcon, CopyIcon, FileCode2Icon, FileTextIcon, FolderIcon, PaletteIcon } from "lucide-react"
import Link from "next/link"
import * as React from "react"
import type { ExampleSourceSet, SourceFile } from "@/lib/example-sources"

/* ── Copying ───────────────────────────────────────────────────── */

function formatBytes(bytes: number) {
  return bytes < 1024 ? `${bytes} B` : `${(bytes / 1024).toFixed(1)} KB`
}

function allFiles(source: ExampleSourceSet) {
  return source.files.map((file) => `// ${file.path}\n\n${file.code.trimEnd()}\n`).join("\n")
}

async function copyText(text: string, title: string, description?: string) {
  try {
    await navigator.clipboard.writeText(text)
    toast.success(title, { description })
    return true
  } catch {
    toast.error("Couldn’t copy", { description: "The browser blocked access to the clipboard." })
    return false
  }
}

function copyFile(file: SourceFile) {
  return copyText(file.code, `Copied ${file.name}`, `${file.lines} lines · ${formatBytes(file.bytes)}`)
}

function copyAllFiles(source: ExampleSourceSet) {
  const lines = source.files.reduce((sum, file) => sum + file.lines, 0)
  return copyText(allFiles(source), `Copied ${source.files.length} files`, `The ${source.title} example, ${lines} lines`)
}

function copyInstall(source: ExampleSourceSet) {
  return copyText(source.install, "Copied install command", source.install)
}

/** Swaps an icon for a checkmark for a moment after a copy succeeds. */
function useCopied() {
  const [copied, setCopied] = React.useState(false)
  const timer = React.useRef<ReturnType<typeof setTimeout>>(undefined)
  React.useEffect(() => () => clearTimeout(timer.current), [])
  const run = React.useCallback(async (copy: () => Promise<boolean>) => {
    if (!(await copy())) return
    setCopied(true)
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setCopied(false), 1600)
  }, [])
  return [copied, run] as const
}

/* ── Highlighted source, fetched when the code view opens ──────── */

const highlighted = new Map<string, Promise<Record<string, string>>>()

function loadHighlighted(slug: string) {
  let request = highlighted.get(slug)
  if (!request) {
    request = fetch(`/examples/source/${slug}`).then((response) => {
      if (!response.ok) throw new Error(`Couldn’t load the ${slug} source (${response.status})`)
      return response.json() as Promise<Record<string, string>>
    })
    request.catch(() => highlighted.delete(slug))
    highlighted.set(slug, request)
  }
  return request
}

function useHighlighted(slug: string) {
  const [html, setHtml] = React.useState<Record<string, string> | null>(null)
  React.useEffect(() => {
    let live = true
    loadHighlighted(slug).then(
      (result) => live && setHtml(result),
      () => {}
    )
    return () => {
      live = false
    }
  }, [slug])
  return html
}

/* ── File tree ─────────────────────────────────────────────────── */

type TreeNode = { value: string; name: string; file?: SourceFile; children?: TreeNode[] }

/** Nests paths into folders, then joins chains of single folders into one row, as Xcode and VS Code do. */
function buildTree(files: SourceFile[]) {
  const root: TreeNode = { value: "", name: "", children: [] }
  for (const file of files) {
    const parts = file.path.split("/")
    let node = root
    parts.slice(0, -1).forEach((part, index) => {
      const value = `${parts.slice(0, index + 1).join("/")}/`
      let folder = node.children!.find((child) => child.value === value)
      if (!folder) {
        folder = { value, name: part, children: [] }
        node.children!.push(folder)
      }
      node = folder
    })
    node.children!.push({ value: file.path, name: file.name, file })
  }
  const compact = (node: TreeNode): TreeNode => {
    if (!node.children) return node
    let current = node
    // Joins folders that hold only a folder, but keeps a folder of plain files on its own row, so its name stays readable.
    while (
      current.children?.length === 1 &&
      current.children[0].children?.some((child) => child.children)
    ) {
      const only = current.children[0]
      current = { ...only, name: `${current.name}/${only.name}` }
    }
    return { ...current, children: current.children!.map(compact) }
  }
  return root.children!.map(compact)
}

function folderValues(nodes: TreeNode[]): string[] {
  return nodes.flatMap((node) => (node.children ? [node.value, ...folderValues(node.children)] : []))
}

function FileGlyph({ file }: { file: SourceFile }) {
  if (file.lang === "css") return <PaletteIcon aria-hidden="true" />
  if (file.lang === "tsx") return <FileCode2Icon aria-hidden="true" />
  return <FileTextIcon aria-hidden="true" />
}

function TreeItems({ nodes }: { nodes: TreeNode[] }) {
  return nodes.map((node) => (
    <OutlineItem key={node.value} value={node.value} label={node.name}>
      <OutlineItemLabel>
        <OutlineItemIcon data-kind={node.file ? node.file.lang : "folder"}>
          {node.file ? <FileGlyph file={node.file} /> : <FolderIcon aria-hidden="true" />}
        </OutlineItemIcon>
        <OutlineItemText>{node.name}</OutlineItemText>
      </OutlineItemLabel>
      {node.children ? (
        <OutlineGroup>
          <TreeItems nodes={node.children} />
        </OutlineGroup>
      ) : null}
    </OutlineItem>
  ))
}

function FileTree({
  source,
  file,
  onFileChange,
}: {
  source: ExampleSourceSet
  file: SourceFile
  onFileChange: (path: string) => void
}) {
  const nodes = React.useMemo(() => buildTree(source.files), [source.files])
  const folders = React.useMemo(() => folderValues(nodes), [nodes])
  return (
    <Outline
      aria-label={`${source.title} files`}
      className="ex-code-tree"
      value={file.path}
      onValueChange={(value) => {
        if (typeof value === "string" && !value.endsWith("/")) onFileChange(value)
      }}
      defaultExpanded={folders}
    >
      <TreeItems nodes={nodes} />
    </Outline>
  )
}

/** On a phone the tree becomes a pop-up button above the code. */
function FilePicker({
  source,
  file,
  onFileChange,
}: {
  source: ExampleSourceSet
  file: SourceFile
  onFileChange: (path: string) => void
}) {
  const labels = React.useMemo(() => {
    const counts = new Map<string, number>()
    source.files.forEach((f) => counts.set(f.name, (counts.get(f.name) ?? 0) + 1))
    return new Map(
      source.files.map((f) => [
        f.path,
        counts.get(f.name)! > 1 ? f.path.split("/").slice(-2).join("/") : f.name,
      ])
    )
  }, [source.files])
  return (
    <Select
      value={file.path}
      onValueChange={(value) => value && onFileChange(value as string)}
      items={source.files.map((f) => ({ value: f.path, label: labels.get(f.path)! }))}
    >
      <SelectTrigger aria-label="File" className="ex-code-picker" />
      <SelectContent>
        <SelectList>
          {source.files.map((f) => (
            <SelectItem key={f.path} value={f.path}>
              {labels.get(f.path)}
            </SelectItem>
          ))}
        </SelectList>
      </SelectContent>
    </Select>
  )
}

/* ── Pieces of the code pane ───────────────────────────────────── */

function BuiltWith({ source }: { source: ExampleSourceSet }) {
  const lines = source.files.reduce((sum, file) => sum + file.lines, 0)
  return (
    <section className="ex-code-note" aria-label="How this is built">
      <p>
        <strong>How this is built.</strong> {source.files.length} files and {lines.toLocaleString("en-US")} lines,
        using {source.components.length} Macbetter components:{" "}
        {source.components.map((component, index) => (
          <React.Fragment key={component.name}>
            {index ? ", " : null}
            <Link href={component.href}>{component.title}</Link>
          </React.Fragment>
        ))}
        .
      </p>
      {source.stageImports.length ? (
        <p>
          <code>{source.stageImports.join(", ")}</code> come from the gallery’s stage (<code>shell.tsx</code>), which
          isn’t part of the block: swap them for your own window or screen.
        </p>
      ) : null}
    </section>
  )
}

function FilePath({ path }: { path: string }) {
  const slash = path.lastIndexOf("/")
  return (
    <span className="ex-code-path" title={`src/${path}`}>
      <span className="ex-code-path-dir">src/{path.slice(0, slash + 1)}</span>
      <span className="ex-code-path-name">{path.slice(slash + 1)}</span>
    </span>
  )
}

function CopyFileButton({ file }: { file: SourceFile }) {
  const [copied, run] = useCopied()
  return (
    <Button
      variant="bezeled"
      tone="neutral"
      size="sm"
      className="ex-code-copy"
      aria-label={copied ? `Copied ${file.name}` : `Copy ${file.name}`}
      onClick={() => run(() => copyFile(file))}
    >
      {copied ? <CheckIcon aria-hidden="true" /> : <CopyIcon aria-hidden="true" />}
      <span>{copied ? "Copied" : "Copy"}</span>
    </Button>
  )
}

function FileMeta({ file }: { file: SourceFile }) {
  return (
    <span className="ex-code-meta">
      {file.lines.toLocaleString("en-US")} lines · {formatBytes(file.bytes)}
    </span>
  )
}

function Source({ file, html }: { file: SourceFile; html: string | undefined }) {
  const style = { "--ex-code-gutter": `${String(file.lines).length}ch` } as React.CSSProperties
  return (
    <div className="ex-code-source" style={style} data-loading={html ? undefined : ""}>
      {html ? (
        // Shiki marks its <pre> focusable, so the keyboard can scroll long lines.
        <div className="ex-code-scroll" role="region" aria-label={`Source of ${file.name}`} dangerouslySetInnerHTML={{ __html: html }} />
      ) : (
        <div className="ex-code-scroll" role="region" aria-label={`Source of ${file.name}`}>
          <pre className="shiki" tabIndex={0}>
            <code>
              {file.code
                .replace(/\n$/, "")
                .split("\n")
                .map((line, index) => (
                  <React.Fragment key={index}>
                    <span className="line">{line}</span>
                    {"\n"}
                  </React.Fragment>
                ))}
            </code>
          </pre>
        </div>
      )}
    </div>
  )
}

/* ── The view ──────────────────────────────────────────────────── */

type CodeViewProps = {
  source: ExampleSourceSet
  file: SourceFile
  onFileChange: (path: string) => void
  /** A phone: no window chrome, and a pop-up button in place of the tree. */
  compact?: boolean
}

function CodeView({ source, file, onFileChange, compact }: CodeViewProps) {
  const html = useHighlighted(source.slug)
  const code = <Source key={file.path} file={file} html={html?.[file.path]} />

  if (compact) {
    return (
      <div className="ex-code-panel" data-platform="ios">
        <BuiltWith source={source} />
        <div className="ex-code-header">
          <FilePicker source={source} file={file} onFileChange={onFileChange} />
          <CopyFileButton file={file} />
        </div>
        <div className="ex-code-subheader">
          <FilePath path={file.path} />
          <FileMeta file={file} />
        </div>
        {code}
      </div>
    )
  }

  return (
    <div className="ex-code-frame" data-platform="macos">
      <Window aria-label={`${source.title} source`} className="ex-code-window">
        <WindowSidebar>
          <WindowTrafficLights />
          <div className="ex-code-sidebar">
            <div className="ex-code-sidebar-header">Files</div>
            <FileTree source={source} file={file} onFileChange={onFileChange} />
          </div>
        </WindowSidebar>
        <WindowTitlebar className="ex-code-titlebar">
          <div className="ex-code-heading">
            <FilePath path={file.path} />
            <FileMeta file={file} />
          </div>
          <CopyFileButton file={file} />
        </WindowTitlebar>
        <WindowBody className="ex-code-body">
          <BuiltWith source={source} />
          {code}
        </WindowBody>
      </Window>
    </div>
  )
}

export { CodeView, copyAllFiles, copyFile, copyInstall, useCopied }
