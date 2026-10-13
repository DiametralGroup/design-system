"use client"

import * as React from "react"

import { cn } from "../lib/utils.js"
import { Button } from "./button.js"
import {
  CaretLeftIcon,
  CaretRightIcon,
  DotsThreeIcon,
} from "@phosphor-icons/react"

/**
 * Which page numbers to render, and where the ellipses fall — v1's `pageCount`
 * + `siblingCount` window, as a pure function rather than a prop, so the parts
 * API is untouched and the caller still owns every link.
 *
 * `page` is 1-based. The first and last page are always present, so the run
 * has a stable length and the control does not resize as you walk it.
 */
function paginationRange({
  page,
  pageCount,
  siblingCount = 1,
}: {
  page: number
  pageCount: number
  siblingCount?: number
}): (number | "ellipsis")[] {
  // first + last + current + 2 siblings + 2 ellipses
  const slots = siblingCount * 2 + 5
  if (pageCount <= slots) return range(1, pageCount)

  const left = Math.max(page - siblingCount, 1)
  const right = Math.min(page + siblingCount, pageCount)

  // An ellipsis standing in for one page is a lie that costs a click, so it
  // only appears with at least two pages behind it. Near an edge that leaves a
  // gap, and the run there is widened rather than shortened — otherwise the
  // control would be 4 slots wide on page 1 and 7 in the middle, resizing under
  // the pointer as you walk it.
  const showLeft = left >= 4
  const showRight = right <= pageCount - 3
  const edgeRun = siblingCount * 2 + 3

  if (!showLeft) return [...range(1, edgeRun), "ellipsis", pageCount]
  if (!showRight) {
    return [1, "ellipsis", ...range(pageCount - edgeRun + 1, pageCount)]
  }
  return [1, "ellipsis", ...range(left, right), "ellipsis", pageCount]
}

const range = (from: number, to: number) =>
  from > to ? [] : Array.from({ length: to - from + 1 }, (_, i) => from + i)

function Pagination({ className, ...props }: React.ComponentProps<"nav">) {
  return (
    <nav
      role="navigation"
      aria-label="pagination"
      data-slot="pagination"
      className={cn("ds-pagination mx-auto w-full justify-center", className)}
      {...props}
    />
  )
}

function PaginationContent({
  className,
  ...props
}: React.ComponentProps<"ul">) {
  return (
    <ul
      data-slot="pagination-content"
      className={cn("ds-pagination-content", className)}
      {...props}
    />
  )
}

function PaginationItem({ ...props }: React.ComponentProps<"li">) {
  return <li data-slot="pagination-item" {...props} />
}

type PaginationLinkProps = {
  isActive?: boolean
} & Pick<React.ComponentProps<typeof Button>, "size"> &
  React.ComponentProps<"a">

function PaginationLink({
  className,
  isActive,
  size = "icon",
  ...props
}: PaginationLinkProps) {
  return (
    <Button
      variant={isActive ? "outline" : "ghost"}
      size={size}
      className={cn(className)}
      nativeButton={false}
      render={
        <a
          aria-current={isActive ? "page" : undefined}
          data-slot="pagination-link"
          data-active={isActive}
          {...props}
        />
      }
    />
  )
}

function PaginationPrevious({
  className,
  text = "Previous",
  // DiametralGroup addition: children, when given, replace `text`.
  children,
  ...props
}: React.ComponentProps<typeof PaginationLink> & { text?: string }) {
  return (
    <PaginationLink
      aria-label="Go to previous page"
      size="default"
      className={cn("ds-pagination-previous", className)}
      {...props}
    >
      <CaretLeftIcon data-icon="inline-start" className="ds-pagination-caret" />
      <span className="ds-pagination-label">{children ?? text}</span>
    </PaginationLink>
  )
}

function PaginationNext({
  className,
  text = "Next",
  // DiametralGroup addition: children, when given, replace `text`.
  children,
  ...props
}: React.ComponentProps<typeof PaginationLink> & { text?: string }) {
  return (
    <PaginationLink
      aria-label="Go to next page"
      size="default"
      className={cn("ds-pagination-next", className)}
      {...props}
    >
      <span className="ds-pagination-label">{children ?? text}</span>
      <CaretRightIcon data-icon="inline-end" className="ds-pagination-caret" />
    </PaginationLink>
  )
}

function PaginationEllipsis({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      aria-hidden
      data-slot="pagination-ellipsis"
      className={cn("ds-pagination-ellipsis", className)}
      {...props}
    >
      <DotsThreeIcon />
      <span className="sr-only">More pages</span>
    </span>
  )
}

export {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  paginationRange,
}
