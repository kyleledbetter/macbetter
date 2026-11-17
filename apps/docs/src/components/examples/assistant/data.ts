/*
 * Everything the Assistant example shows. The product, its models and its
 * plugins are invented; pictures are generated Artwork from these seeds.
 */

type Tint = "blue" | "green" | "orange" | "pink" | "purple" | "teal" | "indigo" | "red" | "cyan" | "brown" | "mint" | "yellow" | "gray"

const person = { name: "Maya Ortiz", first: "Maya", plan: "Team plan" }

const models = [
  { value: "atlas-4", label: "Atlas 4", description: "Best for complex, multi-step work" },
  { value: "atlas-4-mini", label: "Atlas 4 Mini", description: "Fastest for everyday questions" },
]

const efforts = [
  { value: "low", label: "Low", description: "Quick answers" },
  { value: "medium", label: "Medium", description: "A balance of speed and depth" },
  { value: "high", label: "High", description: "Takes longer on hard problems" },
]

type Project = { id: string; name: string }

const projects: Project[] = [
  { id: "northfield", name: "Northfield Studio" },
  { id: "porto", name: "Porto in March" },
]

type Recent = {
  id: string
  title: string
  project?: string
  /** A short exchange shown when the chat is opened. The main chat has a full thread instead. */
  prompt?: string
  reply?: string
}

const recents: Recent[] = [
  { id: "q3-review", title: "Q3 review for Northfield", project: "northfield" },
  {
    id: "porto-weekend",
    title: "Long weekend in Porto",
    project: "porto",
    prompt: "What's the best way to spend three days in Porto in March?",
    reply:
      "March is quiet and mild in Porto, so you can see most of the city on foot. Spend the first day around Ribeira and the Dom Luís I bridge, the second in Foz by the sea, and keep the third for a day trip up the Douro valley.",
  },
  {
    id: "invoice-wording",
    title: "Wording for a late invoice reminder",
    prompt: "Help me write a polite reminder for an invoice that's two weeks late.",
    reply:
      "Keep it short and assume good faith: say which invoice it is, when it was due, and offer to resend it. A line like “Just checking this reached the right person” lets them pay without losing face.",
  },
  {
    id: "sourdough",
    title: "Why my sourdough is dense",
    prompt: "My sourdough keeps coming out dense. What am I doing wrong?",
    reply:
      "The usual cause is under-proofing. If the dough hasn't grown by about half during bulk fermentation, give it longer, or move it somewhere warmer, before you shape it.",
  },
  {
    id: "hiring-plan",
    title: "Hiring plan for the design team",
    project: "northfield",
    prompt: "Sketch a hiring plan for two designers next year.",
    reply:
      "Hire the senior designer first, in the first quarter, so they can help interview the second. Budget about ten weeks from posting to start date for each role.",
  },
  {
    id: "lease-questions",
    title: "Questions to ask before signing a lease",
    prompt: "What should I ask a landlord before signing a lease?",
    reply:
      "Ask what's included in the rent, how repairs are requested and how fast they're handled, what the notice period is, and whether the deposit is held in a protected account.",
  },
  {
    id: "csv-cleanup",
    title: "Cleaning up the customer export",
    project: "northfield",
    prompt: "The customer export has duplicate rows. How do I clean it up?",
    reply:
      "Match rows on email address after trimming spaces and lowercasing it, keep the most recently updated row in each group, and save the removed rows to a separate file so you can check them.",
  },
  {
    id: "standup-notes",
    title: "Summarize Monday's standup",
    prompt: "Summarize these standup notes into three bullet points.",
    reply: "The launch moved to the 24th, the pricing page needs copy by Wednesday, and Priya is out on Friday.",
  },
  {
    id: "garden",
    title: "Vegetables for a shady balcony",
    prompt: "Which vegetables grow on a balcony that only gets morning sun?",
    reply: "Leafy greens do best: lettuce, spinach, chard and kale all cope with four hours of sun. Herbs like parsley and mint are happy there too.",
  },
  {
    id: "talk-outline",
    title: "Outline for the meetup talk",
    prompt: "Help me outline a 15-minute talk on design systems.",
    reply:
      "Open with one real bug that a shared component fixed everywhere at once, then cover tokens, components and docs in five minutes each, and end with what you'd do differently.",
  },
  {
    id: "budget-sheet",
    title: "Monthly budget spreadsheet",
    prompt: "Set up a simple monthly budget with categories.",
    reply: "Start with income, then fixed costs, then flexible spending, and add a row that shows what's left. I'd keep it to about ten categories so it stays easy to update.",
  },
  {
    id: "flight-change",
    title: "Changing a flight after check-in",
    prompt: "Can I change my flight after I've checked in online?",
    reply: "Usually yes, but most airlines undo the check-in first. Change it in the app or at the desk, then check in again for the new flight.",
  },
  {
    id: "color-tokens",
    title: "Naming color tokens",
    project: "northfield",
    prompt: "How should we name our color tokens?",
    reply: "Name them by role rather than by hue, like label, background and accent, so a theme can change the color without renaming anything.",
  },
  {
    id: "running-plan",
    title: "Ten-week plan for a 10K",
    prompt: "Give me a ten-week plan to run my first 10K.",
    reply: "Run three times a week: two easy runs and one longer run that grows by about a kilometer each week. Take week six a little easier before building to the full distance.",
  },
  {
    id: "thank-you",
    title: "Thank-you note to the venue",
    prompt: "Draft a thank-you note to the venue that hosted our offsite.",
    reply: "Thank them for something specific, like the room setup or the lunch, mention that the team noticed, and say you'd like to come back.",
  },
  {
    id: "sql-window",
    title: "Running totals in SQL",
    prompt: "How do I add a running total to a query?",
    reply: "Use a window function: sum the column over the rows ordered by date, like sum(amount) over (order by day). Add a partition by clause to restart it for each customer.",
  },
  {
    id: "book-club",
    title: "Questions for book club",
    prompt: "Suggest discussion questions for a book club.",
    reply: "Ask which character changed the most, which scene people would cut, and whether the ending felt earned. Open questions like these get people talking.",
  },
  {
    id: "retro",
    title: "Format for the project retro",
    project: "northfield",
    prompt: "What's a good format for a project retrospective?",
    reply: "Give everyone five quiet minutes to write what went well, what didn't, and what to try next, then group the notes and pick two changes to commit to.",
  },
  {
    id: "rental-car",
    title: "Do I need a rental car in the Douro?",
    project: "porto",
    prompt: "Do I need a car to visit the Douro valley?",
    reply: "Not necessarily. The train from Porto to Pinhão runs along the river and is a sight in itself, and most quintas near the station offer tastings within walking distance.",
  },
  {
    id: "sleep",
    title: "Getting back on schedule after travel",
    prompt: "How do I get over jet lag faster?",
    reply: "Get outside in the morning light where you are now, eat meals at local times, and keep naps under twenty minutes on the first day.",
  },
]

