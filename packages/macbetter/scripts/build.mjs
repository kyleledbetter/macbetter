// Compiles src to dist for npm: one JavaScript file and one declaration file per source file,
// with the stylesheets copied beside them. Nothing is bundled, so each file keeps its "use client".
import { execFileSync } from "node:child_process"
import { cpSync, existsSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from "node:fs"
import { dirname, join, resolve } from "node:path"
import { fileURLToPath } from "node:url"

const root = join(dirname(fileURLToPath(import.meta.url)), "..")
const dist = join(root, "dist")

rmSync(dist, { recursive: true, force: true })
execFileSync("pnpm", ["exec", "tsc", "-p", "tsconfig.build.json"], { cwd: root, stdio: "inherit" })

function walk(dir) {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name)
    return statSync(path).isDirectory() ? walk(path) : [path]
  })
}

// Node and browsers resolve ES module paths exactly, so relative imports need their extension.
const specifier = /(\bfrom\s*|\bimport\s*\(?\s*)(["'])(\.{1,2}\/[^"']+)\2/g
let files = 0
for (const file of walk(dist)) {
  if (!/\.(js|d\.ts)$/.test(file)) continue
  const source = readFileSync(file, "utf8")
  const output = source.replace(specifier, (match, lead, quote, path) => {
    if (/\.(js|css|json)$/.test(path)) return match
    const target = resolve(dirname(file), path)
    if (existsSync(`${target}.js`)) return `${lead}${quote}${path}.js${quote}`
    if (existsSync(join(target, "index.js"))) return `${lead}${quote}${path}/index.js${quote}`
    throw new Error(`${file}: cannot resolve ${path}`)
  })
  if (output !== source) writeFileSync(file, output)
  files += 1
}

cpSync(join(root, "src", "styles"), join(dist, "styles"), { recursive: true })

console.log(`Built ${files} files and ${walk(join(dist, "styles")).length} stylesheets to dist`)
