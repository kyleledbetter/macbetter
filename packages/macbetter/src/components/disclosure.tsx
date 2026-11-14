import {
  Accordion,
  AccordionHeader,
  AccordionItem,
  AccordionPanel,
  AccordionTrigger,
} from "@ui-sdk/react/accordion"
import { Collapsible, CollapsiblePanel, CollapsibleTrigger } from "@ui-sdk/react/collapsible"
import type * as React from "react"
import { cx } from "../lib/cx"

type DisclosureVariant = "grouped" | "plain"

function Chevron() {
  return (
    <svg className="mb-disclosure-chevron" viewBox="0 0 8 14" aria-hidden="true">
      <path d="M1.5 1.5 6.5 7l-5 5.5" />
    </svg>
  )
}

type DisclosureGroupProps = React.ComponentProps<typeof Accordion> & {
  /** `grouped` draws the rows in an inset grouped box, like a Settings list; `plain` draws bare rows. */
  variant?: DisclosureVariant
}

/** Several disclosures in a group: by default one opens at a time; `multiple` lets several open. */
function DisclosureGroup({ variant = "grouped", className, ...props }: DisclosureGroupProps) {
  return <Accordion data-variant={variant} className={cx("mb-disclosure-group", className)} {...props} />
}

function DisclosureItem({ className, ...props }: React.ComponentProps<typeof AccordionItem>) {
  return <AccordionItem className={cx("mb-disclosure-item", className)} {...props} />
}

/** The heading around a trigger. It renders an `h3`; pick the level that fits with `render`. */
function DisclosureHeader({ className, ...props }: React.ComponentProps<typeof AccordionHeader>) {
  return <AccordionHeader className={cx("mb-disclosure-header", className)} {...props} />
}

function DisclosureTrigger({ className, children, ...props }: Omit<React.ComponentProps<typeof AccordionTrigger>, "children"> & { children?: React.ReactNode }) {
  return (
    <AccordionTrigger className={cx("mb-disclosure-trigger", className)} {...props}>
      <Chevron />
      <span className="mb-disclosure-label">{children}</span>
    </AccordionTrigger>
  )
}

function DisclosurePanel({ className, children, ...props }: Omit<React.ComponentProps<typeof AccordionPanel>, "children"> & { children?: React.ReactNode }) {
  return (
    <AccordionPanel className={cx("mb-disclosure-panel", className)} {...props}>
      <div className="mb-disclosure-content">{children}</div>
    </AccordionPanel>
  )
}

type DisclosureProps = React.ComponentProps<typeof Collapsible> & {
  variant?: DisclosureVariant
}

/** One disclosure on its own, like "Advanced" under a form. */
function Disclosure({ variant = "plain", className, ...props }: DisclosureProps) {
  return <Collapsible data-variant={variant} className={cx("mb-disclosure", className)} {...props} />
}

function DisclosureButton({ className, children, ...props }: Omit<React.ComponentProps<typeof CollapsibleTrigger>, "children"> & { children?: React.ReactNode }) {
  return (
    <CollapsibleTrigger className={cx("mb-disclosure-trigger", className)} {...props}>
      <Chevron />
      <span className="mb-disclosure-label">{children}</span>
    </CollapsibleTrigger>
  )
}

function DisclosureContent({ className, children, ...props }: Omit<React.ComponentProps<typeof CollapsiblePanel>, "children"> & { children?: React.ReactNode }) {
  return (
    <CollapsiblePanel className={cx("mb-disclosure-panel", className)} {...props}>
      <div className="mb-disclosure-content">{children}</div>
    </CollapsiblePanel>
  )
}

export {
  Disclosure,
  DisclosureButton,
  DisclosureContent,
  DisclosureGroup,
  DisclosureHeader,
  DisclosureItem,
  DisclosurePanel,
  DisclosureTrigger,
}
export type { DisclosureGroupProps, DisclosureProps, DisclosureVariant }
