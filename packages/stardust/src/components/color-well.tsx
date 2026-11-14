import {
  ColorPicker,
  ColorPickerArea,
  ColorPickerAreaThumb,
  ColorPickerEyeDropper,
  ColorPickerInput,
  ColorPickerSlider,
  ColorPickerSliderThumb,
  ColorPickerSwatch,
  ColorPickerSwatches,
  ColorPickerSwatchItem,
} from "@ui-sdk/react/color-picker"
import { Popover, PopoverContent, PopoverTrigger } from "@ui-sdk/react/popover"
import type * as React from "react"
import { cx } from "../lib/cx"

/** Apple's system colors, light appearance. */
const systemColors = [
  "#ff3b30",
  "#ff9500",
  "#ffcc00",
  "#34c759",
  "#00c7be",
  "#30b0c7",
  "#007aff",
  "#5856d6",
  "#af52de",
  "#ff2d55",
  "#a2845e",
  "#8e8e93",
]

type ColorWellProps = Omit<React.ComponentProps<typeof ColorPicker>, "children"> & {
  /** Extra content at the end of the editor. */
  children?: React.ReactNode
  /** Preset colors under the editor. Pass `[]` for none. */
  presets?: readonly string[]
  /** Shows the opacity slider. */
  alpha?: boolean
  size?: "sm" | "md" | "lg"
  /** `auto` opens a bottom sheet on small touch screens, as UIColorWell does. */
  presentation?: React.ComponentProps<typeof Popover>["presentation"]
  side?: React.ComponentProps<typeof PopoverContent>["side"]
  align?: React.ComponentProps<typeof PopoverContent>["align"]
}

/**
 * A swatch button that opens a color editor in a popover: an area for saturation and brightness,
 * hue and opacity sliders, a hex field and presets. `aria-label` names both the picker and the button.
 */
function ColorWell({
  presets = systemColors,
  alpha = true,
  size = "md",
  presentation = "auto",
  side = "bottom",
  align = "start",
  space = "hsv",
  format = "hex",
  className,
  children,
  "aria-label": label,
  ...props
}: ColorWellProps) {
  return (
    <ColorPicker
      aria-label={label}
      space={space}
      format={format}
      data-size={size}
      className={cx("sd-color-well", className)}
      {...props}
    >
      <Popover presentation={presentation}>
        <PopoverTrigger aria-label={label} className="sd-color-well-trigger">
          <ColorPickerSwatch aria-hidden="true" className="sd-color-well-swatch" />
        </PopoverTrigger>
        <PopoverContent side={side} align={align} sideOffset={6} className="sd-color-well-panel">
          <ColorPickerArea className="sd-color-well-area">
            <ColorPickerAreaThumb className="sd-color-well-thumb" />
          </ColorPickerArea>
          <div className="sd-color-well-sliders">
            <ColorPickerSlider channel="hue" className="sd-color-well-slider">
              <ColorPickerSliderThumb className="sd-color-well-thumb" />
            </ColorPickerSlider>
            {alpha ? (
              <ColorPickerSlider channel="alpha" className="sd-color-well-slider">
                <ColorPickerSliderThumb className="sd-color-well-thumb" />
              </ColorPickerSlider>
            ) : null}
          </div>
          <div className="sd-color-well-fields">
            <ColorPickerSwatch className="sd-color-well-preview" />
            <ColorPickerInput aria-label="Hex" className="sd-color-well-input" />
            <ColorPickerEyeDropper aria-label="Pick a color from the screen" className="sd-color-well-eyedropper">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="m2 22 1-1h3l9-9" />
                <path d="M3 21v-3l9-9" />
                <path d="m15 6 3.4-3.4a2.1 2.1 0 1 1 3 3L18 9l.4.4a2.1 2.1 0 1 1-3 3l-3.8-3.8a2.1 2.1 0 1 1 3-3l.4.4Z" />
              </svg>
            </ColorPickerEyeDropper>
          </div>
          {presets.length > 0 ? (
            <ColorPickerSwatches aria-label="Presets" className="sd-color-well-presets">
              {presets.map((preset) => (
                <ColorPickerSwatchItem key={preset} value={preset} className="sd-color-well-preset" />
              ))}
            </ColorPickerSwatches>
          ) : null}
          {children}
        </PopoverContent>
      </Popover>
    </ColorPicker>
  )
}

export { ColorWell }
export type { ColorWellProps }
