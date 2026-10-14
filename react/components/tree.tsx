"use client"

import * as React from "react"
import { Collapsible as CollapsiblePrimitive } from "@base-ui/react/collapsible"

import { cn } from "../lib/utils.js"
import { CaretRightIcon, CaretDownIcon } from "@phosphor-icons/react"

function Tree({ className, ...props }: React.ComponentProps<"ul">) {
  return (
    <ul
      role="tree"
      data-slot="tree"
      className={cn("ds-tree", className)}
      {...props}
    />
  )
}

function TreeItem({ className, ...props }: CollapsiblePrimitive.Root.Props) {
  return (
    <CollapsiblePrimitive.Root
      data-slot="tree-item"
      render={<li role="treeitem" />}
      className={cn("ds-tree-item", className)}
      {...props}
    />
  )
}

function TreeItemTrigger({
  className,
  children,
  ...props
}: CollapsiblePrimitive.Trigger.Props) {
  return (
    <CollapsiblePrimitive.Trigger
      data-slot="tree-item-trigger"
      className={cn("ds-tree-item-trigger group/tree-item-trigger", className)}
      {...props}
    >
      <CaretRightIcon className="ds-tree-item-trigger-caret-right" />
      <CaretDownIcon className="ds-tree-item-trigger-caret-down" />
      {children}
    </CollapsiblePrimitive.Trigger>
  )
}

function TreeItemContent({
  className,
  ...props
}: CollapsiblePrimitive.Panel.Props) {
  return (
    <CollapsiblePrimitive.Panel
      data-slot="tree-item-content"
      render={<ul role="group" />}
      className={cn("ds-tree-item-content", className)}
      {...props}
    />
  )
}

function TreeLeaf({ className, children, ...props }: React.ComponentProps<"li">) {
  return (
    <li
      role="treeitem"
      data-slot="tree-leaf"
      className={cn("ds-tree-leaf", className)}
      {...props}
    >
      <span className="ds-tree-leaf-spacer" />
      {children}
    </li>
  )
}

export { Tree, TreeItem, TreeItemTrigger, TreeItemContent, TreeLeaf }
