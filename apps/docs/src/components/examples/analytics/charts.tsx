"use client"

import * as React from "react"

const number = new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 })

function useWidth<T extends HTMLElement>() {
  const ref = React.useRef<T>(null)
  const [width, setWidth] = React.useState(0)
  React.useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    const update = () => setWidth(el.clientWidth)
    update()
    const observer = new ResizeObserver(update)
    observer.observe(el)
    return () => observer.disconnect()
  }, [])
  return [ref, width] as const
}

/** Round, readable axis steps: 1, 2 or 5 times a power of ten. */
function niceMax(value: number, ticks = 4) {
  const raw = value / ticks
  const power = 10 ** Math.floor(Math.log10(raw))
  const step = [1, 2, 2.5, 5, 10].map((m) => m * power).find((s) => s >= raw) ?? raw
  return { max: step * ticks, step }
}

type Series = { name: string; values: number[]; color: string; dashed?: boolean }

type ChartFrameProps = {
  title: string
  description: string
  /** Rows for the table screen readers get in place of the drawing. */
  table: { columns: string[]; rows: (string | number)[][] }
  legend?: { name: string; color: string; dashed?: boolean }[]
  children: React.ReactNode
  action?: React.ReactNode
}

/** A chart's title, description, legend and accessible data table around its drawing. */
function ChartFrame({ title, description, table, legend, children, action }: ChartFrameProps) {
  const id = React.useId()
  return (
    <figure className="ex-chart" aria-labelledby={`${id}-t`} aria-describedby={`${id}-d`}>
      <div className="ex-chart-head">
        <div>
          <figcaption id={`${id}-t`} className="ex-chart-title">
            {title}
          </figcaption>
          <p id={`${id}-d`} className="ex-chart-description">
            {description}
          </p>
        </div>
        {action}
      </div>
      {legend ? (
        <ul className="ex-chart-legend" aria-hidden="true">
          {legend.map((item) => (
            <li key={item.name}>
              <span
                className="ex-chart-swatch"
                data-dashed={item.dashed ? "" : undefined}
                style={{ "--ex-swatch": item.color } as React.CSSProperties}
              />
              {item.name}
            </li>
          ))}
        </ul>
      ) : null}
      <div aria-hidden="true" className="ex-chart-drawing">
        {children}
      </div>
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
              {row.map((cell, i) => (i === 0 ? <th key={i} scope="row">{cell}</th> : <td key={i}>{cell}</td>))}
            </tr>
          ))}
        </tbody>
      </table>
    </figure>
  )
}

type AreaChartProps = {
  series: Series[]
  labels: string[]
  height?: number
  /** How many x labels to show at most. */
  xTicks?: number
}

/** A line chart whose lead series is filled to the baseline. */
function AreaChart({ series, labels, height = 220, xTicks = 6 }: AreaChartProps) {
  const [ref, width] = useWidth<HTMLDivElement>()
  const gradient = React.useId()
  const [hover, setHover] = React.useState<number | null>(null)
  const pad = { top: 10, right: 8, bottom: 22, left: 40 }
  const w = Math.max(width - pad.left - pad.right, 10)
  const h = height - pad.top - pad.bottom
  const peak = Math.max(...series.flatMap((s) => s.values))
  const { max, step } = niceMax(peak)
  const count = labels.length
  const x = (i: number) => pad.left + (count === 1 ? w / 2 : (i / (count - 1)) * w)
  const y = (v: number) => pad.top + h - (v / max) * h
  const path = (values: number[]) => values.map((v, i) => `${i ? "L" : "M"}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join("")
  const every = Math.max(1, Math.ceil(count / xTicks))
  const lead = series[0]

  return (
    <div ref={ref} className="ex-area" style={{ height }}>
      {width ? (
        <svg
          width={width}
          height={height}
          onPointerMove={(event) => {
            const box = event.currentTarget.getBoundingClientRect()
            const px = ((event.clientX - box.left) / box.width) * width
            const i = Math.round(((px - pad.left) / w) * (count - 1))
            setHover(Math.min(Math.max(i, 0), count - 1))
          }}
          onPointerLeave={() => setHover(null)}
        >
          <defs>
            <linearGradient id={gradient} x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor={lead.color} stopOpacity="0.32" />
              <stop offset="100%" stopColor={lead.color} stopOpacity="0" />
            </linearGradient>
          </defs>
          {Array.from({ length: max / step + 1 }, (_, i) => i * step).map((tick) => (
            <g key={tick}>
              <line x1={pad.left} x2={pad.left + w} y1={y(tick)} y2={y(tick)} className="ex-grid-line" data-base={tick === 0 ? "" : undefined} />
              <text x={pad.left - 8} y={y(tick)} dy="0.32em" textAnchor="end" className="ex-axis-label">
                {number.format(tick)}
              </text>
            </g>
          ))}
          {labels.map((label, i) =>
            i % every === 0 || i === count - 1 ? (
              <text key={i} x={x(i)} y={height - 6} textAnchor={i === 0 ? "start" : i === count - 1 ? "end" : "middle"} className="ex-axis-label">
                {label}
              </text>
            ) : null
          )}
          <path d={`${path(lead.values)}L${x(count - 1)},${y(0)}L${x(0)},${y(0)}Z`} fill={`url(#${gradient})`} />
          {[...series].reverse().map((s) => (
            <path
              key={s.name}
              d={path(s.values)}
              fill="none"
              stroke={s.color}
              strokeWidth={s === lead ? 2.25 : 1.75}
              strokeDasharray={s.dashed ? "4 4" : undefined}
              strokeLinejoin="round"
              strokeLinecap="round"
            />
          ))}
          {hover !== null ? (
            <g>
              <line x1={x(hover)} x2={x(hover)} y1={pad.top} y2={pad.top + h} className="ex-crosshair" />
              {series.map((s) => (
                <circle key={s.name} cx={x(hover)} cy={y(s.values[hover])} r="4" fill={s.color} className="ex-dot" />
              ))}
            </g>
          ) : null}
        </svg>
      ) : null}
      {hover !== null && width ? (
        <div
          className="ex-tooltip"
          style={{ left: Math.min(Math.max(x(hover), 70), width - 70), top: 0 }}
        >
          <strong>{labels[hover]}</strong>
          {series.map((s) => (
            <span key={s.name}>
              <i style={{ background: s.color }} />
              {s.name} <b className="ex-mono">{s.values[hover].toLocaleString("en")}</b>
            </span>
          ))}
        </div>
      ) : null}
    </div>
  )
}

