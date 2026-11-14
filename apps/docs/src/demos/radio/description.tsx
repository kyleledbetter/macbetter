import { Radio, RadioGroup } from "macbetter/radio"

export default function Example() {
  return (
    <RadioGroup aria-label="Backup frequency" defaultValue="daily" style={{ maxWidth: 360 }}>
      <Radio value="hourly" description="Keeps the most recent 24 hours of changes.">
        Every hour
      </Radio>
      <Radio value="daily" description="Runs once a day while your Mac is idle.">
        Every day
      </Radio>
      <Radio value="weekly" description="Runs on Sunday night.">
        Every week
      </Radio>
    </RadioGroup>
  )
}
