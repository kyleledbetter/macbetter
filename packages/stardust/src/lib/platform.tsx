type Platform = "macos" | "ipados" | "ios"
type PlatformChoice = Platform | "auto"

/** What "auto" means on this device: touch picks iOS or iPadOS by width, a pointer picks macOS. */
function resolvePlatform(view: Window = window): Platform {
  const coarse = view.matchMedia("(pointer: coarse)").matches
  if (!coarse) return "macos"
  return view.matchMedia("(min-width: 744px)").matches ? "ipados" : "ios"
}

type StardustScriptProps = {
  /** The platform to render, or `auto` to follow the device. */
  platform?: PlatformChoice
  /** localStorage key that holds a saved platform choice, if you let people pick. */
  storageKey?: string
  nonce?: string
}

/**
 * Sets `data-platform` on <html> before first paint, so the page never
 * flashes macOS metrics on a phone. Render it in <head> or first in <body>.
 */
function StardustScript({ platform = "auto", storageKey, nonce }: StardustScriptProps) {
  const code = `(function(){try{var d=document.documentElement,p=${JSON.stringify(platform)},k=${JSON.stringify(
    storageKey ?? null
  )};if(k){var s=localStorage.getItem(k);if(s==="macos"||s==="ipados"||s==="ios"||s==="auto")p=s}if(p==="auto"){p=matchMedia("(pointer: coarse)").matches?(matchMedia("(min-width: 744px)").matches?"ipados":"ios"):"macos"}d.setAttribute("data-platform",p)}catch(e){}})()`
  return <script nonce={nonce} dangerouslySetInnerHTML={{ __html: code }} />
}

export { resolvePlatform, StardustScript }
export type { Platform, PlatformChoice, StardustScriptProps }
