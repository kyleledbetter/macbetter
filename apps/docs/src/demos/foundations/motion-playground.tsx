"use client"

import { Button } from "macbetter/button"
import { PlayIcon, RotateCcwIcon } from "lucide-react"
import { useState } from "react"

const curves = [
  { name: "snappy", easing: "var(--mb-spring-snappy)", duration: "var(--mb-spring-snappy-duration)", use: "Controls: switches, segments, presses" },
  { name: "smooth", easing: "var(--mb-spring-smooth)", duration: "var(--mb-spring-smooth-duration)", use: "Larger moves: panels, reflow" },
  { name: "bouncy", easing: "var(--mb-spring-bouncy)", duration: "var(--mb-spring-bouncy-duration)", use: "After a flick that carried momentum" },
  { name: "sheet", easing: "var(--mb-spring-sheet)", duration: "var(--mb-spring-sheet-duration)", use: "Sheets settling after a drag" },
  { name: "ease-out", easing: "var(--mb-ease-out)", duration: "var(--mb-duration-base)", use: "Fades and color, not motion" },
]

export default function MotionPlayground() {
  const [end, setEnd] = useState(false)
  const [scale, setScale] = useState(false)

  return (
    <div className="flex w-full flex-col gap-5">
      <div className="flex flex-wrap items-center gap-2">
        <Button variant="filled" onClick={() => setEnd((value) => !value)}>
          {end ? <RotateCcwIcon aria-hidden="true" /> : <PlayIcon aria-hidden="true" />}
          {end ? "Send back" : "Play"}
        </Button>
        <Button onClick={() => setScale((value) => !value)}>{scale ? "Shrink" : "Grow"}</Button>
        <span className="text-[12px] text-label-tertiary">Press again mid-flight: the shape turns around from where it is.</span>
      </div>
      <div className="flex flex-col gap-3">
        {curves.map((curve) => (
          <div key={curve.name} className="grid items-center gap-x-4 gap-y-1 sm:grid-cols-[150px_1fr]">
            <div className="flex flex-col">
              <code className="w-fit font-mono text-[12px] text-label">{curve.name}</code>
              <span className="text-[11.5px] leading-snug text-label-tertiary">{curve.use}</span>
            </div>
            <div className="relative h-11 rounded-full bg-fill-quaternary [container-type:inline-size]">
              <div
                className="absolute inset-y-1.5 start-1.5 aspect-square rounded-full bg-accent shadow-[0_2px_8px_var(--mb-shadow-color)] motion-reduce:!transition-none rtl:[--direction:-1]"
                style={{
                  translate: end ? "calc((100cqw - 44px) * var(--direction, 1))" : "0",
                  scale: scale ? "1.25" : "1",
                  transitionProperty: "translate, scale",
                  transitionDuration: curve.duration,
                  transitionTimingFunction: curve.easing,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
