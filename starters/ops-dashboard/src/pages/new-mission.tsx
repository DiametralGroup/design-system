import { EnvelopeSimpleIcon, FloppyDiskIcon, WarningIcon } from "@phosphor-icons/react"
import {
  Alert,
  AlertDescription,
  AlertTitle,
  Autocomplete,
  AutocompleteContent,
  AutocompleteEmpty,
  AutocompleteInput,
  AutocompleteItem,
  AutocompleteList,
  Button,
  ButtonGroup,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Checkbox,
  CheckboxGroup,
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  DateRangePicker,
  type DateRange,
  DescriptionDetail,
  DescriptionList,
  DescriptionTerm,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Field,
  FieldArray,
  FieldArrayAdd,
  FieldArrayItem,
  FieldArrayItemContent,
  FieldArrayRemove,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
  FieldTitle,
  FileUpload,
  FileUploadDescription,
  FileUploadIcon,
  FileUploadTitle,
  Form,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  Label,
  MultiSelect,
  NumberField,
  NumberFieldDecrement,
  NumberFieldGroup,
  NumberFieldIncrement,
  NumberFieldInput,
  PageHeader,
  PageHeaderActions,
  PageHeaderDescription,
  PageHeaderHeading,
  PageHeaderTitle,
  PhoneInput,
  RadioGroup,
  RadioGroupItem,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Slider,
  Switch,
  TagsInput,
  Textarea,
  Wizard,
  toast,
} from "@diametral/design-system/react"
import { useState } from "react"

type Client = { value: string; label: string; sector: string }

const CLIENTS: Client[] = [
  { value: "cli_lumen", label: "Lumen SA", sector: "Energy" },
  { value: "cli_ardent", label: "Ardent Bank", sector: "Banking" },
  { value: "cli_norvia", label: "Norvia Logistics", sector: "Transport" },
  { value: "cli_helio", label: "Helio Santé", sector: "Healthcare" },
  { value: "cli_vauban", label: "Groupe Vauban", sector: "Construction" },
  { value: "cli_orsay", label: "Orsay Retail", sector: "Retail" },
]

const CITIES = [
  "Paris", "Lyon", "Marseille", "Toulouse", "Bordeaux", "Lille", "Nantes",
  "Strasbourg", "Bruxelles", "Genève", "Luxembourg", "Montréal",
]

const CONSULTANTS = [
  { value: "cr", label: "Camille Roux" },
  { value: "am", label: "Augustin Morval" },
  { value: "dt", label: "Diane Tessier" },
  { value: "ym", label: "Yanis Mercier" },
  { value: "lb", label: "Léa Bonnet" },
  { value: "hk", label: "Hugo Kessler" },
  { value: "sn", label: "Sofia Nguyen" },
]
const LEADS = Object.fromEntries(CONSULTANTS.map((c) => [c.value, c.label]))

const ENGAGEMENTS = [
  { value: "tm", title: "Time & materials", description: "Billed on consumed days, monthly." },
  { value: "fixed", title: "Fixed price", description: "Committed scope, billed on milestones." },
  { value: "retainer", title: "Retainer", description: "Reserved capacity, flat monthly fee." },
] as const

const CADENCES = ["Monthly", "Milestones", "On delivery"] as const

const EXPENSES = [
  { value: "travel", label: "Travel" },
  { value: "lodging", label: "Lodging" },
  { value: "perdiem", label: "Per diem" },
]

const eur = new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 })
const date = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric" })

let nextId = 3

const initial = () => ({
  client: null as Client | null,
  contact: "",
  email: "",
  phone: "",
  city: "",
  title: "",
  engagement: "tm" as string,
  description: "",
  skills: ["Data strategy"] as string[],
  deliverables: [
    { id: 1, label: "Discovery report" },
    { id: 2, label: "" },
  ],
  remote: true,
  sow: null as File | null,
  lead: null as string | null,
  team: [] as string[],
  seniority: [3, 8],
  allocation: 80,
  approval: false,
  dates: { from: undefined, to: undefined } as DateRange,
  dayRate: 850 as number | null,
  days: 40 as number | null,
  cadence: "Monthly" as (typeof CADENCES)[number],
  expenses: ["travel"] as string[],
  confirmed: false,
})

type Mission = ReturnType<typeof initial>
type Errors = Partial<Record<string, string>>

