import { Radio, RadioGroup } from "@dreambase/stardust/radio"

export default function Example() {
  return (
    <RadioGroup variant="list" aria-label="Auto-Lock" defaultValue="60" style={{ width: "100%", maxWidth: 360 }}>
      <Radio value="30">30 seconds</Radio>
      <Radio value="60">1 minute</Radio>
      <Radio value="120">2 minutes</Radio>
      <Radio value="300">5 minutes</Radio>
      <Radio value="never">Never</Radio>
    </RadioGroup>
  )
}
