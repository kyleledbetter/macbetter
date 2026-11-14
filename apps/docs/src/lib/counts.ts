import { readdirSync } from "node:fs"
import { join } from "node:path"
import { allDocSlugs } from "@/lib/docs"

/** Component modules the macbetter package ships, one file each, read at build time. */
function componentCount() {
  const dir = join(process.cwd(), "..", "..", "packages", "macbetter", "src", "components")
  return readdirSync(dir).filter((file) => file.endsWith(".tsx")).length
}

/** Component pages in these docs. */
function componentPageCount() {
  return allDocSlugs().filter((slug) => slug[0] === "components" && slug.length === 2).length
}

export { componentCount, componentPageCount }
