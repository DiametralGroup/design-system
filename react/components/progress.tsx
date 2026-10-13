"use client"

import { Progress as ProgressPrimitive } from "@base-ui/react/progress"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "../lib/utils.js"

// Mirrors meter.tsx: --tone on the root, read by the indicator the composed
// <Progress> renders for you. Unset by default, so the bar stays --primary.
const progressVariants = cva("ds-progress", {
  variants: {
    tone: {
      neutral: "ds-progress--tone-neutral",
      success: "ds-progress--tone-success",
      warning: "ds-progress--tone-warning",
      danger: "ds-progress--tone-danger",
      critical: "ds-progress--tone-critical",
      info: "ds-progress--tone-info",
    },
  },
})

function Progress({
  className,
  children,
  value,
  tone,
  ...props
}: ProgressPrimitive.Root.Props & VariantProps<typeof progressVariants>) {
  return (
    <ProgressPrimitive.Root
      value={value}
      data-slot="progress"
      className={cn(progressVariants({ tone }), className)}
      {...props}
    >
      {children}
      <ProgressTrack>
        <ProgressIndicator />
      </ProgressTrack>
    </ProgressPrimitive.Root>
  )
}

function ProgressTrack({ className, ...props }: ProgressPrimitive.Track.Props) {
  return (
    <ProgressPrimitive.Track
      className={cn("ds-progress-track", className)}
      data-slot="progress-track"
      {...props}
    />
  )
}

function ProgressIndicator({
  className,
  ...props
}: ProgressPrimitive.Indicator.Props) {
  return (
    <ProgressPrimitive.Indicator
      data-slot="progress-indicator"
      className={cn("ds-progress-indicator", className)}
      {...props}
    />
  )
}

function ProgressLabel({ className, ...props }: ProgressPrimitive.Label.Props) {
  return (
    <ProgressPrimitive.Label
      className={cn("ds-progress-label", className)}
      data-slot="progress-label"
      {...props}
    />
  )
}

function ProgressValue({ className, ...props }: ProgressPrimitive.Value.Props) {
  return (
    <ProgressPrimitive.Value
      className={cn("ds-progress-value", className)}
      data-slot="progress-value"
      {...props}
    />
  )
}

export {
  Progress,
  ProgressTrack,
  ProgressIndicator,
  ProgressLabel,
  ProgressValue,
  progressVariants,
}

// DiametralGroup addition: the tone union as a named export.
export type ProgressTone = NonNullable<
  VariantProps<typeof progressVariants>["tone"]
>
