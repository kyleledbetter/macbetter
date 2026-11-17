import type { Metadata } from "next"
import { AssistantExample } from "@/components/examples/assistant/assistant"
import { ExampleSource } from "@/components/examples/example-source"
import { socialMetadata } from "@/lib/og/routes"

const description =
  "An assistant app with chat history, a new chat screen, a conversation that streams a scripted reply with reasoning, tool calls and a permission request, an inspector, and plugin and skill directories, built with macbetter."

export const metadata: Metadata = {
  title: "AI Assistant example",
  description,
  alternates: { canonical: "/examples/assistant" },
  ...socialMetadata({ path: "examples/assistant", title: "AI Assistant example", description }),
}

export default function Page() {
  return (
    <ExampleSource slug="assistant">
      <AssistantExample />
    </ExampleSource>
  )
}
