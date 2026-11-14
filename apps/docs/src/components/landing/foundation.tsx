import { Button } from "macbetter/button"
import { BotIcon, KeyboardIcon, LanguagesIcon, ScanEyeIcon, ServerIcon, TextCursorInputIcon } from "lucide-react"
import Link from "next/link"
import { CodeBlock } from "@/components/code-block"
import { CopyButton } from "@/components/copy-button"
import { SectionHeading } from "./section-heading"

const install = "pnpm add macbetter @ui-sdk/react @ui-sdk/core"

const usage = `import { Button } from "macbetter/button"
import { Switch } from "macbetter/switch"

export function JoinNetwork() {
  return (
    <form data-theme="nebula" data-platform="ios">
      <label>
        Wi-Fi
        <Switch defaultChecked />
      </label>
      <Button variant="filled" type="submit">
        Join network
      </Button>
    </form>
  )
}`

const features = [
  {
    icon: KeyboardIcon,
    title: "Keyboard",
    text: "Arrow keys, typeahead, Escape and shortcuts work the way each control works on a Mac.",
  },
  {
    icon: TextCursorInputIcon,
    title: "Focus",
    text: "Dialogs and menus move focus in and give it back. Keyboard focus shows the accent ring.",
  },
  {
    icon: ScanEyeIcon,
    title: "ARIA",
    text: "Roles, names and states come from ui-sdk, so screen readers hear a switch as a switch.",
  },
  {
    icon: LanguagesIcon,
    title: "Right to left",
    text: "Layouts use logical properties and mirror their glyphs. Set dir=\"rtl\" and it flips.",
  },
  {
    icon: ServerIcon,
    title: "Server rendering",
    text: "Components render on the server, and the platform is set before the first paint.",
  },
  {
    icon: BotIcon,
    title: "Agents",
    text: "ui-sdk’s agent bridge lists every control by name and state, and acts through the same API people use.",
  },
]

function Foundation() {
  return (
    <section className="lp-section" aria-labelledby="lp-foundation">
      <SectionHeading
        id="lp-foundation"
        title="Built on ui-sdk."
        muted="Ready for people and agents."
        actions={
          <Button variant="tinted" render={<Link href="/docs/agents" />}>
            How agents use Macbetter
          </Button>
        }
      >
        Macbetter adds the Apple look and feel. Behavior comes from ui-sdk, shadcn’s headless component library, so
        the hard parts of every control are already built and tested.
      </SectionHeading>
      <div className="lp-foundation lp-reveal">
        <ul className="lp-features">
          {features.map((feature) => (
            <li key={feature.title}>
              <feature.icon aria-hidden="true" />
              <div>
                <h3>{feature.title}</h3>
                <p>{feature.text}</p>
              </div>
            </li>
          ))}
        </ul>
        <div className="lp-code">
          <div className="lp-install" data-platform="macos">
            <span aria-hidden="true" className="lp-install-prompt">
              $
            </span>
            <code>{install}</code>
            <CopyButton text={install} />
          </div>
          <CodeBlock code={usage} title="join-network.tsx" />
        </div>
      </div>
    </section>
  )
}

export { Foundation }
