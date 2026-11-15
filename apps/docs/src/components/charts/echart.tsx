"use client"

import { BarChart, CandlestickChart, CustomChart, GaugeChart, LineChart, PieChart, ScatterChart } from "echarts/charts"
import {
  AxisPointerComponent,
  GraphicComponent,
  GridComponent,
  MarkAreaComponent,
  MarkLineComponent,
  TooltipComponent,
} from "echarts/components"
import * as echarts from "echarts/core"
import { UniversalTransition } from "echarts/features"
import { CanvasRenderer } from "echarts/renderers"
import * as React from "react"
import "./charts.css"
import { useChartTheme, type ChartTheme } from "./theme"

// Modular registration: only the series and components these charts draw.
echarts.use([
  BarChart,
  CandlestickChart,
  CustomChart,
  GaugeChart,
  LineChart,
  PieChart,
  ScatterChart,
  AxisPointerComponent,
  GraphicComponent,
  GridComponent,
  MarkAreaComponent,
  MarkLineComponent,
  TooltipComponent,
  UniversalTransition,
  CanvasRenderer,
])

type EChartsOption = echarts.EChartsCoreOption
type Scrub = { index: number; x: number; width: number }

type ScrubConfig = {
  /** What the scrubber is called, like "Price". */
  label: string
  /** How many points there are to step through. */
  count: number
  /** How a point reads aloud, like "$231.40 at 2:15 PM". */
  valueText: (index: number) => string
  /** Where keyboard focus starts. Defaults to the last point. */
  initial?: number
}

type EChartProps = Omit<React.ComponentProps<"div">, "children"> & {
  /** Builds the ECharts option from the resolved macbetter theme. Memoize it with useCallback. */
  option: (theme: ChartTheme) => EChartsOption
  height?: number | string
  /**
   * Turns on Apple-style scrubbing: drag or hover to move a vertical rule,
   * use the arrow keys when focused. The drawing becomes a slider for
   * assistive technology.
   */
  scrub?: ScrubConfig
  onScrub?: (scrub: Scrub | null) => void
}

/** A canvas ECharts chart themed by macbetter. Redraws when the theme, scheme or platform changes. */
function EChart({ option, height = 220, scrub, onScrub, className, style, ...props }: EChartProps) {
  const ref = React.useRef<HTMLDivElement>(null)
  const mountRef = React.useRef<HTMLDivElement>(null)
  const chartRef = React.useRef<echarts.ECharts | null>(null)
  const theme = useChartTheme(ref)
  const [active, setActive] = React.useState<number | null>(null)
  const lastRef = React.useRef<number | null>(null)
  const onScrubRef = React.useRef(onScrub)
  const scrubRef = React.useRef(scrub)
  React.useEffect(() => {
    onScrubRef.current = onScrub
    scrubRef.current = scrub
  })

  // Mount once the theme is known, and dispose on unmount.
  const ready = theme !== null
  React.useEffect(() => {
    const mount = mountRef.current
    if (!ready || !mount) return
    const chart = echarts.init(mount, null, { renderer: "canvas" })
    chartRef.current = chart
    const report = (index: number | null) => {
      if (index === lastRef.current) return
      lastRef.current = index
      setActive(index)
      if (index === null) return onScrubRef.current?.(null)
      const x = chart.convertToPixel({ xAxisIndex: 0 }, index)
      onScrubRef.current?.({ index, x: typeof x === "number" ? x : 0, width: chart.getWidth() })
    }
    chart.on("updateAxisPointer", (event) => {
      if (!scrubRef.current) return
      const info = (event as { axesInfo?: { axisDim: string; value: number }[] }).axesInfo?.find(
        (axis) => axis.axisDim === "x"
      )
      report(info ? Math.round(info.value) : null)
    })
    chart.getZr().on("globalout", () => report(null))
    const resize = new ResizeObserver(() => chart.resize())
    resize.observe(mount)
    return () => {
      resize.disconnect()
      chart.dispose()
      chartRef.current = null
    }
  }, [ready])

  const scrubbing = Boolean(scrub)
  React.useEffect(() => {
    const chart = chartRef.current
    if (!chart || !theme) return
    const built = option(theme)
    const next = scrubbing
      ? {
          ...built,
          tooltip: {
            show: true,
            trigger: "axis",
            showContent: false,
            triggerOn: "mousemove",
            axisPointer: {
              type: "line",
              snap: true,
              z: 0,
              lineStyle: { color: theme.colors.rule, width: 1, type: "solid" },
              label: { show: false },
            },
            ...(built.tooltip as object | undefined),
          },
        }
      : built
    chart.setOption(next, { replaceMerge: ["series", "graphic"] })
  }, [option, theme, scrubbing, ready])

  const step = (index: number) => {
    const chart = chartRef.current
    if (!chart || !scrub) return
    const clamped = Math.min(Math.max(index, 0), scrub.count - 1)
    chart.dispatchAction({ type: "showTip", seriesIndex: 0, dataIndex: clamped })
  }

  const end = () => {
    chartRef.current?.dispatchAction({ type: "hideTip" })
    lastRef.current = null
    setActive(null)
    onScrub?.(null)
  }

  const slider = scrub
    ? {
        role: "slider",
        tabIndex: 0,
        "aria-label": scrub.label,
        "aria-valuemin": 0,
        "aria-valuemax": scrub.count - 1,
        "aria-valuenow": active ?? scrub.initial ?? scrub.count - 1,
        "aria-valuetext": scrub.valueText(active ?? scrub.initial ?? scrub.count - 1),
        onFocus: () => step(scrub.initial ?? scrub.count - 1),
        onBlur: end,
        onKeyDown: (event: React.KeyboardEvent) => {
          const current = active ?? scrub.initial ?? scrub.count - 1
          const moves: Record<string, number> = {
            ArrowLeft: current - 1,
            ArrowDown: current - 1,
            ArrowRight: current + 1,
            ArrowUp: current + 1,
            PageDown: current - 10,
            PageUp: current + 10,
            Home: 0,
            End: scrub.count - 1,
          }
          if (event.key === "Escape") return end()
          if (!(event.key in moves)) return
          event.preventDefault()
          step(moves[event.key]!)
        },
        // Lifting a finger ends the scrub, as it does in Stocks and Health.
        onPointerUp: (event: React.PointerEvent) => event.pointerType === "touch" && end(),
        onPointerCancel: end,
      }
    : { "aria-hidden": true }

  return (
    <div
      ref={ref}
      {...slider}
      {...props}
      className={className ? `mb-echart ${className}` : "mb-echart"}
      data-scrub={scrub ? "" : undefined}
      style={{ height, ...style }}
    >
      <div ref={mountRef} className="mb-echart-canvas" aria-hidden="true" />
    </div>
  )
}

export { echarts, EChart }
export type { EChartProps, EChartsOption, Scrub, ScrubConfig }
