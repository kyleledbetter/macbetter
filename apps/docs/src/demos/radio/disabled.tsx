import { Radio, RadioGroup } from "macbetter/radio"

export default function Example() {
  return (
    <RadioGroup aria-label="Video quality" defaultValue="hd">
      <Radio value="sd">Standard</Radio>
      <Radio value="hd">High Definition</Radio>
      <Radio value="4k" disabled description="Needs a faster connection.">
        4K
      </Radio>
    </RadioGroup>
  )
}
