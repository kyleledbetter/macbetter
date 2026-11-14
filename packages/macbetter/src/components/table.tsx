"use client"

import {
  type ChangeDetails,
  createChange,
  createRovingFocus,
  createSelection,
  definePrimitive,
} from "@ui-sdk/core"
import { createParts } from "@ui-sdk/react/primitive"
import type * as React from "react"
import { cx, join } from "../lib/cx"

type TableSelectionMode = "none" | "single" | "multiple"
type TableSortDirection = "ascending" | "descending"
type TableSort = { column: string; direction: TableSortDirection }
type TableSelectionReason = "item-press" | "list-navigation"

type TableOptions = {
  selectionMode?: TableSelectionMode
  value?: string[]
  defaultValue?: string[]
  onValueChange?: (value: string[], details: ChangeDetails<TableSelectionReason>) => void
  sort?: TableSort | null
  defaultSort?: TableSort | null
  onSortChange?: (sort: TableSort, details: ChangeDetails<"item-press">) => void
  onAction?: (value: string) => void
}

const table = definePrimitive({
  name: "table",
  options: {
    selectionMode: "string",
    value: "list",
    defaultValue: "list",
    onValueChange: "callback",
    sort: "value",
    defaultSort: "value",
    onSortChange: "callback",
    onAction: "callback",
  },
  controlled: ["value", "sort"],
  state: (options: TableOptions) => ({
    mode: options.selectionMode ?? "none",
    value: options.value ?? options.defaultValue ?? [],
    sort: options.sort ?? options.defaultSort ?? null,
    focused: null as string | null,
  }),
  sync: (options) => ({
    mode: options.selectionMode ?? "none",
    ...(options.value === undefined ? {} : { value: options.value }),
    ...(options.sort === undefined ? {} : { sort: options.sort }),
  }),
  api: (context) => {
    const change = createChange(context)
    const roving = createRovingFocus(context, {
      slot: "row",
      key: "focused",
      preferred: (row) => context.store.get().value.includes(row.key),
    })
    const selection = createSelection(context, {
      key: "value",
      set: (value, details) => change("value", value, details),
      order: () => roving.items().map((row) => row.key),
      multiple: () => context.store.get().mode === "multiple",
    })

    return {
      roving,
      selection,
      press(key: string, event?: Event) {
        if (context.store.get().mode === "none") return
        const mouse = event as MouseEvent | undefined
        const details = { reason: "item-press" as const, event }
        if (mouse?.shiftKey) selection.extend(key, { ...details, from: context.store.get().focused })
        else if (mouse?.metaKey || mouse?.ctrlKey) selection.toggle(key, details)
        else selection.choose(key, details)
      },
      keydown(event: KeyboardEvent, el: HTMLElement, key: string) {
        const { mode } = context.store.get()
        if (mode === "multiple" && (event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "a") {
          event.preventDefault()
          // Command-A always selects everything on macOS; it never clears a full selection.
          const all = roving.items().map((row) => row.key)
          const { value } = context.store.get()
          if (!all.every((row) => value.includes(row))) change("value", all, { reason: "list-navigation", event })
          return
        }
        if (event.key === " " && mode !== "none") {
          event.preventDefault()
          selection.toggle(key, { reason: "item-press", event })
          return
        }
        if (event.key === "Enter") {
          context.options().onAction?.(key)
          return
        }
        if ((event.metaKey || event.ctrlKey) && (event.key === "ArrowUp" || event.key === "ArrowDown")) {
          // Roving focus ignores modified arrows, so move focus here without touching the selection (APG multi-select).
          const rows = roving.items()
          const at = rows.findIndex((row) => row.key === key)
          const next = rows[at + (event.key === "ArrowDown" ? 1 : -1)]
          if (next) {
            event.preventDefault()
            next.el.focus()
          }
          return
        }
        const moved = roving.keydown(event, el)
        if (!moved || mode === "none" || moved.key === moved.from) return
        // macOS tables move the selection with the arrows; Command or Control moves focus alone.
        if (moved.shift) selection.extend(moved.key, { from: moved.from, reason: "list-navigation", event })
        else if (!(event.metaKey || event.ctrlKey)) selection.choose(moved.key, { reason: "list-navigation", event })
      },
      action(key: string) {
        context.options().onAction?.(key)
      },
      sortBy(column: string, event?: Event) {
        const current = context.store.get().sort
        const direction: TableSortDirection =
          current?.column === column && current.direction === "ascending" ? "descending" : "ascending"
        change("sort", { column, direction }, { reason: "item-press", event })
      },
    }
  },
  slots: (slot) => ({
    root: slot({
      role: (state) => (state.mode === "none" ? undefined : "grid"),
      roles: ["grid"],
      keys: { none: "Each row handles its own keys." },
      attrs: (state) => ({
        "aria-multiselectable": state.mode === "multiple" ? "true" : undefined,
        "data-selection-mode": state.mode,
      }),
    }),
    row: slot<{ value: string }, { selected: boolean }>({
      props: { value: "string" },
      state: (state, part) => ({ selected: state.value.includes(part.key) }),
      attrs: (state, part) => ({
        tabindex: state.mode === "none" ? undefined : part.api.roving.tabIndex(state, part),
        "aria-selected": state.mode === "none" ? undefined : String(state.value.includes(part.key)),
        "data-selected": state.value.includes(part.key) ? "" : undefined,
      }),
      on: {
        keydown: (event, { el, api, key }) => {
          if (el) api.keydown(event as KeyboardEvent, el, key)
        },
        click: (event, { api, key }) => api.press(key, event),
        dblclick: (_event, { api, key }) => api.action(key),
      },
      bind: (el, part) => part.api.roving.bind(el, part),
    }),
    column: slot<{ value: string; sortable: boolean }>({
      props: { value: "string", sortable: "boolean" },
      attrs: (state, part) => {
        const sorted = part.props.sortable && state.sort?.column === part.key ? state.sort.direction : undefined
        return {
          "aria-sort": part.props.sortable ? (sorted ?? "none") : undefined,
          "data-sorted": sorted,
        }
      },
    }),
    sort: slot<{ value: string }>({
      props: { value: "string" },
      attrs: () => ({ type: "button" }),
      press: ({ api, key }, event) => api.sortBy(key, event),
    }),
  }),
  agent: { actions: ["sortBy"] },
})

const parts = createParts(table, {
  root: "table",
  row: "tr",
  column: "th",
  sort: "button",
})

type TableProps = React.ComponentProps<typeof parts.Root> & {
  /** Shades every other row, like Finder's list view. */
  alternating?: boolean
}

function Table({ alternating, className, ...props }: TableProps) {
  return (
    <parts.Root
      data-alternating={alternating ? "" : undefined}
      className={cx("mb-table", className)}
      {...props}
    />
  )
}

function TableHeader({ className, children, ...props }: React.ComponentProps<"thead">) {
  return (
    <thead className={join("mb-table-header", className)} {...props}>
      <tr className="mb-table-header-row">{children}</tr>
    </thead>
  )
}

type TableColumnProps = Omit<React.ComponentProps<typeof parts.Column>, "value" | "sortable" | "align" | "children"> & {
  children?: React.ReactNode
  /** Identifies the column in the table's `sort`. Set it to make the column sortable. */
  value?: string
  align?: "start" | "center" | "end"
}

function TableColumn({ value, align = "start", className, children, ...props }: TableColumnProps) {
  const sortable = value !== undefined
  return (
    <parts.Column
      value={value ?? ""}
      sortable={sortable}
      scope="col"
      data-align={align}
      className={cx("mb-table-column", className)}
      {...props}
    >
      {sortable ? (
        <parts.Sort value={value} className="mb-table-sort">
          <span className="mb-table-sort-label">{children}</span>
          <svg className="mb-table-sort-indicator" viewBox="0 0 10 6" aria-hidden="true">
            <path d="M1 1.25 5 4.75l4-3.5" />
          </svg>
        </parts.Sort>
      ) : (
        children
      )}
    </parts.Column>
  )
}

function TableBody({ className, ...props }: React.ComponentProps<"tbody">) {
  return <tbody className={join("mb-table-body", className)} {...props} />
}

function TableRow({ className, ...props }: React.ComponentProps<typeof parts.Row>) {
  return <parts.Row className={cx("mb-table-row", className)} {...props} />
}

type TableCellProps = Omit<React.ComponentProps<"td">, "align"> & {
  align?: "start" | "center" | "end"
  /** Secondary text, like a file's size or kind. */
  secondary?: boolean
}

function TableCell({ align = "start", secondary, className, ...props }: TableCellProps) {
  return (
    <td
      data-align={align}
      data-secondary={secondary ? "" : undefined}
      className={join("mb-table-cell", className)}
      {...props}
    />
  )
}

export { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, table }
export type {
  TableCellProps,
  TableColumnProps,
  TableOptions,
  TableProps,
  TableSelectionMode,
  TableSort,
  TableSortDirection,
}
