import { Squircle } from "macbetter/squircle"
import {
  AudioLinesIcon,
  BarChart3Icon,
  BookOpenIcon,
  CalendarIcon,
  CloudSunIcon,
  CodeIcon,
  FileTextIcon,
  FolderIcon,
  ImageIcon,
  LandmarkIcon,
  LanguagesIcon,
  ListChecksIcon,
  MailIcon,
  MapIcon,
  MicIcon,
  MusicIcon,
  PenToolIcon,
  PresentationIcon,
  SearchIcon,
  SheetIcon,
  StickyNoteIcon,
  TicketIcon,
  UsersIcon,
} from "lucide-react"
import type * as React from "react"
import type { PluginGlyph, Tint } from "./data"
import type { ToolStep } from "./script"

type Icon = React.ComponentType<React.SVGProps<SVGSVGElement>>

const pluginGlyphs: Record<PluginGlyph, Icon> = {
  calendar: CalendarIcon,
  mail: MailIcon,
  files: FolderIcon,
  notes: StickyNoteIcon,
  tasks: ListChecksIcon,
  search: SearchIcon,
  sheet: SheetIcon,
  slides: PresentationIcon,
  finance: LandmarkIcon,
  customers: UsersIcon,
  tickets: TicketIcon,
  chart: BarChart3Icon,
  image: ImageIcon,
  pen: PenToolIcon,
  mic: MicIcon,
  translate: LanguagesIcon,
  map: MapIcon,
  weather: CloudSunIcon,
  code: CodeIcon,
  music: MusicIcon,
}

const toolGlyphs: Record<ToolStep["glyph"], Icon> = {
  skill: BookOpenIcon,
  file: FileTextIcon,
  search: SearchIcon,
  calendar: CalendarIcon,
  chart: BarChart3Icon,
  image: ImageIcon,
  finance: LandmarkIcon,
}

/** A generated plugin or skill icon: a white glyph on a tinted squircle. No real product's mark. */
function AppTile({ glyph, color, className }: { glyph: PluginGlyph; color: Tint; className?: string }) {
  const Glyph = pluginGlyphs[glyph]
  return (
    <Squircle
      aria-hidden="true"
      data-color={color}
      className={["ex-ai-tile", className].filter(Boolean).join(" ")}
    >
      <Glyph aria-hidden="true" />
    </Squircle>
  )
}

/** A plugin's glyph on its own, for a sidebar row. */
function PluginGlyphIcon({ glyph }: { glyph: PluginGlyph }) {
  const Glyph = pluginGlyphs[glyph]
  return <Glyph aria-hidden="true" />
}

function ToolGlyph({ glyph }: { glyph: ToolStep["glyph"] }) {
  const Glyph = toolGlyphs[glyph]
  return <Glyph aria-hidden="true" />
}

/** The voice-mode glyph, kept here so the composer's buttons read as one set. */
const VoiceIcon = AudioLinesIcon

export { AppTile, PluginGlyphIcon, ToolGlyph, VoiceIcon }
