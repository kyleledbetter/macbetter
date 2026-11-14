import { NumberField } from "macbetter/stepper"

export default function Example() {
  return (
    <>
      <NumberField size="sm" aria-label="Columns" defaultValue={3} min={1} max={12} />
      <NumberField size="md" aria-label="Rows" defaultValue={8} min={1} max={100} />
    </>
  )
}
