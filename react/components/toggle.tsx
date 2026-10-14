"use client"

import { Toggle as TogglePrimitive } from "@base-ui/react/toggle"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "../lib/utils.js"

const toggleVariants = cva("group/toggle ds-toggle", {
  variants: {
    variant: {
      default: "ds-toggle--default",
      outline: "ds-toggle--outline",
    },
    size: {
      default: "ds-toggle--size-default",
      sm: "ds-toggle--size-sm",
      lg: "ds-toggle--size-lg",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
})

function Toggle({
  className,
  variant = "default",
  size = "default",
  ...props
}: TogglePrimitive.Props & VariantProps<typeof toggleVariants>) {
  return (
    <TogglePrimitive
      data-slot="toggle"
      className={cn(toggleVariants({ variant, size, className }))}
      {...props}
    />
  )
}

// DiametralGroup addition: the axis unions, named for callers.
export type ToggleVariant = NonNullable<
  VariantProps<typeof toggleVariants>["variant"]
>
export type ToggleSize = NonNullable<VariantProps<typeof toggleVariants>["size"]>

export { Toggle, toggleVariants }
