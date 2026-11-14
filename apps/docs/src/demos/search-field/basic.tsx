import { SearchField } from "@dreambase/stardust/search-field"

export default function Example() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12, width: "100%", maxWidth: 280 }}>
      <SearchField aria-label="Search boards" defaultValue="revenue" />
      <SearchField aria-label="Search datasets" placeholder="Search Datasets" />
    </div>
  )
}
