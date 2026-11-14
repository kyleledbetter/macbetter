import { DeviceFrame } from "macbetter/device-frame"

const reminders = ["Book the offsite venue", "Send Q3 metrics to Kofi", "Review the onboarding flow"]

export default function Example() {
  return (
    <DeviceFrame scale={0.78} role="group" aria-label="Reminders on iPhone">
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          paddingTop: "calc(var(--mb-safe-top) + 8px)",
          paddingBottom: "var(--mb-safe-bottom)",
          background: "var(--mb-bg-grouped)",
        }}
      >
        <h2 className="mb-text-large-title" style={{ margin: 0, padding: "0 16px 8px" }}>
          Today
        </h2>
        <ul
          style={{
            listStyle: "none",
            margin: "0 16px",
            padding: 0,
            borderRadius: 10,
            background: "var(--mb-bg-grouped-secondary)",
          }}
        >
          {reminders.map((reminder, index) => (
            <li
              key={reminder}
              className="mb-text-body"
              style={{
                padding: "11px 16px",
                boxShadow: index ? "inset 0 0.5px 0 var(--mb-separator)" : undefined,
              }}
            >
              {reminder}
            </li>
          ))}
        </ul>
      </div>
    </DeviceFrame>
  )
}