function validate(step: number, m: Mission): Errors {
  const e: Errors = {}
  if (step === 0) {
    if (!m.client) e.client = "Pick a client."
    if (!m.contact.trim()) e.contact = "Enter the client contact."
    if (!/^\S+@\S+\.\S+$/.test(m.email)) e.email = "Enter a valid email address."
    if (!m.city.trim()) e.city = "Enter the mission city."
  }
  if (step === 1) {
    if (!m.title.trim()) e.title = "Give the mission a title."
    if (m.description.trim().length < 20) e.description = "Describe the scope in at least 20 characters."
    if (m.skills.length === 0) e.skills = "Add at least one skill."
    if (!m.deliverables.some((d) => d.label.trim())) e.deliverables = "List at least one deliverable."
  }
  if (step === 2) {
    if (!m.lead) e.lead = "Choose an engagement lead."
    if (m.team.length === 0) e.team = "Staff at least one consultant."
  }
  if (step === 3) {
    if (!m.dates.from || !m.dates.to) e.dates = "Pick a start and an end date."
    if (!m.dayRate || m.dayRate < 300) e.dayRate = "The day rate must be at least 300 €."
    if (!m.days || m.days < 1) e.days = "Estimate at least one day."
  }
  if (step === 4 && !m.confirmed) e.confirmed = "Confirm the client has approved the scope."
  return e
}

const STEP_COUNT = 5

function err(errors: Errors, key: string) {
  return errors[key] ? <FieldError>{errors[key]}</FieldError> : null
}

