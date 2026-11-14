import { Toggle, ToggleIcon } from "@dreambase/stardust/toggle"
import { BookmarkIcon, StarIcon } from "lucide-react"

export default function Example() {
  return (
    <>
      <Toggle aria-label="Favorite" defaultPressed>
        <ToggleIcon>
          <StarIcon />
        </ToggleIcon>
      </Toggle>
      <Toggle aria-label="Bookmark">
        <ToggleIcon>
          <BookmarkIcon />
        </ToggleIcon>
      </Toggle>
      <Toggle variant="bezeled" defaultPressed>
        Show Invisibles
      </Toggle>
    </>
  )
}
