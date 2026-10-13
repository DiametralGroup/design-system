"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { XIcon } from "@phosphor-icons/react"

import { cn } from "../lib/utils.js"
import { IconButton } from "./icon-button.js"

// The accent rail reads one variable, --tone-ink, rather than each axis
// setting `after:bg-*` itself: two utilities of the same specificity would
// otherwise resolve by stylesheet order, not by the order they appear in the
// class string, so `variant` and `tone` would fight non-deterministically.
const alertVariants = cva("ds-alert", {
  variants: {
    variant: {
      default: "ds-alert--default",
      destructive: "ds-alert--destructive",
    },
    /* Semantic axis, over the shared --ds-<tone>-ink family. Unlike Banner,
       which tints the whole block, Alert keeps its card surface and spends
       the tone on the rail and the title only — the description stays muted,
       so the two components read as different objects rather than duplicates. */
    tone: {
      neutral: "ds-alert--tone-neutral",
      info: "ds-alert--tone-info",
      success: "ds-alert--tone-success",
      warning: "ds-alert--tone-warning",
      danger: "ds-alert--tone-danger",
      critical: "ds-alert--tone-critical",
    },
  },
  defaultVariants: {
    variant: "default",
  },
})

function Alert({
  className,
  variant,
  tone,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof alertVariants>) {
  return (
    <div
      data-slot="alert"
      role="alert"
      className={cn(alertVariants({ variant, tone }), className)}
      {...props}
    />
  )
}

function AlertTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-title"
      className={cn("ds-alert-title", className)}
      {...props}
    />
  )
}

function AlertDescription({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-description"
      className={cn("ds-alert-description", className)}
      {...props}
    />
  )
}

function AlertAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-action"
      className={cn("ds-alert-action", className)}
      {...props}
    />
  )
}

// The close affordance v2 was missing. Deliberately stateless: Alert does not
// hide itself, because a dismissed alert usually has to stay dismissed, and
// only the caller knows where that fact lives. Pass `onClick`.
function AlertDismiss({
  className,
  label = "Dismiss",
  ...props
}: Omit<React.ComponentProps<typeof IconButton>, "label" | "children"> & {
  label?: string
}) {
  return (
    <IconButton
      data-slot="alert-dismiss"
      label={label}
      variant="ghost"
      size="icon-xs"
      className={cn("ds-alert-dismiss", className)}
      {...props}
    >
      <XIcon />
    </IconButton>
  )
}

export {
  Alert,
  AlertTitle,
  AlertDescription,
  AlertAction,
  AlertDismiss,
  alertVariants,
}
