"use client"

import * as React from "react"
import { ChatCircleDotsIcon, XIcon } from "@phosphor-icons/react"

import { cx } from "../lib/cx.js"
import { cn } from "../lib/utils.js"
import {
  buildFeedbackPayload,
  captureFeedbackContext,
  emptyFeedbackDraft,
  feedbackErrorMessage,
  feedbackLabels,
  formatFeedbackCounter,
  resolveFeedbackConfig,
  validateFeedback,
  type FeedbackConfig,
  type FeedbackDraft,
  type FeedbackErrorCode,
  type FeedbackField,
  type FeedbackLabels,
  type FeedbackPayload,
} from "../lib/feedback.js"
import { Alert, AlertDescription } from "./alert.js"
import { Button } from "./button.js"
import { Checkbox } from "./checkbox.js"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./dialog.js"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
  FieldTitle,
} from "./field.js"
import { Input } from "./input.js"
import { Rating } from "./rating.js"
import { Textarea } from "./textarea.js"
import { ToggleGroup, ToggleGroupItem } from "./toggle-group.js"

/* Feedback — one form, three ways in.
   ---------------------------------------------------------------------------
   `FeedbackForm` is the inline form (a /feedback page), `FeedbackDialog` puts
   the same form in the DS Dialog, `FeedbackTrigger` is the header button that
   opens it. The framework-free logic (validation, payload, labels) lives in
   lib/feedback.ts and is published as `@diametral/design-system/feedback` for
   apps that cannot use React. The transport belongs to the application:
   `onSubmit` resolves = sent, rejects = error shown and the input kept. */

export interface FeedbackFormProps {
  config: FeedbackConfig
  /** The application's transport. Resolve = success; reject = the error is shown and the input is kept. */
  onSubmit: (payload: FeedbackPayload) => Promise<void>
  locale?: "en" | "fr"
  labels?: Partial<FeedbackLabels>
  appVersion?: string
  /** Merged into the captured context (after it, so a key here wins). */
  context?: Record<string, unknown>
  /** The message shown for a rejected `onSubmit`. Default: `labels.error`. */
  getErrorMessage?: (error: unknown) => string | undefined
  /** Replaces the actions of the success state. */
  successActions?: React.ReactNode
  /** Shows a Cancel button; on the success state it also shows a Close button. */
  onCancel?: () => void
  /** The "page and version are attached" note. Default true. */
  showContextNote?: boolean
  className?: string
}

type Status = "idle" | "submitting" | "success" | "error"

