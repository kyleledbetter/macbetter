"use client"

import { Button } from "macbetter/button"
import { CameraView } from "macbetter/camera-view"
import { CornersOutIcon } from "@phosphor-icons/react/dist/ssr/CornersOut"
import { MicrophoneIcon } from "@phosphor-icons/react/dist/ssr/Microphone"
import { SpeakerHighIcon } from "@phosphor-icons/react/dist/ssr/SpeakerHigh"
import { SpeakerSlashIcon } from "@phosphor-icons/react/dist/ssr/SpeakerSlash"
import { useState } from "react"

export default function Example() {
  const [muted, setMuted] = useState(true)

  return (
    <CameraView
      name="Front door"
      room="Entry"
      live
      style={{ width: "min(100%, 480px)" }}
      controls={
        <>
          <Button variant="glass" shape="circle" size="sm" aria-label={muted ? "Unmute" : "Mute"} onClick={() => setMuted(!muted)}>
            {muted ? <SpeakerSlashIcon weight="fill" aria-hidden="true" /> : <SpeakerHighIcon weight="fill" aria-hidden="true" />}
          </Button>
          {/* This doorbell camera has a speaker, so it can offer Talk. */}
          <Button variant="glass" shape="circle" size="sm" aria-label="Talk">
            <MicrophoneIcon weight="fill" aria-hidden="true" />
          </Button>
          <Button variant="glass" shape="circle" size="sm" aria-label="Full Screen">
            <CornersOutIcon weight="bold" aria-hidden="true" />
          </Button>
        </>
      }
    />
  )
}
