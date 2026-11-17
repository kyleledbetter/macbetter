// Works out which stylesheets each component needs, for apps that import styles one component at a time.
// A component needs its own file, the files of the components it renders, and the file of any
// other component whose classes it uses (Select's popup is drawn with menu.css).
import { existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"

const src = join(dirname(fileURLToPath(import.meta.url)), "..", "src")
const names = readdirSync(join(src, "components"))
  .filter((file) => file.endsWith(".tsx"))
  .map((file) => file.replace(/\.tsx$/, ""))
  .sort()
const sheets = new Set(names.filter((name) => existsSync(join(src, "styles", "components", `${name}.css`))))
const byLength = [...sheets].sort((a, b) => b.length - a.length)

function direct(name) {
  const code = readFileSync(join(src, "components", `${name}.tsx`), "utf8")
  const found = new Set()
  for (const [, path] of code.matchAll(/from "\.\/([a-z0-9-]+)"/g)) if (names.includes(path)) found.add(path)
  for (const [, cls] of code.matchAll(/["'`\s]mb-([a-z0-9-]+)/g)) {
    const owner = byLength.find((sheet) => cls === sheet || cls.startsWith(`${sheet}-`))
    if (owner && owner !== name) found.add(owner)
  }
  return found
}

const cache = new Map()
function all(name, seen = new Set()) {
  if (cache.has(name)) return cache.get(name)
  seen.add(name)
  const needs = new Set()
  for (const dep of direct(name)) {
    if (seen.has(dep)) continue
    needs.add(dep)
    for (const inner of all(dep, seen)) needs.add(inner)
  }
  needs.delete(name)
  cache.set(name, needs)
  return needs
}

const dependencies = {}
for (const name of names) {
  const needs = [...all(name, new Set())].filter((dep) => sheets.has(dep)).sort()
  if (needs.length) dependencies[name] = needs
}

writeFileSync(join(src, "styles", "components", "dependencies.json"), `${JSON.stringify(dependencies, null, 2)}\n`)
console.log(`${Object.keys(dependencies).length} components need another component's stylesheet`)