function FeedbackForm({
  config,
  onSubmit,
  locale = "en",
  labels: labelOverrides,
  appVersion,
  context,
  getErrorMessage,
  successActions,
  onCancel,
  showContextNote = true,
  className,
}: FeedbackFormProps) {
  const uid = React.useId()
  const labels = React.useMemo(
    () => feedbackLabels(locale, labelOverrides),
    [locale, labelOverrides]
  )
  const resolved = resolveFeedbackConfig(config)

  const [draft, setDraft] = React.useState<FeedbackDraft>(() =>
    emptyFeedbackDraft(config)
  )
  const [status, setStatus] = React.useState<Status>("idle")
  const [attempted, setAttempted] = React.useState(false)
  const [errorText, setErrorText] = React.useState<string>()
  const mounted = React.useRef(true)
  React.useEffect(() => {
    mounted.current = true
    return () => {
      mounted.current = false
    }
  }, [])

  const successRef = React.useRef<HTMLDivElement>(null)
  React.useEffect(() => {
    if (status === "success") successRef.current?.focus()
  }, [status])

  const patch = (next: Partial<FeedbackDraft>) =>
    setDraft((current) => ({ ...current, ...next }))

  const { errors } = validateFeedback(draft, config)
  const shown: Partial<Record<FeedbackField, FeedbackErrorCode>> = attempted
    ? errors
    : {}
  const submitting = status === "submitting"

  const id = (part: string) => `${uid}-${part}`
  const errorId = (field: FeedbackField) => `${id(field)}-error`
  const errorMessage = (field: FeedbackField) => {
    const code = shown[field]
    if (!code) return undefined
    const max =
      field === "title"
        ? resolved.title?.maxLength
        : field === "message"
          ? resolved.message.maxLength
          : undefined
    return feedbackErrorMessage(labels, code, max)
  }
  const fieldError = (field: FeedbackField) => {
    const message = errorMessage(field)
    return message ? (
      <FieldError id={errorId(field)}>{message}</FieldError>
    ) : null
  }
  const describedBy = (
    field: FeedbackField,
    ...others: (string | false | 0 | undefined)[]
  ) =>
    [...others, shown[field] && errorId(field)].filter(Boolean).join(" ") ||
    undefined

  const requiredMark = (required: boolean) =>
    required ? (
      <span aria-hidden="true" className="ds-feedback__required">
        {" *"}
      </span>
    ) : null

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (submitting) return
    setAttempted(true)
    if (!validateFeedback(draft, config).valid) return

    const payload = buildFeedbackPayload(
      draft,
      config,
      captureFeedbackContext({ appVersion, extra: context })
    )
    setStatus("submitting")
    setErrorText(undefined)
    try {
      await onSubmit(payload)
      if (mounted.current) setStatus("success")
    } catch (error) {
      if (!mounted.current) return
      setErrorText(getErrorMessage?.(error) ?? labels.error)
      setStatus("error")
    }
  }

  function reset() {
    setDraft(emptyFeedbackDraft(config))
    setAttempted(false)
    setErrorText(undefined)
    setStatus("idle")
  }

  if (status === "success") {
    return (
      <div
        data-slot="feedback"
        className={cx("ds-feedback ds-feedback--success", className)}
      >
        <div
          ref={successRef}
          role="status"
          tabIndex={-1}
          className="ds-feedback__success"
        >
          <p className="ds-feedback__success-title">{labels.successTitle}</p>
          <p className="ds-feedback__success-description">
            {labels.successDescription}
          </p>
        </div>
        <div className="ds-feedback__actions">
          {successActions ?? (
            <>
              {onCancel && (
                <Button type="button" variant="outline" onClick={onCancel}>
                  {labels.close}
                </Button>
              )}
              <Button type="button" onClick={reset}>
                {labels.sendAnother}
              </Button>
            </>
          )}
        </div>
      </div>
    )
  }

  const message = resolved.message
  const messageMax = config.message?.maxLength
  const titleMax = resolved.title && config.title && config.title.maxLength

  return (
    <form
      data-slot="feedback"
      noValidate
      className={cx("ds-feedback", className)}
      onSubmit={handleSubmit}
    >
      {resolved.kinds && resolved.kinds.length > 0 && (
        <Field data-invalid={shown.kind ? "true" : undefined}>
          <FieldTitle id={id("kind-label")}>
            {labels.kind}
            {requiredMark(true)}
          </FieldTitle>
          <ToggleGroup
            variant="outline"
            spacing={0}
            value={draft.kind ? [draft.kind] : []}
            onValueChange={(value: string[]) => {
              if (value.length > 0) patch({ kind: value[value.length - 1] })
            }}
            aria-labelledby={id("kind-label")}
            aria-describedby={describedBy("kind")}
            disabled={submitting}
            className="ds-feedback__kinds"
          >
            {resolved.kinds.map((kind) => (
              <ToggleGroupItem key={kind.value} value={kind.value}>
                {kind.label}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
          {fieldError("kind")}
        </Field>
      )}

      {resolved.rating && (
        <Field data-invalid={shown.rating ? "true" : undefined}>
          <FieldTitle id={id("rating-label")}>
            {labels.rating}
            {requiredMark(resolved.rating.required)}
          </FieldTitle>
          <Rating
            shape="star"
            max={resolved.rating.max}
            value={draft.rating ?? 0}
            onValueChange={(value) => patch({ rating: value })}
            disabled={submitting}
            required={resolved.rating.required}
            aria-labelledby={id("rating-label")}
            aria-invalid={shown.rating ? true : undefined}
            aria-describedby={describedBy(
              "rating",
              resolved.rating.labels && draft.rating !== null && id("rating-text")
            )}
          />
          {resolved.rating.labels && (
            <p
              id={id("rating-text")}
              className="ds-feedback__rating-label"
              aria-live="polite"
            >
              {draft.rating !== null
                ? (resolved.rating.labels[draft.rating - 1] ?? "")
                : ""}
            </p>
          )}
          {fieldError("rating")}
        </Field>
      )}

      {resolved.categories && resolved.categories.length > 0 && (
        <Field>
          <FieldTitle id={id("categories-label")}>{labels.categories}</FieldTitle>
          <div
            role="group"
            aria-labelledby={id("categories-label")}
            className="ds-feedback__categories"
          >
            {resolved.categories.map((category) => {
              const checkboxId = id(`category-${category.value}`)
              return (
                <Field key={category.value} orientation="horizontal">
                  <Checkbox
                    id={checkboxId}
                    checked={draft.categories.includes(category.value)}
                    disabled={submitting}
                    onCheckedChange={(checked) =>
                      patch({
                        categories: checked
                          ? [...draft.categories, category.value]
                          : draft.categories.filter(
                              (value) => value !== category.value
                            ),
                      })
                    }
                  />
                  <FieldLabel htmlFor={checkboxId}>{category.label}</FieldLabel>
                </Field>
              )
            })}
          </div>
        </Field>
      )}

      {resolved.title && (
        <Field data-invalid={shown.title ? "true" : undefined}>
          <FieldLabel htmlFor={id("title")}>
            {labels.titleField}
            {requiredMark(resolved.title.required)}
          </FieldLabel>
          <Input
            id={id("title")}
            value={draft.title}
            maxLength={resolved.title.maxLength}
            placeholder={labels.titlePlaceholder}
            disabled={submitting}
            required={resolved.title.required}
            aria-invalid={shown.title ? true : undefined}
            aria-describedby={describedBy("title", titleMax && id("title-count"))}
            onChange={(event) => patch({ title: event.target.value })}
          />
          {titleMax ? (
            <p id={id("title-count")} className="ds-feedback__counter">
              {formatFeedbackCounter(labels, draft.title.length, titleMax)}
            </p>
          ) : null}
          {fieldError("title")}
        </Field>
      )}

      <Field data-invalid={shown.message ? "true" : undefined}>
        <FieldLabel htmlFor={id("message")}>
          {labels.message}
          {requiredMark(message.required)}
        </FieldLabel>
        <Textarea
          id={id("message")}
          rows={5}
          value={draft.message}
          maxLength={message.maxLength}
          placeholder={labels.messagePlaceholder}
          disabled={submitting}
          required={message.required}
          aria-invalid={shown.message ? true : undefined}
          aria-describedby={describedBy(
            "message",
            messageMax !== undefined && id("message-count")
          )}
          onChange={(event) => patch({ message: event.target.value })}
        />
        {messageMax !== undefined && (
          <p id={id("message-count")} className="ds-feedback__counter">
            {formatFeedbackCounter(labels, draft.message.length, messageMax)}
          </p>
        )}
        {fieldError("message")}
      </Field>

      {resolved.allowAnonymous && (
        <Field orientation="horizontal">
          <Checkbox
            id={id("anonymous")}
            checked={draft.anonymous}
            disabled={submitting}
            aria-describedby={id("anonymous-hint")}
            onCheckedChange={(checked) => patch({ anonymous: checked })}
          />
          <FieldContent>
            <FieldLabel htmlFor={id("anonymous")}>{labels.anonymous}</FieldLabel>
            <FieldDescription id={id("anonymous-hint")}>
              {labels.anonymousHint}
            </FieldDescription>
          </FieldContent>
        </Field>
      )}

      {showContextNote && (
        <p className="ds-feedback__context-note">{labels.contextNote}</p>
      )}

      {status === "error" && errorText && (
        <Alert tone="danger" variant="destructive">
          <AlertDescription>{errorText}</AlertDescription>
        </Alert>
      )}

      <div className="ds-feedback__actions">
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            disabled={submitting}
            onClick={onCancel}
          >
            {labels.cancel}
          </Button>
        )}
        <Button type="submit" loading={submitting}>
          {submitting ? labels.sending : labels.send}
        </Button>
      </div>
    </form>
  )
}

