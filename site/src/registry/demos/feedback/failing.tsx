import {
  FeedbackDialog,
  FeedbackTrigger,
  feedbackKindPresets,
} from "@diametral/design-system/react"

export default function FeedbackDialogFailing() {
  return (
    <FeedbackDialog
      locale="fr"
      trigger={<FeedbackTrigger locale="fr" variant="outline" />}
      config={{
        kinds: feedbackKindPresets("fr"),
        defaultKind: "bug",
        message: { maxLength: 300 },
      }}
      getErrorMessage={(error) =>
        error instanceof Error ? error.message : undefined
      }
      onSubmit={async () => {
        await new Promise((resolve) => setTimeout(resolve, 300))
        throw new Error("Le serveur ne répond pas. Réessayez dans un instant.")
      }}
    />
  )
}
