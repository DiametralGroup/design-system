import {
  CalendarBlankIcon,
  CalendarPlusIcon,
  CaretLeftIcon,
  CaretRightIcon,
  CrosshairIcon,
} from "@phosphor-icons/react"
import {
  type AgendaEvent,
  Agenda,
  Avatar,
  AvatarFallback,
  Button,
  Calendar,
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  DatePicker,
  DatePickerContent,
  DatePickerTrigger,
  type DateRange,
  DateRangePicker,
  DateTimePicker,
  Field,
  FieldDescription,
  FieldLabel,
  Input,
  PageHeader,
  PageHeaderActions,
  PageHeaderDescription,
  PageHeaderHeading,
  PageHeaderIcon,
  PageHeaderTitle,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Status,
  StatusIndicator,
  StatusLabel,
  TimePicker,
  type TimeValue,
  ToggleGroup,
  ToggleGroupItem,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  toast,
} from "@diametral/design-system/react"
import { type ReactNode, useState } from "react"

// Fixed so the mock schedule always lines up with "today".
const TODAY = new Date(2026, 8, 24)

const CONSULTANTS = {
  CR: "Camille Roux",
  AM: "Antoine Mercier",
  LB: "Léa Bernard",
  NK: "Nadia Kaci",
  TG: "Thomas Girard",
} as const
type ConsultantId = keyof typeof CONSULTANTS

const FILTER_ITEMS = { all: "Whole team", ...CONSULTANTS }

const AVAILABILITY: { id: ConsultantId; tone: "success" | "warning" | "info" | "neutral"; label: string; detail: string }[] = [
  { id: "CR", tone: "warning", label: "Staffed 90%", detail: "Lumen SA until 30 Nov, pre-sales on Fridays" },
  { id: "AM", tone: "warning", label: "Staffed 100%", detail: "Lumen SA and Maison Lefort, no capacity before November" },
  { id: "LB", tone: "info", label: "Staffed 60%", detail: "Groupe Arvor three days a week" },
  { id: "NK", tone: "success", label: "Available", detail: "Free from 1 October, ML and MLOps profile" },
  { id: "TG", tone: "neutral", label: "Time off", detail: "Back on Monday 28 September" },
]

type PlannedEvent = AgendaEvent & { id: number; who: ConsultantId }

const INITIAL: PlannedEvent[] = [
  { id: 1, who: "CR", date: "2026-09-21", time: "09:30", title: "Weekly steering · Lumen SA", meta: "Client site, Lyon", status: "info" },
  { id: 2, who: "AM", date: "2026-09-22", time: "14:00", title: "Data audit restitution · Maison Lefort", meta: "Visio", status: "info" },
  { id: 3, who: "LB", date: "2026-09-23", time: "10:00", title: "User tests · Groupe Arvor", meta: "5 field technicians", status: "success" },
  { id: 4, who: "CR", date: "2026-09-24", time: "09:00", title: "Pipeline review", meta: "Internal, 45 min", status: "neutral" },
  { id: 5, who: "NK", date: "2026-09-24", time: "11:30", title: "Churn model demo · Lumen SA", meta: "Sprint 2 review", status: "success" },
  { id: 6, who: "CR", date: "2026-09-24", time: "15:00", title: "Pitch · Norelec control tower", meta: "€59,400 opportunity", status: "warning" },
  { id: 7, who: "TG", date: "2026-09-25", time: "", title: "Time off", meta: "Thomas Girard", status: "neutral" },
  { id: 8, who: "AM", date: "2026-09-25", time: "16:00", title: "INV-2041 overdue follow-up", meta: "Cèdre Capital, 12 days late", status: "danger" },
  { id: 9, who: "LB", date: "2026-09-28", time: "09:30", title: "Design review · Field app", meta: "Groupe Arvor", status: "info" },
  { id: 10, who: "NK", date: "2026-10-01", time: "10:00", title: "Kick-off · Pricing engine audit", meta: "Vauban Assurances", status: "success" },
]

const pad = (n: number) => String(n).padStart(2, "0")
const iso = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
const parseIso = (s: string) => {
  const [y, m, d] = s.split("-").map(Number)
  return new Date(y, m - 1, d)
}
const addDays = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n)
const monday = (d: Date) => addDays(d, -((d.getDay() + 6) % 7))
const short = (d: Date) => d.toLocaleDateString("en-GB", { day: "numeric", month: "short" })

function IconTip({ label, onClick, children }: { label: string; onClick: () => void; children: ReactNode }) {
  return (
    <Tooltip>
      <TooltipTrigger render={<Button variant="outline" size="icon-sm" aria-label={label} onClick={onClick} />}>
        {children}
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  )
}

