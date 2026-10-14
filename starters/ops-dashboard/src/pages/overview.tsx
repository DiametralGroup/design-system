import { useState } from "react"
import {
  CalendarCheckIcon,
  DownloadSimpleIcon,
  FileTextIcon,
  HandshakeIcon,
  InfoIcon,
  PlusIcon,
  UserPlusIcon,
  WarningIcon,
} from "@phosphor-icons/react"
import {
  Alert,
  AlertAction,
  AlertDescription,
  AlertTitle,
  AreaChart,
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  Badge,
  Banner,
  BannerAction,
  BannerContent,
  BannerDescription,
  BannerTitle,
  Button,
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Gauge,
  Meter,
  MeterLabel,
  MeterValue,
  PageHeader,
  PageHeaderActions,
  PageHeaderDescription,
  PageHeaderHeading,
  PageHeaderTitle,
  Panel,
  PanelContent,
  PanelHeader,
  PanelRow,
  PanelTitle,
  Progress,
  ProgressLabel,
  ProgressValue,
  RelativeTime,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Separator,
  Sparkline,
  StatCard,
  StatCardDelta,
  StatCardLabel,
  StatCardSpark,
  StatCardValue,
  Status,
  StatusIndicator,
  StatusLabel,
  Timeline,
  TimelineContent,
  TimelineDescription,
  TimelineIndicator,
  TimelineItem,
  TimelineTime,
  TimelineTitle,
  type ChartConfig,
} from "@diametral/design-system/react"

const eur = (n: number) =>
  new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(n)

const PRACTICES = { all: "All practices", strategy: "Strategy", data: "Data & AI", engineering: "Engineering" }

const KPIS = [
  { label: "Revenue MTD", value: eur(412_800), delta: "+8.2%", up: true, spark: [310, 342, 328, 365, 371, 389, 402, 413] },
  { label: "Billable utilisation", value: "81%", delta: "+3pt", up: true, spark: [72, 74, 71, 76, 78, 77, 80, 81] },
  { label: "Average day rate", value: eur(1_140), delta: "+2.1%", up: true, spark: [1080, 1095, 1090, 1110, 1105, 1120, 1132, 1140] },
  { label: "Signed pipeline", value: eur(1_870_000), delta: "−4.6%", up: false, spark: [2.1, 2.05, 2.12, 1.98, 1.95, 1.99, 1.91, 1.87] },
]

const REVENUE = [
  { month: "Apr", invoiced: 356, forecast: 340 },
  { month: "May", invoiced: 381, forecast: 365 },
  { month: "Jun", invoiced: 402, forecast: 390 },
  { month: "Jul", invoiced: 318, forecast: 335 },
  { month: "Aug", invoiced: 244, forecast: 260 },
  { month: "Sep", invoiced: 413, forecast: 420 },
]
const REVENUE_CONFIG = {
  invoiced: { label: "Invoiced (k€)", color: "var(--ds-chart-2)" },
  forecast: { label: "Forecast (k€)", color: "var(--ds-chart-4)" },
} satisfies ChartConfig

const UTILISATION = [
  { practice: "Strategy", value: 86, tone: "success" },
  { practice: "Data & AI", value: 94, tone: "warning" },
  { practice: "Engineering", value: 78, tone: "neutral" },
  { practice: "Change", value: 58, tone: "danger" },
] as const

const CLIENTS = [
  { initials: "AR", name: "Arvalis Énergie", sector: "Energy", revenue: 184_200, share: 22 },
  { initials: "BN", name: "Banque Nordique", sector: "Banking", revenue: 151_600, share: 18 },
  { initials: "CM", name: "Clinique Mérieux", sector: "Health", revenue: 118_900, share: 14 },
  { initials: "LG", name: "Logistique Gaudin", sector: "Transport", revenue: 92_300, share: 11 },
]

const MISSIONS = [
  { name: "Arvalis · Data platform", tone: "success", state: "On track", pulse: false },
  { name: "Banque Nordique · KYC", tone: "warning", state: "At risk", pulse: false },
  { name: "Mérieux · Patient portal", tone: "info", state: "Kick-off", pulse: true },
  { name: "Gaudin · TMS audit", tone: "danger", state: "Over budget", pulse: false },
  { name: "Internal · Academy", tone: "neutral", state: "Paused", pulse: false },
] as const

const NOW = Date.now()
const MIN = 60_000
const ACTIVITY = [
  { icon: HandshakeIcon, tone: "success", title: "Mission signed", detail: "Clinique Mérieux — 120 days at 1 050 € / day.", at: NOW - 25 * MIN },
  { icon: FileTextIcon, tone: "info", title: "Invoice F-2318 sent", detail: "Banque Nordique, 48 600 € due in 30 days.", at: NOW - 3 * 60 * MIN },
  { icon: WarningIcon, tone: "warning", title: "Budget alert", detail: "Gaudin TMS audit reached 104 % of sold days.", at: NOW - 26 * 60 * MIN },
  { icon: UserPlusIcon, tone: "neutral", title: "Consultant onboarded", detail: "Inès Laurent joins the Data & AI practice.", at: NOW - 3 * 24 * 60 * MIN },
] as const

