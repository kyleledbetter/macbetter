"use client"

import {
  Field as FieldPrimitive,
  FieldDescription as FieldDescriptionPrimitive,
  FieldError as FieldErrorPrimitive,
  FieldGroup as FieldGroupPrimitive,
  FieldLabel as FieldLabelPrimitive,
  FieldLegend as FieldLegendPrimitive,
  FieldSet as FieldSetPrimitive,
} from "@ui-sdk/react/field"
import { Label as LabelPrimitive } from "@ui-sdk/react/label"
import type * as React from "react"
import { cx } from "../lib/cx"

type FieldLayout = "stacked" | "horizontal"

type FieldProps = React.ComponentProps<typeof FieldPrimitive> & {
  /**
   * `horizontal` puts the label beside the control, as in macOS forms and
   * inspectors; `stacked` puts it above. Inside a horizontal `FieldGroup` it
   * follows the group.
   */
  layout?: FieldLayout
}

function Field({ layout, className, ...props }: FieldProps) {
  return <FieldPrimitive data-layout={layout} className={cx("sd-field", className)} {...props} />
}

function FieldLabel({ className, ...props }: React.ComponentProps<typeof FieldLabelPrimitive>) {
  return <FieldLabelPrimitive className={cx("sd-field-label", className)} {...props} />
}

/** Renders a `div`, so a host page's paragraph margins never move it. */
function FieldDescription({ className, ...props }: React.ComponentProps<typeof FieldDescriptionPrimitive>) {
  return <FieldDescriptionPrimitive render={<div />} className={cx("sd-field-description", className)} {...props} />
}

function FieldError({ className, ...props }: React.ComponentProps<typeof FieldErrorPrimitive>) {
  return <FieldErrorPrimitive className={cx("sd-field-error", className)} {...props} />
}

type FieldGroupProps = React.ComponentProps<typeof FieldGroupPrimitive> & {
  /** `horizontal` lines every field's label up in one right-aligned column, like a macOS form. */
  layout?: FieldLayout
}

function FieldGroup({ layout = "stacked", className, ...props }: FieldGroupProps) {
  return <FieldGroupPrimitive data-layout={layout} className={cx("sd-field-group", className)} {...props} />
}

function FieldSet({ className, ...props }: React.ComponentProps<typeof FieldSetPrimitive>) {
  return <FieldSetPrimitive className={cx("sd-field-set", className)} {...props} />
}

function FieldLegend({ className, ...props }: React.ComponentProps<typeof FieldLegendPrimitive>) {
  return <FieldLegendPrimitive className={cx("sd-field-legend", className)} {...props} />
}

/** A label for a control outside a `Field`, pointed at it with `htmlFor`. */
function Label({ className, ...props }: React.ComponentProps<typeof LabelPrimitive>) {
  return <LabelPrimitive className={cx("sd-field-label", className)} {...props} />
}

export { Field, FieldDescription, FieldError, FieldGroup, FieldLabel, FieldLegend, FieldSet, Label }
export type { FieldGroupProps, FieldLayout, FieldProps }
