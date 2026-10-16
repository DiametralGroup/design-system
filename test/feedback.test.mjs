// Unit tests for the framework-free Feedback core (react/lib/feedback.ts),
// run against the compiled output exactly as a non-React consumer imports it.
// `npm run test:unit` builds first.
import { test } from "node:test"
import assert from "node:assert/strict"

import {
  FEEDBACK_LABELS,
  buildFeedbackPayload,
  captureFeedbackContext,
  emptyFeedbackDraft,
  feedbackErrorMessage,
  feedbackKindPresets,
  feedbackLabels,
  formatFeedbackCounter,
  validateFeedback,
} from "../dist/react/lib/feedback.js"

const kinds = [
  { value: "bug", label: "Bug" },
  { value: "feature", label: "Feature" },
]
const categories = [
  { value: "ui", label: "UI" },
  { value: "perf", label: "Performance" },
  { value: "other", label: "Other" },
]
const ophelie = {
  kinds,
  title: { required: true, maxLength: 200 },
  message: { required: true, maxLength: 5000 },
}
const scorecard = {
  rating: { max: 5, required: true, labels: ["Terrible", "Bad", "Okay", "Good", "Excellent"] },
  categories,
  message: { required: false, maxLength: 500 },
  allowAnonymous: true,
}
const ctx = { route: "/x" }

