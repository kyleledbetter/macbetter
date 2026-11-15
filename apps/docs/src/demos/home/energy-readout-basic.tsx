import { EnergyReadout } from "macbetter/energy-readout"

const hours = ["12 PM", "1 PM", "2 PM", "3 PM", "4 PM", "5 PM", "6 PM", "7 PM", "8 PM", "9 PM", "10 PM", "11 PM"]
const forecast = hours.map((label, i) => ({ label, cleaner: i >= 4 && i <= 10 }))

export default function Example() {
  return (
    <EnergyReadout
      style={{ width: "min(100%, 380px)" }}
      forecast={forecast}
      now={1}
      summary="Cleaner energy 4–10 PM"
      usage={{ value: "18.4 kWh", label: "Used today" }}
    />
  )
}
