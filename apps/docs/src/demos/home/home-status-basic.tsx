"use client"

import { HomeStatus, HomeStatusItem } from "macbetter/home-status"
import { DropIcon } from "@phosphor-icons/react/dist/ssr/Drop"
import { LightbulbIcon } from "@phosphor-icons/react/dist/ssr/Lightbulb"
import { LightningIcon } from "@phosphor-icons/react/dist/ssr/Lightning"
import { LockIcon } from "@phosphor-icons/react/dist/ssr/Lock"
import { SpeakerHifiIcon } from "@phosphor-icons/react/dist/ssr/SpeakerHifi"
import { ThermometerIcon } from "@phosphor-icons/react/dist/ssr/Thermometer"
import { useState } from "react"

export default function Example() {
  const [category, setCategory] = useState<string[]>([])

  return (
    <div style={{ display: "grid", gap: 12, width: "min(100%, 520px)" }}>
      <HomeStatus aria-label="Categories" value={category} onValueChange={setCategory}>
        <HomeStatusItem value="climate" tint="teal" icon={<ThermometerIcon weight="fill" />} label="Climate" summary="68–72°" />
        <HomeStatusItem value="lights" tint="yellow" icon={<LightbulbIcon weight="fill" />} label="Lights" summary="3 on" />
        <HomeStatusItem value="security" tint="blue" icon={<LockIcon weight="fill" />} label="Security" summary="Locked" />
        <HomeStatusItem value="speakers" tint="indigo" icon={<SpeakerHifiIcon weight="fill" />} label="Speakers & TVs" summary="1 playing" />
        <HomeStatusItem value="water" alert icon={<DropIcon weight="fill" />} label="Water" summary="Leak Detected" />
        <HomeStatusItem value="energy" tint="green" icon={<LightningIcon weight="fill" />} label="Energy" summary="Cleaner now" />
      </HomeStatus>
      <p style={{ margin: 0, fontSize: 13, opacity: 0.7 }} aria-live="polite">
        {category.length ? `Showing ${category[0]} accessories, by room.` : "Showing every room."}
      </p>
    </div>
  )
}
