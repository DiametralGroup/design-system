"use client"

import * as React from "react"

import { cn } from "../lib/utils.js"

function PageHeader({ className, ...props }: React.ComponentProps<"header">) {
  return (
    <header
      data-slot="page-header"
      className={cn("ds-page-header", className)}
      {...props}
    />
  )
}

function PageHeaderHeading({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="page-header-heading"
      className={cn("ds-page-header-heading", className)}
      {...props}
    />
  )
}

function PageHeaderIcon({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="page-header-icon"
      className={cn("ds-page-header-icon", className)}
      {...props}
    />
  )
}

function PageHeaderTitle({ className, ...props }: React.ComponentProps<"h1">) {
  return (
    <h1
      data-slot="page-header-title"
      className={cn("ds-page-header-title", className)}
      {...props}
    />
  )
}

function PageHeaderDescription({
  className,
  ...props
}: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="page-header-description"
      className={cn("ds-page-header-description", className)}
      {...props}
    />
  )
}

function PageHeaderActions({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="page-header-actions"
      className={cn("ds-page-header-actions", className)}
      {...props}
    />
  )
}

// Only a slot marker: its presence flips `PageHeader`'s `has-data-[slot=…]`
// selector so the bottom rule sits flush under the tab strip instead of the
// title row.
function PageHeaderTabs({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div data-slot="page-header-tabs" className={cn(className)} {...props} />
  )
}

export {
  PageHeader,
  PageHeaderHeading,
  PageHeaderIcon,
  PageHeaderTitle,
  PageHeaderDescription,
  PageHeaderActions,
  PageHeaderTabs,
}