type Attachment = { name: string; kind: string; seed: string; palette: "ocean" | "sunset" | "forest" | "dusk" | "amber" | "glacier" | "berry" }

const outputs: Attachment[] = [
  { name: "Q3 review.md", kind: "Document", seed: "q3 review document", palette: "glacier" },
  { name: "Cover, option 2.png", kind: "Image", seed: "northfield cover two", palette: "ocean" },
  { name: "Revenue by month.png", kind: "Chart", seed: "revenue by month chart", palette: "forest" },
]

type SourceFile = { name: string; meta: string; extension: string; color: "green" | "red" | "blue" | "orange" | "purple" }

const sourceFiles: SourceFile[] = [
  { name: "q3-revenue.csv", meta: "CSV · 84 KB", extension: "csv", color: "green" },
  { name: "q2-review.md", meta: "Markdown · 12 KB", extension: "md", color: "blue" },
  { name: "northfield-brand.pdf", meta: "PDF · 3.1 MB", extension: "pdf", color: "red" },
  { name: "Revenue chart.png", meta: "PNG · 640 KB", extension: "png", color: "purple" },
]

const recentOutputs = [
  { title: "Q3 review", chat: "q3-review", time: "Today, 9:41 AM", seed: "q3 review document", palette: "glacier" as const },
  { title: "Porto itinerary", chat: "porto-weekend", time: "Yesterday", seed: "porto itinerary river", palette: "sunset" as const },
  { title: "Color token names", chat: "color-tokens", time: "Monday", seed: "brand colors audit", palette: "berry" as const },
]

/* ── Plugins ─────────────────────────────────────────────────────── */

type PluginGlyph =
  | "calendar"
  | "mail"
  | "files"
  | "notes"
  | "tasks"
  | "search"
  | "sheet"
  | "slides"
  | "finance"
  | "customers"
  | "tickets"
  | "chart"
  | "image"
  | "pen"
  | "mic"
  | "translate"
  | "map"
  | "weather"
  | "code"
  | "music"

type PluginSection = "popular" | "new" | "productivity" | "creativity"

type Plugin = {
  id: string
  name: string
  description: string
  glyph: PluginGlyph
  color: Tint
  section: PluginSection
  scope: "public" | "workspace"
  badge?: string
  installed?: boolean
}

