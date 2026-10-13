"use client"

import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import * as React from "react"

import { cn } from "../lib/utils.js"

/* DiametralGroup additions in this file: `CardProps` and Card's `clickable`
   prop (legacy `.ds-card--clickable`, plus the tabIndex/role it needs), ref
   forwarding on Card, CardHeader's `ruled` prop (`.ds-card__header--ruled`),
   and the `CardMedia` / `CardBlock` parts, which keep rendering the 0.x
   `.ds-card__media` / `.ds-card__block` classes. */
export interface CardProps extends React.ComponentProps<"div"> {
  size?: "default" | "sm"
  /** Turn the whole card into a focusable, hover-highlighted affordance. */
  clickable?: boolean
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(function Card(
  { className, size = "default", clickable, ...props },
  ref
) {
  return (
    <div
      ref={ref}
      data-slot="card"
      data-size={size}
      className={cn("ds-card", clickable && "ds-card--clickable", className)}
      tabIndex={clickable ? 0 : undefined}
      role={clickable ? "button" : undefined}
      {...props}
    />
  )
})

/** DiametralGroup addition. Full-bleed media at the top of the card. Pass an
 *  image `src` for the common case, or any node to wrap. */
function CardMedia({
  className,
  src,
  alt = "",
  children,
  ...props
}: React.ComponentProps<"div"> & { src?: string; alt?: string }) {
  if (src) {
    return (
      <img
        data-slot="card-media"
        className={cn("ds-card__media", className)}
        src={src}
        alt={alt}
      />
    )
  }
  return (
    <div
      data-slot="card-media"
      className={cn("ds-card__media", className)}
      {...props}
    >
      {children}
    </div>
  )
}

function CardHeader({
  className,
  ruled,
  ...props
}: React.ComponentProps<"div"> & {
  /** DiametralGroup addition: a rule under the header. */
  ruled?: boolean
}) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "ds-card-header",
        ruled && "ds-card__header--ruled",
        className
      )}
      {...props}
    />
  )
}

// A real heading, so a page of cards has an outline. h2 because cards usually
// sit straight under the page's h1; nest one level deeper with render={<h3 />}.
function CardTitle({
  className,
  render,
  ...props
}: useRender.ComponentProps<"h2">) {
  return useRender({
    defaultTagName: "h2",
    props: mergeProps<"h2">(
      { className: cn("ds-card-title text-lg", className) },
      props
    ),
    render,
    state: { slot: "card-title" },
  })
}

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-description"
      className={cn("ds-card-description", className)}
      {...props}
    />
  )
}

function CardAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-action"
      className={cn("ds-card-action", className)}
      {...props}
    />
  )
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={cn("ds-card-content", className)}
      {...props}
    />
  )
}

/** DiametralGroup addition. A divided region, separated from the one above it
 *  by a soft rule. */
function CardBlock({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-block"
      className={cn("ds-card__block", className)}
      {...props}
    />
  )
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn("ds-card-footer", className)}
      {...props}
    />
  )
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
  CardMedia,
  CardBlock,
}
