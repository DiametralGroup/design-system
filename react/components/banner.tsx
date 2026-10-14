"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "../lib/utils.js"

// Tone axis over the shared six-tone family in globals.css — the same
// --ds-<tone>-bg / --ds-<tone>-ink pair button.tsx's `tone` variant reads,
// so a new tone never needs a bespoke colour here.
const bannerVariants = cva("ds-banner", {
  variants: {
    tone: {
      neutral: "ds-banner--neutral",
      info: "ds-banner--info",
      success: "ds-banner--success",
      warning: "ds-banner--warning",
      danger: "ds-banner--danger",
      critical: "ds-banner--critical",
    },
  },
  defaultVariants: {
    tone: "neutral",
  },
})

function Banner({
  className,
  tone = "neutral",
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof bannerVariants>) {
  return (
    <div
      data-slot="banner"
      role="status"
      className={cn(bannerVariants({ tone }), className)}
      {...props}
    />
  )
}

function BannerContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="banner-content"
      className={cn("ds-banner-content", className)}
      {...props}
    />
  )
}

function BannerTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="banner-title"
      className={cn("ds-banner-title", className)}
      {...props}
    />
  )
}

function BannerDescription({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      // No opacity here on purpose: the tone inks clear AA as bare text, but
      // fading them toward the tint drags contrast back under 4.5:1 — warning
      // on dark measured 4.35:1 at opacity-90. BannerTitle's font-medium
      // already carries the hierarchy, so weight does the work instead.
      data-slot="banner-description"
      className={cn(className)}
      {...props}
    />
  )
}

function BannerAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="banner-action"
      className={cn("ds-banner-action", className)}
      {...props}
    />
  )
}

// DiametralGroup addition: the tone union as a named type.
type BannerTone = NonNullable<VariantProps<typeof bannerVariants>["tone"]>

export {
  Banner,
  BannerContent,
  BannerTitle,
  BannerDescription,
  BannerAction,
  bannerVariants,
}
export type { BannerTone }
