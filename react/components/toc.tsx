"use client"

import * as React from "react"
import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"

import { cn } from "../lib/utils.js"

function Toc({ className, ...props }: React.ComponentProps<"nav">) {
  return (
    <nav
      aria-label="On this page"
      data-slot="toc"
      className={cn("ds-toc sticky top-8", className)}
      {...props}
    />
  )
}

function TocLabel({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="toc-label"
      className={cn("ds-toc-label mb-3", className)}
      {...props}
    />
  )
}

function TocList({ className, ...props }: React.ComponentProps<"ul">) {
  return (
    <ul
      data-slot="toc-list"
      className={cn("ds-toc-list gap-2", className)}
      {...props}
    />
  )
}

function TocItem({
  className,
  level = 1,
  ...props
}: React.ComponentProps<"li"> & { level?: 1 | 2 }) {
  return (
    <li
      data-slot="toc-item"
      data-level={level}
      className={className}
      {...props}
    />
  )
}

// Under a hash router (`#/route`) a plain `#section` anchor replaces the
// route, so the link scrolls to its target instead of navigating. Every other
// app keeps the native anchor jump.
function scrollUnderHashRouter(event: React.MouseEvent<HTMLAnchorElement>) {
  const href = event.currentTarget.getAttribute("href")
  if (!href?.startsWith("#") || !window.location.hash.startsWith("#/")) return
  const target = document.getElementById(decodeURIComponent(href.slice(1)))
  if (!target) return
  event.preventDefault()
  target.scrollIntoView()
}

function TocLink({
  className,
  render,
  current,
  ...props
}: useRender.ComponentProps<"a"> & {
  /** DiametralGroup addition: marks the reader's current section —
   *  `aria-current` plus the legacy `.ds-toc-link--current`. */
  current?: boolean
}) {
  return useRender({
    defaultTagName: "a",
    props: mergeProps<"a">(
      {
        onClick: scrollUnderHashRouter,
        "aria-current": current ? ("location" as const) : undefined,
        className: cn(
          "ds-toc-link border-transparent text-sm text-muted-foreground hover:border-foreground hover:text-foreground",
          current && "ds-toc-link--current",
          className
        ),
      },
      props
    ),
    render,
    state: {
      slot: "toc-link",
    },
  })
}

export { Toc, TocLabel, TocList, TocItem, TocLink }
