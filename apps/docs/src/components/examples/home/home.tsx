"use client"

import { ExampleShell, useStage } from "../shell"
import { MacHome } from "./mac"
import { PhoneApp } from "./phone"
import "./home.css"

function HomeApp() {
  const { platform } = useStage()
  return platform === "ios" ? <PhoneApp /> : <MacHome />
}

function HomeExample() {
  return (
    <ExampleShell title="Home" platforms={["macos", "ios"]}>
      <HomeApp />
    </ExampleShell>
  )
}

export { HomeApp, HomeExample }
