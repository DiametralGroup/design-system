import * as React from "react"

import {
  FeedbackDialog,
  FeedbackTrigger,
  type FeedbackConfig,
  type FeedbackPayload,
} from "@diametral/design-system/react"

const config: FeedbackConfig = {
  kinds: [
    { value: "bug", label: "Bug" },
    { value: "feature", label: "Feature" },
    { value: "improvement", label: "Improvement" },
    { value: "request", label: "Request" },
  ],
  title: { required: true, maxLength: 200 },
  message: { required: true, maxLength: 5000 },
}

export default function FeedbackDialogHeader() {
  const [sent, setSent] = React.useState<FeedbackPayload>()

  return (
    <div className="w-full max-w-2xl border">
      <header className="flex items-center justify-between border-b px-4 py-2">
        <span className="text-sm font-semibold">Ophélie</span>
        <FeedbackDialog
          trigger={<FeedbackTrigger />}
          config={config}
          appVersion="2.4.1"
          onSubmit={async (payload) => {
            await new Promise((resolve) => setTimeout(resolve, 400))
            setSent(payload)
          }}
        />
      </header>
      <div className="p-4 text-sm text-muted-foreground">
        {sent ? (
          <output>
            Sent: {sent.kind} — {sent.title} (from {sent.context.route})
          </output>
        ) : (
          "Nothing sent yet."
        )}
      </div>
    </div>
  )
}
