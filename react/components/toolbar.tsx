"use client"

import { Toolbar as ToolbarPrimitive } from "@base-ui/react/toolbar"
import { type VariantProps } from "class-variance-authority"

import { cn } from "../lib/utils.js"
import { Button, buttonVariants } from "./button.js"
import { Input } from "./input.js"

function Toolbar({ className, ...props }: ToolbarPrimitive.Root.Props) {
  return (
    <ToolbarPrimitive.Root
      data-slot="toolbar"
      className={cn("ds-toolbar", className)}
      {...props}
    />
  )
}

function ToolbarGroup({ className, ...props }: ToolbarPrimitive.Group.Props) {
  return (
    <ToolbarPrimitive.Group
      data-slot="toolbar-group"
      className={cn("ds-toolbar-group", className)}
      {...props}
    />
  )
}

function ToolbarButton({
  className,
  variant = "ghost",
  size = "icon-sm",
  tone,
  ...props
}: ToolbarPrimitive.Button.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ToolbarPrimitive.Button
      data-slot="toolbar-button"
      render={<Button variant={variant} size={size} tone={tone} />}
      className={cn("ds-toolbar-button", className)}
      {...props}
    />
  )
}

function ToolbarLink({ className, ...props }: ToolbarPrimitive.Link.Props) {
  return (
    <ToolbarPrimitive.Link
      data-slot="toolbar-link"
      className={cn("ds-toolbar-link", className)}
      {...props}
    />
  )
}

function ToolbarInput({ className, ...props }: ToolbarPrimitive.Input.Props) {
  return (
    <ToolbarPrimitive.Input
      data-slot="toolbar-input"
      render={<Input />}
      className={cn("h-9 w-32 px-2", className)}
      {...props}
    />
  )
}

function ToolbarSeparator({
  className,
  ...props
}: ToolbarPrimitive.Separator.Props) {
  return (
    <ToolbarPrimitive.Separator
      data-slot="toolbar-separator"
      className={cn("ds-toolbar-separator", className)}
      {...props}
    />
  )
}

export {
  Toolbar,
  ToolbarGroup,
  ToolbarButton,
  ToolbarLink,
  ToolbarInput,
  ToolbarSeparator,
}