const pluginSections: { id: PluginSection; title: string }[] = [
  { id: "popular", title: "Popular" },
  { id: "new", title: "New and noteworthy" },
  { id: "productivity", title: "Productivity" },
  { id: "creativity", title: "Creativity" },
]

const plugins: Plugin[] = [
  { id: "calendar", name: "Calendar", description: "Find free time and create events", glyph: "calendar", color: "red", section: "popular", scope: "public", installed: true },
  { id: "mail", name: "Mail", description: "Search, summarize and draft email", glyph: "mail", color: "blue", section: "popular", scope: "public", installed: true },
  { id: "files", name: "Files", description: "Read documents from your shared drive", glyph: "files", color: "cyan", section: "popular", scope: "public", installed: true },
  { id: "web", name: "Web search", description: "Look things up and cite what it finds", glyph: "search", color: "indigo", section: "popular", scope: "public" },
  { id: "sheets", name: "Spreadsheets", description: "Analyze tables and build charts", glyph: "sheet", color: "green", section: "popular", scope: "public", installed: true },
  { id: "tasks", name: "Tasks", description: "Turn plans into to-dos with due dates", glyph: "tasks", color: "orange", section: "popular", scope: "public" },
  { id: "translate", name: "Translate", description: "Translate text and documents in 40 languages", glyph: "translate", color: "teal", section: "new", scope: "public", badge: "New" },
  { id: "maps", name: "Maps", description: "Plan routes and find places nearby", glyph: "map", color: "mint", section: "new", scope: "public", badge: "New" },
  { id: "weather", name: "Weather", description: "Forecasts for any city, ten days out", glyph: "weather", color: "cyan", section: "new", scope: "public" },
  { id: "voice-notes", name: "Voice notes", description: "Transcribe and summarize recordings", glyph: "mic", color: "pink", section: "new", scope: "public", badge: "Beta" },
  { id: "notes", name: "Notes", description: "Save answers and outlines to your notes", glyph: "notes", color: "yellow", section: "productivity", scope: "public" },
  { id: "slides", name: "Slides", description: "Draft a deck from an outline", glyph: "slides", color: "orange", section: "productivity", scope: "public" },
  { id: "code-review", name: "Code review", description: "Explain diffs and suggest fixes", glyph: "code", color: "brown", section: "productivity", scope: "public" },
  { id: "charts", name: "Charts", description: "Make a chart from any table", glyph: "chart", color: "purple", section: "productivity", scope: "public" },
  { id: "image-studio", name: "Image studio", description: "Generate and edit images from a prompt", glyph: "image", color: "pink", section: "creativity", scope: "public", installed: true },
  { id: "sketchpad", name: "Sketchpad", description: "Turn rough sketches into clean diagrams", glyph: "pen", color: "purple", section: "creativity", scope: "public" },
  { id: "soundboard", name: "Soundboard", description: "Compose short music beds for video", glyph: "music", color: "red", section: "creativity", scope: "public", badge: "Beta" },
  { id: "storyboard", name: "Storyboard", description: "Lay out scenes for a video shoot", glyph: "slides", color: "indigo", section: "creativity", scope: "public" },
  { id: "finance-books", name: "Finance books", description: "Northfield's ledger, read-only", glyph: "finance", color: "green", section: "popular", scope: "workspace", installed: true },
  { id: "customer-records", name: "Customer records", description: "Look up accounts and contacts", glyph: "customers", color: "blue", section: "popular", scope: "workspace" },
  { id: "support-queue", name: "Support queue", description: "Summarize and triage open tickets", glyph: "tickets", color: "orange", section: "productivity", scope: "workspace" },
  { id: "brand-library", name: "Brand library", description: "Logos, colors and type for Northfield", glyph: "image", color: "teal", section: "creativity", scope: "workspace", badge: "Workspace" },
]

/* ── Skills ──────────────────────────────────────────────────────── */

type Skill = {
  id: string
  name: string
  description: string
  author: string
  updated: string
  glyph: PluginGlyph
  color: Tint
}

