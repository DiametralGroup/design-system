"use client"

import * as React from "react"
import { CheckIcon, PencilSimpleIcon, XIcon } from "@phosphor-icons/react"

import { cn } from "../lib/utils.js"
import { useControllableValue } from "../hooks/use-controllable-value.js"
import { Button } from "./button.js"
import { Input } from "./input.js"

// DiametralGroup addition: the props type, exported by name.
export type EditableProps = Omit<
  React.ComponentProps<"div">,
  "onChange" | "defaultValue" | "onSubmit"
> & {
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  onSubmit?: (value: string) => void
  onCancel?: () => void
  placeholder?: string
  disabled?: boolean
  submitOnBlur?: boolean
}

// Inline click-to-edit text. `onMouseDown` preventDefault on the Save/Cancel
// buttons stops them from blurring the input first — without it, the blur
// handler would commit or discard before the button's own onClick runs.
// `aria-label` names the field, not the wrapper: it labels the input and
// suffixes each button ("Edit Project name"), so several Editables on one
// page stay distinguishable.
function Editable({
  className,
  value,
  defaultValue = "",
  onValueChange,
  onSubmit,
  onCancel,
  placeholder = "Empty",
  disabled = false,
  submitOnBlur = true,
  "aria-label": fieldName,
  ...props
}: EditableProps) {
  const [committed, setCommitted] = useControllableValue<string>({
    value,
    defaultValue,
    onChange: onValueChange,
  })
  const [editing, setEditing] = React.useState(false)
  const [draft, setDraft] = React.useState(committed)
  const inputRef = React.useRef<HTMLInputElement>(null)

  React.useEffect(() => {
    if (editing) inputRef.current?.focus()
  }, [editing])

  const label = (verb: string) => (fieldName ? `${verb} ${fieldName}` : verb)

  const startEditing = () => {
    if (disabled) return
    setDraft(committed)
    setEditing(true)
  }

  const submit = () => {
    setCommitted(draft)
    onSubmit?.(draft)
    setEditing(false)
  }

  const cancel = () => {
    setDraft(committed)
    setEditing(false)
    onCancel?.()
  }

  if (editing) {
    return (
      <div
        data-slot="editable"
        data-editing="true"
        className={cn("ds-editable", className)}
        {...props}
      >
        <Input
          ref={inputRef}
          data-slot="editable-input"
          aria-label={fieldName}
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault()
              submit()
            } else if (event.key === "Escape") {
              event.preventDefault()
              cancel()
            }
          }}
          onBlur={() => (submitOnBlur ? submit() : cancel())}
          className="h-8"
        />
        <Button
          type="button"
          variant="ghost"
          size="icon-xs"
          aria-label={label("Save")}
          onMouseDown={(event) => event.preventDefault()}
          onClick={submit}
        >
          <CheckIcon />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon-xs"
          aria-label={label("Cancel")}
          onMouseDown={(event) => event.preventDefault()}
          onClick={cancel}
        >
          <XIcon />
        </Button>
      </div>
    )
  }

  return (
    <div
      data-slot="editable"
      data-editing="false"
      className={cn("ds-editable", className)}
      {...props}
    >
      <span data-slot="editable-preview" data-empty={!committed || undefined}>
        {committed || placeholder}
      </span>
      <Button
        type="button"
        variant="ghost"
        size="icon-xs"
        aria-label={label("Edit")}
        disabled={disabled}
        onClick={startEditing}
        className="ds-editable-edit-button"
      >
        <PencilSimpleIcon />
      </Button>
    </div>
  )
}

export { Editable }
