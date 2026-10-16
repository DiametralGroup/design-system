/* Feedback core — the framework-free half of the Feedback component.
   ---------------------------------------------------------------------------
   No import of React and no DOM access at module level: this file is published
   on its own as `@diametral/design-system/feedback`, so an Angular (or any
   non-React) app can validate a draft, build the payload and read the labels
   with the same code the React `FeedbackForm` runs. Transport stays with the
   application: nothing here sends anything.

   Contract: docs/components.md → Feedback. */

export interface FeedbackOption {
  value: string
  label: string
}

export interface FeedbackConfig {
  /** Single choice "what is this about" (bug / feature / ...). Absent = no field. A kind is required when configured. */
  kinds?: FeedbackOption[]
  defaultKind?: string
  /** A 1..max note. false / absent = no field. `max` defaults to 5, `required` to false. */
  rating?: false | { max?: number; required?: boolean; labels?: string[] }
  /** Multiple choice. Absent = no field. */
  categories?: FeedbackOption[]
  /** One-line title. false / absent = no field. `required` defaults to false, `maxLength` to 200. */
  title?: false | { required?: boolean; maxLength?: number }
  /** The message. Always present. `required` defaults to true, `maxLength` to 5000. */
  message?: { required?: boolean; maxLength?: number }
  /** The "send anonymously" checkbox. */
  allowAnonymous?: boolean
}

export interface FeedbackDraft {
  kind?: string
  rating: number | null
  categories: string[]
  title: string
  message: string
  anonymous: boolean
}

export interface FeedbackContext {
  /** location.pathname + location.search */
  route: string
  appVersion?: string
  userAgent?: string
  /** navigator.language */
  locale?: string
  /** `${innerWidth}x${innerHeight}` */
  viewport?: string
  /** Whatever the application adds. */
  [key: string]: unknown
}

export interface FeedbackPayload {
  kind?: string
  rating?: number
  categories?: string[]
  title?: string
  message: string
  anonymous?: boolean
  context: FeedbackContext
}

export type FeedbackField = "kind" | "rating" | "title" | "message"
export type FeedbackErrorCode =
  | "required"
  | "tooLong"
  | "outOfRange"
  | "unknownOption"

export const DEFAULT_RATING_MAX = 5
export const DEFAULT_TITLE_MAX_LENGTH = 200
export const DEFAULT_MESSAGE_MAX_LENGTH = 5000

/** The limits a config resolves to, defaults applied. One place, so the React form and the validator agree. */
export function resolveFeedbackConfig(config: FeedbackConfig) {
  const rating = config.rating ? config.rating : undefined
  const title = config.title ? config.title : undefined
  return {
    kinds: config.kinds,
    categories: config.categories,
    rating: rating && {
      max: rating.max ?? DEFAULT_RATING_MAX,
      required: rating.required ?? false,
      labels: rating.labels,
    },
    title: title && {
      required: title.required ?? false,
      maxLength: title.maxLength ?? DEFAULT_TITLE_MAX_LENGTH,
    },
    message: {
      required: config.message?.required ?? true,
      maxLength: config.message?.maxLength ?? DEFAULT_MESSAGE_MAX_LENGTH,
    },
    allowAnonymous: config.allowAnonymous === true,
  }
}

/** The draft a form starts from (and returns to after "send another"). */
export function emptyFeedbackDraft(config: FeedbackConfig): FeedbackDraft {
  const draft: FeedbackDraft = {
    rating: null,
    categories: [],
    title: "",
    message: "",
    anonymous: false,
  }
  if (config.kinds?.length && config.defaultKind !== undefined) {
    if (config.kinds.some((kind) => kind.value === config.defaultKind)) {
      draft.kind = config.defaultKind
    }
  }
  return draft
}

