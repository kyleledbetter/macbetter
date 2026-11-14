"use client"

import {
  ListRow,
  ListRowAccessory,
  ListRowIcon,
  ListRowSubtitle,
  ListRowTitle,
  ListRowValue,
} from "@dreambase/stardust/list"
import { Select, SelectContent, SelectItem, SelectList, SelectTrigger } from "@dreambase/stardust/select"
import { Slider } from "@dreambase/stardust/slider"
import { Switch } from "@dreambase/stardust/switch"
import type { ListRowIconProps } from "@dreambase/stardust/list"
import type * as React from "react"

type Icon = React.ComponentType<React.SVGProps<SVGSVGElement>>
type TileColor = NonNullable<ListRowIconProps["color"]>

function RowIcon({ icon: Glyph, color }: { icon?: Icon; color?: TileColor }) {
  if (!Glyph) return null
  return (
    <ListRowIcon color={color}>
      <Glyph aria-hidden="true" />
    </ListRowIcon>
  )
}

type ToggleRowProps = {
  title: string
  subtitle?: string
  checked: boolean
  onCheckedChange: (checked: boolean) => void
  icon?: Icon
  color?: TileColor
  disabled?: boolean
}

function ToggleRow({ title, subtitle, checked, onCheckedChange, icon, color, disabled }: ToggleRowProps) {
  return (
    <ListRow disabled={disabled}>
      <RowIcon icon={icon} color={color} />
      <ListRowTitle>{title}</ListRowTitle>
      {subtitle ? <ListRowSubtitle>{subtitle}</ListRowSubtitle> : null}
      <ListRowAccessory>
        <Switch
          aria-label={title}
          checked={checked}
          disabled={disabled}
          onCheckedChange={(next) => onCheckedChange(next)}
        />
      </ListRowAccessory>
    </ListRow>
  )
}

type Option = { value: string; label: string }

type SelectRowProps = {
  title: string
  subtitle?: string
  value: string
  options: Option[]
  onValueChange: (value: string) => void
  icon?: Icon
  color?: TileColor
}

function SelectRow({ title, subtitle, value, options, onValueChange, icon, color }: SelectRowProps) {
  return (
    <ListRow>
      <RowIcon icon={icon} color={color} />
      <ListRowTitle>{title}</ListRowTitle>
      {subtitle ? <ListRowSubtitle>{subtitle}</ListRowSubtitle> : null}
      <ListRowAccessory>
        <Select value={value} onValueChange={(next) => next && onValueChange(next as string)} items={options}>
          <SelectTrigger aria-label={title} size="sm" />
          <SelectContent>
            <SelectList>
              {options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectList>
          </SelectContent>
        </Select>
      </ListRowAccessory>
    </ListRow>
  )
}

type ValueRowProps = {
  title: string
  subtitle?: string
  value?: React.ReactNode
  icon?: Icon
  color?: TileColor
  onClick?: () => void
  disclosure?: boolean
  checked?: boolean
}

function ValueRow({ title, subtitle, value, icon, color, onClick, disclosure, checked }: ValueRowProps) {
  return (
    <ListRow onClick={onClick} aria-pressed={checked === undefined ? undefined : checked}>
      <RowIcon icon={icon} color={color} />
      <ListRowTitle>{title}</ListRowTitle>
      {subtitle ? <ListRowSubtitle>{subtitle}</ListRowSubtitle> : null}
      {value !== undefined ? <ListRowValue>{value}</ListRowValue> : null}
      {checked ? <ListRowAccessory type="checkmark" /> : null}
      {disclosure ? <ListRowAccessory type="disclosure" /> : null}
    </ListRow>
  )
}

type SliderRowProps = {
  label: string
  value: number
  onValueChange: (value: number) => void
  min?: Icon
  max?: Icon
  /** Shows the label as a title above the slider instead of only naming it. */
  showLabel?: boolean
  disabled?: boolean
}

function SliderRow({ label, value, onValueChange, min: Min, max: Max, showLabel = true, disabled }: SliderRowProps) {
  return (
    <ListRow className="ex-slider-row" disabled={disabled}>
      {showLabel ? <ListRowTitle>{label}</ListRowTitle> : null}
      <span className="ex-slider-row-control">
        {Min ? <Min aria-hidden="true" className="ex-slider-row-glyph" /> : null}
        <Slider
          value={value}
          disabled={disabled}
          onValueChange={(next) => onValueChange(next as number)}
          thumbLabel={label}
        />
        {Max ? <Max aria-hidden="true" className="ex-slider-row-glyph" /> : null}
      </span>
    </ListRow>
  )
}

export { RowIcon, SelectRow, SliderRow, ToggleRow, ValueRow }
export type { Icon, Option, TileColor }
