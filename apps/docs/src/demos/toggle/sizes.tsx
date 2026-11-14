import { Toggle, ToggleIcon } from "macbetter/toggle"
import { HeartIcon } from "lucide-react"

const sizes = ["sm", "md", "lg"] as const

export default function Example() {
  return (
    <>
      {sizes.map((size) => (
        <Toggle key={size} size={size} variant="bezeled" defaultPressed aria-label={`Love, ${size}`}>
          <ToggleIcon>
            <HeartIcon />
          </ToggleIcon>
        </Toggle>
      ))}
      {sizes.map((size) => (
        <Toggle key={`text-${size}`} size={size} variant="bezeled">
          Repeat
        </Toggle>
      ))}
    </>
  )
}
