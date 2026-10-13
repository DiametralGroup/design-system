"use client"

import * as React from "react"

import { cn } from "../lib/utils.js"

// A two-column key/value grid (auto label column, 1fr value column). `dt`/`dd`
// pairs flow as consecutive grid children — no explicit row wrapper needed —
// matching v1's DescriptionList (css/components/description-list.css).
function DescriptionList({ className, ...props }: React.ComponentProps<"dl">) {
  return (
    <dl
      data-slot="description-list"
      className={cn("ds-description-list", className)}
      {...props}
    />
  )
}

function DescriptionTerm({ className, ...props }: React.ComponentProps<"dt">) {
  return (
    <dt
      data-slot="description-term"
      className={cn("ds-description-term", className)}
      {...props}
    />
  )
}

function DescriptionDetail({
  className,
  ...props
}: React.ComponentProps<"dd">) {
  return (
    <dd
      data-slot="description-detail"
      className={cn("ds-description-detail", className)}
      {...props}
    />
  )
}

export { DescriptionList, DescriptionTerm, DescriptionDetail }
