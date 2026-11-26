import * as React from "react"
import { createAgent } from "@diametral/design-system/agent"
import {
  Alert,
  AlertDescription,
  AlertTitle,
  Button,
  Label,
  Switch,
} from "@diametral/design-system/react"

const SETTINGS = [
  { id: "autosave", label: "Autosave" },
  { id: "notes", label: "Speaker notes" },
  { id: "share", label: "Share publicly" },
]
const LABELS = SETTINGS.map((setting) => setting.label)

// One bridge per page. Publishing is the person's call, so the agent is
// refused any step on "Share publicly".
const agent = createAgent({
  allow: (step) => step.label !== "Share publicly",
})

type Outcome = { tone: "success" | "danger"; title: string; text: string }

export default function SwitchAgent() {
  const [checked, setChecked] = React.useState<Record<string, boolean>>({
    autosave: false,
    notes: true,
    share: false,
  })
  const [changedBy, setChangedBy] = React.useState<string | null>(null)
  const [outcome, setOutcome] = React.useState<Outcome | null>(null)
  const [snapshot, setSnapshot] = React.useState("")

  const readPage = () => {
    const entries = agent
      .snapshot()
      .filter((entry) => entry.label && LABELS.includes(entry.label))
      .map(({ label, checked, actions }) => ({ label, checked, actions }))
    setSnapshot(JSON.stringify(entries, null, 2))
  }

  const run = async (id: string) => {
    const { label } = SETTINGS.find((setting) => setting.id === id)!
    const result = await agent.act({
      steps: [{ ref: label, action: "setChecked", args: [!checked[id]] }],
    })
    setOutcome(
      result.ok
        ? { tone: "success", title: "Done", text: `The agent toggled ${label}.` }
        : {
            tone: "danger",
            title: "Refused",
            text: `allow() blocked the agent: ${label} stays as it was. (${result.error?.message})`,
          }
    )
    readPage()
  }

  return (
    <div className="flex max-w-md flex-col gap-4">
      <div className="flex flex-col gap-3">
        {SETTINGS.map((setting) => (
          <div
            key={setting.id}
            className="flex items-center justify-between gap-3"
          >
            <Label htmlFor={`switch-agent-${setting.id}`}>
              {setting.label}
            </Label>
            <Switch
              id={`switch-agent-${setting.id}`}
              checked={checked[setting.id]}
              onCheckedChange={(next, details) => {
                setChecked((current) => ({ ...current, [setting.id]: next }))
                setChangedBy(
                  `${setting.label} turned ${next ? "on" : "off"} by ${
                    details.source === "agent" ? "the agent" : "you"
                  }`
                )
              }}
            />
          </div>
        ))}
      </div>

      <p className="text-sm" aria-live="polite">
        {changedBy ?? "No change yet."}
      </p>

      <div data-agent-hidden className="flex flex-wrap gap-2">
        <Button variant="outline" size="sm" onClick={readPage}>
          Read the page
        </Button>
        <Button variant="outline" size="sm" onClick={() => run("autosave")}>
          Agent: toggle Autosave
        </Button>
        <Button variant="outline" size="sm" onClick={() => run("share")}>
          Agent: toggle Share publicly
        </Button>
      </div>

      {outcome && (
        <Alert tone={outcome.tone} role="status">
          <AlertTitle>{outcome.title}</AlertTitle>
          <AlertDescription>{outcome.text}</AlertDescription>
        </Alert>
      )}

      {snapshot && (
        <pre
          aria-label="Agent snapshot"
          className="overflow-x-auto font-mono text-xs"
        >
          {snapshot}
        </pre>
      )}
    </div>
  )
}
