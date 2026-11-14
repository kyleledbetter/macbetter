import {
  TextField,
  TextFieldAdornment,
  TextFieldClear,
  TextFieldGroup,
} from "@dreambase/stardust/text-field"
import { AtSignIcon } from "lucide-react"

export default function Example() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12, width: "100%", maxWidth: 300 }}>
      <TextFieldGroup>
        <TextFieldAdornment>https://</TextFieldAdornment>
        <TextField aria-label="Website" defaultValue="dreambase.ai" />
        <TextFieldClear aria-label="Clear website" />
      </TextFieldGroup>
      <TextFieldGroup>
        <TextFieldAdornment>
          <AtSignIcon aria-hidden="true" />
        </TextFieldAdornment>
        <TextField aria-label="Username" placeholder="username" autoComplete="username" />
      </TextFieldGroup>
      <TextFieldGroup>
        <TextField aria-label="Storage limit" inputMode="numeric" defaultValue="250" />
        <TextFieldAdornment>GB</TextFieldAdornment>
      </TextFieldGroup>
    </div>
  )
}
