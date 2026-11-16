"use client"

import { lazy, Suspense, useEffect, useRef, useState } from "react"
import { MoreLink } from "@/components/more-link"
import { SectionHeading } from "./section-heading"
import { Tile } from "./tile"

// ECharts is a few hundred kilobytes, so each chart's module loads only when its tile nears the viewport.
const StockPrice = lazy(() => import("@/demos/charts/stocks-price"))
const Watchlist = lazy(() => import("@/demos/charts/stocks-watchlist"))
const HeartRate = lazy(() => import("@/demos/charts/health-heart-rate"))
const SleepStages = lazy(() => import("@/demos/charts/health-sleep"))
const ActivityRings = lazy(() => import("@/demos/charts/fitness-rings"))
const WeeklyRings = lazy(() => import("@/demos/charts/fitness-week"))
const Donut = lazy(() => import("@/demos/charts/general-donut"))
const Heatmap = lazy(() => import("@/demos/charts/general-heatmap"))
const Stacked = lazy(() => import("@/demos/charts/general-stacked"))

/** Renders its children once the bento is within a screen or so of the viewport. */
function useNear<T extends HTMLElement>() {
  const ref = useRef<T>(null)
  const [near, setNear] = useState(false)
  useEffect(() => {
    const node = ref.current
    if (!node) return
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setNear(true)
          observer.disconnect()
        }
      },
      { rootMargin: "800px 0px" }
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])
  return [ref, near] as const
}

function Chart({ near, children }: { near: boolean; children: React.ReactNode }) {
  return near ? <Suspense fallback={<span className="lp-chart-placeholder" />}>{children}</Suspense> : <span className="lp-chart-placeholder" />
}

function ChartsBento() {
  const [ref, near] = useNear<HTMLDivElement>()

  return (
    <section id="charts" className="lp-section" data-surface="alt" aria-labelledby="lp-charts">
      <div className="lp-section-inner">
        <SectionHeading
          id="lp-charts"
          eyebrow="Apple Style Visualizations"
          headline={<>Charts in the style of the Apple&nbsp;ecosystem.</>}
          links={
            <>
              <MoreLink href="/examples/analytics">See the analytics example</MoreLink>
              <MoreLink href="/docs/charts/overview">Learn more about charts</MoreLink>
            </>
          }
        >
          Price lines, heart rate ranges, sleep stages, activity rings and everyday charts, drawn with ECharts and colored by
          the same tokens as every other component. <strong>Drag across a chart to read its&nbsp;values.</strong>
        </SectionHeading>

        <div ref={ref} className="lp-bento lp-charts-bento lp-reveal" data-platform="macos">
          <Tile area="stock" name="Stock price" href="/docs/charts/stocks">
            <Chart near={near}>
              <StockPrice />
            </Chart>
          </Tile>
          <Tile area="watch" name="Watchlist" href="/docs/charts/stocks#watchlist">
            <Chart near={near}>
              <Watchlist />
            </Chart>
          </Tile>
          <Tile area="heart" name="Heart rate" href="/docs/charts/health#heart-rate">
            <Chart near={near}>
              <HeartRate />
            </Chart>
          </Tile>
          <Tile area="sleep" name="Sleep stages" href="/docs/charts/health#sleep-stages">
            <Chart near={near}>
              <SleepStages />
            </Chart>
          </Tile>
          <Tile area="rings" name="Activity rings" href="/docs/charts/fitness#activity-rings">
            <Chart near={near}>
              <ActivityRings />
            </Chart>
          </Tile>
          <Tile area="week" name="Weekly rings" href="/docs/charts/fitness#this-week">
            <Chart near={near}>
              <WeeklyRings />
            </Chart>
          </Tile>
          <Tile area="donut" name="Donut" href="/docs/charts/general#donut">
            <Chart near={near}>
              <Donut />
            </Chart>
          </Tile>
          <Tile area="heat" name="Calendar heatmap" href="/docs/charts/general#calendar-heatmap" className="lp-tile-heatmap">
            <Chart near={near}>
              <Heatmap />
            </Chart>
          </Tile>
          <Tile area="stacked" name="Stacked bars" href="/docs/charts/general#stacked-bars">
            <Chart near={near}>
              <Stacked />
            </Chart>
          </Tile>
        </div>
      </div>
    </section>
  )
}

export { ChartsBento }
