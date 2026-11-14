import { Button } from "@dreambase/stardust/button"
import { List, ListRow, ListRowTitle, ListRowValue, ListSection } from "@dreambase/stardust/list"
import {
  Sheet,
  SheetBody,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@dreambase/stardust/sheet"

const places = [
  { name: "Blue Bottle Coffee", detail: "Coffee · 0.2 mi" },
  { name: "Tartine Bakery", detail: "Bakery · 0.4 mi" },
  { name: "Dolores Park", detail: "Park · 0.5 mi" },
  { name: "Mission Dolores", detail: "Landmark · 0.6 mi" },
  { name: "Ritual Coffee Roasters", detail: "Coffee · 0.7 mi" },
  { name: "Bi-Rite Creamery", detail: "Ice cream · 0.7 mi" },
  { name: "Alamo Square", detail: "Park · 1.1 mi" },
  { name: "Ferry Building", detail: "Market · 2.3 mi" },
]

export default function Example() {
  return (
    <Sheet detents={["medium", "large"]}>
      <SheetTrigger render={<Button variant="filled" />}>Find a Place</SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Places Nearby</SheetTitle>
          <SheetClose variant="primary">Done</SheetClose>
        </SheetHeader>
        <SheetDescription>Drag the sheet up to see more.</SheetDescription>
        <SheetBody>
          <List>
            <ListSection>
              {places.map((place) => (
                <ListRow key={place.name}>
                  <ListRowTitle>{place.name}</ListRowTitle>
                  <ListRowValue>{place.detail}</ListRowValue>
                </ListRow>
              ))}
            </ListSection>
          </List>
        </SheetBody>
      </SheetContent>
    </Sheet>
  )
}
