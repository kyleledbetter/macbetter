import {
  Tree,
  TreeGroup,
  TreeItem,
  TreeItemIndicator,
  TreeItemLabel,
  type TreeMode,
  type TreeProps,
} from "@ui-sdk/react/tree"
import * as React from "react"
import { cx, join } from "../lib/cx"

type OutlineProps<Mode extends TreeMode = "single"> = TreeProps<Mode> & {
  /** Draws a hairline down each open branch, linking children to their parent. */
  guides?: boolean
}

/** A macOS outline view, like Finder's list: rows that expand, select and move with the keyboard. */
function Outline<Mode extends TreeMode = "single">({
  guides,
  activation = "automatic",
  className,
  ...props
}: OutlineProps<Mode>) {
  // Arrow keys move the selection, as in Finder.
  return (
    <Tree<Mode>
      activation={activation}
      data-guides={guides ? "" : undefined}
      className={cx("mb-outline", className)}
      {...(props as TreeProps<Mode>)}
    />
  )
}

function OutlineItem({ branch, className, children, ...props }: React.ComponentProps<typeof TreeItem>) {
  // ui-sdk reads a branch and its depth from a TreeGroup placed directly in the item,
  // so hand it the real part rather than our wrapper.
  let hasGroup = false
  const parts = React.Children.map(children as React.ReactNode, (child) => {
    if (React.isValidElement<React.ComponentProps<typeof TreeGroup>>(child) && child.type === OutlineGroup) {
      hasGroup = true
      return <TreeGroup {...child.props} className={cx("mb-outline-group", child.props.className)} />
    }
    return child
  })
  return (
    <TreeItem branch={branch ?? (hasGroup || undefined)} className={cx("mb-outline-item", className)} {...props}>
      {parts}
    </TreeItem>
  )
}

type OutlineItemLabelProps = Omit<React.ComponentProps<typeof TreeItemLabel>, "children"> & {
  children?: React.ReactNode
}

/** The row: a disclosure triangle on branches, then whatever you put in it. */
function OutlineItemLabel({ className, children, ...props }: OutlineItemLabelProps) {
  return (
    <TreeItemLabel className={cx("mb-outline-row", className)} {...props}>
      <TreeItemIndicator className="mb-outline-indicator">
        <svg viewBox="0 0 8 14" aria-hidden="true">
          <path d="M1.5 1.5 6.5 7l-5 5.5" />
        </svg>
      </TreeItemIndicator>
      {children}
    </TreeItemLabel>
  )
}

function OutlineItemIcon({ className, ...props }: React.ComponentProps<"span">) {
  return <span aria-hidden="true" className={join("mb-outline-icon", className)} {...props} />
}

function OutlineItemText({ className, ...props }: React.ComponentProps<"span">) {
  return <span className={join("mb-outline-text", className)} {...props} />
}

/** Secondary text at the trailing edge, like a file's size or a folder's item count. */
function OutlineItemDetail({ className, ...props }: React.ComponentProps<"span">) {
  return <span className={join("mb-outline-detail", className)} {...props} />
}

function OutlineGroup({ className, ...props }: React.ComponentProps<typeof TreeGroup>) {
  return <TreeGroup className={cx("mb-outline-group", className)} {...props} />
}

export { Outline, OutlineGroup, OutlineItem, OutlineItemDetail, OutlineItemIcon, OutlineItemLabel, OutlineItemText }
export type { OutlineItemLabelProps, OutlineProps }
