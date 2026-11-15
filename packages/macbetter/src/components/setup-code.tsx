import type * as React from "react"
import { cx, join } from "../lib/cx"
import { CodeField, CodeFieldGroup, type CodeFieldProps, CodeFieldSeparator, CodeFieldSlot } from "./code-field"

type SetupCodeFormat = "homekit" | "matter"

// The grouping printed on accessories: 3-2-3 for an 8-digit setup code, 4-3-4 for an 11-digit Matter pairing code.
const groupings: Record<SetupCodeFormat, number[]> = { homekit: [3, 2, 3], matter: [4, 3, 4] }

function groupDigits(digits: string, format: SetupCodeFormat): string[] {
  const groups: string[] = []
  let start = 0
  for (const size of groupings[format]) {
    if (start >= digits.length) break
    groups.push(digits.slice(start, start + size))
    start += size
  }
  if (start < digits.length) groups.push(digits.slice(start))
  return groups
}

type SetupCodeProps = Omit<React.ComponentProps<"div">, "children"> & {
  /** The digits, with or without dashes or spaces. */
  code: string
  /** `homekit` is the 8-digit setup code; `matter` the 11-digit pairing code. */
  format?: SetupCodeFormat
  /** Names the code for assistive tech. */
  label?: string
}

/** An accessory's setup code, grouped the way it's printed on the accessory, in tabular digits. */
function SetupCode({ code, format = "homekit", label = "Setup code", className, ...props }: SetupCodeProps) {
  const digits = code.replace(/\D/g, "")
  const groups = groupDigits(digits, format)
  return (
    <div
      role="img"
      aria-label={`${label}: ${digits.split("").join(" ")}`}
      data-format={format}
      className={join("mb-setup-code", className)}
      {...props}
    >
      {groups.map((group, index) => (
        <span key={`${index}-${group}`} className="mb-setup-code-group" aria-hidden="true">
          {group}
        </span>
      ))}
    </div>
  )
}

type SetupCodeScannerProps = React.ComponentProps<"div"> & {
  /** The instruction under the frame. */
  instruction?: React.ReactNode
}

/**
 * Where the camera's picture goes while someone scans an accessory's code. It draws the frame and
 * the instruction; put a camera preview inside, or leave it empty as a placeholder.
 */
function SetupCodeScanner({
  instruction = "Position the code in the frame.",
  className,
  children,
  ...props
}: SetupCodeScannerProps) {
  return (
    <div className={join("mb-setup-code-scanner", className)} {...props}>
      <div className="mb-setup-code-scanner-view">
        {children}
        <svg className="mb-setup-code-scanner-frame" viewBox="0 0 100 100" aria-hidden="true">
          <path d="M4 24V12a8 8 0 0 1 8-8h12M76 4h12a8 8 0 0 1 8 8v12M96 76v12a8 8 0 0 1-8 8H76M24 96H12a8 8 0 0 1-8-8V76" />
        </svg>
      </div>
      {instruction ? <p className="mb-setup-code-scanner-instruction">{instruction}</p> : null}
    </div>
  )
}

type SetupCodeFieldProps = Omit<CodeFieldProps, "length" | "groupSize" | "children"> & {
  format?: SetupCodeFormat
}

/** Type the setup code by hand: 8 cells in runs of 3, 2 and 3, or 11 in runs of 4, 3 and 4 for Matter. */
function SetupCodeField({ format = "homekit", className, ...props }: SetupCodeFieldProps) {
  const sizes = groupings[format]
  const length = sizes.reduce((sum, size) => sum + size, 0)
  let start = 0
  const runs = sizes.map((size) => {
    const run = Array.from({ length: size }, (_, i) => start + i)
    start += size
    return run
  })
  return (
    <CodeField
      length={length}
      pattern="digits"
      inputMode="numeric"
      data-format={format}
      className={cx("mb-setup-code-field", className)}
      {...props}
    >
      {runs.map((run, i) => (
        <SetupCodeFieldRun key={run[0]} run={run} separated={i > 0} />
      ))}
    </CodeField>
  )
}

function SetupCodeFieldRun({ run, separated }: { run: number[]; separated: boolean }) {
  return (
    <>
      {separated ? <CodeFieldSeparator /> : null}
      <CodeFieldGroup>
        {run.map((index) => (
          <CodeFieldSlot key={index} index={index} />
        ))}
      </CodeFieldGroup>
    </>
  )
}

export { SetupCode, SetupCodeField, SetupCodeScanner }
export type { SetupCodeFieldProps, SetupCodeFormat, SetupCodeProps, SetupCodeScannerProps }
