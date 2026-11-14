import {
  OTPInput,
  OTPInputGroup,
  OTPInputSeparator,
  OTPInputSlot,
} from "@ui-sdk/react/otp-input"
import type * as React from "react"
import { cx } from "../lib/cx"

type CodeFieldProps = Omit<React.ComponentProps<typeof OTPInput>, "maxLength" | "size"> & {
  /** How many characters the code has, one cell each. */
  length?: number
  /** Splits the cells into runs of this many with a dash between, like 3 for "123–456". */
  groupSize?: number
  size?: "md" | "lg"
}

/** A one-time code: a row of rounded cells, filled by typing, pasting or autofill. */
function CodeField({ length = 6, groupSize, size = "md", className, children, ...props }: CodeFieldProps) {
  const runs = chunk(length, groupSize && groupSize > 0 ? groupSize : length)
  return (
    <OTPInput maxLength={length} data-size={size} className={cx("mb-code-field", className)} {...props}>
      {children ??
        runs.map((run, i) => (
          <CodeFieldRun key={run[0]} run={run} separated={i > 0} />
        ))}
    </OTPInput>
  )
}

function CodeFieldRun({ run, separated }: { run: number[]; separated: boolean }) {
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

function chunk(length: number, size: number): number[][] {
  const runs: number[][] = []
  for (let start = 0; start < length; start += size) {
    runs.push(Array.from({ length: Math.min(size, length - start) }, (_, i) => start + i))
  }
  return runs
}

function CodeFieldGroup({ className, ...props }: React.ComponentProps<typeof OTPInputGroup>) {
  return <OTPInputGroup className={cx("mb-code-field-group", className)} {...props} />
}

function CodeFieldSlot({ className, ...props }: React.ComponentProps<typeof OTPInputSlot>) {
  return <OTPInputSlot className={cx("mb-code-field-slot", className)} {...props} />
}

function CodeFieldSeparator({ className, children, ...props }: React.ComponentProps<typeof OTPInputSeparator>) {
  return (
    <OTPInputSeparator className={cx("mb-code-field-separator", className)} {...props}>
      {children ?? <span className="mb-code-field-dash" />}
    </OTPInputSeparator>
  )
}

export { CodeField, CodeFieldGroup, CodeFieldSeparator, CodeFieldSlot }
export type { CodeFieldProps }
