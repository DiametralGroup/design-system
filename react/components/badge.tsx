"use client"

import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "../lib/utils.js"

const badgeVariants = cva("ds-badge", {
  variants: {
    variant: {
      default: "ds-badge--default",
      secondary: "ds-badge--secondary",
      destructive: "ds-badge--destructive",
      outline: "ds-badge--outline",
      ghost: "ds-badge--ghost",
      link: "ds-badge--link",
      // DiametralGroup additions: 0.x's `solid` and `accent` modifiers.
      solid: "ds-badge--solid",
      accent: "ds-badge--accent",
    },
  },
  defaultVariants: {
    variant: "default",
  },
})

// DiametralGroup addition: the variant union as a named type.
export type BadgeVariant = NonNullable<
  VariantProps<typeof badgeVariants>["variant"]
>

function Badge({
  className,
  variant = "default",
  render,
  ...props
}: useRender.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return useRender({
    defaultTagName: "span",
    props: mergeProps<"span">(
      {
        className: cn(badgeVariants({ variant }), className),
      },
      props
    ),
    render,
    state: {
      slot: "badge",
      variant,
    },
  })
}

export { Badge, badgeVariants }
