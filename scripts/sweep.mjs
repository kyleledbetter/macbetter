// Visits every route once, on desktop and on a phone, in one browser.
// Reports console errors, failed requests and horizontal overflow.
//
//   node scripts/sweep.mjs [base-url]
import { chromium, devices } from "@playwright/test"
import { withBrowserSlot } from "./browser-lock.mjs"

const base = process.argv[2] ?? "http://localhost:4173"

await withBrowserSlot(async () => {
  const browser = await chromium.launch()
  try {
    const sitemap = await (await fetch(`${base}/sitemap.xml`)).text()
    const paths = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => new URL(match[1]).pathname)
    const problems = []

    for (const [name, options] of [
      ["desktop", { viewport: { width: 1440, height: 900 }, colorScheme: "dark" }],
      ["phone", { ...devices["iPhone 15"], colorScheme: "dark" }],
    ]) {
      const context = await browser.newContext(options)
      const page = await context.newPage()
      let current = ""
      page.on("console", (message) => {
        if (message.type() === "error") problems.push(`${name} ${current}: console: ${message.text().slice(0, 200)}`)
      })
      page.on("pageerror", (error) => problems.push(`${name} ${current}: pageerror: ${error.message.slice(0, 200)}`))
      page.on("response", (response) => {
        if (response.status() >= 400) problems.push(`${name} ${current}: ${response.status()} ${response.url()}`)
      })
      for (const path of paths) {
        current = path
        await page.goto(base + path, { waitUntil: "networkidle" })
        const overflow = await page.evaluate(
          () => document.documentElement.scrollWidth - document.documentElement.clientWidth
        )
        if (overflow > 1) problems.push(`${name} ${path}: page scrolls sideways by ${overflow}px`)
      }
      await context.close()
    }

    console.log(`${paths.length} routes checked on desktop and phone`)
    console.log(problems.length ? problems.join("\n") : "No problems found")
    process.exitCode = problems.length ? 1 : 0
  } finally {
    await browser.close()
  }
})
