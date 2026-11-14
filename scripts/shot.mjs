// Screenshot a docs page in a real browser.
//
//   node scripts/shot.mjs <path> <out.png> [--width 1440] [--height 900] [--full]
//     [--scheme light|dark] [--theme name] [--mobile] [--click "selector"]...
//     [--opaque] (reduced transparency) [--reduced] (reduced motion)
//     [--press Key]... [--hover "selector"] [--wait ms] [--selector "css"] [--eval "js"]
//
// Steps (--click, --press, --hover, --eval) run in the order given. Console
// errors and failed requests print to stderr, so a clean run is a real signal.
import { chromium, devices } from "@playwright/test"
import { withBrowserSlot } from "./browser-lock.mjs"

const args = process.argv.slice(2)
const [path, out] = args
const steps = []
const options = { width: 1440, height: 900, full: false, wait: 350, base: "http://localhost:4173" }

for (let i = 2; i < args.length; i++) {
  const flag = args[i]
  if (flag === "--full") options.full = true
  else if (flag === "--opaque") options.opaque = true
  else if (flag === "--reduced") options.reduced = true
  else if (flag === "--mobile") options.mobile = true
  else if (["--click", "--press", "--hover", "--eval", "--type"].includes(flag)) {
    steps.push([flag.slice(2), args[++i]])
  } else options[flag.slice(2)] = args[++i]
}

await withBrowserSlot(async () => {
const browser = await chromium.launch()
const context = await browser.newContext(
  options.mobile
    ? { ...devices["iPhone 15"], colorScheme: options.scheme ?? "dark" }
    : {
        viewport: { width: Number(options.width), height: Number(options.height) },
        deviceScaleFactor: 2,
        colorScheme: options.scheme ?? "dark",
      }
)
const page = await context.newPage()
// Headless Chromium claims prefers-reduced-transparency, which turns every material opaque.
const cdp = await context.newCDPSession(page)
await cdp.send("Emulation.setEmulatedMedia", {
  features: [
    { name: "prefers-reduced-transparency", value: options.opaque ? "reduce" : "no-preference" },
    ...(options.reduced ? [{ name: "prefers-reduced-motion", value: "reduce" }] : []),
  ],
})
page.on("console", (message) => {
  if (message.type() === "error") console.error("console:", message.text())
})
page.on("pageerror", (error) => console.error("pageerror:", error.message))
page.on("requestfailed", (request) => console.error("failed:", request.url()))

if (options.scheme || options.theme) {
  await page.addInitScript(
    ([scheme, theme]) => {
      if (scheme) localStorage.setItem("macbetter-scheme", scheme)
      if (theme) localStorage.setItem("macbetter-theme", theme)
    },
    [options.scheme, options.theme]
  )
}

await page.goto(options.base + path, { waitUntil: "networkidle" })
for (const [kind, value] of steps) {
  if (kind === "click") await page.locator(value).first().click()
  else if (kind === "press") await page.keyboard.press(value)
  else if (kind === "hover") await page.locator(value).first().hover()
  else if (kind === "type") await page.keyboard.type(value)
  else if (kind === "eval") console.log(JSON.stringify(await page.evaluate(value)))
  await page.waitForTimeout(250)
}
await page.waitForTimeout(Number(options.wait))

if (options.selector) await page.locator(options.selector).first().screenshot({ path: out })
else await page.screenshot({ path: out, fullPage: options.full })
await browser.close()
})
