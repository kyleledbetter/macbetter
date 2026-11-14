import { Switch } from "@dreambase/stardust/switch"

export default function Example() {
  return (
    <>
      <Switch size="sm" aria-label="Snap to Grid" defaultChecked />
      <Switch size="md" aria-label="Show Rulers" defaultChecked />
    </>
  )
}
