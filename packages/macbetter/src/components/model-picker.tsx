"use client"

import * as React from "react"
import { cx, join } from "../lib/cx"
import type { ButtonSize } from "./button"
import {
  Menu,
  MenuContent,
  MenuGroupLabel,
  type MenuProps,
  MenuRadioGroup,
  MenuRadioItem,
  MenuSeparator,
  MenuTrigger,
} from "./menu"

type ModelPickerModel = {
  value: string
  label: string
  /** One line about when to pick it, under its name in the menu. */
  description?: string
  disabled?: boolean
}

type ModelPickerEffortLevel = {
  value: string
  label: string
  description?: string
}

type ModelPickerContextValue = {
  models: readonly ModelPickerModel[]
  efforts: readonly ModelPickerEffortLevel[]
  value: string | null
  setValue: (value: string) => void
  effort: string | null
  setEffort: (effort: string) => void
  modelsLabel: string
  effortLabel: string
}

const ModelPickerContext = React.createContext<ModelPickerContextValue | null>(null)

function useModelPicker(part: string) {
  const context = React.useContext(ModelPickerContext)
  if (!context) throw new Error(`${part} must be inside a ModelPicker.`)
  return context
}

function useControllable<T>(value: T | undefined, defaultValue: T, onChange?: (next: T) => void) {
  const [own, setOwn] = React.useState(defaultValue)
  const current = value !== undefined ? value : own
  const set = React.useCallback(
    (next: T) => {
      if (value === undefined) setOwn(next)
      onChange?.(next)
    },
    [value, onChange]
  )
  return [current, set] as const
}

type ModelPickerProps = Omit<MenuProps, "children"> & {
  models: readonly ModelPickerModel[]
  /** Effort levels, listed as a second group. Leave out for models without one. */
  efforts?: readonly ModelPickerEffortLevel[]
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  effort?: string
  defaultEffort?: string
  onEffortChange?: (effort: string) => void
  /** The heading over the models in the menu. */
  modelsLabel?: string
  /** The heading over the effort levels in the menu. */
  effortLabel?: string
  size?: ButtonSize
  disabled?: boolean
  /** Names the trigger for assistive tech, when its text alone isn't enough. */
  "aria-label"?: string
  className?: string
  /** Replaces the menu's generated body, for a layout of your own built from the ModelPicker parts. */
  children?: React.ReactNode
}

/** One compact control that shows the model and effort ("Atlas 4 · High") and opens a menu to change them. */
function ModelPicker({
  models,
  efforts = [],
  value: valueProp,
  defaultValue,
  onValueChange,
  effort: effortProp,
  defaultEffort,
  onEffortChange,
  modelsLabel = "Model",
  effortLabel = "Effort",
  size = "md",
  disabled,
  "aria-label": ariaLabel,
  className,
  presentation = "auto",
  children,
  ...props
}: ModelPickerProps) {
  const [value, setValue] = useControllable<string | null>(
    valueProp,
    defaultValue ?? models[0]?.value ?? null,
    onValueChange as ((next: string | null) => void) | undefined
  )
  const [effort, setEffort] = useControllable<string | null>(
    effortProp,
    defaultEffort ?? efforts[0]?.value ?? null,
    onEffortChange as ((next: string | null) => void) | undefined
  )
  const model = models.find((entry) => entry.value === value)
  const level = efforts.find((entry) => entry.value === effort)

  const context: ModelPickerContextValue = {
    models,
    efforts,
    value,
    setValue,
    effort,
    setEffort,
    modelsLabel,
    effortLabel,
  }

  return (
    <ModelPickerContext.Provider value={context}>
      <Menu presentation={presentation} {...props}>
        <MenuTrigger
          variant="plain"
          tone="neutral"
          size={size}
          disabled={disabled}
          aria-label={ariaLabel}
          className={join("mb-model-picker", className)}
        >
          <span className="mb-model-picker-name">{model?.label ?? modelsLabel}</span>
          {level ? (
            <>
              <span className="mb-visually-hidden">, </span>
              <span aria-hidden="true" className="mb-model-picker-dot">
                ·
              </span>
              <span className="mb-model-picker-effort">{level.label}</span>
            </>
          ) : null}
        </MenuTrigger>
        <MenuContent className="mb-model-picker-content">
          {children ?? (
            <>
              <ModelPickerGroup>
                {models.map((entry) => (
                  <ModelPickerItem
                    key={entry.value}
                    value={entry.value}
                    description={entry.description}
                    disabled={entry.disabled}
                  >
                    {entry.label}
                  </ModelPickerItem>
                ))}
              </ModelPickerGroup>
              {efforts.length ? (
                <>
                  <MenuSeparator />
                  <ModelPickerEffort />
                </>
              ) : null}
            </>
          )}
        </MenuContent>
      </Menu>
    </ModelPickerContext.Provider>
  )
}

