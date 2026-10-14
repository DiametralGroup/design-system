"use client"

import * as React from "react"

import { cn } from "../lib/utils.js"
import { CheckIcon } from "@phosphor-icons/react"

function Stepper({
  className,
  orientation = "horizontal",
  ...props
}: React.ComponentProps<"div"> & {
  orientation?: "horizontal" | "vertical"
}) {
  return (
    <div
      data-slot="stepper"
      data-orientation={orientation}
      // A steps rail holds no focusable content of its own, so once the
      // horizontal variant becomes a scroll container it is unreachable by
      // keyboard — a pointer is the only way to pan it. Making the container
      // itself a tab stop is the standard remedy (axe
      // `scrollable-region-focusable`). Vertical never scrolls, so it stays out
      // of the tab order rather than adding a stop that does nothing.
      tabIndex={orientation === "horizontal" ? 0 : undefined}
      className={cn("ds-stepper", className)}
      {...props}
    />
  )
}

function StepperItem({
  className,
  state = "inactive",
  ...props
}: React.ComponentProps<"div"> & {
  state?: "inactive" | "active" | "completed"
}) {
  return (
    <div
      data-slot="stepper-item"
      data-state={state}
      className={cn("ds-stepper-item", className)}
      {...props}
    />
  )
}

function StepperIndicator({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="stepper-indicator"
      className={cn("ds-stepper-indicator", className)}
      {...props}
    >
      <span className="ds-stepper-indicator-number">{children}</span>
      <CheckIcon className="ds-stepper-indicator-check" />
    </div>
  )
}

function StepperContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="stepper-content"
      className={cn("ds-stepper-content", className)}
      {...props}
    />
  )
}

function StepperTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="stepper-title"
      className={cn("ds-stepper-title", className)}
      {...props}
    />
  )
}

function StepperDescription({
  className,
  ...props
}: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="stepper-description"
      className={cn("ds-stepper-description", className)}
      {...props}
    />
  )
}

function StepperSeparator({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="stepper-separator"
      className={cn("ds-stepper-separator", className)}
      {...props}
    />
  )
}

export {
  Stepper,
  StepperItem,
  StepperIndicator,
  StepperContent,
  StepperTitle,
  StepperDescription,
  StepperSeparator,
}
