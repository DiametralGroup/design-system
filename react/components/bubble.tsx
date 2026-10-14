"use client"

import * as React from "react"
import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "../lib/utils.js"

function BubbleGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="bubble-group"
      // gap-2 stays a literal Tailwind utility (see bubble.css) so
      // tailwind-merge can keep deduping it against a consumer's own gap-*
      // override (e.g. the "with reactions" demo's gap-6) — same constraint
      // as dropdown-menu.css's width/min-width note.
      className={cn("ds-bubble-group gap-2", className)}
      {...props}
    />
  )
}

// Variant styling lives in bubble.css, keyed off the `data-variant` attribute
// Bubble already renders below — the cva() call stays only so the docs
// playground's variant extraction (apps/web/plugins/extract-variants.ts,
// which reads the `variants` object's keys) keeps working.
const bubbleVariants = cva("ds-bubble", {
  variants: {
    variant: {
      default: "",
      secondary: "",
      muted: "",
      tinted: "",
      outline: "",
      ghost: "",
      destructive: "",
    },
  },
  defaultVariants: {
    variant: "default",
  },
})

function Bubble({
  variant = "default",
  align = "start",
  className,
  ...props
}: React.ComponentProps<"div"> &
  VariantProps<typeof bubbleVariants> & {
    align?: "start" | "end"
  }) {
  return (
    <div
      data-slot="bubble"
      data-variant={variant}
      data-align={align}
      className={cn(bubbleVariants({ variant }), className)}
      {...props}
    />
  )
}

function BubbleContent({
  className,
  render,
  ...props
}: useRender.ComponentProps<"div">) {
  return useRender({
    defaultTagName: "div",
    props: mergeProps<"div">(
      {
        className: cn("ds-bubble-content", className),
      },
      props
    ),
    render,
    state: {
      slot: "bubble-content",
    },
  })
}

// Variant styling lives in bubble.css, keyed off the `data-side`/`data-align`
// attributes BubbleReactions already renders below — see the note on
// bubbleVariants above for why the cva() call stays.
const bubbleReactionsVariants = cva("ds-bubble-reactions", {
  variants: {
    side: {
      top: "",
      bottom: "",
    },
    align: {
      start: "",
      end: "",
    },
  },
  defaultVariants: {
    side: "bottom",
    align: "end",
  },
})

function BubbleReactions({
  side = "bottom",
  align = "end",
  className,
  ...props
}: React.ComponentProps<"div"> & {
  align?: "start" | "end"
  side?: "top" | "bottom"
}) {
  return (
    <div
      data-slot="bubble-reactions"
      data-align={align}
      data-side={side}
      className={cn(bubbleReactionsVariants({ side, align }), className)}
      {...props}
    />
  )
}

// DiametralGroup addition: the variant union as a named type.
type BubbleVariant = NonNullable<VariantProps<typeof bubbleVariants>["variant"]>

export { BubbleGroup, Bubble, BubbleContent, BubbleReactions }
export type { BubbleVariant }
