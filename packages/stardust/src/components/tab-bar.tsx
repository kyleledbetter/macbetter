import {
  Tabs,
  TabsIndicator,
  TabsList,
  TabsPanel,
  TabsTab,
  TabsTabIcon,
} from "@ui-sdk/react/tabs"
import type * as React from "react"
import { cx } from "../lib/cx"

type TabBarProps = React.ComponentProps<typeof Tabs>

/** The app's top-level sections: the panels, with the tab bar floating over them. */
function TabBar({ className, ...props }: TabBarProps) {
  return <Tabs className={cx("sd-tab-bar", className)} {...props} />
}

function TabBarPanel({ className, ...props }: React.ComponentProps<typeof TabsPanel>) {
  return <TabsPanel className={cx("sd-tab-bar-panel", className)} {...props} />
}

type TabBarListProps = Omit<React.ComponentProps<typeof TabsList>, "children"> & {
  children?: React.ReactNode
  /** `floating` is the glass capsule of iOS 26; `classic` is the full-width translucent bar. */
  variant?: "floating" | "classic"
}

function TabBarList({ variant = "floating", className, children, ...props }: TabBarListProps) {
  return (
    <TabsList
      data-variant={variant}
      className={cx(variant === "floating" ? "sd-tab-bar-list sd-glass" : "sd-tab-bar-list", className)}
      {...props}
    >
      {variant === "floating" ? <TabsIndicator className="sd-tab-bar-indicator" /> : null}
      {children}
    </TabsList>
  )
}

type TabBarItemProps = Omit<React.ComponentProps<typeof TabsTab>, "children"> & {
  children?: React.ReactNode
  /** The tab's symbol, drawn above its label. Decorative: the label names the tab. */
  icon?: React.ReactNode
}

function TabBarItem({ icon, className, children, ...props }: TabBarItemProps) {
  return (
    <TabsTab className={cx("sd-tab-bar-item", className)} {...props}>
      {icon ? <TabsTabIcon className="sd-tab-bar-item-icon">{icon}</TabsTabIcon> : null}
      <span className="sd-tab-bar-item-label">{children}</span>
    </TabsTab>
  )
}

export { TabBar, TabBarItem, TabBarList, TabBarPanel }
export type { TabBarItemProps, TabBarListProps, TabBarProps }
