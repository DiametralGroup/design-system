import { Signal } from "@diametral/design-system/react"
export default function SignalBasic() {
  return (
    <div className="flex flex-wrap items-center gap-6">
      <Signal tone="done">Done</Signal>
      <Signal tone="progress">In progress</Signal>
      <Signal tone="blocked">Blocked</Signal>
      <Signal tone="warn">At risk</Signal>
      <Signal tone="idle">Not started</Signal>
      <Signal tone="empty">No status</Signal>
      <Signal tone="warn" square>Weather: watch</Signal>
    </div>
  )
}
