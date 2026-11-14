import { Badge } from "macbetter/badge"

const services = [
  { name: "API", status: "Operational", color: "green" },
  { name: "Dashboards", status: "Degraded", color: "yellow" },
  { name: "Webhooks", status: "Outage", color: "red" },
  { name: "Exports", status: "Paused", color: "gray" },
] as const

export default function Example() {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "auto auto", gap: "10px 32px", alignItems: "center" }}>
      {services.map((service) => (
        <div key={service.name} style={{ display: "contents" }}>
          <span>{service.name}</span>
          <Badge variant="dot" color={service.color}>
            {service.status}
          </Badge>
        </div>
      ))}
    </div>
  )
}
