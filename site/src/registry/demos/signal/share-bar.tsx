import { Signal, SignalBar, SignalRow } from "@diametral/design-system/react"

/* A portfolio at a glance: the bar splits every stream by status, and each
   project row repeats its own streams as bare dots. */
export default function SignalShareBar() {
  return (
    <div className="flex w-full max-w-xl flex-col gap-6">
      <SignalBar
        segments={[
          { tone: "blocked", value: 2, label: "Blocked" },
          { tone: "progress", value: 7, label: "In progress" },
          { tone: "idle", value: 3, label: "Not started" },
          { tone: "done", value: 3, label: "Done" },
          { tone: "empty", value: 9, label: "No status" },
        ]}
      />
      <div className="flex items-center justify-between gap-4">
        <span>Insight 360</span>
        <SignalRow>
          <Signal tone="progress" title="LinkedIn: in progress" />
          <Signal tone="blocked" title="Staffing: blocked" />
          <Signal tone="done" title="Access control: done" />
          <Signal tone="empty" title="Governance: no status" />
        </SignalRow>
      </div>
    </div>
  )
}