export default function NewMission() {
  const [m, setM] = useState(initial)
  const [active, setActive] = useState(0)
  const [errors, setErrors] = useState<Errors>({})
  const [confirmOpen, setConfirmOpen] = useState(false)

  const set = <K extends keyof Mission>(key: K, value: Mission[K]) => {
    setM((prev) => ({ ...prev, [key]: value }))
    if (errors[key]) setErrors(({ [key]: _, ...rest }) => rest)
  }

  const checkStep = (index: number) => {
    const found = validate(index, m)
    setErrors(found)
    return !Object.keys(found).length
  }

  const goTo = (index: number) => {
    setErrors({})
    setActive(index)
  }

  const finish = () => {
    for (let step = 0; step < STEP_COUNT; step++) {
      const found = validate(step, m)
      if (Object.keys(found).length) {
        setErrors(found)
        setActive(step)
        return
      }
    }
    setConfirmOpen(true)
  }

  const submit = () => {
    setConfirmOpen(false)
    toast.add({
      type: "success",
      title: "Mission created",
      description: `${m.title} for ${m.client?.label} is now in Planning.`,
    })
    setM(initial())
    setErrors({})
    setActive(0)
  }

  const total = (m.dayRate ?? 0) * (m.days ?? 0)
  const errorList = Object.values(errors).filter(Boolean)
  const invalid = (key: string) => (errors[key] ? true : undefined)

  const clientStep = (
    <FieldGroup className="grid gap-6 md:grid-cols-2">
      <Field data-invalid={invalid("client")} className="md:col-span-2">
        <FieldLabel htmlFor="nm-client">Client</FieldLabel>
        <Combobox items={CLIENTS} value={m.client} onValueChange={(value) => set("client", value)}>
          <ComboboxInput id="nm-client" placeholder="Search 248 clients…" showClear aria-invalid={invalid("client")} />
          <ComboboxContent>
            <ComboboxEmpty>No client found.</ComboboxEmpty>
            <ComboboxList>
              {(item: Client) => (
                <ComboboxItem key={item.value} value={item}>
                  {item.label}
                  <span className="ms-auto text-xs text-muted-foreground">{item.sector}</span>
                </ComboboxItem>
              )}
            </ComboboxList>
          </ComboboxContent>
        </Combobox>
        {err(errors, "client") ?? <FieldDescription>Only active accounts are listed.</FieldDescription>}
      </Field>
      <Field data-invalid={invalid("contact")}>
        <FieldLabel htmlFor="nm-contact">Client contact</FieldLabel>
        <Input
          id="nm-contact"
          placeholder="Diane Tessier"
          value={m.contact}
          onChange={(e) => set("contact", e.target.value)}
          aria-invalid={invalid("contact")}
        />
        {err(errors, "contact")}
      </Field>
      <Field data-invalid={invalid("email")}>
        <FieldLabel htmlFor="nm-email">Contact email</FieldLabel>
        <InputGroup>
          <InputGroupAddon>
            <EnvelopeSimpleIcon />
          </InputGroupAddon>
          <InputGroupInput
            id="nm-email"
            type="email"
            placeholder="diane@lumen.fr"
            value={m.email}
            onChange={(e) => set("email", e.target.value)}
            aria-invalid={invalid("email")}
          />
        </InputGroup>
        {err(errors, "email")}
      </Field>
      <Field>
        <FieldLabel htmlFor="mission-phone">Contact phone</FieldLabel>
        <PhoneInput id="mission-phone" value={m.phone} onValueChange={(value) => set("phone", value)} />
        <FieldDescription>Optional.</FieldDescription>
      </Field>
      <Field data-invalid={invalid("city")}>
        <FieldLabel htmlFor="nm-city">Mission city</FieldLabel>
        <Autocomplete items={CITIES} value={m.city} onValueChange={(value) => set("city", value)}>
          <AutocompleteInput id="nm-city" placeholder="Start typing…" showClear aria-invalid={invalid("city")} />
          <AutocompleteContent>
            <AutocompleteEmpty>No suggestion — keep typing to use your own.</AutocompleteEmpty>
            <AutocompleteList>
              {(city: string) => (
                <AutocompleteItem key={city} value={city}>
                  {city}
                </AutocompleteItem>
              )}
            </AutocompleteList>
          </AutocompleteContent>
        </Autocomplete>
        {err(errors, "city")}
      </Field>
    </FieldGroup>
  )

  const scopeStep = (
    <FieldGroup className="grid gap-6 md:grid-cols-2">
      <Field data-invalid={invalid("title")} className="md:col-span-2">
        <FieldLabel htmlFor="nm-title">Mission title</FieldLabel>
        <Input
          id="nm-title"
          placeholder="Data platform audit"
          value={m.title}
          onChange={(e) => set("title", e.target.value)}
          aria-invalid={invalid("title")}
        />
        {err(errors, "title")}
      </Field>
      <FieldSet className="md:col-span-2">
        <FieldLegend variant="label">Engagement model</FieldLegend>
        <RadioGroup
          value={m.engagement}
          onValueChange={(value) => set("engagement", value as string)}
          className="grid gap-3 md:grid-cols-3"
        >
          {ENGAGEMENTS.map((option) => (
            <FieldLabel key={option.value} htmlFor={`nm-eng-${option.value}`}>
              <Field orientation="horizontal">
                <RadioGroupItem id={`nm-eng-${option.value}`} value={option.value} />
                <FieldContent>
                  <FieldTitle>{option.title}</FieldTitle>
                  <FieldDescription>{option.description}</FieldDescription>
                </FieldContent>
              </Field>
            </FieldLabel>
          ))}
        </RadioGroup>
      </FieldSet>
      <Field data-invalid={invalid("description")} className="md:col-span-2">
        <FieldLabel htmlFor="nm-description">Scope</FieldLabel>
        <Textarea
          id="nm-description"
          rows={4}
          placeholder="Objectives, constraints, success criteria…"
          value={m.description}
          onChange={(e) => set("description", e.target.value)}
          aria-invalid={invalid("description")}
        />
        {err(errors, "description") ?? <FieldDescription>{m.description.trim().length} / 20 characters minimum.</FieldDescription>}
      </Field>
      <Field data-invalid={invalid("skills")}>
        <FieldLabel id="nm-skills-label">Required skills</FieldLabel>
        <TagsInput
          value={m.skills}
          onValueChange={(value) => set("skills", value)}
          placeholder="Add a skill…"
          max={8}
          aria-labelledby="nm-skills-label"
        />
        {err(errors, "skills") ?? <FieldDescription>Press Enter or comma to add. Up to 8.</FieldDescription>}
      </Field>
      <Field orientation="horizontal" className="self-start">
        <FieldContent>
          <FieldLabel htmlFor="nm-remote">Remote-friendly</FieldLabel>
          <FieldDescription>Consultants may work up to 3 days a week off-site.</FieldDescription>
        </FieldContent>
        <Switch id="nm-remote" checked={m.remote} onCheckedChange={(checked) => set("remote", checked)} />
      </Field>
      <FieldSet data-invalid={invalid("deliverables")}>
        <FieldLegend variant="label">Deliverables</FieldLegend>
        <FieldArray>
          {m.deliverables.map((d, index) => (
            <FieldArrayItem key={d.id}>
              <FieldArrayItemContent>
                <Label htmlFor={`nm-deliv-${d.id}`} className="sr-only">
                  Deliverable {index + 1}
                </Label>
                <Input
                  id={`nm-deliv-${d.id}`}
                  placeholder={`Deliverable ${index + 1}`}
                  value={d.label}
                  onChange={(e) =>
                    set("deliverables", m.deliverables.map((row) => (row.id === d.id ? { ...row, label: e.target.value } : row)))
                  }
                  aria-invalid={invalid("deliverables")}
                />
              </FieldArrayItemContent>
              {m.deliverables.length > 1 && (
                <FieldArrayRemove
                  label={`Remove deliverable ${index + 1}`}
                  onClick={() => set("deliverables", m.deliverables.filter((row) => row.id !== d.id))}
                />
              )}
            </FieldArrayItem>
          ))}
          <FieldArrayAdd onClick={() => set("deliverables", [...m.deliverables, { id: nextId++, label: "" }])}>
            Add a deliverable
          </FieldArrayAdd>
        </FieldArray>
        {err(errors, "deliverables")}
      </FieldSet>
      <Field>
        <FieldLabel>Statement of work</FieldLabel>
        <FileUpload
          accept="application/pdf"
          aria-label="Upload the statement of work (PDF)"
          onFiles={(files) => set("sow", files[0] ?? null)}
        >
          <FileUploadIcon />
          <FileUploadTitle>{m.sow ? m.sow.name : "Drop the signed SoW"}</FileUploadTitle>
          <FileUploadDescription>PDF only. Optional at this stage.</FileUploadDescription>
        </FileUpload>
      </Field>
    </FieldGroup>
  )

  const teamStep = (
    <FieldGroup className="grid gap-6 md:grid-cols-2">
      <Field data-invalid={invalid("lead")}>
        <FieldLabel id="nm-lead-label">Engagement lead</FieldLabel>
        <Select items={LEADS} value={m.lead} onValueChange={(value) => set("lead", value)}>
          <SelectTrigger className="w-full" aria-labelledby="nm-lead-label" aria-invalid={invalid("lead")}>
            <SelectValue placeholder="Pick a partner" />
          </SelectTrigger>
          <SelectContent>
            {CONSULTANTS.map((c) => (
              <SelectItem key={c.value} value={c.value}>
                {c.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {err(errors, "lead")}
      </Field>
      <Field data-invalid={invalid("team")}>
        <FieldLabel id="nm-team-label">Consultants</FieldLabel>
        <MultiSelect
          options={CONSULTANTS.filter((c) => c.value !== m.lead)}
          value={m.team}
          onValueChange={(value) => set("team", value)}
          placeholder="Add consultants…"
          aria-labelledby="nm-team-label"
        />
        {err(errors, "team")}
      </Field>
      <Field>
        <FieldLabel id="nm-seniority-label">
          Seniority — {m.seniority[0]} to {m.seniority[1]} years
        </FieldLabel>
        <Slider
          value={m.seniority}
          min={0}
          max={20}
          onValueChange={(value) => set("seniority", value as number[])}
          aria-labelledby="nm-seniority-label"
        />
        <FieldDescription>Used to suggest available profiles.</FieldDescription>
      </Field>
      <Field>
        <FieldLabel id="nm-allocation-label">Allocation — {m.allocation}%</FieldLabel>
        <Slider
          value={m.allocation}
          min={20}
          max={100}
          step={10}
          onValueChange={(value) => set("allocation", value as number)}
          aria-labelledby="nm-allocation-label"
        />
        <FieldDescription>{(m.allocation / 20).toFixed(1)} days a week per consultant.</FieldDescription>
      </Field>
      <Field orientation="horizontal" className="md:col-span-2">
        <Checkbox id="nm-approval" checked={m.approval} onCheckedChange={(checked) => set("approval", checked)} />
        <FieldLabel htmlFor="nm-approval">Staffing needs partner approval before kick-off</FieldLabel>
      </Field>
    </FieldGroup>
  )

  const budgetStep = (
    <FieldGroup className="grid gap-6 md:grid-cols-2">
      <Field data-invalid={invalid("dates")} className="md:col-span-2">
        <FieldLabel htmlFor="mission-dates">Mission dates</FieldLabel>
        <DateRangePicker id="mission-dates" aria-invalid={invalid("dates")} value={m.dates} onValueChange={(value) => set("dates", value)} className="w-full md:w-72" />
        {err(errors, "dates")}
      </Field>
      <Field data-invalid={invalid("dayRate")}>
        <FieldLabel id="nm-rate-label">Day rate</FieldLabel>
        <NumberField
          value={m.dayRate}
          onValueChange={(value) => set("dayRate", value)}
          min={0}
          step={50}
          format={{ style: "currency", currency: "EUR", maximumFractionDigits: 0 }}
        >
          <NumberFieldGroup>
            <NumberFieldDecrement />
            <NumberFieldInput aria-labelledby="nm-rate-label" aria-invalid={invalid("dayRate")} />
            <NumberFieldIncrement />
          </NumberFieldGroup>
        </NumberField>
        {err(errors, "dayRate") ?? <FieldDescription>Grid rate for this seniority: 800–950 €.</FieldDescription>}
      </Field>
      <Field data-invalid={invalid("days")}>
        <FieldLabel id="nm-days-label">Estimated days</FieldLabel>
        <NumberField value={m.days} onValueChange={(value) => set("days", value)} min={0} max={999}>
          <NumberFieldGroup>
            <NumberFieldDecrement />
            <NumberFieldInput aria-labelledby="nm-days-label" aria-invalid={invalid("days")} />
            <NumberFieldIncrement />
          </NumberFieldGroup>
        </NumberField>
        {err(errors, "days")}
      </Field>
      <Field>
        <FieldLabel id="nm-cadence-label">Invoicing cadence</FieldLabel>
        <ButtonGroup aria-labelledby="nm-cadence-label" className="w-full">
          {CADENCES.map((cadence) => (
            <Button
              key={cadence}
              type="button"
              variant={m.cadence === cadence ? "default" : "outline"}
              aria-pressed={m.cadence === cadence}
              onClick={() => set("cadence", cadence)}
              className="flex-1 px-3"
            >
              {cadence}
            </Button>
          ))}
        </ButtonGroup>
      </Field>
      <FieldSet>
        <FieldLegend variant="label">Re-billable expenses</FieldLegend>
        <CheckboxGroup value={m.expenses} onValueChange={(value) => set("expenses", value)} className="flex flex-row flex-wrap gap-6">
          {EXPENSES.map((x) => (
            <Field key={x.value} orientation="horizontal" className="w-auto">
              <Checkbox id={`nm-exp-${x.value}`} value={x.value} />
              <FieldLabel htmlFor={`nm-exp-${x.value}`}>{x.label}</FieldLabel>
            </Field>
          ))}
        </CheckboxGroup>
      </FieldSet>
    </FieldGroup>
  )

  const people = (ids: string[]) => ids.map((id) => LEADS[id]).join(", ") || "—"
  const reviewStep = (
    <div className="flex flex-col gap-6">
      <DescriptionList>
        <DescriptionTerm>Client</DescriptionTerm>
        <DescriptionDetail>{m.client?.label ?? "—"}</DescriptionDetail>
        <DescriptionTerm>Contact</DescriptionTerm>
        <DescriptionDetail className="flex-wrap gap-x-2">
          {m.contact || "—"} <span className="text-muted-foreground">{m.email}</span>
          {m.phone && <span className="text-muted-foreground">{m.phone}</span>}
        </DescriptionDetail>
        <DescriptionTerm>City</DescriptionTerm>
        <DescriptionDetail>{m.city || "—"}{m.remote ? " · remote-friendly" : ""}</DescriptionDetail>
        <DescriptionTerm>Mission</DescriptionTerm>
        <DescriptionDetail>{m.title || "—"}</DescriptionDetail>
        <DescriptionTerm>Model</DescriptionTerm>
        <DescriptionDetail>{ENGAGEMENTS.find((e) => e.value === m.engagement)?.title}</DescriptionDetail>
        <DescriptionTerm>Skills</DescriptionTerm>
        <DescriptionDetail>{m.skills.join(", ") || "—"}</DescriptionDetail>
        <DescriptionTerm>Deliverables</DescriptionTerm>
        <DescriptionDetail>{m.deliverables.filter((d) => d.label.trim()).map((d) => d.label).join(", ") || "—"}</DescriptionDetail>
        <DescriptionTerm>SoW</DescriptionTerm>
        <DescriptionDetail>{m.sow?.name ?? "Not attached"}</DescriptionDetail>
        <DescriptionTerm>Lead</DescriptionTerm>
        <DescriptionDetail>{m.lead ? LEADS[m.lead] : "—"}</DescriptionDetail>
        <DescriptionTerm>Team</DescriptionTerm>
        <DescriptionDetail>{people(m.team)} · {m.allocation}%</DescriptionDetail>
        <DescriptionTerm>Dates</DescriptionTerm>
        <DescriptionDetail>
          {m.dates.from && m.dates.to ? `${date.format(m.dates.from)} – ${date.format(m.dates.to)}` : "—"}
        </DescriptionDetail>
        <DescriptionTerm>Budget</DescriptionTerm>
        <DescriptionDetail>
          {m.days ?? 0} d × {eur.format(m.dayRate ?? 0)} = {eur.format(total)}
        </DescriptionDetail>
        <DescriptionTerm>Invoicing</DescriptionTerm>
        <DescriptionDetail>
          {m.cadence}
          {m.expenses.length ? ` · expenses: ${m.expenses.join(", ")}` : ""}
        </DescriptionDetail>
      </DescriptionList>
      <Field orientation="horizontal" data-invalid={invalid("confirmed")}>
        <Checkbox
          id="nm-confirm"
          checked={m.confirmed}
          onCheckedChange={(checked) => set("confirmed", checked)}
          aria-invalid={invalid("confirmed")}
        />
        <FieldLabel htmlFor="nm-confirm">The client has approved this scope and budget</FieldLabel>
      </Field>
      {err(errors, "confirmed")}
    </div>
  )

  return (
    <div className="flex flex-col gap-6">
      <PageHeader>
        <PageHeaderHeading>
          <div className="flex flex-col gap-1">
            <PageHeaderTitle>New mission</PageHeaderTitle>
            <PageHeaderDescription>Scope, staff and price a consulting engagement in five steps.</PageHeaderDescription>
          </div>
          <PageHeaderActions>
            <Button
              variant="outline"
              size="sm"
              onClick={() => toast.add({ title: "Draft saved", description: "You can resume it from Projects." })}
            >
              <FloppyDiskIcon /> Save draft
            </Button>
          </PageHeaderActions>
        </PageHeaderHeading>
      </PageHeader>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_18rem]">
        <Form onSubmit={(e) => e.preventDefault()} className="min-w-0">
          <Wizard
            label="New mission steps"
            active={active}
            onStepChange={goTo}
            onBeforeNext={checkStep}
            onFinish={finish}
            finishLabel="Create mission"
            steps={[
              { label: "Client", content: clientStep },
              { label: "Scope", content: scopeStep },
              { label: "Team", content: teamStep },
              { label: "Budget", content: budgetStep },
              { label: "Review", content: reviewStep },
            ].map((step) => ({
              ...step,
              content: (
                <div className="flex flex-col gap-6">
                  {errorList.length > 0 && (
                    <Alert tone="danger" role="alert">
                      <WarningIcon />
                      <AlertTitle>
                        {errorList.length === 1 ? "1 field needs attention" : `${errorList.length} fields need attention`}
                      </AlertTitle>
                      <AlertDescription>
                        <ul className="list-disc ps-4">
                          {errorList.map((message) => (
                            <li key={message}>{message}</li>
                          ))}
                        </ul>
                      </AlertDescription>
                    </Alert>
                  )}
                  {step.content}
                </div>
              ),
            }))}
          />
        </Form>

        <Card size="sm" className="self-start">
          <CardHeader>
            <CardTitle>Estimate</CardTitle>
            <CardDescription>Updates as you fill the form.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-1">
            <span className="font-heading text-2xl font-semibold tabular-nums">{eur.format(total)}</span>
            <span className="text-xs text-muted-foreground">
              {m.days ?? 0} days × {eur.format(m.dayRate ?? 0)} · {m.team.length + (m.lead ? 1 : 0)} people
            </span>
          </CardContent>
        </Card>
      </div>

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create this mission?</DialogTitle>
            <DialogDescription>
              {m.title} for {m.client?.label} — {eur.format(total)} over {m.days} days. The team will be notified and the
              mission added to Planning.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose render={<Button variant="outline" />}>Keep editing</DialogClose>
            <Button onClick={submit}>Create mission</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
