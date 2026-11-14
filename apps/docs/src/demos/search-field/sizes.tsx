import { SearchField } from "@dreambase/stardust/search-field"

export default function Example() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12, width: "100%", maxWidth: 260 }}>
      <SearchField size="sm" aria-label="Filter rows" placeholder="Filter" />
      <SearchField aria-label="Search" />
      <SearchField size="lg" aria-label="Search everything" />
    </div>
  )
}
