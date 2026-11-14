"use client"

import { Sparkline } from "@/components/charts"

/** Today's 5-minute closes, trimmed to 24 points; enough for a sparkline. */
const watchlist = [
  {
    symbol: "DRMB",
    name: "Dreambase Inc.",
    price: 231.4,
    previousClose: 228.28,
    today: [228.9, 229.3, 228.7, 228.4, 229.1, 229.6, 229.2, 229.0, 229.4, 229.9, 229.5, 229.8, 230.4, 230.1, 230.6, 231.0, 230.7, 231.2, 231.6, 231.3, 231.8, 232.0, 231.6, 231.4],
  },
  {
    symbol: "NWND",
    name: "Northwind Traders",
    price: 84.12,
    previousClose: 86.03,
    today: [86.2, 86.0, 85.7, 85.9, 85.4, 85.1, 85.3, 84.9, 85.0, 84.6, 84.8, 84.4, 84.7, 84.5, 84.2, 84.6, 84.3, 84.0, 84.2, 83.9, 84.1, 84.3, 84.0, 84.12],
  },
  {
    symbol: "ORBT",
    name: "Orbital Systems",
    price: 412.77,
    previousClose: 405.1,
    today: [405.6, 406.9, 406.2, 407.8, 408.4, 407.6, 409.1, 410.2, 409.4, 410.8, 411.6, 410.9, 411.2, 412.4, 411.8, 412.9, 413.6, 412.8, 413.1, 412.2, 412.9, 413.4, 412.6, 412.77],
  },
  {
    symbol: "LUMA",
    name: "Lumen Health",
    price: 57.36,
    previousClose: 57.92,
    today: [57.9, 58.2, 58.4, 58.1, 58.3, 57.9, 57.8, 58.0, 57.6, 57.7, 57.4, 57.6, 57.9, 57.7, 57.5, 57.3, 57.5, 57.2, 57.4, 57.6, 57.3, 57.5, 57.4, 57.36],
  },
]

const price = new Intl.NumberFormat("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })

export default function Watchlist() {
  return (
    <ul aria-label="Watchlist" style={{ width: "100%", maxWidth: 420, margin: 0, padding: 0, listStyle: "none" }}>
      {watchlist.map((stock) => {
        const change = stock.price - stock.previousClose
        const percent = (change / stock.previousClose) * 100
        const up = change >= 0
        return (
          <li
            key={stock.symbol}
            style={{
              display: "grid",
              gridTemplateColumns: "minmax(0, 1fr) auto auto",
              alignItems: "center",
              gap: 12,
              padding: "10px 0",
              borderBottom: "0.5px solid var(--sd-separator)",
            }}
          >
            <div style={{ minWidth: 0 }}>
              <div style={{ font: "var(--sd-text-headline)" }}>{stock.symbol}</div>
              <div
                style={{
                  color: "var(--sd-label-secondary)",
                  font: "var(--sd-text-footnote)",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {stock.name}
              </div>
            </div>
            <Sparkline values={stock.today} baseline={stock.previousClose} width={64} height={30} />
            <div style={{ display: "grid", justifyItems: "end", gap: 3, fontVariantNumeric: "tabular-nums" }}>
              <span style={{ font: "var(--sd-text-headline)", fontWeight: 500 }}>{price.format(stock.price)}</span>
              <span
                style={{
                  minWidth: 64,
                  padding: "1px 6px",
                  borderRadius: 5,
                  textAlign: "end",
                  color: "#fff",
                  // Darkened just enough for white text to hold 4.5:1.
                  background: `oklch(from var(${up ? "--sd-green" : "--sd-red"}) min(l, 0.52) c h)`,
                  font: "var(--sd-text-footnote)",
                  fontWeight: 600,
                }}
              >
                <span className="sd-visually-hidden">{up ? "Up" : "Down"} </span>
                {up ? "+" : "−"}
                {Math.abs(percent).toFixed(2)}%
              </span>
            </div>
          </li>
        )
      })}
    </ul>
  )
}
