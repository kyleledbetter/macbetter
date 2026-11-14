import { Button } from "@dreambase/stardust/button"
import { List, ListRow, ListRowAccessory, ListRowTitle, ListRowValue, ListSection } from "@dreambase/stardust/list"
import { Sheet, SheetBody, SheetClose, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@dreambase/stardust/sheet"
import { Switch } from "@dreambase/stardust/switch"
import { PanelRightIcon } from "lucide-react"

export default function Example() {
  return (
    <Sheet side="end" modal={false}>
      <SheetTrigger render={<Button />}>
        <PanelRightIcon aria-hidden="true" />
        Show Inspector
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Inspector</SheetTitle>
          <SheetClose>Hide</SheetClose>
        </SheetHeader>
        <SheetBody>
          <List>
            <ListSection header="Document">
              <ListRow>
                <ListRowTitle>Size</ListRowTitle>
                <ListRowValue>1,920 × 1,080</ListRowValue>
              </ListRow>
              <ListRow>
                <ListRowTitle>Modified</ListRowTitle>
                <ListRowValue>Today, 9:41</ListRowValue>
              </ListRow>
              <ListRow>
                <ListRowTitle>Show Grid</ListRowTitle>
                <ListRowAccessory>
                  <Switch aria-label="Show Grid" defaultChecked />
                </ListRowAccessory>
              </ListRow>
            </ListSection>
          </List>
        </SheetBody>
      </SheetContent>
    </Sheet>
  )
}
