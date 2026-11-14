import { Button } from "@dreambase/stardust/button"
import { Field, FieldLabel } from "@dreambase/stardust/field"
import {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverDescription,
  PopoverTitle,
  PopoverTrigger,
} from "@dreambase/stardust/popover"
import { TextField } from "@dreambase/stardust/text-field"
import { ShareIcon } from "lucide-react"

export default function Example() {
  return (
    <Popover presentation="auto">
      <PopoverTrigger render={<Button />}>
        <ShareIcon aria-hidden="true" />
        Share
      </PopoverTrigger>
      <PopoverContent>
        <PopoverTitle>Share “Q3 Roadmap”</PopoverTitle>
        <PopoverDescription>Anyone with the link can view it.</PopoverDescription>
        <div style={{ display: "grid", gap: 12, marginTop: 10, minWidth: 280 }}>
          <Field>
            <FieldLabel>Link</FieldLabel>
            <TextField readOnly defaultValue="dreambase.ai/d/q3-roadmap" />
          </Field>
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <PopoverClose render={<Button variant="filled" />}>Copy Link</PopoverClose>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
