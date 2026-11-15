"use client"

import { Button } from "macbetter/button"
import { Field, FieldDescription, FieldLabel } from "macbetter/field"
import { Radio, RadioGroup } from "macbetter/radio"
import { SetupCode, SetupCodeField, SetupCodeScanner } from "macbetter/setup-code"
import { TextField } from "macbetter/text-field"
import { Plug } from "@phosphor-icons/react/dist/ssr/Plug"
import * as React from "react"
import type { RoomId } from "./data"
import { addAccessory, rooms } from "./store"

type Step = "scan" | "code" | "found" | "name" | "room" | "done"

/**
 * The HomeKit naming rules from the HIG: letters, numbers, spaces and
 * apostrophes; starts and ends with a letter or number; no room in the name.
 */
function nameProblem(name: string) {
  const trimmed = name.trim()
  if (!trimmed) return "Enter a name."
  if (/[^\p{L}\p{N} ']/u.test(trimmed)) return "Use only letters, numbers, spaces and apostrophes."
  if (!/^[\p{L}\p{N}].*[\p{L}\p{N}]$|^[\p{L}\p{N}]$/u.test(trimmed)) return "Start and end the name with a letter or number."
  const room = rooms.find((r) => trimmed.toLowerCase().includes(r.name.toLowerCase()))
  if (room) return `Leave “${room.name}” out of the name. Choose the room in the next step instead.`
  return null
}

/** Adding an accessory: scan or enter its code, name it, choose its room. */
function SetupFlow({ onClose }: { onClose: () => void }) {
  const [step, setStep] = React.useState<Step>("scan")
  const [code, setCode] = React.useState("")
  const [name, setName] = React.useState("Kettle")
  const [room, setRoom] = React.useState<RoomId>("kitchen")
  const [touched, setTouched] = React.useState(false)
  const problem = nameProblem(name)
  const roomLabel = rooms.find((r) => r.id === room)?.name

  return (
    <div className="ex-home-setup" data-step={step}>
      {step === "scan" ? (
        <>
          <h3 className="ex-home-setup-title">Add Accessory</h3>
          <p className="ex-home-setup-copy">Scan the setup code on the accessory or its packaging.</p>
          <SetupCodeScanner className="ex-home-setup-scanner" />
          <Button variant="filled" block onClick={() => setStep("found")}>
            Simulate a Scan
          </Button>
          <Button variant="plain" block onClick={() => setStep("code")}>
            Enter Code Instead
          </Button>
        </>
      ) : null}

      {step === "code" ? (
        <>
          <h3 className="ex-home-setup-title">Enter Setup Code</h3>
          <p className="ex-home-setup-copy">Enter the 8-digit code printed on the accessory, its box or its manual.</p>
          <SetupCodeField
            value={code}
            onValueChange={(next: string) => setCode(next)}
            onValueCommit={() => setStep("found")}
            aria-label="Setup code"
          />
          <Button variant="filled" block disabled={code.length < 8} onClick={() => setStep("found")}>
            Continue
          </Button>
          <Button variant="plain" block onClick={() => setStep("scan")}>
            Scan Code Instead
          </Button>
        </>
      ) : null}

      {step === "found" ? (
        <>
          <span className="ex-home-setup-device" aria-hidden="true">
            <Plug weight="fill" />
          </span>
          <h3 className="ex-home-setup-title">Smart Plug</h3>
          <p className="ex-home-setup-copy">Ready to add to Maple Street.</p>
          <SetupCode code={code.length === 8 ? code : "48203917"} />
          <Button variant="filled" block onClick={() => setStep("name")}>
            Add to Home
          </Button>
        </>
      ) : null}

      {step === "name" ? (
        <>
          <h3 className="ex-home-setup-title">Name This Accessory</h3>
          <p className="ex-home-setup-copy">Siri uses this name. Name it for what it controls.</p>
          <Field invalid={touched && Boolean(problem)}>
            <FieldLabel>Name</FieldLabel>
            <TextField
              value={name}
              onChange={(event) => {
                setName(event.currentTarget.value)
                setTouched(true)
              }}
            />
            <FieldDescription className="ex-home-setup-hint" data-problem={touched && problem ? "" : undefined}>
              {touched && problem ? problem : "For example, Kettle or Toaster."}
            </FieldDescription>
          </Field>
          <Button
            variant="filled"
            block
            disabled={Boolean(problem)}
            onClick={() => setStep("room")}
          >
            Continue
          </Button>
        </>
      ) : null}

      {step === "room" ? (
        <>
          <h3 className="ex-home-setup-title">Choose a Room</h3>
          <p className="ex-home-setup-copy">Where is {name.trim()}?</p>
          <RadioGroup variant="list" aria-label="Room" value={room} onValueChange={(value) => setRoom(value as RoomId)}>
            {rooms.map((r) => (
              <Radio key={r.id} value={r.id}>
                {r.name}
              </Radio>
            ))}
          </RadioGroup>
          <Button
            variant="filled"
            block
            onClick={() => {
              addAccessory({
                id: `plug-${Date.now()}`,
                kind: "outlet",
                name: name.trim(),
                room,
                icon: "plug",
                on: false,
                favorite: true,
              })
              setStep("done")
            }}
          >
            Continue
          </Button>
        </>
      ) : null}

      {step === "done" ? (
        <>
          <span className="ex-home-setup-device" aria-hidden="true" data-done="">
            <Plug weight="fill" />
          </span>
          <h3 className="ex-home-setup-title">{name.trim()} Is Ready</h3>
          <p className="ex-home-setup-copy">
            It’s in {roomLabel} and in your favorites. Try saying “Hey Siri, turn on the {name.trim().toLowerCase()}.”
          </p>
          <Button variant="filled" block onClick={onClose}>
            Done
          </Button>
        </>
      ) : null}
    </div>
  )
}

export { nameProblem, SetupFlow }
