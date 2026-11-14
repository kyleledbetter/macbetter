"use client"

import { ColorWell } from "macbetter/color-well"
import { TextField } from "macbetter/text-field"
import { useEffect, useId, useState } from "react"
import { normalizeHex } from "./derive"

type ColorRowProps = {
  label: string
  value: string
  onChange: (hex: string) => void
}

/** A labeled color: a well that opens the editor, and a hex field for typing or pasting. */
function ColorRow({ label, value, onChange }: ColorRowProps) {
  const id = useId()
  const [draft, setDraft] = useState(value)
  useEffect(() => setDraft(value), [value])
  const invalid = normalizeHex(draft) === null

  const commit = () => {
    const hex = normalizeHex(draft)
    if (hex) {
      setDraft(hex)
      if (hex !== value) onChange(hex)
    } else setDraft(value)
  }

  return (
    <div className="ts-row">
      <label htmlFor={id} className="ts-row-label">
        {label}
      </label>
      <div className="ts-row-control">
        <TextField
          id={id}
          size="sm"
          className="ts-hex"
          value={draft}
          spellCheck={false}
          autoComplete="off"
          aria-invalid={invalid || undefined}
          aria-label={`${label}, hex`}
          onChange={(event) => setDraft(event.currentTarget.value)}
          onBlur={commit}
          onKeyDown={(event) => {
            if (event.key === "Enter") commit()
            if (event.key === "Escape") setDraft(value)
          }}
        />
        <ColorWell
          aria-label={label}
          size="sm"
          alpha={false}
          side="right"
          align="center"
          value={value}
          onValueChange={(next) => {
            const hex = normalizeHex(next)
            if (hex && hex !== value) onChange(hex)
          }}
        />
      </div>
    </div>
  )
}

export { ColorRow }
