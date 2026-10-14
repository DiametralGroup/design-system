"use client"

import { Meter as MeterPrimitive } from "@base-ui/react/meter"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "../lib/utils.js"

// Tone rides on the root as --tone so the internally-rendered indicator can
// read it — the caller never gets a handle on MeterIndicator when using the
// composed <Meter>. Left unset by default so the bar stays --primary; the
// six keys are the shared family from globals.css, the same one
// status/tag/banner read.
const meterVariants = cva("ds-meter", {
  variants: {
    tone: {
      neutral: "ds-meter--tone-neutral",
      success: "ds-meter--tone-success",
      warning: "ds-meter--tone-warning",
      danger: "ds-meter--tone-danger",
      critical: "ds-meter--tone-critical",
      info: "ds-meter--tone-info",
    },
  },
})

// DiametralGroup addition: the tone union as a named export.
export type MeterTone = NonNullable<VariantProps<typeof meterVariants>["tone"]>

function Meter({
  className,
  children,
  tone,
  ...props
}: MeterPrimitive.Root.Props & VariantProps<typeof meterVariants>) {
  return (
    <MeterPrimitive.Root
      data-slot="meter"
      className={cn(meterVariants({ tone }), className)}
      {...props}
    >
      {children}
      <MeterTrack>
        <MeterIndicator />
      </MeterTrack>
    </MeterPrimitive.Root>
  )
}

function MeterTrack({ className, ...props }: MeterPrimitive.Track.Props) {
  return (
    <MeterPrimitive.Track
      data-slot="meter-track"
      className={cn("ds-meter-track", className)}
      {...props}
    />
  )
}

function MeterIndicator({
  className,
  ...props
}: MeterPrimitive.Indicator.Props) {
  return (
    <MeterPrimitive.Indicator
      data-slot="meter-indicator"
      className={cn("ds-meter-indicator", className)}
      {...props}
    />
  )
}

function MeterLabel({ className, ...props }: MeterPrimitive.Label.Props) {
  return (
    <MeterPrimitive.Label
      data-slot="meter-label"
      className={cn("ds-meter-label", className)}
      {...props}
    />
  )
}

function MeterValue({ className, ...props }: MeterPrimitive.Value.Props) {
  return (
    <MeterPrimitive.Value
      data-slot="meter-value"
      className={cn("ds-meter-value", className)}
      {...props}
    />
  )
}

export {
  Meter,
  MeterTrack,
  MeterIndicator,
  MeterLabel,
  MeterValue,
  meterVariants,
}