export function validateFeedback(
  draft: FeedbackDraft,
  config: FeedbackConfig
): { valid: boolean; errors: Partial<Record<FeedbackField, FeedbackErrorCode>> } {
  const resolved = resolveFeedbackConfig(config)
  const errors: Partial<Record<FeedbackField, FeedbackErrorCode>> = {}

  if (resolved.kinds?.length) {
    if (!draft.kind) errors.kind = "required"
    else if (!resolved.kinds.some((kind) => kind.value === draft.kind)) {
      errors.kind = "unknownOption"
    }
  }

  if (resolved.rating) {
    if (draft.rating === null || draft.rating === undefined) {
      if (resolved.rating.required) errors.rating = "required"
    } else if (
      !Number.isInteger(draft.rating) ||
      draft.rating < 1 ||
      draft.rating > resolved.rating.max
    ) {
      errors.rating = "outOfRange"
    }
  }

  if (resolved.title) {
    const title = draft.title.trim()
    if (!title) {
      if (resolved.title.required) errors.title = "required"
    } else if (title.length > resolved.title.maxLength) {
      errors.title = "tooLong"
    }
  }

  const message = draft.message.trim()
  if (!message) {
    if (resolved.message.required) errors.message = "required"
  } else if (message.length > resolved.message.maxLength) {
    errors.message = "tooLong"
  }

  return { valid: Object.keys(errors).length === 0, errors }
}

/** Trims, leaves out every field the config does not have, sends `anonymous` only when allowed.
 *  Categories the config does not list are dropped (there is no error code for them), the rest keep the config's order.
 *  An optional title left empty is left out. Throws when the draft is invalid. */
export function buildFeedbackPayload(
  draft: FeedbackDraft,
  config: FeedbackConfig,
  context: FeedbackContext
): FeedbackPayload {
  const { valid, errors } = validateFeedback(draft, config)
  if (!valid) {
    throw new Error(
      `Invalid feedback draft: ${Object.entries(errors)
        .map(([field, code]) => `${field} (${code})`)
        .join(", ")}`
    )
  }
  const resolved = resolveFeedbackConfig(config)
  const payload: FeedbackPayload = { message: draft.message.trim(), context }

  if (resolved.kinds?.length && draft.kind) payload.kind = draft.kind
  if (resolved.rating && draft.rating !== null && draft.rating !== undefined) {
    payload.rating = draft.rating
  }
  if (resolved.categories) {
    const chosen = new Set(draft.categories)
    payload.categories = resolved.categories
      .map((category) => category.value)
      .filter((value) => chosen.has(value))
  }
  if (resolved.title) {
    const title = draft.title.trim()
    if (title) payload.title = title
  }
  if (resolved.allowAnonymous) payload.anonymous = draft.anonymous === true

  return payload
}

interface CaptureEnv {
  location?: Pick<Location, "pathname" | "search">
  navigator?: Pick<Navigator, "userAgent" | "language">
  innerWidth?: number
  innerHeight?: number
}

/** The ambient browser environment, or an empty one (SSR, node tests). Read at call time, never at import. */
function ambientEnv(): CaptureEnv {
  const w = (globalThis as { window?: CaptureEnv }).window
  if (!w) return {}
  return {
    location: w.location,
    navigator: w.navigator,
    innerWidth: w.innerWidth,
    innerHeight: w.innerHeight,
  }
}

/** Safe on the server: reads window / navigator / location only when they exist, and `env` replaces them for tests.
 *  `extra` is merged last, so an application may override any captured key (a hash router overriding `route`). */
export function captureFeedbackContext(
  options: {
    appVersion?: string
    extra?: Record<string, unknown>
    env?: CaptureEnv
  } = {}
): FeedbackContext {
  const env = options.env ?? ambientEnv()
  const context: FeedbackContext = {
    route: env.location ? `${env.location.pathname}${env.location.search}` : "",
  }
  if (options.appVersion !== undefined) context.appVersion = options.appVersion
  if (env.navigator?.userAgent) context.userAgent = env.navigator.userAgent
  if (env.navigator?.language) context.locale = env.navigator.language
  if (
    typeof env.innerWidth === "number" &&
    typeof env.innerHeight === "number"
  ) {
    context.viewport = `${env.innerWidth}x${env.innerHeight}`
  }
  return { ...context, ...options.extra }
}

/* -- Labels -------------------------------------------------------------- */

export interface FeedbackLabels {
  /** Dialog title and description. */
  title: string
  description: string
  /** Field labels and placeholders. */
  kind: string
  rating: string
  categories: string
  titleField: string
  titlePlaceholder: string
  message: string
  messagePlaceholder: string
  anonymous: string
  anonymousHint: string
  /** Buttons. */
  send: string
  sending: string
  cancel: string
  close: string
  sendAnother: string
  /** Success state. */
  successTitle: string
  successDescription: string
  /** Generic transport error. */
  error: string
  /** Character counter, with `{count}` and `{max}`. */
  counter: string
  /** "The page and version are attached." */
  contextNote: string
  /** Validation messages, one per code. `{max}` is the field's limit. */
  errorRequired: string
  errorTooLong: string
  errorOutOfRange: string
  errorUnknownOption: string
  /** The trigger button's label. */
  trigger: string
}

