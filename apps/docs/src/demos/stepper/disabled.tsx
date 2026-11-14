import { NumberField, Stepper } from "macbetter/stepper"

export default function Example() {
  return (
    <>
      <NumberField disabled aria-label="Retries" defaultValue={3} />
      <Stepper disabled aria-label="Retries" defaultValue={3} />
    </>
  )
}
