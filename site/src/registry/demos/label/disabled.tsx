import { Input, Label, Textarea } from "@diametral/design-system/react"

/* Two ways a Label dims, both keyed to Tailwind's marker classes as in
   incoming: `.peer:disabled ~ .ds-label` catches a label that follows its own
   disabled control marked `peer`, and `.group[data-disabled="true"]` on an
   ancestor dims every label inside it — which is what a disabled field group
   wants, without marking each label.

   The sibling form has one constraint worth knowing: it needs the disabled
   element itself to be the previous sibling, so it works for `Input` and
   `Textarea` but not for a wrapped control. Use the ancestor form there. */
export default function LabelDisabled() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-6">
      {/* Control first: the sibling selector only looks backwards. */}
      <div className="flex flex-col-reverse gap-2">
        <Input
          id="label-disabled-key"
          className="peer"
          defaultValue="ssh-ed25519 AAAA…"
          disabled
        />
        <Label htmlFor="label-disabled-key">Deploy key (locked)</Label>
      </div>
      {/* Label first, dimmed from the group instead. Works for any control,
          wrapped ones included. */}
      <div className="group flex flex-col gap-2" data-disabled="true">
        <Label htmlFor="label-disabled-notes">Internal notes</Label>
        <Textarea id="label-disabled-notes" rows={2} disabled />
      </div>
    </div>
  )
}