test("the core module has no import of React", async () => {
  const { readFile } = await import("node:fs/promises")
  const source = await readFile(new URL("../dist/react/lib/feedback.js", import.meta.url), "utf8")
  assert.doesNotMatch(source, /from\s+["']react/)
  assert.doesNotMatch(source, /require\(["']react/)
})

test("emptyFeedbackDraft follows the config", () => {
  assert.deepEqual(emptyFeedbackDraft({}), {
    rating: null,
    categories: [],
    title: "",
    message: "",
    anonymous: false,
  })
  assert.equal(emptyFeedbackDraft(ophelie).kind, undefined)
  assert.equal(emptyFeedbackDraft({ kinds, defaultKind: "feature" }).kind, "feature")
  // A default that is not one of the kinds is ignored.
  assert.equal(emptyFeedbackDraft({ kinds, defaultKind: "nope" }).kind, undefined)
  // No kinds configured: defaultKind is meaningless.
  assert.equal(emptyFeedbackDraft({ defaultKind: "bug" }).kind, undefined)
})

test("validateFeedback: required", () => {
  const draft = emptyFeedbackDraft(ophelie)
  const result = validateFeedback(draft, ophelie)
  assert.equal(result.valid, false)
  assert.deepEqual(result.errors, { kind: "required", title: "required", message: "required" })

  const rating = validateFeedback(emptyFeedbackDraft(scorecard), scorecard)
  assert.deepEqual(rating.errors, { rating: "required" })
})

test("validateFeedback: whitespace only counts as empty", () => {
  const draft = { ...emptyFeedbackDraft(ophelie), kind: "bug", title: "   ", message: "\n\t " }
  assert.deepEqual(validateFeedback(draft, ophelie).errors, { title: "required", message: "required" })
})

test("validateFeedback: message is required by default, optional when told so", () => {
  assert.deepEqual(validateFeedback(emptyFeedbackDraft({}), {}).errors, { message: "required" })
  assert.equal(validateFeedback(emptyFeedbackDraft({}), { message: { required: false } }).valid, true)
})

test("validateFeedback: tooLong, measured after trim", () => {
  const config = { message: { maxLength: 5 }, title: { maxLength: 3 } }
  const base = emptyFeedbackDraft(config)
  assert.deepEqual(
    validateFeedback({ ...base, message: "123456", title: "1234" }, config).errors,
    { message: "tooLong", title: "tooLong" }
  )
  assert.equal(validateFeedback({ ...base, message: "  12345  ", title: " 123 " }, config).valid, true)
})

test("validateFeedback: default limits are 5000 (message) and 200 (title)", () => {
  const config = { title: {} }
  const base = emptyFeedbackDraft(config)
  assert.equal(validateFeedback({ ...base, message: "a".repeat(5000) }, config).valid, true)
  assert.equal(validateFeedback({ ...base, message: "a".repeat(5001) }, config).errors.message, "tooLong")
  assert.equal(validateFeedback({ ...base, message: "m", title: "a".repeat(200) }, config).valid, true)
  assert.equal(validateFeedback({ ...base, message: "m", title: "a".repeat(201) }, config).errors.title, "tooLong")
})

test("validateFeedback: rating out of range", () => {
  const base = { ...emptyFeedbackDraft(scorecard), message: "ok" }
  for (const bad of [0, 6, -1, 2.5, Number.NaN]) {
    assert.equal(validateFeedback({ ...base, rating: bad }, scorecard).errors.rating, "outOfRange", String(bad))
  }
  for (const good of [1, 3, 5]) {
    assert.equal(validateFeedback({ ...base, rating: good }, scorecard).valid, true, String(good))
  }
  // max defaults to 5, and a custom max moves the ceiling.
  assert.equal(validateFeedback({ ...base, rating: 6 }, { rating: {} }).errors.rating, "outOfRange")
  assert.equal(validateFeedback({ ...base, rating: 10 }, { rating: { max: 10 } }).valid, true)
})

test("validateFeedback: an optional rating may stay empty", () => {
  const config = { rating: { required: false } }
  assert.equal(validateFeedback({ ...emptyFeedbackDraft(config), message: "ok" }, config).valid, true)
})

test("validateFeedback: unknown kind", () => {
  const draft = { ...emptyFeedbackDraft(ophelie), kind: "rant", title: "t", message: "m" }
  assert.deepEqual(validateFeedback(draft, ophelie).errors, { kind: "unknownOption" })
})

test("validateFeedback: fields the config lacks are never validated", () => {
  const draft = { ...emptyFeedbackDraft({}), message: "m", rating: 99, title: "x".repeat(999), kind: "zzz" }
  assert.equal(validateFeedback(draft, {}).valid, true)
})

test("buildFeedbackPayload: trims and keeps only the configured fields", () => {
  const draft = {
    ...emptyFeedbackDraft(ophelie),
    kind: "bug",
    title: "  Broken  ",
    message: "  It breaks.\n",
    rating: 3,
    categories: ["ui"],
    anonymous: true,
  }
  assert.deepEqual(buildFeedbackPayload(draft, ophelie, ctx), {
    kind: "bug",
    title: "Broken",
    message: "It breaks.",
    context: ctx,
  })
})

test("buildFeedbackPayload: anonymous only when allowed", () => {
  const base = { ...emptyFeedbackDraft(scorecard), rating: 4, message: "fine", anonymous: true }
  assert.equal(buildFeedbackPayload(base, scorecard, ctx).anonymous, true)
  assert.equal(buildFeedbackPayload({ ...base, anonymous: false }, scorecard, ctx).anonymous, false)
  const without = { ...scorecard, allowAnonymous: false }
  assert.equal("anonymous" in buildFeedbackPayload(base, without, ctx), false)
  assert.equal("anonymous" in buildFeedbackPayload(base, { ...scorecard, allowAnonymous: undefined }, ctx), false)
})

test("buildFeedbackPayload: the Scorecard shape", () => {
  const draft = {
    ...emptyFeedbackDraft(scorecard),
    rating: 5,
    categories: ["perf", "ui", "ghost"],
    message: "",
  }
  assert.deepEqual(buildFeedbackPayload(draft, scorecard, ctx), {
    rating: 5,
    categories: ["ui", "perf"],
    message: "",
    anonymous: false,
    context: ctx,
  })
})

test("buildFeedbackPayload: an optional title left empty is omitted, a configured empty category list is kept", () => {
  const config = { title: {}, categories }
  const payload = buildFeedbackPayload({ ...emptyFeedbackDraft(config), message: "m" }, config, ctx)
  assert.deepEqual(payload, { message: "m", categories: [], context: ctx })
})

test("buildFeedbackPayload: throws on an invalid draft, naming the fields", () => {
  assert.throws(
    () => buildFeedbackPayload(emptyFeedbackDraft(ophelie), ophelie, ctx),
    /kind \(required\).*title \(required\).*message \(required\)/
  )
})

test("captureFeedbackContext: without window (node) it still returns a context", () => {
  assert.equal(typeof globalThis.window, "undefined")
  assert.deepEqual(captureFeedbackContext(), { route: "" })
  assert.deepEqual(captureFeedbackContext({ appVersion: "1.2.3" }), { route: "", appVersion: "1.2.3" })
})

test("captureFeedbackContext: injected env", () => {
  const env = {
    location: { pathname: "/orders", search: "?page=2" },
    navigator: { userAgent: "UA/1", language: "fr-FR" },
    innerWidth: 1280,
    innerHeight: 720,
  }
  assert.deepEqual(captureFeedbackContext({ env, appVersion: "9" }), {
    route: "/orders?page=2",
    appVersion: "9",
    userAgent: "UA/1",
    locale: "fr-FR",
    viewport: "1280x720",
  })
})

test("captureFeedbackContext: a partial env leaves the other keys out", () => {
  assert.deepEqual(captureFeedbackContext({ env: { location: { pathname: "/a", search: "" } } }), { route: "/a" })
  assert.deepEqual(captureFeedbackContext({ env: { innerWidth: 10 } }), { route: "" })
})

test("captureFeedbackContext: an injected env is used even when a window exists", () => {
  globalThis.window = { location: { pathname: "/ambient", search: "" }, innerWidth: 1, innerHeight: 1 }
  try {
    assert.equal(captureFeedbackContext().route, "/ambient")
    assert.equal(captureFeedbackContext({ env: {} }).route, "")
  } finally {
    delete globalThis.window
  }
})

test("captureFeedbackContext: extra is merged last and may override", () => {
  const env = { location: { pathname: "/p", search: "" } }
  assert.deepEqual(captureFeedbackContext({ env, extra: { tenant: "acme", route: "#/hash" } }), {
    route: "#/hash",
    tenant: "acme",
  })
})

test("feedbackLabels: English by default, French on request, English for an unknown locale", () => {
  assert.equal(feedbackLabels().send, "Send")
  assert.equal(feedbackLabels("fr").send, "Envoyer")
  assert.equal(feedbackLabels("de").send, "Send")
})

test("feedbackLabels: partial override, undefined ignored, source untouched", () => {
  const labels = feedbackLabels("fr", { send: "Go", cancel: undefined })
  assert.equal(labels.send, "Go")
  assert.equal(labels.cancel, "Annuler")
  assert.equal(FEEDBACK_LABELS.fr.send, "Envoyer")
})

test("labels: en and fr define exactly the same keys, all non-empty strings", () => {
  assert.deepEqual(Object.keys(FEEDBACK_LABELS.en).sort(), Object.keys(FEEDBACK_LABELS.fr).sort())
  for (const locale of ["en", "fr"]) {
    for (const [key, value] of Object.entries(FEEDBACK_LABELS[locale])) {
      assert.equal(typeof value, "string", `${locale}.${key}`)
      assert.ok(value.length > 0, `${locale}.${key}`)
    }
  }
})

test("French typography: a no-break space before ? : and the {max} count", () => {
  for (const value of Object.values(FEEDBACK_LABELS.fr)) {
    assert.doesNotMatch(value, /[^ ] [?:!;»]/, value)
    assert.doesNotMatch(value, /[^ \s]\?/, value)
  }
  assert.match(FEEDBACK_LABELS.fr.kind, / \?$/)
  assert.match(feedbackErrorMessage(feedbackLabels("fr"), "tooLong", 500), /500 caractères/)
})

test("counter {count}/{max}", () => {
  assert.equal(formatFeedbackCounter(feedbackLabels(), 12, 500), "12/500")
  assert.equal(formatFeedbackCounter(feedbackLabels("fr"), 500, 500), "500/500")
  assert.equal(formatFeedbackCounter(feedbackLabels("en", { counter: "{count} of {max}" }), 1, 2), "1 of 2")
})

test("feedbackErrorMessage: one message per code, {max} filled", () => {
  const labels = feedbackLabels()
  for (const code of ["required", "tooLong", "outOfRange", "unknownOption"]) {
    assert.ok(feedbackErrorMessage(labels, code, 10).length > 0, code)
  }
  assert.match(feedbackErrorMessage(labels, "tooLong", 200), /200/)
  assert.doesNotMatch(feedbackErrorMessage(labels, "required"), /\{max\}/)
})

test("feedbackKindPresets: bug, feature, improvement, question in both languages", () => {
  for (const locale of ["en", "fr"]) {
    const presets = feedbackKindPresets(locale)
    assert.deepEqual(presets.map((p) => p.value), ["bug", "feature", "improvement", "question"])
    assert.ok(presets.every((p) => p.label))
  }
  assert.equal(feedbackKindPresets("fr")[2].label, "Amélioration")
  assert.deepEqual(feedbackKindPresets(), feedbackKindPresets("en"))
})
