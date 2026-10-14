"use client"

import * as React from "react"
import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "../lib/utils.js"
import { Separator } from "./separator.js"

function ItemGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    // Deliberately no role="list". A list may only own listitems, and Item is
    // polymorphic through Base UI's useRender — which does not forward `role`
    // to the rendered element, so its children cannot be made listitems from
    // here. Asserting the role anyway is what produced axe's critical
    // aria-required-children on every group. A generic container is honest; a
    // malformed list is announced unpredictably by screen readers. Consumers
    // who genuinely need list semantics own the markup: pass role="list" here
    // and role="listitem" on each child.
    <div
      data-slot="item-group"
      className={cn("ds-item-group", className)}
      {...props}
    />
  )
}

function ItemSeparator({
  className,
  ...props
}: React.ComponentProps<typeof Separator>) {
  return (
    <Separator
      data-slot="item-separator"
      orientation="horizontal"
      className={cn("ds-item-separator", className)}
      {...props}
    />
  )
}

const itemVariants = cva("ds-item", {
  variants: {
    variant: {
      default: "ds-item--default",
      outline: "ds-item--outline",
      muted: "ds-item--muted",
    },
    size: {
      default: "ds-item--size-default",
      sm: "ds-item--size-sm",
      xs: "ds-item--size-xs",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
})

function Item({
  className,
  variant = "default",
  size = "default",
  render,
  ...props
}: useRender.ComponentProps<"div"> & VariantProps<typeof itemVariants>) {
  return useRender({
    defaultTagName: "div",
    props: mergeProps<"div">(
      {
        className: cn(itemVariants({ variant, size, className })),
      },
      props
    ),
    render,
    state: {
      slot: "item",
      variant,
      size,
    },
  })
}

const itemMediaVariants = cva("ds-item-media", {
  variants: {
    variant: {
      default: "ds-item-media--default",
      icon: "ds-item-media--icon",
      image: "ds-item-media--image",
    },
  },
  defaultVariants: {
    variant: "default",
  },
})

function ItemMedia({
  className,
  variant = "default",
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof itemMediaVariants>) {
  return (
    <div
      data-slot="item-media"
      data-variant={variant}
      className={cn(itemMediaVariants({ variant, className }))}
      {...props}
    />
  )
}

function ItemContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="item-content"
      className={cn("ds-item-content", className)}
      {...props}
    />
  )
}

function ItemTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="item-title"
      className={cn("ds-item-title", className)}
      {...props}
    />
  )
}

function ItemDescription({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="item-description"
      className={cn("ds-item-description", className)}
      {...props}
    />
  )
}

function ItemActions({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="item-actions"
      className={cn("ds-item-actions", className)}
      {...props}
    />
  )
}

function ItemHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="item-header"
      className={cn("ds-item-header", className)}
      {...props}
    />
  )
}

function ItemFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="item-footer"
      className={cn("ds-item-footer", className)}
      {...props}
    />
  )
}

export {
  Item,
  ItemMedia,
  ItemContent,
  ItemActions,
  ItemGroup,
  ItemSeparator,
  ItemTitle,
  ItemDescription,
  ItemHeader,
  ItemFooter,
}
