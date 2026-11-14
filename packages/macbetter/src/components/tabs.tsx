import {
  Tabs as TabsPrimitive,
  TabsIndicator,
  TabsList as TabsListPrimitive,
  TabsPanel as TabsPanelPrimitive,
  TabsTab as TabsTabPrimitive,
  TabsTabIcon as TabsTabIconPrimitive,
} from "@ui-sdk/react/tabs"
import type * as React from "react"
import { cx } from "../lib/cx"

type TabsProps = React.ComponentProps<typeof TabsPrimitive> & {
  /** `bordered` is the macOS tab view: a segmented strip on the edge of a framed panel. `plain` has no frame. */
  variant?: "bordered" | "plain"
}

function Tabs({ variant = "bordered", className, ...props }: TabsProps) {
  return <TabsPrimitive data-variant={variant} className={cx("mb-tabs", className)} {...props} />
}

type TabsListProps = Omit<React.ComponentProps<typeof TabsListPrimitive>, "children"> & {
  children?: React.ReactNode
}

function TabsList({ className, children, ...props }: TabsListProps) {
  return (
    <TabsListPrimitive className={cx("mb-tabs-list", className)} {...props}>
      <TabsIndicator className="mb-tabs-indicator" />
      {children}
    </TabsListPrimitive>
  )
}

function TabsTab({ className, ...props }: React.ComponentProps<typeof TabsTabPrimitive>) {
  return <TabsTabPrimitive className={cx("mb-tabs-tab", className)} {...props} />
}

function TabsTabIcon({ className, ...props }: React.ComponentProps<typeof TabsTabIconPrimitive>) {
  return <TabsTabIconPrimitive className={cx("mb-tabs-tab-icon", className)} {...props} />
}

function TabsPanel({ className, ...props }: React.ComponentProps<typeof TabsPanelPrimitive>) {
  return <TabsPanelPrimitive className={cx("mb-tabs-panel", className)} {...props} />
}

export { Tabs, TabsList, TabsPanel, TabsTab, TabsTabIcon }
export type { TabsListProps, TabsProps }
