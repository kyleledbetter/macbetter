import { Tabs, TabsList, TabsPanel, TabsTab, TabsTabIcon } from "@dreambase/stardust/tabs"
import { ClockIcon, StarIcon, UsersIcon } from "lucide-react"

export default function Example() {
  return (
    <Tabs variant="plain" defaultValue="recents" style={{ width: "100%", maxWidth: 460 }}>
      <TabsList aria-label="Contacts">
        <TabsTab value="recents">
          <TabsTabIcon>
            <ClockIcon />
          </TabsTabIcon>
          Recents
        </TabsTab>
        <TabsTab value="favorites">
          <TabsTabIcon>
            <StarIcon />
          </TabsTabIcon>
          Favorites
        </TabsTab>
        <TabsTab value="groups">
          <TabsTabIcon>
            <UsersIcon />
          </TabsTabIcon>
          Groups
        </TabsTab>
      </TabsList>
      <TabsPanel value="recents" className="sd-label-secondary">
        Inès Moreau called 12 minutes ago. Kofi Mensah, yesterday.
      </TabsPanel>
      <TabsPanel value="favorites" className="sd-label-secondary">
        Hollis Grant and Wren Takahashi are in your favorites.
      </TabsPanel>
      <TabsPanel value="groups" className="sd-label-secondary">
        Design, Family and Climbing Club.
      </TabsPanel>
    </Tabs>
  )
}
