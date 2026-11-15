type ClassValue<S> = string | undefined | ((state: S) => string | undefined)

/**
 * Joins macbetter's class with the caller's, which ui-sdk lets be a function
 * of the part's state.
 */
function cx<S>(base: string, className?: ClassValue<S>): string | ((state: S) => string) {
  if (typeof className === "function") {
    return (state: S) => join(base, className(state))
  }
  return join(base, className)
}

function join(...parts: Array<string | undefined | false | null>): string {
  return parts.filter(Boolean).join(" ")
}

export { cx, join }
export type { ClassValue }
