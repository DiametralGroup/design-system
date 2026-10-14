"use client"

import { cn } from "../lib/utils.js"
import { SpinnerIcon } from "@phosphor-icons/react"

// `label` is the accessible name, not decoration: a spinner is the only thing
// on screen saying anything is happening, so it says what. v1 carried the same
// prop; v2 previously hardcoded "Loading", which is right for a page and wrong
// for the third spinner in a settings list.
function Spinner({
  className,
  label = "Loading",
  ...props
}: React.ComponentProps<"svg"> & { label?: string }) {
  return (
    <SpinnerIcon
      data-slot="spinner"
      role="status"
      aria-label={label}
      className={cn("ds-spinner size-4", className)}
      {...props}
    />
  )
}

export { Spinner }