export default function Planning() {
  const [events, setEvents] = useState(INITIAL)
  const [day, setDay] = useState<Date>(TODAY)
  const [view, setView] = useState<"day" | "week">("week")
  const [filter, setFilter] = useState<string>("all")

  const [title, setTitle] = useState("")
  const [who, setWho] = useState<ConsultantId>("CR")
  const [date, setDate] = useState<Date | undefined>(addDays(TODAY, 1))
  const [dateOpen, setDateOpen] = useState(false)
  const [time, setTime] = useState<TimeValue>({ hours: 10, minutes: 0 })

  const [timeOff, setTimeOff] = useState<DateRange>({ from: undefined })
  const [reminder, setReminder] = useState<Date | undefined>()

  const start = view === "day" ? day : monday(day)
  const end = view === "day" ? day : addDays(start, 6)
  const visible = events.filter(
    (e) =>
      (filter === "all" || e.who === filter) &&
      (e.date as string) >= iso(start) &&
      (e.date as string) <= iso(end)
  )
  const busyDays = [...new Set(events.map((e) => e.date as string))].map(parseIso)
  const step = view === "day" ? 1 : 7

  const add = (items: Omit<PlannedEvent, "id">[], message: string) => {
    setEvents((list) => [...list, ...items.map((item, i) => ({ ...item, id: Date.now() + i }))])
    setDay(parseIso(items[0].date as string))
    toast.add({ title: "Added to the agenda", description: message })
  }

  const schedule = () => {
    if (!date || !title.trim()) return
    add(
      [
        {
          who,
          date: iso(date),
          time: `${pad(time.hours)}:${pad(time.minutes)}`,
          title: title.trim(),
          meta: CONSULTANTS[who],
          status: "info",
        },
      ],
      `${title.trim()} on ${short(date)}.`
    )
    setTitle("")
  }

  const requestTimeOff = () => {
    if (!timeOff.from) return
    const last = timeOff.to ?? timeOff.from
    const days: Omit<PlannedEvent, "id">[] = []
    for (let d = timeOff.from; d <= last; d = addDays(d, 1)) {
      if (d.getDay() % 6 !== 0) days.push({ who, date: iso(d), time: "", title: "Time off", meta: CONSULTANTS[who], status: "neutral" })
    }
    if (!days.length) return
    add(days, `${days.length} working day${days.length > 1 ? "s" : ""} for ${CONSULTANTS[who]}.`)
    setTimeOff({ from: undefined })
  }

  const setReminderEvent = () => {
    if (!reminder) return
    add(
      [
        {
          who,
          date: iso(reminder),
          time: `${pad(reminder.getHours())}:${pad(reminder.getMinutes())}`,
          title: "Timesheet reminder",
          meta: `Sent to ${CONSULTANTS[who]}`,
          status: "warning",
        },
      ],
      `Reminder on ${short(reminder)}.`
    )
    setReminder(undefined)
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader>
        <PageHeaderHeading>
          <div className="flex items-start gap-3">
            <PageHeaderIcon>
              <CalendarBlankIcon />
            </PageHeaderIcon>
            <div className="flex flex-col gap-1">
              <PageHeaderTitle>Planning</PageHeaderTitle>
              <PageHeaderDescription>Client meetings, kick-offs and team availability.</PageHeaderDescription>
            </div>
          </div>
          <PageHeaderActions className="flex-wrap">
            <Select items={FILTER_ITEMS} value={filter} onValueChange={(v) => setFilter(v ?? "all")}>
              <SelectTrigger size="sm" aria-label="Filter by consultant" className="w-44">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(FILTER_ITEMS).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <ToggleGroup
              variant="outline"
              size="sm"
              value={[view]}
              onValueChange={(v) => v[0] && setView(v[0] as "day" | "week")}
              aria-label="Agenda view"
            >
              <ToggleGroupItem value="day">Day</ToggleGroupItem>
              <ToggleGroupItem value="week">Week</ToggleGroupItem>
            </ToggleGroup>
          </PageHeaderActions>
        </PageHeaderHeading>
      </PageHeader>

      <div className="grid items-start gap-4 lg:grid-cols-[auto_minmax(0,1fr)]">
        <div className="flex flex-col gap-4">
          <Card size="sm">
            <CardContent className="flex justify-center">
              <Calendar
                mode="single"
                required
                selected={day}
                onSelect={setDay}
                month={day}
                onMonthChange={setDay}
                weekStartsOn={1}
                modifiers={{ busy: busyDays }}
                modifiersClassNames={{ busy: "font-semibold [&_button]:underline [&_button]:underline-offset-4" }}
              />
            </CardContent>
          </Card>

          <Card size="sm">
            <CardHeader>
              <CardTitle>Team availability</CardTitle>
              <CardDescription>Week of {short(monday(TODAY))}</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col">
              {AVAILABILITY.map((a) => (
                <div key={a.id} className="flex items-center gap-3 border-b border-border py-2 last:border-b-0">
                  <Avatar size="sm">
                    <AvatarFallback>{a.id}</AvatarFallback>
                  </Avatar>
                  <div className="flex min-w-0 flex-1 flex-col">
                    <span className="truncate text-sm">{CONSULTANTS[a.id]}</span>
                    <Tooltip>
                      <TooltipTrigger render={<button type="button" className="w-fit text-start outline-none focus-visible:ring-2 focus-visible:ring-ring/30" />}>
                        <Status tone={a.tone}>
                          <StatusIndicator pulse={a.tone === "success"} />
                          <StatusLabel>{a.label}</StatusLabel>
                        </Status>
                      </TooltipTrigger>
                      <TooltipContent>{a.detail}</TooltipContent>
                    </Tooltip>
                  </div>
                  <IconTip label={`Book ${CONSULTANTS[a.id]}`} onClick={() => setWho(a.id)}>
                    <CalendarPlusIcon />
                  </IconTip>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="flex min-w-0 flex-col gap-4">
          <Card>
            <CardHeader>
              <CardTitle>{view === "day" ? "Day agenda" : "Week agenda"}</CardTitle>
              <CardDescription>
                {view === "day"
                  ? day.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" })
                  : `${short(start)} – ${short(end)}`}{" "}
                · {visible.length} event{visible.length === 1 ? "" : "s"}
              </CardDescription>
              <CardAction className="flex gap-1">
                <IconTip label={view === "day" ? "Previous day" : "Previous week"} onClick={() => setDay(addDays(day, -step))}>
                  <CaretLeftIcon />
                </IconTip>
                <IconTip label="Back to today" onClick={() => setDay(TODAY)}>
                  <CrosshairIcon />
                </IconTip>
                <IconTip label={view === "day" ? "Next day" : "Next week"} onClick={() => setDay(addDays(day, step))}>
                  <CaretRightIcon />
                </IconTip>
              </CardAction>
            </CardHeader>
            <CardContent>
              <Agenda events={visible} locale="en-GB" emptyMessage="Nothing planned for this period." />
            </CardContent>
          </Card>

          <div className="grid gap-4 xl:grid-cols-2">
            <Card size="sm">
              <CardHeader>
                <CardTitle>Schedule a session</CardTitle>
                <CardDescription>Adds a meeting to the agenda.</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                <Field>
                  <FieldLabel htmlFor="session-title">Title</FieldLabel>
                  <Input
                    id="session-title"
                    placeholder="Workshop · Lumen SA"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </Field>
                <Field>
                  <FieldLabel>Consultant</FieldLabel>
                  <Select items={CONSULTANTS} value={who} onValueChange={(v) => v && setWho(v as ConsultantId)}>
                    <SelectTrigger aria-label="Consultant" className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(CONSULTANTS).map(([value, label]) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
                <div className="flex flex-wrap gap-4">
                  <Field className="w-fit">
                    <FieldLabel>Date</FieldLabel>
                    <DatePicker open={dateOpen} onOpenChange={setDateOpen}>
                      <DatePickerTrigger value={date} />
                      <DatePickerContent>
                        <Calendar
                          mode="single"
                          selected={date}
                          defaultMonth={date}
                          weekStartsOn={1}
                          disabled={{ before: TODAY }}
                          onSelect={(value) => {
                            setDate(value)
                            setDateOpen(false)
                          }}
                        />
                      </DatePickerContent>
                    </DatePicker>
                  </Field>
                  <Field className="w-fit">
                    <FieldLabel>Start</FieldLabel>
                    <TimePicker value={time} onValueChange={setTime} />
                  </Field>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={schedule} disabled={!date || !title.trim()}>
                  <CalendarPlusIcon /> Add to agenda
                </Button>
              </CardFooter>
            </Card>

            <Card size="sm">
              <CardHeader>
                <CardTitle>Requests for {CONSULTANTS[who]}</CardTitle>
                <CardDescription>Time off and timesheet reminders.</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                <Field>
                  <FieldLabel>Time off</FieldLabel>
                  <div className="flex flex-wrap items-center gap-2">
                    <DateRangePicker value={timeOff} onValueChange={setTimeOff} placeholder="Pick the days off" />
                    <Button variant="outline" onClick={requestTimeOff} disabled={!timeOff.from}>
                      Request
                    </Button>
                  </div>
                  <FieldDescription>Weekends are skipped automatically.</FieldDescription>
                </Field>
                <Field>
                  <FieldLabel>Timesheet reminder</FieldLabel>
                  <div className="flex flex-wrap items-center gap-2">
                    <DateTimePicker value={reminder} onChange={setReminder} min={TODAY} step={15} datePlaceholder="Pick a day" />
                    <Button variant="outline" onClick={setReminderEvent} disabled={!reminder}>
                      Set
                    </Button>
                  </div>
                  <FieldDescription>The time snaps to 15-minute steps.</FieldDescription>
                </Field>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
