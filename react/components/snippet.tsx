"use client"

import * as React from "react"

import { CodeBlockCopyButton } from "./code-block.js"
import { cn } from "../lib/utils.js"

// A single-line copyable value — an API key, a CLI command — built on
// CodeBlock's copy affordance rather than reimplementing it. Light surface,
// so CodeBlockCopyButton's dark-panel colors are overridden via className.
function Snippet({
  className,
  value,
  children,
  ...props
}: Omit<React.ComponentProps<"div">, "children"> & {
  value: string
  children?: React.ReactNode
}) {
  return (
    <div data-slot="snippet" className={cn("ds-snippet", className)} {...props}>
      <code data-slot="snippet-code" className="ds-snippet-code">
        {children ?? value}
      </code>
      <CodeBlockCopyButton value={value} className="ds-snippet-copy-button" />
    </div>
  )
}

export { Snippet }
