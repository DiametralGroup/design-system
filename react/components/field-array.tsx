"use client"

import * as React from "react"
import { PlusIcon, TrashIcon } from "@phosphor-icons/react"

import { cn } from "../lib/utils.js"
import { Button } from "./button.js"
import { IconButton } from "./icon-button.js"

// Repeat chrome for an array of objects: one bordered block per entry, one add
// button under the stack. Every part is separate and holds nothing — no state,
// no opinion about what an entry contains — so an entry takes any control in
// any arrangement, and the array itself lives with the consumer, since this
// package owns no form state (issue #76).
//
// Submission needs no state at all beyond the row list: index each control's
// own `name` per entry (`diplomas[0].school`) and a plain form submit carries
// the whole array. Keys must key off a stable entry id rather than the index —
// keyed by index, removing a row makes React reuse the wrong DOM node and the
// values below it shift up by one.
function FieldArray({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      role="group"
      data-slot="field-array"
      className={cn("ds-field-array", className)}
      {...props}
    />
  )
}

function FieldArrayItem({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="field-array-item"
      className={cn("ds-field-array-item flex items-center", className)}
      {...props}
    />
  )
}

function FieldArrayItemContent({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="field-array-item-content"
      // min-w-0 is load-bearing: without it a long value refuses to shrink
      // below its content width and pushes the remove button out of the block.
      className={cn("ds-field-array-item-content flex", className)}
      {...props}
    />
  )
}

function FieldArrayRemove({
  label = "Remove",
  children,
  ...props
}: Omit<React.ComponentProps<typeof IconButton>, "label"> & {
  label?: string
}) {
  return (
    <IconButton
      type="button"
      variant="ghost"
      size="icon-sm"
      label={label}
      data-slot="field-array-remove"
      {...props}
    >
      {children ?? <TrashIcon />}
    </IconButton>
  )
}

function FieldArrayAdd({
  className,
  children,
  ...props
}: React.ComponentProps<typeof Button>) {
  return (
    <Button
      type="button"
      variant="outline"
      data-slot="field-array-add"
      className={cn("ds-field-array-add", className)}
      {...props}
    >
      <PlusIcon />
      {children}
    </Button>
  )
}

export {
  FieldArray,
  FieldArrayItem,
  FieldArrayItemContent,
  FieldArrayRemove,
  FieldArrayAdd,
}
