"use client"

import * as React from "react"

import { Button } from "./button.js"

/** The four `Button` sizes that produce a square. */
type IconSize = "icon" | "icon-xs" | "icon-sm" | "icon-lg"

// `Button` with an accessible name it cannot ship without, ported from v1's
// IconButton (react/components/ButtonExtras.js). That requirement is the whole
// component: an icon-only Button in v2 today can render with no name at all
// and nothing catches it, so `label` is required in the type and lands on both
// `aria-label` and `title` — the screen-reader name and the hover tooltip.
//
// v1's `variant` ("primary" | "danger") and `size` ("sm" | "lg") are gone in
// favour of Button's own axes: v1 primary is `variant="default"`, v1 danger is
// `variant="destructive"`, and `size` narrows to the square ones.
// DiametralGroup addition: the 0.x bare sizes ("xs" | "sm" | "lg") are still
// accepted and resolve to their `icon-` square; the props are exported by name.
type IconButtonSize = IconSize | "xs" | "sm" | "lg"

type IconButtonProps = Omit<
  React.ComponentProps<typeof Button>,
  "aria-label" | "size"
> & {
  /** The accessible name. Required — that is the point of this component. */
  label: string
  size?: IconButtonSize
}

function IconButton({ label, size = "icon", ...props }: IconButtonProps) {
  return (
    <Button
      data-slot="icon-button"
      aria-label={label}
      title={label}
      size={(size.startsWith("icon") ? size : `icon-${size}`) as IconSize}
      {...props}
    />
  )
}

export { IconButton }
export type { IconButtonProps, IconButtonSize }
