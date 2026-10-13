"use client"

import * as React from "react"

import { cn } from "../lib/utils.js"
import { UploadSimpleIcon } from "@phosphor-icons/react"

function FileUpload({
  className,
  children,
  onFiles,
  accept,
  multiple = false,
  disabled = false,
  "aria-label": ariaLabel = "Upload files",
  ...props
}: Omit<
  React.ComponentProps<"div">,
  "onDrop" | "onDragOver" | "onDragLeave" | "onClick"
> & {
  onFiles?: (files: File[]) => void
  accept?: string
  multiple?: boolean
  disabled?: boolean
}) {
  const inputRef = React.useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = React.useState(false)

  function emit(files: FileList | null) {
    if (files?.length) {
      onFiles?.(Array.from(files))
    }
  }

  return (
    <div
      data-slot="file-upload"
      data-dragging={dragging || undefined}
      data-disabled={disabled || undefined}
      onClick={() => inputRef.current?.click()}
      onDragOver={(event) => {
        event.preventDefault()
        setDragging(true)
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(event) => {
        event.preventDefault()
        setDragging(false)
        emit(event.dataTransfer.files)
      }}
      className={cn(
        "ds-file-upload flex-col justify-center gap-2 px-6 py-10 text-center",
        className
      )}
      {...props}
    >
      {/* The real file input is already focusable and Enter/Space-operable
          natively, so this wrapper stays a plain div rather than a nested
          role="button" — a div and an input both being interactive is what
          triggered the nested-interactive violation. */}
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        disabled={disabled}
        aria-label={ariaLabel}
        className="sr-only"
        onChange={(event) => {
          emit(event.target.files)
          // Clearing lets the same file be re-selected, which otherwise emits no change event.
          event.target.value = ""
        }}
      />
      {children}
    </div>
  )
}

function FileUploadIcon({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="file-upload-icon"
      className={cn("ds-file-upload-icon", className)}
      {...props}
    >
      <UploadSimpleIcon />
    </div>
  )
}

function FileUploadTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="file-upload-title"
      className={cn("ds-file-upload-title", className)}
      {...props}
    />
  )
}

function FileUploadDescription({
  className,
  ...props
}: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="file-upload-description"
      className={cn("ds-file-upload-description", className)}
      {...props}
    />
  )
}

export { FileUpload, FileUploadIcon, FileUploadTitle, FileUploadDescription }
