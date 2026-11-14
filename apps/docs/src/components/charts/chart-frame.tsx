import * as React from "react"
import "./charts.css"

type ChartTable = {
  columns: string[]
  /** The first cell of each row is its header. */
  rows: (string | number)[][]
}

type ChartFrameProps = Omit<React.ComponentProps<"figure">, "title"> & {
  /** The chart's accessible name, like "Steps this week". */
  title: string
  /** One or two sentences that say what the chart shows, for people who can't see it. */
  summary: string
  /** The data as a table, read by screen readers in place of the drawing. */
  table?: ChartTable
}

/**
 * A chart's accessible frame: a figure named by its title, described by its
 * summary, with the data in a visually hidden table. Put the visible header,
 * the drawing and the legend inside.
 */
function ChartFrame({ title, summary, table, className, children, ...props }: ChartFrameProps) {
  const id = React.useId()
  return (
    <figure
      {...props}
      className={className ? `sd-chart ${className}` : "sd-chart"}
      aria-labelledby={`${id}-title`}
      aria-describedby={`${id}-summary`}
    >
      {children}
      <figcaption className="sd-visually-hidden">
        <span id={`${id}-title`}>{title}</span> <span id={`${id}-summary`}>{summary}</span>
      </figcaption>
      {table ? (
        <table className="sd-visually-hidden">
          <caption>{title}</caption>
          <thead>
            <tr>
              {table.columns.map((column) => (
                <th key={column} scope="col">
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {table.rows.map((row, index) => (
              <tr key={index}>
                {row.map((cell, i) =>
                  i === 0 ? (
                    <th key={i} scope="row">
                      {cell}
                    </th>
                  ) : (
                    <td key={i}>{cell}</td>
                  )
                )}
              </tr>
            ))}
          </tbody>
        </table>
      ) : null}
    </figure>
  )
}

type ChartHeaderProps = Omit<React.ComponentProps<"div">, "children"> & {
  /** The small caps line above the value: "AVERAGE", "TOTAL", "RANGE". */
  eyebrow?: React.ReactNode
  value: React.ReactNode
  unit?: React.ReactNode
  /** The date or range under the value. */
  detail?: React.ReactNode
}

/** The header Health puts over a chart: what, how much, and when. It follows the scrub. */
function ChartHeader({ eyebrow, value, unit, detail, className, ...props }: ChartHeaderProps) {
  return (
    <div {...props} className={className ? `sd-chart-header ${className}` : "sd-chart-header"}>
      {eyebrow ? <div className="sd-chart-eyebrow">{eyebrow}</div> : null}
      <div className="sd-chart-reading">
        <span className="sd-chart-value">{value}</span>
        {unit ? <span className="sd-chart-unit">{unit}</span> : null}
      </div>
      {detail ? <div className="sd-chart-detail">{detail}</div> : null}
    </div>
  )
}

type ChartLegendProps = React.ComponentProps<"ul"> & {
  items: {
    label: string
    /** Any CSS color, usually a token: "var(--sd-chart-rem)". */
    color: string
    /** A short value beside the label, like "1 hr 42 min". */
    value?: React.ReactNode
    shape?: "dot" | "line" | "dashed" | "bar"
  }[]
}

/** A legend. Each entry says its name in words, so color is never the only key. */
function ChartLegend({ items, className, ...props }: ChartLegendProps) {
  return (
    <ul {...props} className={className ? `sd-chart-legend ${className}` : "sd-chart-legend"}>
      {items.map((item) => (
        <li key={item.label}>
          <span
            aria-hidden="true"
            className="sd-chart-swatch"
            data-shape={item.shape ?? "dot"}
            style={{ "--sd-chart-swatch": item.color } as React.CSSProperties}
          />
          <span className="sd-chart-legend-label">{item.label}</span>
          {item.value ? <span className="sd-chart-legend-value">{item.value}</span> : null}
        </li>
      ))}
    </ul>
  )
}

export { ChartFrame, ChartHeader, ChartLegend }
export type { ChartFrameProps, ChartHeaderProps, ChartLegendProps, ChartTable }
