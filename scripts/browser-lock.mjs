// A machine-wide limit on headless browsers. Several people (and agents) drive
// Playwright in this repo at once; without a cap they pile up and stall the Mac.
//
//   import { withBrowserSlot } from "./browser-lock.mjs"
//   await withBrowserSlot(async () => { /* launch, shoot, close */ })
import { mkdirSync, rmdirSync, statSync } from "node:fs"
import { tmpdir } from "node:os"
import { join } from "node:path"

const slots = Number(process.env.STARDUST_BROWSER_SLOTS ?? 2)
const dir = join(tmpdir(), "stardust-browser-slots")
const stale = 3 * 60 * 1000

function tryAcquire() {
  mkdirSync(dir, { recursive: true })
  for (let i = 0; i < slots; i++) {
    const slot = join(dir, `slot-${i}`)
    try {
      mkdirSync(slot)
      return slot
    } catch {
      try {
        if (Date.now() - statSync(slot).mtimeMs > stale) rmdirSync(slot)
      } catch {}
    }
  }
  return null
}

async function withBrowserSlot(run) {
  let slot = tryAcquire()
  while (!slot) {
    await new Promise((resolve) => setTimeout(resolve, 400 + Math.random() * 400))
    slot = tryAcquire()
  }
  const release = () => {
    try {
      rmdirSync(slot)
    } catch {}
  }
  process.once("exit", release)
  process.once("SIGINT", () => process.exit(130))
  process.once("SIGTERM", () => process.exit(143))
  try {
    return await run()
  } finally {
    release()
  }
}

export { withBrowserSlot }
