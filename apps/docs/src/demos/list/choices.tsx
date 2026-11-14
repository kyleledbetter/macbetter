"use client"

import { List, ListRow, ListRowAccessory, ListRowTitle, ListSection } from "@dreambase/stardust/list"
import { useState } from "react"

const appearances = ["Light", "Dark", "Automatic"]

export default function Example() {
  const [appearance, setAppearance] = useState("Automatic")

  return (
    <List style={{ width: "100%", maxWidth: 560, marginInline: "auto" }}>
      <ListSection header="Appearance" footer="Automatic switches to Dark at sunset.">
        {appearances.map((option) => (
          <ListRow key={option} aria-pressed={appearance === option} onClick={() => setAppearance(option)}>
            <ListRowTitle>{option}</ListRowTitle>
            {appearance === option ? <ListRowAccessory type="checkmark" /> : null}
          </ListRow>
        ))}
      </ListSection>
    </List>
  )
}
