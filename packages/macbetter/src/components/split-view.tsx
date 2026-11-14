import {
  Resizable,
  ResizableHandle,
  ResizablePanel,
} from "@ui-sdk/react/resizable"
import type * as React from "react"
import { cx } from "../lib/cx"

function SplitView({ className, ...props }: React.ComponentProps<typeof Resizable>) {
  return <Resizable className={cx("mb-split-view", className)} {...props} />
}

type SplitViewPaneProps = React.ComponentProps<typeof ResizablePanel> & {
  /** `sidebar` takes the translucent sidebar material, `inspector` the secondary background. */
  variant?: "sidebar" | "content" | "inspector"
}

function SplitViewPane({ variant = "content", className, ...props }: SplitViewPaneProps) {
  return <ResizablePanel data-variant={variant} className={cx("mb-split-view-pane", className)} {...props} />
}

function SplitViewDivider({ className, ...props }: React.ComponentProps<typeof ResizableHandle>) {
  return <ResizableHandle className={cx("mb-split-view-divider", className)} {...props} />
}

export { SplitView, SplitViewDivider, SplitViewPane }
export type { SplitViewPaneProps }
