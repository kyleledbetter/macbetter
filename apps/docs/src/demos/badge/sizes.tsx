import { Badge } from "macbetter/badge"
import { SparklesIcon } from "lucide-react"

export default function Example() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <Badge size="sm">Beta</Badge>
      <Badge>Beta</Badge>
      <Badge variant="filled">
        <SparklesIcon aria-hidden="true" />
        Pro
      </Badge>
      <Badge variant="filled" color="green">
        Paid
      </Badge>
    </div>
  )
}
