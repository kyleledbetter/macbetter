import { CodeBlock, CodeBlockContent, CodeBlockCopy, CodeBlockHeader, CodeBlockTitle } from "macbetter/code-block"

const source = `type Forecast = { day: string; high: number; low: number }

export function warmestDay(week: Forecast[]) {
  return week.reduce((best, day) => (day.high > best.high ? day : best))
}
`

export default function Example() {
  return (
    <CodeBlock style={{ width: "100%", maxWidth: 560 }}>
      <CodeBlockHeader>
        <CodeBlockTitle language="TypeScript">forecast.ts</CodeBlockTitle>
        <CodeBlockCopy />
      </CodeBlockHeader>
      <CodeBlockContent>{source}</CodeBlockContent>
    </CodeBlock>
  )
}