export interface FeedbackDialogProps extends FeedbackFormProps {
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  /** The element that opens the dialog, typically a `FeedbackTrigger`. */
  trigger?: React.ReactElement
  /** Default: `labels.title`. */
  title?: React.ReactNode
  /** Default: `labels.description`. */
  description?: React.ReactNode
}

function FeedbackDialog({
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  trigger,
  title,
  description,
  onSubmit,
  onCancel,
  ...formProps
}: FeedbackDialogProps) {
  const labels = React.useMemo(
    () => feedbackLabels(formProps.locale ?? "en", formProps.labels),
    [formProps.locale, formProps.labels]
  )
  const [openState, setOpenState] = React.useState(defaultOpen)
  const open = openProp ?? openState
  const submitting = React.useRef(false)
  const [formKey, setFormKey] = React.useState(0)

  // Closing throws the draft away: the form remounts empty on the next open.
  const wasOpen = React.useRef(open)
  React.useEffect(() => {
    if (wasOpen.current && !open) setFormKey((key) => key + 1)
    wasOpen.current = open
  }, [open])

  const setOpen = React.useCallback(
    (next: boolean) => {
      if (!next && submitting.current) return
      if (openProp === undefined) setOpenState(next)
      onOpenChange?.(next)
    },
    [openProp, onOpenChange]
  )

  const guardedSubmit = React.useCallback(
    async (payload: FeedbackPayload) => {
      submitting.current = true
      try {
        await onSubmit(payload)
      } finally {
        submitting.current = false
      }
    },
    [onSubmit]
  )

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger && <DialogTrigger render={trigger} />}
      <DialogContent showCloseButton={false} className="ds-feedback-dialog">
        <DialogHeader>
          <DialogTitle>{title ?? labels.title}</DialogTitle>
          <DialogDescription>{description ?? labels.description}</DialogDescription>
        </DialogHeader>
        <FeedbackForm
          key={formKey}
          {...formProps}
          onSubmit={guardedSubmit}
          onCancel={() => {
            setOpen(false)
            onCancel?.()
          }}
        />
        <DialogClose
          render={
            <Button
              variant="ghost"
              size="icon-sm"
              className="ds-dialog-close"
              type="button"
            />
          }
        >
          <XIcon aria-hidden="true" />
          <span className="sr-only">{labels.close}</span>
        </DialogClose>
      </DialogContent>
    </Dialog>
  )
}

export interface FeedbackTriggerProps
  extends Omit<React.ComponentProps<typeof Button>, "children"> {
  locale?: "en" | "fr"
  labels?: Partial<FeedbackLabels>
}

/** A ghost button: icon + label, the label folding away below the `lg` breakpoint. */
const FeedbackTrigger = React.forwardRef<HTMLButtonElement, FeedbackTriggerProps>(
  function FeedbackTrigger(
    { locale = "en", labels: labelOverrides, className, ...props },
    ref
  ) {
    const labels = feedbackLabels(locale, labelOverrides)
    return (
      <Button
        ref={ref}
        type="button"
        variant="ghost"
        size="sm"
        aria-label={labels.trigger}
        className={cn("ds-feedback-trigger", className)}
        {...props}
      >
        <ChatCircleDotsIcon aria-hidden="true" />
        <span className="ds-feedback-trigger__label">{labels.trigger}</span>
      </Button>
    )
  }
)

export { FeedbackForm, FeedbackDialog, FeedbackTrigger }
