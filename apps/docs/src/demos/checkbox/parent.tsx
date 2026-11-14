import { Checkbox, CheckboxGroup } from "@dreambase/stardust/checkbox"

const notifications = [
  { value: "messages", label: "Messages" },
  { value: "mentions", label: "Mentions" },
  { value: "reactions", label: "Reactions" },
]

export default function Example() {
  return (
    <CheckboxGroup
      aria-label="Notifications"
      defaultValue={["messages", "mentions"]}
      allValues={notifications.map((item) => item.value)}
    >
      <Checkbox parent>All notifications</Checkbox>
      <div style={{
          display: "flex",
          flexDirection: "column",
          gap: "var(--sd-checkbox-group-gap)",
          paddingInlineStart: "calc(var(--sd-checkbox-size) + var(--sd-checkbox-label-gap))",
        }}>
        {notifications.map((item) => (
          <Checkbox key={item.value} value={item.value}>
            {item.label}
          </Checkbox>
        ))}
      </div>
    </CheckboxGroup>
  )
}