export default function Overview() {
  const [showBanner, setShowBanner] = useState(true)

  return (
    <div className="flex flex-col gap-6">
      <PageHeader>
        <PageHeaderHeading>
          <div className="flex flex-col gap-1">
            <PageHeaderTitle>Overview</PageHeaderTitle>
            <PageHeaderDescription>September 2026 at a glance — revenue, staffing and delivery.</PageHeaderDescription>
          </div>
          <PageHeaderActions className="flex-wrap">
            <Select items={PRACTICES} defaultValue="all">
              <SelectTrigger size="sm" aria-label="Practice" className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(PRACTICES).map(([value, label]) => (
                  <SelectItem key={value} value={value}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button size="sm" variant="outline"><DownloadSimpleIcon /> Export</Button>
            <Button size="sm"><PlusIcon /> New mission</Button>
          </PageHeaderActions>
        </PageHeaderHeading>
      </PageHeader>

      {showBanner && (
        <Banner tone="info">
          <InfoIcon />
          <BannerContent>
            <BannerTitle>Q3 closing</BannerTitle>
            <BannerDescription>September timesheets must be validated by Wednesday 30, 18:00.</BannerDescription>
          </BannerContent>
          <BannerAction>
            <Button size="sm" variant="outline" onClick={() => setShowBanner(false)}>Got it</Button>
          </BannerAction>
        </Banner>
      )}

      <section aria-label="Key figures" className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {KPIS.map((kpi) => (
          <StatCard key={kpi.label}>
            <StatCardLabel>{kpi.label}</StatCardLabel>
            <StatCardValue>{kpi.value}</StatCardValue>
            <StatCardDelta direction={kpi.up ? "up" : "down"}>{kpi.delta} vs August</StatCardDelta>
            <StatCardSpark>
              <Sparkline
                data={kpi.spark}
                width={160}
                height={28}
                stroke={kpi.up ? "var(--ds-success-ink)" : "var(--ds-danger-ink)"}
                fill
                showDot
                aria-label={`${kpi.label}, last 8 weeks`}
              />
            </StatCardSpark>
          </StatCard>
        ))}
      </section>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Revenue trend</CardTitle>
            <CardDescription>Invoiced vs forecast, last six months</CardDescription>
            <CardAction><Badge variant="secondary">k€</Badge></CardAction>
          </CardHeader>
          <CardContent>
            <AreaChart config={REVENUE_CONFIG} data={REVENUE} xAxisKey="month" grid />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Utilisation</CardTitle>
            <CardDescription>Billable days over available days</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-6">
            <Gauge
              value={81}
              label="Firm-wide"
              format={(v) => `${v}%`}
              thresholds={[
                { at: 0, color: "var(--ds-danger)" },
                { at: 65, color: "var(--ds-warning)" },
                { at: 75, color: "var(--ds-success)" },
              ]}
            />
            <div className="flex w-full flex-col gap-4">
              {UTILISATION.map((u) => (
                <Meter key={u.practice} value={u.value} tone={u.tone}>
                  <MeterLabel>{u.practice}</MeterLabel>
                  <MeterValue />
                </Meter>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Alert tone="warning">
        <WarningIcon />
        <AlertTitle>3 invoices overdue by more than 30 days</AlertTitle>
        <AlertDescription>Logistique Gaudin (F-2271, F-2284) and Banque Nordique (F-2290) — 96 400 € outstanding.</AlertDescription>
        <AlertAction><Button size="xs" variant="outline">Send reminders</Button></AlertAction>
      </Alert>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Top clients</CardTitle>
            <CardDescription>Year-to-date revenue share</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-5">
            {CLIENTS.map((c) => (
              <div key={c.name} className="flex items-center gap-3">
                <Avatar><AvatarFallback>{c.initials}</AvatarFallback></Avatar>
                <Progress value={c.share} className="min-w-0 flex-1">
                  <ProgressLabel className="truncate">{c.name}</ProgressLabel>
                  <ProgressValue>{() => eur(c.revenue)}</ProgressValue>
                </Progress>
              </div>
            ))}
          </CardContent>
          <Separator />
          <CardFooter className="justify-between gap-2 text-sm text-muted-foreground">
            <span>Staffed on these accounts</span>
            <AvatarGroup>
              {["IL", "MB", "TC"].map((i) => (
                <Avatar key={i}><AvatarFallback>{i}</AvatarFallback></Avatar>
              ))}
              <AvatarGroupCount>+9</AvatarGroupCount>
            </AvatarGroup>
          </CardFooter>
        </Card>

        <Panel>
          <PanelHeader className="border-b">
            <PanelTitle>Mission health</PanelTitle>
            <Badge variant="secondary">{MISSIONS.length} active</Badge>
          </PanelHeader>
          <PanelContent className="px-0">
            {MISSIONS.map((m) => (
              <PanelRow key={m.name}>
                <span className="truncate">{m.name}</span>
                <Status tone={m.tone}>
                  <StatusIndicator pulse={m.pulse} />
                  <StatusLabel>{m.state}</StatusLabel>
                </Status>
              </PanelRow>
            ))}
          </PanelContent>
        </Panel>

        <Card>
          <CardHeader>
            <CardTitle>Recent activity</CardTitle>
            <CardAction>
              <Button size="icon-sm" variant="ghost" aria-label="Open calendar"><CalendarCheckIcon /></Button>
            </CardAction>
          </CardHeader>
          <CardContent>
            <Timeline>
              {ACTIVITY.map(({ icon: Icon, tone, title, detail, at }) => (
                <TimelineItem key={title} tone={tone}>
                  <TimelineIndicator><Icon /></TimelineIndicator>
                  <TimelineContent>
                    <TimelineTitle>{title}</TimelineTitle>
                    <TimelineTime render={<RelativeTime date={at} locale="en" />} />
                    <TimelineDescription>{detail}</TimelineDescription>
                  </TimelineContent>
                </TimelineItem>
              ))}
            </Timeline>
          </CardContent>
        </Card>
      </div>

      <p className="flex items-center gap-2 text-xs text-muted-foreground">
        <Avatar size="sm">
          <AvatarFallback>AM</AvatarFallback>
          <AvatarBadge />
        </Avatar>
        Figures refreshed <RelativeTime date={NOW - 4 * MIN} locale="en" live />
      </p>
    </div>
  )
}
