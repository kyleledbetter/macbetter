import type * as React from "react"
import { join } from "../lib/cx"

type EnergyForecastHour = {
  /** The hour, already formatted: "4 PM". */
  label: string
  /** Cleaner electricity is forecast for this hour. */
  cleaner: boolean
}

type EnergyReadoutProps = Omit<React.ComponentProps<"section">, "title"> & {
  /** One entry per hour, in order. */
  forecast: EnergyForecastHour[]
  /** Which hour is now, by index. */
  now?: number
  title?: React.ReactNode
  /** The forecast in a sentence: "Cleaner energy 4–10 PM". Without one, it's worked out from the hours. */
  summary?: React.ReactNode
  /** A reading beside the forecast, like the home's use today. */
  usage?: { value: string; label: string }
  /** The words for the two kinds of hour, in the page's language. */
  cleanerLabel?: string
  lessCleanLabel?: string
  nowLabel?: string
}

function cleanerRuns(forecast: EnergyForecastHour[]) {
  const runs: string[] = []
  let start = -1
  forecast.forEach((hour, i) => {
    if (hour.cleaner && start < 0) start = i
    const ends = start >= 0 && (!hour.cleaner || i === forecast.length - 1)
    if (ends) {
      const last = hour.cleaner ? i : i - 1
      runs.push(start === last ? forecast[start].label : `${forecast[start].label}–${forecast[last].label}`)
      start = -1
    }
  })
  return runs
}

/**
 * The Grid Forecast: the hours ahead, with the cleaner ones raised and green. Each bar is
 * labeled in words for assistive tech, and the summary says the same in a sentence.
 */
function EnergyReadout({
  forecast,
  now = 0,
  title = "Grid Forecast",
  summary,
  usage,
  cleanerLabel = "Cleaner",
  lessCleanLabel = "Less clean",
  nowLabel = "Now",
  className,
  ...props
}: EnergyReadoutProps) {
  const runs = cleanerRuns(forecast)
  const sentence = summary ?? (runs.length ? `Cleaner energy ${runs.join(", ")}` : "No cleaner periods forecast")
  return (
    <section className={join("mb-energy-readout", className)} {...props}>
      <header className="mb-energy-readout-header">
        <div className="mb-energy-readout-heading">
          <h3 className="mb-energy-readout-title">{title}</h3>
          <p className="mb-energy-readout-summary">{sentence}</p>
        </div>
        {usage ? (
          <p className="mb-energy-readout-usage">
            <span className="mb-energy-readout-usage-value">{usage.value}</span>
            <span className="mb-energy-readout-usage-label">{usage.label}</span>
          </p>
        ) : null}
      </header>
      <ol className="mb-energy-readout-bars">
        {forecast.map((hour, i) => (
          <li
            key={`${i}-${hour.label}`}
            data-cleaner={hour.cleaner ? "" : undefined}
            data-now={i === now ? "" : undefined}
            className="mb-energy-readout-bar"
          >
            <span className="mb-visually-hidden">
              {`${hour.label}: ${hour.cleaner ? cleanerLabel : lessCleanLabel}${i === now ? `, ${nowLabel}` : ""}`}
            </span>
          </li>
        ))}
      </ol>
      <div className="mb-energy-readout-axis" aria-hidden="true">
        <span>{forecast[0]?.label}</span>
        <span>{forecast[Math.floor(forecast.length / 2)]?.label}</span>
        <span>{forecast[forecast.length - 1]?.label}</span>
      </div>
    </section>
  )
}

export { EnergyReadout }
export type { EnergyForecastHour, EnergyReadoutProps }
