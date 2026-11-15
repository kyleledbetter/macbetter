"use client"

import { Card } from "macbetter/card"
import { BedIcon, ChevronRightIcon, FlameIcon, HeartIcon, PersonStandingIcon } from "lucide-react"
import * as React from "react"
import { ChartFrame, Sparkline } from "@/components/charts"
import { RangeControl } from "./charts"
import { HeartRateChart, RestingTrend, SleepChart, StepsChart } from "./health-charts"
import { favorites, healthPeriods, highlights, type Favorite, type HealthPeriod } from "./health-data"
import "./health.css"

/*
 * Health, in the manner of the Health app's Summary: favorites as small
 * tiles, highlights that say a trend in a sentence, then each category's
 * chart on its own card, under a header in the category's color.
 */

type Icon = React.ComponentType<React.SVGProps<SVGSVGElement>>

const icons: Record<string, Icon> = {
  steps: FlameIcon,
  distance: FlameIcon,
  flights: FlameIcon,
  resting: HeartIcon,
  heart: HeartIcon,
  sleep: BedIcon,
  weight: PersonStandingIcon,
}

/** The colored category line every Health card starts with. */
function Category({ id, label, color, detail }: { id: string; label: string; color: string; detail?: string }) {
  const Glyph = icons[id] ?? HeartIcon
  return (
    <div className="ex-health-category" style={{ "--ex-category": color } as React.CSSProperties}>
      <Glyph aria-hidden="true" fill="currentColor" strokeWidth={1.5} />
      <span>{label}</span>
      {detail ? <span className="ex-health-when">{detail}</span> : null}
      <ChevronRightIcon aria-hidden="true" className="ex-health-chevron" />
    </div>
  )
}

function FavoriteTile({ item, compact }: { item: Favorite; compact?: boolean }) {
  return (
    <Card className="ex-health-tile">
      <ChartFrame title={`${item.label}, last 14 days`} summary={`${item.value} ${item.unit} as of ${item.time}. ${item.trend}.`}>
        <Category id={item.id} label={item.label} color={item.css} detail={item.time} />
        <div className="ex-health-tile-body">
          <span className="ex-health-reading">
            <strong>{item.value}</strong> <span>{item.unit}</span>
          </span>
          <Sparkline values={item.values} color={item.color} area width={compact ? "100%" : 84} height={compact ? 30 : 34} />
        </div>
      </ChartFrame>
    </Card>
  )
}

function Highlight({ item }: { item: (typeof highlights)[number] }) {
  const max = Math.max(...item.bars.map((b) => b.value))
  return (
    <Card className="ex-health-highlight">
      <Category id={item.id} label={item.category} color={item.color} detail={item.when} />
      <p className="ex-health-headline">{item.headline}</p>
      <ChartFrame
        title={`${item.category}: ${item.bars[0]!.label} compared with ${item.bars[1]!.label}`}
        summary={item.bars.map((b) => `${b.label}: ${b.value.toLocaleString("en-US")} ${item.unit}`).join(". ")}
        className="ex-health-compare"
      >
        {item.bars.map((bar, i) => (
          <div key={bar.label} aria-hidden="true" className="ex-health-capsule-row">
            <span className="ex-health-reading" data-small="">
              <strong style={i === 0 ? { color: item.color } : undefined}>{bar.value.toLocaleString("en-US")}</strong> <span>{item.unit}</span>
            </span>
            <span
              className="ex-health-capsule"
              data-current={i === 0 ? "" : undefined}
              style={{ width: `${(bar.value / max) * 100}%`, "--ex-category": item.color } as React.CSSProperties}
            >
              {bar.label}
            </span>
          </div>
        ))}
      </ChartFrame>
    </Card>
  )
}

type HealthScreenProps = {
  period: HealthPeriod
  onPeriodChange: (period: HealthPeriod) => void
  query: string
  compact?: boolean
}

function HealthScreen({ period, onPeriodChange, query, compact }: HealthScreenProps) {
  const needle = query.trim().toLowerCase()
  const matches = (label: string) => !needle || label.toLowerCase().includes(needle)
  const tiles = favorites.filter((f) => matches(f.label))
  const cards = [
    {
      id: "steps",
      label: "Steps",
      color: "var(--mb-orange)",
      chart: <StepsChart period={period} height={compact ? 180 : 210} />,
    },
    { id: "heart", label: "Heart Rate", color: "var(--mb-pink)", chart: <HeartRateChart period={period} height={compact ? 170 : 210} /> },
    { id: "sleep", label: "Sleep", color: "var(--mb-chart-core)", chart: <SleepChart height={compact ? 160 : 170} /> },
    { id: "resting", label: "Resting Heart Rate", color: "var(--mb-pink)", chart: <RestingTrend height={compact ? 160 : 170} /> },
  ].filter((card) => matches(card.label))
  const shownHighlights = highlights.filter((h) => matches(h.category))
  const ids = { favorites: React.useId(), highlights: React.useId(), charts: React.useId() }

  return (
    <div className="ex-health" data-compact={compact ? "" : undefined}>
      <div className="ex-health-inner">
        {tiles.length ? (
          <section aria-labelledby={ids.favorites}>
            <h2 id={ids.favorites} className="ex-health-section">
              Favorites
            </h2>
            <div className="ex-health-tiles">
              {tiles.map((item) => (
                <FavoriteTile key={item.id} item={item} compact={compact} />
              ))}
            </div>
          </section>
        ) : null}
        {shownHighlights.length ? (
          <section aria-labelledby={ids.highlights}>
            <h2 id={ids.highlights} className="ex-health-section">
              Highlights
            </h2>
            <div className="ex-health-highlights">
              {shownHighlights.map((item) => (
                <Highlight key={item.id} item={item} />
              ))}
            </div>
          </section>
        ) : null}
        {cards.length ? (
          <section aria-labelledby={ids.charts}>
            <div className="ex-health-section-row">
              <h2 id={ids.charts} className="ex-health-section">
                Charts
              </h2>
              {compact ? null : <span>Steps and heart rate follow the period in the toolbar</span>}
            </div>
            {compact ? (
              <RangeControl ranges={healthPeriods} value={period} onValueChange={onPeriodChange} label="Steps and heart rate period" block className="ex-health-period" />
            ) : null}
            <div className="ex-health-cards">
              {cards.map((card) => (
                <Card key={card.id} className="ex-health-card">
                  <Category id={card.id} label={card.label} color={card.color} />
                  {card.chart}
                </Card>
              ))}
            </div>
          </section>
        ) : null}
        {!tiles.length && !cards.length && !shownHighlights.length ? (
          <p className="ex-health-empty">No health data matches “{query.trim()}”.</p>
        ) : null}
      </div>
    </div>
  )
}

export { HealthScreen }
