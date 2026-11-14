import { Radio, RadioGroup } from "@dreambase/stardust/radio"

export default function Example() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <span id="appearance" style={{ font: "var(--sd-text-headline)" }}>
        Appearance
      </span>
      <RadioGroup aria-labelledby="appearance" defaultValue="auto">
        <Radio value="light">Light</Radio>
        <Radio value="dark">Dark</Radio>
        <Radio value="auto">Automatic</Radio>
      </RadioGroup>
    </div>
  )
}
