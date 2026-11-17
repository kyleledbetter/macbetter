import { Button } from "macbetter/button"
import {
  ContentUnavailable,
  ContentUnavailableActions,
  ContentUnavailableDescription,
  ContentUnavailableIcon,
  ContentUnavailableTitle,
} from "macbetter/content-unavailable"
import { WifiOffIcon } from "lucide-react"

export default function Example() {
  return (
    <div
      style={{
        display: "flex",
        width: 260,
        minHeight: 240,
        borderRadius: 12,
        background: "var(--mb-bg-secondary)",
      }}
    >
      <ContentUnavailable size="sm">
        <ContentUnavailableIcon>
          <WifiOffIcon strokeWidth={1.75} />
        </ContentUnavailableIcon>
        <ContentUnavailableTitle>You’re Offline</ContentUnavailableTitle>
        <ContentUnavailableDescription>Connect to the internet to load your shared projects.</ContentUnavailableDescription>
        <ContentUnavailableActions>
          <Button size="sm">Try Again</Button>
        </ContentUnavailableActions>
      </ContentUnavailable>
    </div>
  )
}
