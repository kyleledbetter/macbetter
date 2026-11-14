"use client"

import * as React from "react"
import { baseOption, categoryAxis, ChartFrame, EChart, valueAxis, type ChartTheme } from "@/components/charts"

const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
const minutes = [22, 41, 31, 64, 28, 35, 38]

export default function ExerciseWeek() {
  // The option is a function of the resolved theme, so it redraws on a scheme, theme or platform change.
  const option = React.useCallback(
    (theme: ChartTheme) => ({
      ...baseOption(theme),
      grid: { left: 0, right: 32, top: 8, bottom: 24 },
      xAxis: categoryAxis(theme, days),
      yAxis: valueAxis(theme, { max: 80, interval: 40 }),
      series: [
        {
          id: "exercise",
          type: "bar",
          data: minutes,
          barWidth: "56%",
          itemStyle: { color: theme.colors.exercise, borderRadius: [4, 4, 0, 0] },
        },
      ],
    }),
    []
  )

  return (
    <ChartFrame
      title="Exercise minutes this week"
      summary="Between 22 and 64 minutes a day; Wednesday was the longest."
      table={{ columns: ["Day", "Minutes"], rows: days.map((day, i) => [day, minutes[i]!]) }}
      style={{ width: "100%", maxWidth: 420 }}
    >
      <EChart option={option} height={180} />
    </ChartFrame>
  )
}
