import type * as React from "react"
import { join } from "../lib/cx"
import { Artwork, type ArtworkPalette, type ArtworkTime, type ArtworkVariant } from "./artwork"

type HomeBackdropProps = React.ComponentProps<"div"> & {
  /** The home's or the room's name. The same name draws the same wallpaper. */
  seed: string
  /** `wash` is a soft color field; `horizon` and `window` are the other background variants. */
  variant?: ArtworkVariant
  palette?: ArtworkPalette
  time?: ArtworkTime
  /** Width over height of the screen it fills. The art is drawn for it and cropped to fit. */
  aspect?: number
  /** How far the wallpaper recedes behind tiles and text, from 0 to 1. */
  dim?: number
  /** A photo to show instead of drawn art, like one a person chose for the room. It's blurred and dimmed the same way. */
  src?: string
}

/**
 * A home's or a room's wallpaper, painted behind its children. The wallpaper stays put; make a child
 * the scrolling element so tiles move over it.
 */
function HomeBackdrop({
  seed,
  variant = "wash",
  palette,
  time,
  aspect = 1,
  dim = 0.35,
  src,
  className,
  style,
  children,
  ...props
}: HomeBackdropProps) {
  const veil = Number.isFinite(dim) ? Math.min(1, Math.max(0, dim)) : 0.35
  return (
    <div
      className={join("mb-home-backdrop", className)}
      style={{ "--mb-home-backdrop-dim": String(veil), ...style } as React.CSSProperties}
      {...props}
    >
      <div className="mb-home-backdrop-layer" aria-hidden="true">
        {src ? (
          <img className="mb-home-backdrop-image" src={src} alt="" decoding="async" />
        ) : (
          <Artwork seed={seed} variant={variant} palette={palette} time={time} aspect={aspect} shape="square" finish="flat" />
        )}
      </div>
      {children}
    </div>
  )
}

export { HomeBackdrop }
export type { HomeBackdropProps }