type ModelPickerGroupProps = Omit<
  React.ComponentProps<typeof MenuRadioGroup>,
  "value" | "defaultValue" | "onValueChange" | "children"
> & {
  children?: React.ReactNode
  /** The group's heading. Defaults to the picker's `modelsLabel`; pass `null` for none. */
  label?: React.ReactNode
}

/** The radio group of models. `ModelPickerItem`s go inside. */
function ModelPickerGroup({ label, className, children, ...props }: ModelPickerGroupProps) {
  const { value, setValue, modelsLabel } = useModelPicker("ModelPickerGroup")
  const heading = label === undefined ? modelsLabel : label
  return (
    <MenuRadioGroup
      value={value}
      onValueChange={(next) => setValue(next)}
      className={cx("mb-model-picker-group", className)}
      {...props}
    >
      {heading ? <MenuGroupLabel>{heading}</MenuGroupLabel> : null}
      {children}
    </MenuRadioGroup>
  )
}

type ModelPickerItemProps = React.ComponentProps<typeof MenuRadioItem> & {
  description?: React.ReactNode
}

/** A model: its name, with a one-line description under it. */
function ModelPickerItem({
  description,
  closeOnSelect = true,
  label,
  className,
  children,
  ...props
}: ModelPickerItemProps) {
  return (
    <MenuRadioItem
      closeOnSelect={closeOnSelect}
      label={label ?? (typeof children === "string" ? children : undefined)}
      className={cx("mb-model-picker-item", className)}
      {...props}
    >
      <span className="mb-model-picker-item-text">
        <span className="mb-model-picker-item-label">{children}</span>
        {description ? <span className="mb-model-picker-item-description">{description}</span> : null}
      </span>
    </MenuRadioItem>
  )
}

type ModelPickerEffortProps = Omit<
  React.ComponentProps<typeof MenuRadioGroup>,
  "value" | "defaultValue" | "onValueChange" | "children"
> & {
  /** The group's heading. Defaults to the picker's `effortLabel`; pass `null` for none. */
  label?: React.ReactNode
}

/** The radio group of effort levels, from the picker's `efforts`. */
function ModelPickerEffort({ label, className, ...props }: ModelPickerEffortProps) {
  const { efforts, effort, setEffort, effortLabel } = useModelPicker("ModelPickerEffort")
  const heading = label === undefined ? effortLabel : label
  return (
    <MenuRadioGroup
      value={effort}
      onValueChange={(next) => setEffort(next)}
      className={cx("mb-model-picker-group", className)}
      {...props}
    >
      {heading ? <MenuGroupLabel>{heading}</MenuGroupLabel> : null}
      {efforts.map((entry) => (
        <ModelPickerItem key={entry.value} value={entry.value} description={entry.description} closeOnSelect={false}>
          {entry.label}
        </ModelPickerItem>
      ))}
    </MenuRadioGroup>
  )
}

/** A line between groups in a custom picker layout. */
const ModelPickerSeparator = MenuSeparator

export { ModelPicker, ModelPickerEffort, ModelPickerGroup, ModelPickerItem, ModelPickerSeparator }
export type {
  ModelPickerEffortLevel,
  ModelPickerEffortProps,
  ModelPickerGroupProps,
  ModelPickerItemProps,
  ModelPickerModel,
  ModelPickerProps,
}
