"use client"

import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "../lib/utils.js"
import { Separator } from "./separator.js"

// The orientation classes are applied via the `data-orientation` attribute
// selector in button-group.css, so cva only needs the shape (its variant
// keys) for apps/web's build-time playground extraction.
const buttonGroupVariants = cva("ds-button-group", {
  variants: {
    orientation: { horizontal: "", vertical: "" },
  },
  defaultVariants: {
    orientation: "horizontal",
  },
})

// DiametralGroup addition: the orientation union as a named type.
export type ButtonGroupOrientation = NonNullable<
  VariantProps<typeof buttonGroupVariants>["orientation"]
>

function ButtonGroup({
  className,
  orientation,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof buttonGroupVariants>) {
  return (
    <div
      role="group"
      data-slot="button-group"
      data-orientation={orientation ?? "horizontal"}
      className={cn(buttonGroupVariants({ orientation }), className)}
      {...props}
    />
  )
}

function ButtonGroupText({
  className,
  render,
  ...props
}: useRender.ComponentProps<"div">) {
  return useRender({
    defaultTagName: "div",
    props: mergeProps<"div">(
      {
        className: cn("ds-button-group-text", className),
      },
      props
    ),
    render,
    state: {
      slot: "button-group-text",
    },
  })
}

function ButtonGroupSeparator({
  className,
  orientation = "vertical",
  ...props
}: React.ComponentProps<typeof Separator>) {
  return (
    <Separator
      data-slot="button-group-separator"
      orientation={orientation}
      className={cn(
        // bg-input/data-horizontal:w-auto/data-vertical:h-auto stay literal
        // Tailwind utilities (see separator.css's note on Separator itself)
        // — they dedupe via tailwind-merge against Separator's own literal
        // bg-border/data-horizontal:w-full/data-vertical:w-px defaults.
        "ds-button-group-separator bg-input data-horizontal:w-auto data-vertical:h-auto",
        className
      )}
      {...props}
    />
  )
}

export {
  ButtonGroup,
  ButtonGroupSeparator,
  ButtonGroupText,
  buttonGroupVariants,
}
