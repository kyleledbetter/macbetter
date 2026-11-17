import {
  ContentUnavailable,
  ContentUnavailableDescription,
  ContentUnavailableIcon,
  ContentUnavailableTitle,
} from "macbetter/content-unavailable"
import { SearchIcon } from "lucide-react"

export default function Example() {
  return (
    <ContentUnavailable>
      <ContentUnavailableIcon>
        <SearchIcon strokeWidth={1.75} />
      </ContentUnavailableIcon>
      <ContentUnavailableTitle>No Results for “lantern budget”</ContentUnavailableTitle>
      <ContentUnavailableDescription>Check the spelling or try a new search.</ContentUnavailableDescription>
    </ContentUnavailable>
  )
}
