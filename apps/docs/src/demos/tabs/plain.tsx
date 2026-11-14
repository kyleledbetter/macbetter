import { Tabs, TabsList, TabsPanel, TabsTab, TabsTabIcon } from "macbetter/tabs"
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
      <TabsPanel value="recents" className="mb-label-secondary">
        Inès Moreau called 12 minutes ago. Kofi Mensah, yesterday.
      </TabsPanel>
      <TabsPanel value="favorites" className="mb-label-secondary">
        Hollis Grant and Wren Takahashi are in your favorites.
      </TabsPanel>
      <TabsPanel value="groups" className="mb-label-secondary">
        Design, Family and Climbing Club.
      </TabsPanel>
    </Tabs>
  )
}
