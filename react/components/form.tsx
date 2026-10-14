"use client"

import { Form as FormPrimitive } from "@base-ui/react/form"

import { cn } from "../lib/utils.js"

function Form({ className, ...props }: FormPrimitive.Props) {
  return (
    <FormPrimitive
      data-slot="form"
      className={cn("ds-form", className)}
      {...props}
    />
  )
}

export { Form }
