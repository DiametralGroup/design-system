import * as React from "react"

import {
  FeedbackForm,
  type FeedbackConfig,
  type FeedbackPayload,
} from "@diametral/design-system/react"

const config: FeedbackConfig = {
  rating: {
    max: 5,
    required: true,
    labels: ["Terrible", "Bad", "Okay", "Good", "Excellent"],
  },
  categories: [
    { value: "ui", label: "UI / Design" },
    { value: "performance", label: "Performance" },
    { value: "features", label: "Features" },
    { value: "bug", label: "Bug" },
    { value: "other", label: "Other" },
  ],
  message: { required: false, maxLength: 500 },
  allowAnonymous: true,
}

export default function FeedbackInlinePage() {
  const [sent, setSent] = React.useState<FeedbackPayload>()

  return (
    <div className="flex w-full max-w-md flex-col gap-4">
      <FeedbackForm
        config={config}
        appVersion="5.0.0"
        onSubmit={async (payload) => {
          await new Promise((resolve) => setTimeout(resolve, 400))
          setSent(payload)
        }}
      />
      {sent && (
        <output className="block text-sm text-muted-foreground">
          {sent.rating}/5 — {sent.categories?.join(", ") || "no topic"}
          {sent.anonymous ? " — anonymous" : ""}
        </output>
      )}
    </div>
  )
}
