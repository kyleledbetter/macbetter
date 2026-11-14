import { Button } from "@dreambase/stardust/button"
import { Popover, PopoverContent, PopoverDescription, PopoverTitle, PopoverTrigger } from "@dreambase/stardust/popover"
import { InfoIcon } from "lucide-react"

export default function Example() {
  return (
    <Popover>
      <PopoverTrigger render={<Button variant="plain" shape="circle" aria-label="About sync" />}>
        <InfoIcon aria-hidden="true" />
      </PopoverTrigger>
      <PopoverContent side="right">
        <PopoverTitle>iCloud sync</PopoverTitle>
        <PopoverDescription>Changes appear on your other devices within a few seconds.</PopoverDescription>
      </PopoverContent>
    </Popover>
  )
}
