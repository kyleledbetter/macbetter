import { InfoIcon, LightbulbIcon, TriangleAlertIcon } from "lucide-react"

function Lead({ children }: { children: React.ReactNode }) {
  return <p className="docs-lead">{children}</p>
}

const calloutIcons = { note: InfoIcon, tip: LightbulbIcon, warning: TriangleAlertIcon }

function Callout({
  type = "note",
  title,
  children,
}: {
  type?: keyof typeof calloutIcons
  title?: string
  children: React.ReactNode
}) {
  const Icon = calloutIcons[type]
  return (
    <aside data-type={type} className="docs-callout">
      <Icon aria-hidden="true" />
      <div className="min-w-0">
        {title ? <p className="docs-callout-title">{title}</p> : null}
        {children}
      </div>
    </aside>
  )
}

type PropRow = { name: string; type: string; default?: string; description: string }

function PropsTable({ rows }: { rows: PropRow[] }) {
  return (
    <div className="docs-table-wrap">
      <table>
        <thead>
          <tr>
            <th>Prop</th>
            <th>Type</th>
            <th>Default</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.name}>
              <td>
                <code>{row.name}</code>
              </td>
              <td>
                <code>{row.type}</code>
              </td>
              <td>{row.default ? <code>{row.default}</code> : <span className="text-(--site-label-tertiary)">—</span>}</td>
              <td>{row.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function Steps({ children }: { children: React.ReactNode }) {
  return (
    <div className="docs-steps my-6 border-s border-(--site-hairline) ps-6 [counter-reset:step] [&>h3]:relative [&>h3]:[counter-increment:step] [&>h3]:before:absolute [&>h3]:before:-start-[37px] [&>h3]:before:top-0 [&>h3]:before:flex [&>h3]:before:size-[26px] [&>h3]:before:items-center [&>h3]:before:justify-center [&>h3]:before:rounded-full [&>h3]:before:bg-(--site-tile) [&>h3]:before:text-[12px] [&>h3]:before:font-semibold [&>h3]:before:text-(--site-label-secondary) [&>h3]:before:ring-1 [&>h3]:before:ring-(--site-hairline) [&>h3]:before:content-[counter(step)]">
      {children}
    </div>
  )
}

export { Callout, Lead, PropsTable, Steps }
