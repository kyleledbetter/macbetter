import { Button } from "macbetter/button"
import {
  ContentUnavailable,
  ContentUnavailableActions,
  ContentUnavailableDescription,
  ContentUnavailableIcon,
  ContentUnavailableTitle,
} from "macbetter/content-unavailable"
import { MessagesSquareIcon, PlusIcon } from "lucide-react"

export default function Example() {
  return (
    <ContentUnavailable size="lg">
      <ContentUnavailableIcon>
        <MessagesSquareIcon strokeWidth={1.5} />
      </ContentUnavailableIcon>
      <ContentUnavailableTitle>No Chats Yet</ContentUnavailableTitle>
      <ContentUnavailableDescription>
        Chats you start appear here, with the newest at the top.
      </ContentUnavailableDescription>
      <ContentUnavailableActions>
        <Button variant="filled">
          <PlusIcon aria-hidden="true" />
          New Chat
        </Button>
      </ContentUnavailableActions>
    </ContentUnavailable>
  )
}