const skills: Skill[] = [
  {
    id: "quarterly-review",
    name: "quarterly-review",
    description: "Turns a quarter's numbers into a one-page review with a table and three takeaways.",
    author: "Maya Ortiz",
    updated: "Nov 3, 2026",
    glyph: "chart",
    color: "green",
  },
  {
    id: "trip-planner",
    name: "trip-planner",
    description: "Plans a trip day by day with walking distances and a budget.",
    author: "Maya Ortiz",
    updated: "Oct 28, 2026",
    glyph: "map",
    color: "mint",
  },
  {
    id: "brand-voice",
    name: "brand-voice",
    description: "Rewrites copy in Northfield's voice: plain, warm and short.",
    author: "Northfield Studio",
    updated: "Oct 14, 2026",
    glyph: "pen",
    color: "purple",
  },
  {
    id: "meeting-notes",
    name: "meeting-notes",
    description: "Turns a transcript into decisions, owners and next steps.",
    author: "Northfield Studio",
    updated: "Sep 30, 2026",
    glyph: "notes",
    color: "yellow",
  },
  {
    id: "data-cleanup",
    name: "data-cleanup",
    description: "Finds duplicates and fixes formats in a spreadsheet before analysis.",
    author: "Jonah Reyes",
    updated: "Sep 12, 2026",
    glyph: "sheet",
    color: "teal",
  },
  {
    id: "deck-outline",
    name: "deck-outline",
    description: "Drafts a slide-by-slide outline from a brief, with speaker notes.",
    author: "Priya Shah",
    updated: "Aug 21, 2026",
    glyph: "slides",
    color: "orange",
  },
]

type SkillFile = { path: string; name: string; language?: string }

type SkillFolder = { path: string; name: string; files: SkillFile[] }

const skillFolders: SkillFolder[] = [
  { path: "agents", name: "agents", files: [{ path: "agents/reviewer.md", name: "reviewer.md", language: "md" }] },
  {
    path: "assets",
    name: "assets",
    files: [
      { path: "assets/template.md", name: "template.md", language: "md" },
      { path: "assets/table.css", name: "table.css", language: "css" },
    ],
  },
  { path: "evals", name: "evals", files: [{ path: "evals/cases.json", name: "cases.json", language: "json" }] },
  {
    path: "references",
    name: "references",
    files: [
      { path: "references/metrics.md", name: "metrics.md", language: "md" },
      { path: "references/query.sql", name: "query.sql", language: "sql" },
    ],
  },
]

function skillBody(skill: Skill) {
  return `## When to use it

${skill.description} It works best with a file or a clear brief attached, and asks for whatever is missing.

## Steps

1. **Read the inputs.** Open every attached file before writing anything, and list what's missing.
2. **Check the numbers.** Recalculate totals instead of copying them, and note any that don't match.
3. **Write the draft.** Lead with the answer, then the detail. Keep it to one page.
4. **Ask before sharing.** Never send or publish the result without confirming first.

## Output

A Markdown document with a short summary, a table and a list of open questions.`
}

function skillFileContents(skill: Skill, path: string): string {
  switch (path) {
    case "agents/reviewer.md":
      return `# Reviewer\n\nRead the draft from ${skill.name} as the person who will present it.\nFlag anything that can't be traced to a source file.\nReply with at most five comments.`
    case "assets/template.md":
      return `# {{title}}\n\n{{summary}}\n\n| Metric | This period | Last period | Change |\n| --- | --- | --- | --- |\n{{rows}}\n\n## Open questions\n\n{{questions}}`
    case "assets/table.css":
      return `table {\n  width: 100%;\n  border-collapse: collapse;\n}\n\nth {\n  text-align: start;\n  font-weight: 600;\n}\n\ntd:not(:first-child) {\n  text-align: end;\n  font-variant-numeric: tabular-nums;\n}`
    case "evals/cases.json":
      return `[\n  {\n    "input": "q3-revenue.csv",\n    "expect": ["summary", "table", "questions"],\n    "maxWords": 400\n  },\n  {\n    "input": "empty.csv",\n    "expect": ["asks for data"]\n  }\n]`
    case "references/metrics.md":
      return `# Metrics\n\n- Revenue: invoiced amount, excluding tax.\n- Margin: revenue minus direct costs, over revenue.\n- Retention: clients with work in both quarters.`
    case "references/query.sql":
      return `select\n  date_trunc('month', invoiced_at) as month,\n  product_line,\n  sum(amount) as revenue\nfrom invoices\nwhere invoiced_at >= date '2026-07-01'\n  and invoiced_at < date '2026-10-01'\ngroup by 1, 2\norder by 1, 2;`
    default:
      return ""
  }
}

export {
  efforts,
  models,
  outputs,
  person,
  plugins,
  pluginSections,
  projects,
  recentOutputs,
  recents,
  skillBody,
  skillFileContents,
  skillFolders,
  skills,
  sourceFiles,
}
export type { Attachment, Plugin, PluginGlyph, PluginSection, Project, Recent, Skill, SkillFile, SkillFolder, SourceFile, Tint }
