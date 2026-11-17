import { PlatformSync } from "./platform-sync"

type Platform = "macos" | "ipados" | "ios"
type PlatformChoice = Platform | "auto"

/** What "auto" means on this device: touch picks iOS or iPadOS by width, a pointer picks macOS. */
function resolvePlatform(view: Window = window): Platform {
  const coarse = view.matchMedia("(pointer: coarse)").matches
  if (!coarse) return "macos"
  return view.matchMedia("(min-width: 744px)").matches ? "ipados" : "ios"
}

type MacbetterScriptProps = {
  /** The platform to render, or `auto` to follow the device. */
  platform?: PlatformChoice
  /** localStorage key that holds a saved platform choice, if you let people pick. */
  storageKey?: string
  nonce?: string
}

/**
 * The script as a string, for a page React doesn't render on the server: paste it into a
 * `<script>` in `index.html`, before your app's bundle, so the platform is set before first paint.
 */
function platformScript({ platform = "auto", storageKey }: Pick<MacbetterScriptProps, "platform" | "storageKey"> = {}) {
  return `(function(){try{var d=document.documentElement,p=${JSON.stringify(platform)},k=${JSON.stringify(
    storageKey ?? null
  )};if(k){var s=localStorage.getItem(k);if(s==="macos"||s==="ipados"||s==="ios"||s==="auto")p=s}if(p==="auto"){p=matchMedia("(pointer: coarse)").matches?(matchMedia("(min-width: 744px)").matches?"ipados":"ios"):"macos"}d.setAttribute("data-platform",p)}catch(e){}})()`
}

/**
 * Sets `data-platform` on <html> before first paint, so the page never
 * flashes macOS metrics on a phone. Render it in <head> or first in <body>.
 *
 * A browser doesn't run a script React inserts on the client, so in a client-rendered
 * app the same choice is applied when this mounts. To set it before first paint there,
 * put `platformScript()` in `index.html`.
 */
function MacbetterScript({ platform = "auto", storageKey, nonce }: MacbetterScriptProps) {
  return (
    <>
      <script nonce={nonce} dangerouslySetInnerHTML={{ __html: platformScript({ platform, storageKey }) }} />
      <PlatformSync platform={platform} storageKey={storageKey} />
    </>
  )
}

export { resolvePlatform, platformScript, MacbetterScript }
export type { Platform, PlatformChoice, MacbetterScriptProps }
