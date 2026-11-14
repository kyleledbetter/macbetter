import {
  ArchiveIcon,
  FileTextIcon,
  FlagIcon,
  FolderIcon,
  InboxIcon,
  OctagonXIcon,
  SendIcon,
  StarIcon,
  Trash2Icon,
} from "lucide-react"
import type { Icon } from "../rows"

type MailboxId =
  | "inbox"
  | "vip"
  | "flagged"
  | "drafts"
  | "sent"
  | "junk"
  | "trash"
  | "archive"
  | "customers"
  | "investors"
  | "receipts"

type Mailbox = { id: MailboxId; name: string; icon: Icon; tint?: string }

const favorites: Mailbox[] = [
  { id: "inbox", name: "Inbox", icon: InboxIcon },
  { id: "vip", name: "VIP", icon: StarIcon },
  { id: "flagged", name: "Flagged", icon: FlagIcon, tint: "var(--sd-orange)" },
  { id: "drafts", name: "Drafts", icon: FileTextIcon },
  { id: "sent", name: "Sent", icon: SendIcon },
  { id: "junk", name: "Junk", icon: OctagonXIcon },
  { id: "trash", name: "Trash", icon: Trash2Icon },
  { id: "archive", name: "Archive", icon: ArchiveIcon },
]

const folders: Mailbox[] = [
  { id: "customers", name: "Customers", icon: FolderIcon },
  { id: "investors", name: "Investors", icon: FolderIcon },
  { id: "receipts", name: "Receipts", icon: FolderIcon },
]

const mailboxes = [...favorites, ...folders]

type Message = {
  id: string
  mailbox: MailboxId
  from: string
  email: string
  vip?: boolean
  to: string
  subject: string
  date: string
  time: string
  unread: boolean
  flagged: boolean
  attachment?: { name: string; size: string }
  body: string[]
}

