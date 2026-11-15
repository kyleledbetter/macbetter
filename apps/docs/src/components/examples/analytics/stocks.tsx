"use client"

import { Listbox, ListboxItem } from "macbetter/listbox"
import { SegmentedControl, SegmentedControlItem } from "macbetter/segmented-control"
import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "macbetter/table"
import { ChartCandlestickIcon, ChartLineIcon } from "lucide-react"
import * as React from "react"
import { Sparkline } from "@/components/charts"
import { Donut, RangeControl, type DonutPart } from "./charts"
import { PriceChart, type ChartStyle } from "./stocks-charts"
import {
  compact,
  dollars,
  history,
  holdings,
  price,
  signed,
  sparkline,
  spec,
  statistics,
  stockRanges,
  stocks,
  type Stock,
  type StockRange,
} from "./stocks-data"
import "./stocks.css"

/*
 * Stocks, in the manner of the Stocks app: a watchlist column that drives
 * the big price chart, key statistics as label and value pairs, and the
 * positions you hold.
 */

/** Change as Stocks shows it: a solid chip, signed, so the color is never the only cue. */
function ChangeChip({ stock }: { stock: Stock }) {
  const change = stock.last - stock.previousClose
  const up = change >= 0
  return (
    <span className="ex-chip" data-direction={up ? "up" : "down"}>
      <span className="mb-visually-hidden">{up ? "Up" : "Down"} </span>
      {signed((change / stock.previousClose) * 100)}%
    </span>
  )
}

function Watchlist({ value, onValueChange, query }: { value: string; onValueChange: (symbol: string) => void; query: string }) {
  const needle = query.trim().toLowerCase()
  const shown = stocks.filter((s) => !needle || s.symbol.toLowerCase().includes(needle) || s.name.toLowerCase().includes(needle))
  if (shown.length === 0) {
    return <p className="ex-stocks-empty">No symbols match “{query.trim()}”.</p>
  }
  return (
    <Listbox
      aria-label="Watchlist"
      className="ex-watchlist"
      value={value}
      onValueChange={(next) => next && onValueChange(next as string)}
    >
      {shown.map((stock) => (
        <ListboxItem key={stock.symbol} value={stock.symbol} className="ex-watch-row" aria-label={`${stock.symbol}, ${stock.name}, ${price.format(stock.last)}`}>
          <span className="ex-watch-name">
            <strong>{stock.symbol}</strong>
            <span>{stock.name}</span>
          </span>
          <Sparkline values={sparkline(stock)} baseline={stock.previousClose} width={58} height={28} className="ex-watch-spark" />
          <span className="ex-watch-price">
            <span>{price.format(stock.last)}</span>
            <ChangeChip stock={stock} />
          </span>
        </ListboxItem>
      ))}
    </Listbox>
  )
}

function Quote({ stock, range }: { stock: Stock; range: StockRange }) {
  const reference = range === "1D" ? stock.previousClose : history(stock, range).start
  const change = stock.last - reference
  const up = change >= 0
  return (
    <header className="ex-quote">
      <div className="ex-quote-name">
        <h2>{stock.symbol}</h2>
        <p>
          {stock.name} · {stock.sector}
        </p>
      </div>
      <div className="ex-quote-price">
        <span className="ex-quote-last">{price.format(stock.last)}</span>
        <span className="ex-quote-change" data-direction={up ? "up" : "down"}>
          <span className="mb-visually-hidden">{up ? "Up" : "Down"} </span>
          {signed(change)} ({signed((change / reference) * 100)}%)
          <span className="ex-quote-range"> {range === "1D" ? "Today" : spec[range].phrase.replace(/^over the /, "")}</span>
        </span>
      </div>
    </header>
  )
}

function StyleToggle({ value, onValueChange }: { value: ChartStyle; onValueChange: (value: ChartStyle) => void }) {
  return (
    <SegmentedControl size="sm" aria-label="Chart style" value={value} onValueChange={(next) => next && onValueChange(next as ChartStyle)}>
      <SegmentedControlItem value="line" aria-label="Line">
        <ChartLineIcon aria-hidden="true" />
      </SegmentedControlItem>
      <SegmentedControlItem value="candles" aria-label="Candlesticks">
        <ChartCandlestickIcon aria-hidden="true" />
      </SegmentedControlItem>
    </SegmentedControl>
  )
}

function KeyStatistics({ stock }: { stock: Stock }) {
  const stats = statistics(stock)
  const items: [string, string][] = [
    ["Open", price.format(stats.open)],
    ["High", price.format(stats.high)],
    ["Low", price.format(stats.low)],
    ["Volume", compact.format(stats.volume)],
    ["Avg. volume", compact.format(stats.averageVolume)],
    ["Market cap", compact.format(stats.marketCap)],
    ["P/E ratio", stats.pe ? stats.pe.toFixed(2) : "—"],
    ["52-week high", price.format(stats.yearHigh)],
    ["52-week low", price.format(stats.yearLow)],
    ["Dividend yield", stats.dividendYield ? `${(stats.dividendYield * 100).toFixed(2)}%` : "—"],
    ["EPS", price.format(stock.eps)],
    ["Beta", stock.beta.toFixed(2)],
  ]
  const id = React.useId()
  return (
    <section className="ex-stats" aria-labelledby={id}>
      <h3 id={id} className="ex-stocks-heading">
        Key statistics
      </h3>
      <dl>
        {items.map(([label, value]) => (
          <div key={label}>
            <dt>{label}</dt>
            <dd>{value}</dd>
          </div>
        ))}
      </dl>
    </section>
  )
}

