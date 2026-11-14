import {
  DisclosureGroup,
  DisclosureHeader,
  DisclosureItem,
  DisclosurePanel,
  DisclosureTrigger,
} from "macbetter/disclosure"

const topics = [
  {
    value: "backup",
    title: "iCloud Backup",
    body: "Backs up your photos, messages and app data every night while your device is locked, charging and on Wi-Fi.",
  },
  {
    value: "keychain",
    title: "Passwords and Keychain",
    body: "Keeps passwords, passkeys and Wi-Fi networks up to date on every device signed in to your account.",
  },
  {
    value: "private-relay",
    title: "Private Relay",
    body: "Hides your IP address and browsing activity in Safari from network providers and websites.",
  },
]

export default function Example() {
  return (
    // A grouped box sits on the grouped background, the way iOS Settings draws it.
    <div style={{ width: "100%", maxWidth: 512, padding: 16, borderRadius: 16, background: "var(--mb-bg-grouped)" }}>
      <DisclosureGroup defaultValue={["backup"]}>
        {topics.map((topic) => (
          <DisclosureItem key={topic.value} value={topic.value}>
            <DisclosureHeader>
              <DisclosureTrigger>{topic.title}</DisclosureTrigger>
            </DisclosureHeader>
            <DisclosurePanel>{topic.body}</DisclosurePanel>
          </DisclosureItem>
        ))}
      </DisclosureGroup>
    </div>
  )
}
