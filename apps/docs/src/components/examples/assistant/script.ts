/*
 * The conversation and the scripted replies. There's no model and no network:
 * a reply is a list of steps that the store plays back on timers, so the
 * example streams, runs tools and asks for permission the way a real one does.
 */

type Pair = [label: string, value: string]

type ToolStep = {
  id: string
  verb: string
  object: string
  glyph: "skill" | "file" | "search" | "calendar" | "chart" | "image" | "finance"
  status: "running" | "done" | "error"
  request?: Pair[]
  response?: Pair[]
}

type CitationRef = { label: string; title: string; site: string; description: string }

/** A paragraph with inline citations, which the Markdown parser can't place, so it's drawn as its own part. */
type CitedParagraph = Array<string | CitationRef>

type ReplyPart = { kind: "markdown"; text: string } | { kind: "cited"; parts: CitedParagraph }

type ConfirmationAsk = {
  title: string
  description: string
  details: Pair[]
  state: "pending" | "allowed" | "denied"
  outcome?: string
}

type AssistantTurn = {
  id: string
  from: "assistant"
  reasoning?: { state: "running" | "done"; duration: number; text: string }
  tools?: { summary: string; steps: ToolStep[]; expanded?: string }
  confirmation?: ConfirmationAsk
  parts: ReplyPart[]
  sources?: { title: string; site: string }[]
  artifact?: { title: string; meta: string }
  images?: { seeds: string[]; prompt: string }
  /** Set while this turn is the one being written. */
  live?: boolean
  /** Set when the person pressed Stop before it finished. */
  stopped?: boolean
}

type UserTurn = {
  id: string
  from: "user"
  text: string
  attachment?: { name: string; seed: string }
}

type Turn = UserTurn | AssistantTurn

const q3Sources = [
  { title: "Q3 revenue export", site: "q3-revenue.csv" },
  { title: "Q2 review", site: "q2-review.md" },
  { title: "Northfield brand guide", site: "northfield-brand.pdf" },
  { title: "Revenue chart from the dashboard", site: "Revenue chart.png" },
]

const q3Thread: Turn[] = [
  {
    id: "q3-1",
    from: "user",
    text: "Here's the revenue chart from the dashboard. Can you put together the Q3 review for Thursday's meeting? The numbers are in the finance folder.",
    attachment: { name: "Revenue chart.png", seed: "revenue chart dashboard" },
  },
  {
    id: "q3-2",
    from: "assistant",
    reasoning: {
      state: "done",
      duration: 121,
      text: "The chart shows September well above July and August, so the quarter's story is a late lift. I'll check that against the invoice export rather than reading it off the image, compare it with Q2's review for the same metrics, and keep the format the team used last time.",
    },
    tools: {
      summary: "Used Finance books and Files, read 4 files",
      expanded: "query",
      steps: [
        { id: "skill", verb: "Loaded skill", object: "quarterly-review", glyph: "skill", status: "done" },
        { id: "image", verb: "Looked at", object: "Revenue chart.png", glyph: "image", status: "done" },
        { id: "search", verb: "Searched Files for", object: "“Q3 finance”", glyph: "search", status: "done" },
        { id: "csv", verb: "Read", object: "q3-revenue.csv", glyph: "file", status: "done" },
        {
          id: "query",
          verb: "Queried",
          object: "Finance books",
          glyph: "finance",
          status: "done",
          request: [
            ["Tool", "finance_books.revenue"],
            ["Period", "Jul 1 – Sep 30, 2026"],
            ["Group by", "Month, product line"],
            ["Currency", "USD, excluding tax"],
          ],
          response: [
            ["Rows", "36"],
            ["Revenue", "$1.84M"],
            ["Change from Q2", "+12.4%"],
            ["Took", "1.2s"],
          ],
        },
        { id: "q2", verb: "Read", object: "q2-review.md", glyph: "file", status: "done" },
        { id: "brand", verb: "Read", object: "northfield-brand.pdf", glyph: "file", status: "done" },
        { id: "chart", verb: "Made chart", object: "Revenue by month", glyph: "chart", status: "done" },
      ],
    },
    parts: [
      {
        kind: "markdown",
        text: `Here's the Q3 review. Revenue was **$1.84M**, up 12.4% from Q2, and most of the growth came in September.

## Q3 at a glance

- **Revenue grew for the third quarter in a row.** September alone brought in $712K, the studio's best month so far.
- **Brand work led the quarter.** It made up 46% of revenue, up from 38%, mostly from two new retainers.
- **Margin held at 31%** even with the two new hires, because utilization rose to 78%.
- **One risk to raise:** two clients account for 40% of revenue. Last quarter it was 29%.`,
      },
      {
        kind: "cited",
        parts: [
          "The monthly figures come from the invoice export ",
          { label: "1", title: "Q3 revenue export", site: "q3-revenue.csv", description: "Invoices from July 1 to September 30, 2026, excluding tax." },
          " and match your chart; the comparison uses the same metrics as last quarter's review ",
          { label: "2", title: "Q2 review", site: "q2-review.md", description: "Presented on August 7. Revenue $1.64M, margin 30%." },
          ".",
        ],
      },
      {
        kind: "markdown",
        text: `| Month | Revenue | Margin |
| --- | ---: | ---: |
| July | $548K | 29% |
| August | $580K | 31% |
| September | $712K | 33% |

If you want to rerun the numbers before Thursday, this is the query I used:

\`\`\`sql
select date_trunc('month', invoiced_at) as month,
       sum(amount) as revenue
from invoices
where invoiced_at >= date '2026-07-01'
  and invoiced_at < date '2026-10-01'
group by 1
order by 1;
\`\`\``,
      },
    ],
    sources: q3Sources,
    artifact: { title: "Q3 review", meta: "Document · Only you" },
  },
  {
    id: "q3-3",
    from: "user",
    text: "Make a cover image for the deck. Something calm, in the studio's colors.",
  },
  {
    id: "q3-4",
    from: "assistant",
    images: {
      prompt: "A calm abstract cover in teal and sand",
      seeds: ["northfield cover one", "northfield cover two", "northfield cover three", "northfield cover four"],
    },
    parts: [
      {
        kind: "markdown",
        text: "Here are four options in the studio's teal and sand. The second leaves the most room for a title.",
      },
    ],
  },
]

