"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "../lib/utils.js"
import { Button } from "./button.js"
import { Input } from "./input.js"
import { Textarea } from "./textarea.js"

function InputGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="input-group"
      role="group"
      className={cn("group/input-group ds-input-group", className)}
      {...props}
    />
  )
}

const inputGroupAddonVariants = cva(
  "ds-input-group-addon **:data-[slot=kbd]:rounded-none **:data-[slot=kbd]:bg-muted-foreground/10 **:data-[slot=kbd]:px-1.5",
  {
    variants: {
      align: {
        "inline-start": "",
        "inline-end": "",
        "block-start": "",
        "block-end": "",
      },
    },
    defaultVariants: {
      align: "inline-start",
    },
  }
)

function InputGroupAddon({
  className,
  align = "inline-start",
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof inputGroupAddonVariants>) {
  return (
    <div
      role="group"
      data-slot="input-group-addon"
      data-align={align}
      className={cn(inputGroupAddonVariants({ align }), className)}
      onClick={(e) => {
        if ((e.target as HTMLElement).closest("button")) {
          return
        }
        e.currentTarget.parentElement?.querySelector("input")?.focus()
      }}
      {...props}
    />
  )
}

const inputGroupButtonVariants = cva("ds-input-group-button", {
  variants: {
    size: {
      xs: "",
      sm: "",
      "icon-xs": "",
      "icon-sm": "",
    },
  },
  defaultVariants: {
    size: "xs",
  },
})

function InputGroupButton({
  className,
  type = "button",
  variant = "ghost",
  size = "xs",
  ...props
}: Omit<React.ComponentProps<typeof Button>, "size" | "type"> &
  VariantProps<typeof inputGroupButtonVariants> & {
    type?: "button" | "submit" | "reset"
  }) {
  return (
    <Button
      type={type}
      data-size={size}
      variant={variant}
      className={cn(inputGroupButtonVariants({ size }), className)}
      {...props}
    />
  )
}

function InputGroupText({ className, ...props }: React.ComponentProps<"span">) {
  return <span className={cn("ds-input-group-text", className)} {...props} />
}

function InputGroupInput({
  className,
  ...props
}: React.ComponentProps<"input">) {
  return (
    <Input
      data-slot="input-group-control"
      className={cn("ds-input-group-input border-0", className)}
      {...props}
    />
  )
}

function InputGroupTextarea({
  className,
  ...props
}: React.ComponentProps<"textarea">) {
  return (
    <Textarea
      data-slot="input-group-control"
      className={cn(
        "ds-input-group-textarea border-0 py-2.5 [--textarea-chrome:1.25rem]",
        className
      )}
      {...props}
    />
  )
}

export {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupText,
  InputGroupInput,
  InputGroupTextarea,
  // DiametralGroup addition: the addon variant map, exported.
  inputGroupAddonVariants,
}

// DiametralGroup addition: the addon alignment and button size unions.
export type InputGroupAlign = NonNullable<
  VariantProps<typeof inputGroupAddonVariants>["align"]
>
export type InputGroupButtonSize = NonNullable<
  VariantProps<typeof inputGroupButtonVariants>["size"]
>