const messages: Message[] = [
  {
    id: "m1",
    mailbox: "inbox",
    from: "Inès Moreau",
    email: "ines@northwind.studio",
    vip: true,
    to: "Avery Chen",
    subject: "Launch checklist for Thursday",
    date: "Today",
    time: "9:41 AM",
    unread: true,
    flagged: true,
    attachment: { name: "Launch checklist.pdf", size: "184 KB" },
    body: [
      "Hi Avery,",
      "Everything on the launch checklist is green except the App Store screenshots. Kofi is reshooting them on the new devices this afternoon, so we should be ready to submit tomorrow morning.",
      "Two things I need from you before then: sign-off on the release notes (attached, page 2) and a final yes on the pricing page copy. If you can get both to me by 4 PM, we stay on schedule.",
      "Thanks,\nInès",
    ],
  },
  {
    id: "m2",
    mailbox: "inbox",
    from: "Kofi Mensah",
    email: "kofi@northwind.studio",
    to: "Avery Chen",
    subject: "Retention chart for the Q3 review",
    date: "Today",
    time: "8:12 AM",
    unread: true,
    flagged: false,
    body: [
      "Avery,",
      "I added the retention chart you asked for on Friday. Week-four retention is up to 41%, mostly from the onboarding changes we shipped in August.",
      "The chart lives in the shared dashboard under Growth. Happy to walk the board through it if that helps.",
      "Kofi",
    ],
  },
  {
    id: "m3",
    mailbox: "inbox",
    from: "Wren Takahashi",
    email: "wren@northwind.studio",
    to: "Design team",
    subject: "Re: Offsite in December",
    date: "Yesterday",
    time: "Yesterday",
    unread: false,
    flagged: false,
    body: [
      "Thursday the 12th works for the whole team. I booked the long room at the Ferry Building from 10 to 4, and lunch is sorted.",
      "Bring one thing you want to stop doing next year. We’ll start there.",
      "Wren",
    ],
  },
  {
    id: "m4",
    mailbox: "inbox",
    from: "Hollis Grant",
    email: "billing@grantandco.com",
    to: "Avery Chen",
    subject: "Invoice 4189 for October",
    date: "Yesterday",
    time: "Yesterday",
    unread: true,
    flagged: false,
    attachment: { name: "Invoice-4189.pdf", size: "92 KB" },
    body: [
      "Hello Avery,",
      "Attached is the invoice for the October retainer. Payment is due within 30 days. Let me know if you’d like it split across two cost centers like last quarter.",
      "Best regards,\nHollis Grant",
    ],
  },
  {
    id: "m5",
    mailbox: "inbox",
    from: "Amara Okafor",
    email: "amara@harborlights.co",
    vip: true,
    to: "Avery Chen",
    subject: "Partnership next steps",
    date: "Monday",
    time: "Monday",
    unread: false,
    flagged: true,
    body: [
      "Avery, great to meet you last week. Our team loved the demo, especially the agent that writes the weekly metrics summary.",
      "Could we set up a 30-minute call with our data lead next week? Tuesday or Wednesday afternoon works best on our side.",
      "Amara",
    ],
  },
  {
    id: "m6",
    mailbox: "inbox",
    from: "Theo Lindqvist",
    email: "theo@lindqvist.se",
    to: "Avery Chen",
    subject: "Photos from the conference",
    date: "Monday",
    time: "Monday",
    unread: true,
    flagged: false,
    body: [
      "Here are the photos from your talk. The one of the full room is my favorite. Feel free to use any of them on the blog.",
      "Theo",
    ],
  },
  {
    id: "m7",
    mailbox: "inbox",
    from: "Priya Raman",
    email: "priya@northwind.studio",
    to: "Engineering",
    subject: "Database migration window",
    date: "Sunday",
    time: "Sunday",
    unread: true,
    flagged: false,
    body: [
      "Team,",
      "The Postgres upgrade is scheduled for Saturday from 6 to 7 AM Pacific. We expect under two minutes of read-only time. I’ll post updates in the incidents channel as we go.",
      "Priya",
    ],
  },
  {
    id: "m8",
    mailbox: "inbox",
    from: "Lucía Ferrer",
    email: "lucia@kitchentable.fm",
    to: "Avery Chen",
    subject: "Podcast interview questions",
    date: "Nov 8",
    time: "Nov 8",
    unread: false,
    flagged: false,
    body: [
      "Hi Avery, as promised here are the questions for next week’s episode. Nothing to prepare, it’ll be a conversation. We record at 11 AM and should wrap by noon.",
      "Lucía",
    ],
  },
  {
    id: "m9",
    mailbox: "inbox",
    from: "Jonah Weiss",
    email: "jonah@northwind.studio",
    to: "Avery Chen",
    subject: "Hiring plan draft",
    date: "Nov 7",
    time: "Nov 7",
    unread: false,
    flagged: false,
    body: [
      "Draft hiring plan for the first half is in the shared folder. Two engineers, one designer, one solutions engineer. Comments welcome before Friday.",
      "Jonah",
    ],
  },
  {
    id: "d1",
    mailbox: "drafts",
    from: "Avery Chen",
    email: "avery@northwind.studio",
    to: "Board",
    subject: "November update",
    date: "Today",
    time: "7:55 AM",
    unread: false,
    flagged: false,
    body: ["Hi all, a quick update on November. Revenue is up 12% month over month and…"],
  },
  {
    id: "s1",
    mailbox: "sent",
    from: "Avery Chen",
    email: "avery@northwind.studio",
    to: "Inès Moreau",
    subject: "Re: Pricing page copy",
    date: "Yesterday",
    time: "Yesterday",
    unread: false,
    flagged: false,
    body: ["Looks great. One small change: say “per seat” instead of “per user” so it matches the invoice."],
  },
  {
    id: "c1",
    mailbox: "customers",
    from: "Sefa Adjei",
    email: "sefa@deepfield.io",
    to: "Avery Chen",
    subject: "Feature request: Slack alerts",
    date: "Nov 6",
    time: "Nov 6",
    unread: false,
    flagged: false,
    body: ["We’d love alerts posted to a Slack channel when a dataset goes stale. Is that on the roadmap?"],
  },
  {
    id: "r1",
    mailbox: "receipts",
    from: "Saltmarsh Coffee",
    email: "receipts@saltmarsh.coffee",
    to: "Avery Chen",
    subject: "Your receipt from Saltmarsh Coffee",
    date: "Nov 5",
    time: "Nov 5",
    unread: false,
    flagged: false,
    body: ["Thanks for stopping by. Oat flat white, $5.25. See you soon."],
  },
]

function inMailbox(list: Message[], mailbox: MailboxId) {
  if (mailbox === "flagged") return list.filter((m) => m.flagged && m.mailbox !== "trash")
  if (mailbox === "vip") return list.filter((m) => m.vip && m.mailbox === "inbox")
  return list.filter((m) => m.mailbox === mailbox)
}

function matches(message: Message, query: string) {
  const q = query.trim().toLowerCase()
  if (!q) return true
  return [message.from, message.subject, message.body.join(" ")].join(" ").toLowerCase().includes(q)
}

function preview(message: Message) {
  return message.body.find((line) => line.length > 30) ?? message.body[0]
}

export { favorites, folders, inMailbox, mailboxes, matches, messages, preview }
export type { Mailbox, MailboxId, Message }
