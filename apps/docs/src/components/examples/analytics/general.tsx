"use client"

import { Badge } from "macbetter/badge"
import { Card } from "macbetter/card"
import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, type TableSort } from "macbetter/table"
import * as React from "react"
import { Donut, RangeControl, type DonutPart } from "./charts"
import {
  AccountsScatter,
  KpiCard,
  NewAccountsCalendar,
  QuarterGoals,
  RegionsRanked,
  RevenueLines,
  SignupsStacked,
} from "./general-charts"
import { accountList, compactCurrency, currency, current, generalRanges, mrrNow, plans, report, type Account, type GeneralRange } from "./general-data"
import "./general.css"

/*
 * Reports: the general-purpose chart set, as a business dashboard. A dense
 * 12-column grid of bordered cards, KPIs first, every chart the kit's
 * general page shows, and a sortable table at the bottom.
 */

// The same colors as the plans in the charts above.
const planColors = { enterprise: "accent", team: "teal", starter: "purple" } as const

function AccountsTable({ query, compact }: { query: string; compact?: boolean }) {
  const [sort, setSort] = React.useState<TableSort>({ column: "mrr", direction: "descending" })
  const needle = query.trim().toLowerCase()
  const rows = React.useMemo(() => {
    const key = sort.column as keyof Account
    const list = accountList.filter((a) => !needle || a.name.toLowerCase().includes(needle) || a.region.toLowerCase().includes(needle))
    const sorted = [...list].sort((a, b) => (a[key] < b[key] ? -1 : a[key] > b[key] ? 1 : 0))
    return (sort.direction === "ascending" ? sorted : sorted.reverse()).slice(0, compact ? 8 : 12)
  }, [sort, needle, compact])

  if (!rows.length) return <p className="ex-gen-empty">No accounts match “{query.trim()}”.</p>
  return (
    <Table aria-label="Top accounts" className="ex-gen-table" sort={sort} onSortChange={setSort}>
      <TableHeader>
        <TableColumn value="name">Account</TableColumn>
        <TableColumn value="plan">Plan</TableColumn>
        {compact ? null : <TableColumn value="region">Region</TableColumn>}
        {compact ? null : (
          <TableColumn value="seats" align="end">
            Seats
          </TableColumn>
        )}
        <TableColumn value="mrr" align="end">
          MRR
        </TableColumn>
        <TableColumn value="change" align="end">
          30 days
        </TableColumn>
      </TableHeader>
      <TableBody>
        {rows.map((a) => (
          <TableRow key={a.id} value={a.id}>
            <TableCell>{a.name}</TableCell>
            <TableCell>
              <Badge variant="dot" color={planColors[a.plan]} size="sm">
                {plans.find((p) => p.key === a.plan)!.label}
              </Badge>
            </TableCell>
            {compact ? null : <TableCell secondary>{a.region}</TableCell>}
            {compact ? null : (
              <TableCell secondary align="end" className="ex-num">
                {a.seats}
              </TableCell>
            )}
            <TableCell align="end" className="ex-num">
              {compact ? compactCurrency.format(a.mrr) : currency.format(a.mrr)}
            </TableCell>
            <TableCell align="end" className="ex-num ex-gen-change" data-direction={a.change >= 0 ? "up" : "down"}>
              {a.change >= 0 ? "+" : "−"}
              {Math.abs(a.change).toFixed(1)}%
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

const donutParts: DonutPart[] = plans.map((p) => ({
  key: p.key,
  label: p.label,
  value: current[p.key],
  color: p.color,
  css: p.css,
  display: currency.format(current[p.key]),
}))

type GeneralScreenProps = {
  range: GeneralRange
  onRangeChange: (range: GeneralRange) => void
  query: string
  workspace: string
  compact?: boolean
}

function GeneralScreen({ range, onRangeChange, query, workspace, compact }: GeneralScreenProps) {
  const data = React.useMemo(() => report(range), [range])
  const tableId = React.useId()
  const largest = donutParts.reduce((a, b) => (b.value > a.value ? b : a))
  const donut = (
    <Donut
      title="MRR by plan, today"
      summary={`${currency.format(mrrNow)} in all. ${largest.label} brings ${Math.round((largest.value / mrrNow) * 100)}%.`}
      columns={["Plan", "MRR"]}
      parts={donutParts}
      center={compactCurrency.format(mrrNow)}
      centerLabel="MRR"
      size={compact ? 128 : 136}
      className="ex-gen-donut"
    />
  )

  if (compact) {
    return (
      <div className="ex-gen" data-compact="">
        <RangeControl ranges={generalRanges} value={range} onValueChange={onRangeChange} label="Report range" block />
        <div className="ex-gen-kpis">
          {data.kpis.map((kpi) => (
            <Card key={kpi.id} className="ex-gen-card">
              <KpiCard kpi={kpi} range={range} compact />
            </Card>
          ))}
        </div>
        <Card className="ex-gen-card">
          <RevenueLines data={data} range={range} />
        </Card>
        <Card className="ex-gen-card">
          <div className="ex-gen-head">
            <h3>Revenue mix</h3>
            <span className="ex-gen-sub">Today</span>
          </div>
          {donut}
        </Card>
        <Card className="ex-gen-card">
          <SignupsStacked data={data} range={range} />
        </Card>
        <Card className="ex-gen-card">
          <QuarterGoals size={128} />
        </Card>
        <Card className="ex-gen-card ex-gen-table-card">
          <h3 className="ex-gen-title">Top accounts</h3>
          <AccountsTable query={query} compact />
        </Card>
      </div>
    )
  }

  return (
    <div className="ex-gen">
      <div className="ex-gen-intro">
        <h2>{workspace} business report</h2>
        <p>General-purpose charts · {generalRanges.find((r) => r.value === range)!.long.toLowerCase()}, to Saturday, November 14</p>
      </div>
      <div className="ex-gen-grid">
        {data.kpis.map((kpi) => (
          <Card key={kpi.id} className="ex-gen-card" data-span="3">
            <KpiCard kpi={kpi} range={range} />
          </Card>
        ))}
        <Card className="ex-gen-card" data-span="8">
          <RevenueLines data={data} range={range} />
        </Card>
        <Card className="ex-gen-card" data-span="4">
          <div className="ex-gen-head">
            <h3>Revenue mix</h3>
            <span className="ex-gen-sub">Today</span>
          </div>
          {donut}
        </Card>
        <Card className="ex-gen-card" data-span="7">
          <SignupsStacked data={data} range={range} />
        </Card>
        <Card className="ex-gen-card" data-span="5">
          <RegionsRanked />
        </Card>
        <Card className="ex-gen-card" data-span="12">
          <NewAccountsCalendar />
        </Card>
        <Card className="ex-gen-card" data-span="7">
          <AccountsScatter />
        </Card>
        <Card className="ex-gen-card" data-span="5">
          <QuarterGoals />
        </Card>
        <Card className="ex-gen-card ex-gen-table-card" data-span="12" role="region" aria-labelledby={tableId}>
          <div className="ex-gen-head">
            <h3 id={tableId}>Top accounts</h3>
            <span className="ex-gen-sub">Sorted by the column you choose</span>
          </div>
          <AccountsTable query={query} />
        </Card>
      </div>
    </div>
  )
}

export { GeneralScreen }
