"use client"

import { ExampleShell, useStage } from "../shell"
import { MacAssistant } from "./mac"
import { PhoneApp } from "./phone"
import "./assistant.css"

function AssistantApp() {
  const { platform } = useStage()
  return platform === "ios" ? <PhoneApp /> : <MacAssistant />
}

function AssistantExample() {
  return (
    <ExampleShell title="AI Assistant" platforms={["macos", "ios"]}>
      <AssistantApp />
    </ExampleShell>
  )
}

export { AssistantApp, AssistantExample }