/** Horizontal bars: categories with long names read best this way. */
function BarList({ items, color = "var(--sd-accent)", format = (v: number) => number.format(v) }: {
  items: { label: string; value: number }[]
  color?: string
  format?: (value: number) => string
}) {
  const max = Math.max(...items.map((item) => item.value))
  return (
    <div className="ex-bars">
      {items.map((item) => (
        <div key={item.label} className="ex-bar-row">
          <span className="ex-bar-label">{item.label}</span>
          <span className="ex-bar-track">
            <span className="ex-bar-fill" style={{ width: `${(item.value / max) * 100}%`, background: color }} />
          </span>
          <span className="ex-bar-value ex-mono">{format(item.value)}</span>
        </div>
      ))}
    </div>
  )
}

/** Vertical bars for a short time series. */
function ColumnChart({ values, labels, color = "var(--sd-accent-secondary)", height = 120 }: {
  values: number[]
  labels: string[]
  color?: string
  height?: number
}) {
  const max = Math.max(...values)
  return (
    <div className="ex-columns" style={{ height }}>
      {values.map((value, i) => (
        <div key={i} className="ex-column">
          <span className="ex-column-bar" style={{ height: `${(value / max) * 100}%`, background: color }} />
          <span className="ex-axis-label">{labels[i]}</span>
        </div>
      ))}
    </div>
  )
}

/** A ring of parts of a whole, with the total in the middle. */
function Donut({ parts, total, unit, size = 148 }: {
  parts: { label: string; value: number; color: string }[]
  total: string
  unit: string
  size?: number
}) {
  const sum = parts.reduce((acc, part) => acc + part.value, 0)
  const r = 15.9155
  const offsets = parts.map((_, index) =>
    parts.slice(0, index).reduce((acc, part) => acc + (part.value / sum) * 100, 0)
  )
  return (
    <div className="ex-donut">
      <div className="ex-donut-ring" style={{ width: size, height: size }}>
        <svg viewBox="0 0 42 42" width={size} height={size}>
          <circle cx="21" cy="21" r={r} fill="none" className="ex-donut-track" strokeWidth="5" />
          {parts.map((part, index) => {
            const offset = offsets[index] ?? 0
            const length = (part.value / sum) * 100
            const gap = parts.length > 1 ? 1.2 : 0
            const circle = (
              <circle
                key={part.label}
                cx="21"
                cy="21"
                r={r}
                fill="none"
                stroke={part.color}
                strokeWidth="5"
                strokeDasharray={`${Math.max(length - gap, 0)} ${100 - Math.max(length - gap, 0)}`}
                strokeDashoffset={25 - offset}
              />
            )
            return circle
          })}
        </svg>
        <div className="ex-donut-center">
          <strong className="ex-mono">{total}</strong>
          <span>{unit}</span>
        </div>
      </div>
      <ul className="ex-donut-legend">
        {parts.map((part) => (
          <li key={part.label}>
            <span className="ex-chart-swatch" style={{ "--ex-swatch": part.color } as React.CSSProperties} />
            <span className="ex-donut-label">{part.label}</span>
            <span className="ex-mono">{Math.round((part.value / sum) * 100)}%</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

/** A tiny trend line for a KPI. */
function Sparkline({ values, color, width = 96, height = 28 }: { values: number[]; color: string; width?: number; height?: number }) {
  const min = Math.min(...values)
  const max = Math.max(...values)
  const d = values
    .map((v, i) => {
      const px = (i / (values.length - 1)) * (width - 2) + 1
      const py = height - 2 - ((v - min) / (max - min || 1)) * (height - 4)
      return `${i ? "L" : "M"}${px.toFixed(1)},${py.toFixed(1)}`
    })
    .join("")
  return (
    <svg width={width} height={height} aria-hidden="true" className="ex-sparkline">
      <path d={d} fill="none" stroke={color} strokeWidth="1.75" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  )
}

export { AreaChart, BarList, ChartFrame, ColumnChart, Donut, Sparkline }
export type { Series }
