import { Button as ButtonPrimitive } from "@ui-sdk/react/button"
import type * as React from "react"
import { cx, join } from "../lib/cx"
import { ActivityIndicator } from "./activity-indicator"

type SceneTileProps = React.ComponentProps<typeof ButtonPrimitive> & {
  icon?: React.ReactNode
  /** The scene's name. Children work too. */
  name?: React.ReactNode
  /** Every accessory in the scene is set the way the scene sets it. */
  active?: boolean
  /** The scene is running: its accessories are still changing. */
  running?: boolean
  size?: "sm" | "md"
  /** What assistive tech hears for `active`, in the page's language. */
  activeLabel?: string
  /** Art behind the tile for the scene's mood, like `<Artwork variant="horizon" time="dawn" />`. Decorative. */
  background?: React.ReactNode
}

/** Runs a scene: a group of actions, like Good Morning or Movie Time. */
function SceneTile({
  icon,
  name,
  active,
  running,
  size = "md",
  activeLabel = "On",
  background,
  className,
  children,
  ...props
}: SceneTileProps) {
  return (
    <ButtonPrimitive
      data-size={size}
      data-active={active ? "" : undefined}
      data-running={running ? "" : undefined}
      data-background={background ? "" : undefined}
      aria-busy={running ? true : undefined}
      className={cx("mb-scene-tile", className)}
      {...props}
    >
      {background ? (
        <span className="mb-scene-tile-background" aria-hidden="true">
          {background}
        </span>
      ) : null}
      <span className="mb-scene-tile-icon" aria-hidden="true">
        {running ? <ActivityIndicator size="sm" aria-hidden="true" className="mb-scene-tile-spinner" /> : icon}
      </span>
      <span className="mb-scene-tile-name">{name ?? (children as React.ReactNode)}</span>
      {active ? <span className="mb-visually-hidden">{`, ${activeLabel}`}</span> : null}
    </ButtonPrimitive>
  )
}

/** The Home tab's row of scenes: it scrolls sideways on iPhone and wraps on iPad and Mac. Name it with `aria-label`. */
function SceneRow({ className, ...props }: React.ComponentProps<"div">) {
  return <div role="group" className={join("mb-scene-row", className)} {...props} />
}

export { SceneRow, SceneTile }
export type { SceneTileProps }