function Portfolio({ compact: phone }: { compact?: boolean }) {
  const portfolio = holdings()
  const up = portfolio.dayGain >= 0
  const parts: DonutPart[] = portfolio.rows.map(({ stock, value }) => ({
    key: stock.symbol,
    label: stock.symbol,
    value: Math.round(value),
    color: stock.color,
    css: stock.css,
    display: dollars.format(value),
  }))
  const largest = portfolio.rows.reduce((a, b) => (b.value > a.value ? b : a))
  const id = React.useId()
  return (
    <section className="ex-portfolio" aria-labelledby={id}>
      <div className="ex-portfolio-head">
        <h3 id={id} className="ex-stocks-heading">
          Holdings
        </h3>
        <span className="ex-portfolio-total">
          {dollars.format(portfolio.total)}
          <span data-direction={up ? "up" : "down"}>
            {up ? "+" : "−"}
            {dollars.format(Math.abs(portfolio.dayGain))} today
          </span>
        </span>
      </div>
      <div className="ex-portfolio-body">
        {phone ? null : (
          <Table aria-label="Holdings" className="ex-holdings">
            <TableHeader>
              <TableColumn>Symbol</TableColumn>
              <TableColumn align="end">Shares</TableColumn>
              <TableColumn align="end">Price</TableColumn>
              <TableColumn align="end">Value</TableColumn>
              <TableColumn align="end">Today</TableColumn>
              <TableColumn align="end">Total gain</TableColumn>
            </TableHeader>
            <TableBody>
              {portfolio.rows.map(({ stock, value, dayGain, totalGain }) => (
                <TableRow key={stock.symbol} value={stock.symbol}>
                  <TableCell>
                    <span className="ex-holding-swatch" style={{ background: stock.css }} aria-hidden="true" />
                    <strong>{stock.symbol}</strong>
                  </TableCell>
                  <TableCell secondary align="end" className="ex-num">
                    {stock.held}
                  </TableCell>
                  <TableCell secondary align="end" className="ex-num">
                    {price.format(stock.last)}
                  </TableCell>
                  <TableCell align="end" className="ex-num">
                    {dollars.format(value)}
                  </TableCell>
                  <TableCell align="end" className="ex-num" data-direction={dayGain >= 0 ? "up" : "down"}>
                    {dayGain >= 0 ? "+" : "−"}
                    {dollars.format(Math.abs(dayGain))}
                  </TableCell>
                  <TableCell align="end" className="ex-num" data-direction={totalGain >= 0 ? "up" : "down"}>
                    {totalGain >= 0 ? "+" : "−"}
                    {dollars.format(Math.abs(totalGain))}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
        <Donut
          title="Allocation"
          summary={`${dollars.format(portfolio.total)} across ${portfolio.rows.length} holdings. ${largest.stock.symbol} is the largest, at ${Math.round(largest.share * 100)}%.`}
          columns={["Symbol", "Value"]}
          parts={parts}
          center={`$${(portfolio.total / 1000).toFixed(1)}K`}
          centerLabel="Allocation"
          size={phone ? 132 : 140}
          className="ex-allocation"
        />
      </div>
    </section>
  )
}

type StocksScreenProps = {
  range: StockRange
  onRangeChange: (range: StockRange) => void
  query: string
  compact?: boolean
}

function StocksScreen({ range, onRangeChange, query, compact: phone }: StocksScreenProps) {
  const [symbol, setSymbol] = React.useState("MCBT")
  const [kind, setKind] = React.useState<ChartStyle>("line")
  const stock = stocks.find((s) => s.symbol === symbol) ?? stocks[0]!
  const watchId = React.useId()
  const detail = (
    <div className="ex-stocks-detail">
      <Quote stock={stock} range={range} />
      {phone ? (
        <RangeControl ranges={stockRanges} value={range} onValueChange={onRangeChange} label="Chart range" block />
      ) : null}
      <div className="ex-quote-bar">
        <span>At close · Nov 13, 4:00 PM EST</span>
        <StyleToggle value={kind} onValueChange={setKind} />
      </div>
      <PriceChart stock={stock} range={range} kind={kind} height={phone ? 250 : 300} />
      {/* On iPhone the watchlist sits right under the chart it drives. */}
      {phone ? (
        <section className="ex-stocks-watch" aria-labelledby={watchId}>
          <h3 id={watchId} className="ex-stocks-heading">
            Watchlist
          </h3>
          <Watchlist value={symbol} onValueChange={setSymbol} query={query} />
        </section>
      ) : null}
      <KeyStatistics stock={stock} />
      <Portfolio compact={phone} />
    </div>
  )
  if (phone) {
    return (
      <div className="ex-stocks" data-compact="">
        {detail}
      </div>
    )
  }
  return (
    <div className="ex-stocks">
      <aside className="ex-stocks-list" aria-labelledby={watchId}>
        <div className="ex-stocks-list-head">
          <h2 id={watchId}>My symbols</h2>
          <span>{stocks.length} symbols</span>
        </div>
        <Watchlist value={symbol} onValueChange={setSymbol} query={query} />
      </aside>
      {detail}
    </div>
  )
}

export { StocksScreen }