/* ── Scripted replies ────────────────────────────────────────────── */

type ScriptStep =
  | { kind: "think"; ms: number; text: string }
  | { kind: "tool"; ms: number; step: Omit<ToolStep, "status"> }
  | { kind: "confirm"; ask: Omit<ConfirmationAsk, "state" | "outcome">; allowed: string; denied: string }
  | { kind: "text"; text: string }
  | { kind: "sources"; sources: { title: string; site: string }[] }

type Script = { id: string; summary: string; steps: ScriptStep[] }

const calendarScript: Script = {
  id: "calendar",
  summary: "Used Calendar, read 1 file",
  steps: [
    {
      kind: "think",
      ms: 1600,
      text: "Thursday is the 19th. Jonah and Priya are both on the review, so I'll look for an hour when all three of you are free, before lunch if possible, and attach the review so nobody has to look for it.",
    },
    { kind: "tool", ms: 900, step: { id: "read-review", verb: "Read", object: "Q3 review.md", glyph: "file" } },
    {
      kind: "tool",
      ms: 1400,
      step: {
        id: "free-busy",
        verb: "Checked",
        object: "Calendar for Thursday",
        glyph: "calendar",
        request: [
          ["Tool", "calendar.free_busy"],
          ["Day", "Thu, Nov 19"],
          ["People", "Maya, Jonah, Priya"],
        ],
        response: [
          ["Free for all", "10:00–11:00 AM, 3:30–4:30 PM"],
          ["Took", "0.8s"],
        ],
      },
    },
    {
      kind: "confirm",
      ask: {
        title: "Allow Calendar to create an event?",
        description: "Calendar will add this event and email an invitation to two people.",
        details: [
          ["Title", "Q3 review"],
          ["When", "Thu, Nov 19, 10:00–11:00 AM"],
          ["Guests", "Jonah Reyes, Priya Shah"],
          ["Attachment", "Q3 review.md"],
        ],
      },
      allowed: `Done. **Q3 review** is on your calendar for Thursday, November 19, from 10:00 to 11:00 AM.

- **Jonah and Priya are invited.** Both calendars were free, so it shouldn't need moving.
- **The review is attached** to the invitation, so everyone can read it beforehand.
- **I kept it to an hour.** Last quarter's review ran 50 minutes.

Want me to draft a short agenda for the invitation too?`,
      denied: `I didn't create the event. The hour that works for all three of you is **Thursday, 10:00 to 11:00 AM**, with 3:30 PM as a backup.

If you add it yourself, attach **Q3 review.md** so everyone can read it beforehand.`,
    },
    { kind: "sources", sources: [{ title: "Q3 review", site: "Q3 review.md" }, { title: "Free and busy times", site: "Calendar" }] },
  ],
}

const tripScript: Script = {
  id: "trip",
  summary: "Searched the web, read 1 file",
  steps: [
    {
      kind: "think",
      ms: 1500,
      text: "Three days in March means mild weather and short queues. I'll plan each day around one neighborhood to keep walking reasonable, and compare the train and a flight for getting there from Madrid.",
    },
    { kind: "tool", ms: 1100, step: { id: "web", verb: "Searched the web for", object: "“Porto in March”", glyph: "search" } },
    { kind: "tool", ms: 900, step: { id: "notes", verb: "Read", object: "porto-ideas.md", glyph: "file" } },
    {
      kind: "text",
      text: `Here's a plan for **three days in Porto in March**. The weather is mild, around 16°C, and it's quieter than in summer.

## Day by day

1. **Friday: Ribeira and the bridge.** Walk down from São Bento, cross the Dom Luís I bridge to Gaia, and have dinner by the river.
2. **Saturday: Foz.** Take the tram along the Douro to the sea, and walk back along the promenade.
3. **Sunday: the Douro valley.** The morning train to Pinhão runs beside the river; book a tasting near the station.

## Getting there from Madrid

| Option | Door to door | Typical fare |
| --- | ---: | ---: |
| Flight | 3 h 30 min | €90 |
| Train via Vigo | 9 h | €65 |

The flight is quicker, but the train is a nice way to start the trip if you have the day.`,
    },
    { kind: "sources", sources: [{ title: "Your trip ideas", site: "porto-ideas.md" }, { title: "Visiting in spring", site: "Web search" }] },
  ],
}

/** Picks the reply for a prompt. Anything about meetings and calendars gets the calendar script. */
function scriptFor(prompt: string): Script {
  return /review|meeting|calendar|schedule|invite|agenda|time for/i.test(prompt) ? calendarScript : tripScript
}

export { calendarScript, q3Thread, scriptFor, tripScript }
export type { AssistantTurn, CitationRef, CitedParagraph, ConfirmationAsk, Pair, ReplyPart, Script, ScriptStep, ToolStep, Turn, UserTurn }