export const FEEDBACK_LABELS: { en: FeedbackLabels; fr: FeedbackLabels } = {
  en: {
    title: "Send feedback",
    description: "Tell us what happened or what you would like to see.",
    kind: "What is this about?",
    rating: "How was your experience?",
    categories: "Topics",
    titleField: "Title",
    titlePlaceholder: "A short summary",
    message: "Message",
    messagePlaceholder: "Describe it in a few sentences",
    anonymous: "Send anonymously",
    anonymousHint: "Your name will not be attached to this feedback.",
    send: "Send",
    sending: "Sending…",
    cancel: "Cancel",
    close: "Close",
    sendAnother: "Send another",
    successTitle: "Thank you",
    successDescription: "Your feedback has been sent.",
    error: "Your feedback could not be sent. Please try again.",
    counter: "{count}/{max}",
    contextNote: "The page and the app version are attached.",
    errorRequired: "This field is required.",
    errorTooLong: "Keep it under {max} characters.",
    errorOutOfRange: "Choose a value in the scale.",
    errorUnknownOption: "Choose one of the options.",
    trigger: "Report",
  },
  fr: {
    title: "Envoyer un retour",
    description: "Dites-nous ce qui s’est passé ou ce que vous aimeriez voir.",
    kind: "De quoi s’agit-il ?",
    rating: "Comment s’est passée votre expérience ?",
    categories: "Thèmes",
    titleField: "Titre",
    titlePlaceholder: "Un résumé en quelques mots",
    message: "Message",
    messagePlaceholder: "Décrivez-le en quelques phrases",
    anonymous: "Envoyer anonymement",
    anonymousHint: "Votre nom ne sera pas joint à ce retour.",
    send: "Envoyer",
    sending: "Envoi en cours…",
    cancel: "Annuler",
    close: "Fermer",
    sendAnother: "Envoyer un autre",
    successTitle: "Merci",
    successDescription: "Votre retour a bien été envoyé.",
    error: "Votre retour n’a pas pu être envoyé. Veuillez réessayer.",
    counter: "{count}/{max}",
    contextNote: "La page et la version de l’application sont jointes.",
    errorRequired: "Ce champ est obligatoire.",
    errorTooLong: "Limitez-vous à {max} caractères.",
    errorOutOfRange: "Choisissez une valeur dans l’échelle.",
    errorUnknownOption: "Choisissez l’une des options.",
    trigger: "Signaler",
  },
}

/** The labels for a locale (unknown locale: English), with a partial override on top. Undefined overrides are ignored. */
export function feedbackLabels(
  locale: "en" | "fr" = "en",
  overrides?: Partial<FeedbackLabels>
): FeedbackLabels {
  const base = FEEDBACK_LABELS[locale] ?? FEEDBACK_LABELS.en
  const merged: FeedbackLabels = { ...base }
  if (overrides) {
    for (const key of Object.keys(overrides) as (keyof FeedbackLabels)[]) {
      const value = overrides[key]
      if (value !== undefined) merged[key] = value
    }
  }
  return merged
}

/** The `{count}/{max}` counter text. */
export function formatFeedbackCounter(
  labels: FeedbackLabels,
  count: number,
  max: number
): string {
  return labels.counter.replace("{count}", String(count)).replace("{max}", String(max))
}

/** The validation message for an error code; `max` fills `{max}` of `errorTooLong`. */
export function feedbackErrorMessage(
  labels: FeedbackLabels,
  code: FeedbackErrorCode,
  max?: number
): string {
  const text = {
    required: labels.errorRequired,
    tooLong: labels.errorTooLong,
    outOfRange: labels.errorOutOfRange,
    unknownOption: labels.errorUnknownOption,
  }[code]
  return text.replace("{max}", String(max ?? ""))
}

/** The ready-made kinds: bug, feature, improvement, question. */
export function feedbackKindPresets(locale: "en" | "fr" = "en"): FeedbackOption[] {
  const fr = locale === "fr"
  return [
    { value: "bug", label: fr ? "Bug" : "Bug" },
    { value: "feature", label: fr ? "Nouvelle fonctionnalité" : "Feature request" },
    { value: "improvement", label: fr ? "Amélioration" : "Improvement" },
    { value: "question", label: fr ? "Question" : "Question" },
  ]
}
