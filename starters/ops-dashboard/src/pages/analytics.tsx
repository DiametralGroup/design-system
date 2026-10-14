import { useState } from "react"
import { CalendarBlankIcon } from "@phosphor-icons/react"
import { Bar, CartesianGrid, ComposedChart, Line, ReferenceLine, XAxis, YAxis } from "recharts"
import {
  BarChart,
  BulletChart,
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  ComboChart,
  DateRangePicker,
  DonutChart,
  FunnelChart,
  Heatmap,
  LineChart,
  PageHeader,
  PageHeaderActions,
  PageHeaderDescription,
  PageHeaderHeading,
  PageHeaderIcon,
  PageHeaderTitle,
  PieChart,
  RadarChart,
  ScatterChart,
  Separator,
  StackedBar,
  ToggleGroup,
  ToggleGroupItem,
  Treemap,
  WaterfallChart,
  type ChartConfig,
  type ComboSeries,
  type DateRange,
} from "@diametral/design-system/react"

type Period = "month" | "quarter" | "year"

const REVENUE: Record<Period, { label: string; revenue: number; margin: number }[]> = {
  month: [
    { label: "Apr", revenue: 356, margin: 31 },
    { label: "May", revenue: 381, margin: 33 },
    { label: "Jun", revenue: 402, margin: 34 },
    { label: "Jul", revenue: 318, margin: 29 },
    { label: "Aug", revenue: 244, margin: 24 },
    { label: "Sep", revenue: 413, margin: 35 },
  ],
  quarter: [
    { label: "Q4 25", revenue: 1_052, margin: 30 },
    { label: "Q1 26", revenue: 1_096, margin: 31 },
    { label: "Q2 26", revenue: 1_139, margin: 33 },
    { label: "Q3 26", revenue: 975, margin: 30 },
  ],
  year: [
    { label: "2023", revenue: 3_410, margin: 27 },
    { label: "2024", revenue: 3_880, margin: 29 },
    { label: "2025", revenue: 4_260, margin: 31 },
    { label: "2026", revenue: 4_470, margin: 32 },
  ],
}
const REVENUE_CONFIG = {
  revenue: { label: "Revenue (k€)", color: "var(--ds-chart-2)" },
  margin: { label: "Gross margin %", color: "var(--ds-chart-5)" },
} satisfies ChartConfig
const REVENUE_SERIES = [
  { key: "revenue", type: "bar" },
  { key: "margin", type: "line", axis: "right" },
] satisfies ComboSeries[]

const PRACTICE_CONFIG = {
  strategy: { label: "Strategy", color: "var(--ds-chart-2)" },
  data: { label: "Data & AI", color: "var(--ds-chart-3)" },
  engineering: { label: "Engineering", color: "var(--ds-chart-4)" },
  change: { label: "Change", color: "var(--ds-chart-5)" },
} satisfies ChartConfig
const PRACTICE_REVENUE = [
  { practice: "strategy", revenue: 1_240 },
  { practice: "data", revenue: 1_610 },
  { practice: "engineering", revenue: 1_180 },
  { practice: "change", revenue: 440 },
]
const UTILISATION = ["Apr", "May", "Jun", "Jul", "Aug", "Sep"].map((month, i) => ({
  month,
  strategy: [82, 84, 85, 78, 61, 86][i],
  data: [88, 90, 93, 85, 70, 94][i],
  engineering: [74, 76, 79, 72, 58, 78][i],
}))
const UTILISATION_CONFIG = {
  strategy: PRACTICE_CONFIG.strategy,
  data: PRACTICE_CONFIG.data,
  engineering: PRACTICE_CONFIG.engineering,
} satisfies ChartConfig

const CLIENT_MARGIN = [
  { client: "Arvalis", margin: 38, status: "success" },
  { client: "Nordique", margin: 31, status: "success" },
  { client: "Mérieux", margin: 27, status: "warning" },
  { client: "Gaudin", margin: 12, status: "danger" },
  { client: "Solvane", margin: 34, status: "success" },
]

const SECTOR_CONFIG = {
  energy: { label: "Energy" },
  banking: { label: "Banking" },
  health: { label: "Health" },
  transport: { label: "Transport" },
  public: { label: "Public sector" },
} satisfies ChartConfig
const SECTORS = [
  { sector: "energy", revenue: 31 },
  { sector: "banking", revenue: 24 },
  { sector: "health", revenue: 19 },
  { sector: "transport", revenue: 15 },
  { sector: "public", revenue: 11 },
]

const PIPELINE = [
  { stage: "Leads", deals: 146 },
  { stage: "Qualified", deals: 82 },
  { stage: "Proposal sent", deals: 41 },
  { stage: "Negotiation", deals: 19 },
  { stage: "Signed", deals: 11 },
]

const BRIDGE = [
  { step: "Revenue", value: 4_470 },
  { step: "Salaries", value: -2_310 },
  { step: "Freelancers", value: -640 },
  { step: "Travel", value: -118 },
  { step: "Overheads", value: -412 },
  { step: "EBITDA", value: 990 },
]

const SKILLS = [
  { skill: "Strategy", seniors: 88, juniors: 54 },
  { skill: "Data", seniors: 76, juniors: 81 },
  { skill: "Cloud", seniors: 69, juniors: 72 },
  { skill: "Delivery", seniors: 91, juniors: 58 },
  { skill: "Sales", seniors: 74, juniors: 32 },
  { skill: "Change", seniors: 80, juniors: 47 },
]
const SKILLS_CONFIG = {
  seniors: { label: "Seniors", color: "var(--ds-chart-2)" },
  juniors: { label: "Juniors", color: "var(--ds-chart-3)" },
} satisfies ChartConfig

const MISSIONS = [
  { practice: "strategy", rate: 1_450, margin: 41, days: 60 },
  { practice: "strategy", rate: 1_320, margin: 36, days: 35 },
  { practice: "strategy", rate: 1_600, margin: 44, days: 20 },
  { practice: "data", rate: 1_150, margin: 33, days: 180 },
  { practice: "data", rate: 1_050, margin: 29, days: 120 },
  { practice: "data", rate: 1_240, margin: 37, days: 90 },
  { practice: "engineering", rate: 890, margin: 22, days: 220 },
  { practice: "engineering", rate: 960, margin: 26, days: 140 },
  { practice: "engineering", rate: 820, margin: 14, days: 160 },
]
const MISSIONS_CONFIG = {
  strategy: PRACTICE_CONFIG.strategy,
  data: PRACTICE_CONFIG.data,
  engineering: PRACTICE_CONFIG.engineering,
} satisfies ChartConfig

const PORTFOLIO = [
  { name: "Energy", children: [{ name: "Arvalis", value: 812 }, { name: "Helion", value: 410 }, { name: "Watt&Co", value: 164 }] },
  { name: "Banking", children: [{ name: "Nordique", value: 690 }, { name: "Crédit Alpin", value: 382 }] },
  { name: "Health", children: [{ name: "Mérieux", value: 540 }, { name: "Santéa", value: 310 }] },
  { name: "Transport", children: [{ name: "Gaudin", value: 420 }, { name: "Railor", value: 250 }] },
]
const PORTFOLIO_CONFIG = {
  Energy: { label: "Energy", color: "var(--ds-chart-2)" },
  Banking: { label: "Banking", color: "var(--ds-chart-3)" },
  Health: { label: "Health", color: "var(--ds-chart-4)" },
  Transport: { label: "Transport", color: "var(--ds-chart-5)" },
} satisfies ChartConfig

const CONSULTANTS = ["I. Laurent", "M. Benali", "T. Caron", "S. Moreau", "L. Nguyen", "P. Dubois"]
const WEEKS = ["W32", "W33", "W34", "W35", "W36", "W37", "W38", "W39"]
const STAFFING = CONSULTANTS.flatMap((y, c) =>
  WEEKS.map((x, w) => ({ x, y, value: Math.max(0, Math.min(5, Math.round(3.4 + 2 * Math.sin(c * 1.7 + w * 0.9)))) }))
)

const TARGETS = [
  { label: "Strategy", caption: "Target 1.3 M€", value: 1_240, target: 1_300 },
  { label: "Data & AI", caption: "Target 1.5 M€", value: 1_610, target: 1_500 },
  { label: "Engineering", caption: "Target 1.4 M€", value: 1_180, target: 1_400 },
  { label: "Change", caption: "Target 0.6 M€", value: 440, target: 600 },
]

const TIME_SPLIT = [
  { practice: "Strategy", billable: 86, internal: 7, bench: 3, leave: 4 },
  { practice: "Data & AI", billable: 91, internal: 4, bench: 1, leave: 4 },
  { practice: "Engineering", billable: 78, internal: 8, bench: 9, leave: 5 },
  { practice: "Change", billable: 58, internal: 14, bench: 22, leave: 6 },
]
const TIME_CONFIG = {
  billable: { label: "Billable", color: "var(--ds-chart-3)" },
  internal: { label: "Internal", color: "var(--ds-chart-4)" },
  bench: { label: "Bench", color: "var(--ds-chart-6)" },
  leave: { label: "Leave", color: "var(--ds-chart-5)" },
} satisfies ChartConfig

const CASH = [
  { month: "Apr", invoiced: 356, collected: 331, dso: 48 },
  { month: "May", invoiced: 381, collected: 342, dso: 51 },
  { month: "Jun", invoiced: 402, collected: 388, dso: 49 },
  { month: "Jul", invoiced: 318, collected: 351, dso: 44 },
  { month: "Aug", invoiced: 244, collected: 262, dso: 46 },
  { month: "Sep", invoiced: 413, collected: 356, dso: 53 },
]
const CASH_CONFIG = {
  invoiced: { label: "Invoiced (k€)", color: "var(--ds-chart-4)" },
  collected: { label: "Collected (k€)", color: "var(--ds-chart-2)" },
  dso: { label: "DSO (days)", color: "var(--ds-chart-5)" },
} satisfies ChartConfig

const keur = (v: number) => `${v.toLocaleString("fr-FR")} k€`

function ChartCard({ title, description, className, children }: { title: string; description: string; className?: string; children: React.ReactNode }) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  )
}

export default function Analytics() {
  const [period, setPeriod] = useState<Period>("month")
  const [range, setRange] = useState<DateRange>({ from: new Date(2026, 3, 1), to: new Date(2026, 8, 30) })

  return (
    <div className="flex flex-col gap-6">
      <PageHeader>
        <PageHeaderHeading>
          <div className="flex items-start gap-3">
            <PageHeaderIcon><CalendarBlankIcon /></PageHeaderIcon>
            <div className="flex flex-col gap-1">
              <PageHeaderTitle>Analytics</PageHeaderTitle>
              <PageHeaderDescription>Revenue, margin, staffing and pipeline across the firm.</PageHeaderDescription>
            </div>
          </div>
          <PageHeaderActions className="flex-wrap">
            <ToggleGroup
              variant="outline"
              spacing={0}
              value={[period]}
              onValueChange={(v) => v.length && setPeriod(v[0] as Period)}
              aria-label="Period"
            >
              <ToggleGroupItem value="month">Month</ToggleGroupItem>
              <ToggleGroupItem value="quarter">Quarter</ToggleGroupItem>
              <ToggleGroupItem value="year">Year</ToggleGroupItem>
            </ToggleGroup>
            <DateRangePicker value={range} onValueChange={setRange} dateFormat="P" numberOfMonths={1} className="w-60" />
          </PageHeaderActions>
        </PageHeaderHeading>
      </PageHeader>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        <ChartCard title="Revenue & margin" description={`By ${period}, revenue in k€ against gross margin`} className="md:col-span-2">
          <ComboChart
            config={REVENUE_CONFIG}
            data={REVENUE[period]}
            xAxisKey="label"
            series={REVENUE_SERIES}
            rightAxis={{ tickFormatter: (v) => `${v}%`, domain: [0, 50] }}
            grid
          />
        </ChartCard>

        <ChartCard title="Revenue by practice" description="Year to date">
          <DonutChart
            config={PRACTICE_CONFIG}
            data={PRACTICE_REVENUE}
            valueKey="revenue"
            nameKey="practice"
            centerLabel="4.47 M€"
            centerCaption="YTD"
            legend
          />
        </ChartCard>

        <ChartCard title="Utilisation by practice" description="Billable rate, % of available days">
          <LineChart config={UTILISATION_CONFIG} data={UTILISATION} xAxisKey="month" grid dots>
            <ReferenceLine y={80} strokeDasharray="4 4" stroke="var(--ds-chart-1)" label={{ value: "Target 80%", position: "insideBottomRight", fontSize: 11 }} />
          </LineChart>
        </ChartCard>

        <ChartCard title="Margin by client" description="Gross margin %, tinted against the 25% floor">
          <BarChart config={{ margin: { label: "Margin %" } }} data={CLIENT_MARGIN} xAxisKey="client" statusKey="status" max={50} grid />
        </ChartCard>

        <ChartCard title="Revenue by sector" description="Share of YTD revenue, %">
          <PieChart config={SECTOR_CONFIG} data={SECTORS} valueKey="revenue" nameKey="sector" legend />
        </ChartCard>

        <ChartCard title="Sales pipeline" description="Open opportunities this year, stage-to-stage conversion">
          <FunnelChart data={PIPELINE} nameKey="stage" valueKey="deals" conversion="previous" />
        </ChartCard>

        <ChartCard title="EBITDA bridge" description="Year to date, k€" className="md:col-span-2">
          <WaterfallChart data={BRIDGE} nameKey="step" valueKey="value" totalKeys={["Revenue", "EBITDA"]} grid formatValue={keur} />
        </ChartCard>

        <ChartCard title="Skills coverage" description="Average self-assessment, 0–100">
          <RadarChart config={SKILLS_CONFIG} data={SKILLS} dimensionKey="skill" domain={[0, 100]} />
        </ChartCard>

        <ChartCard title="Day rate vs margin" description="Active missions, bubble size = sold days" className="md:col-span-2">
          <ScatterChart
            config={MISSIONS_CONFIG}
            data={MISSIONS}
            xKey="rate"
            yKey="margin"
            sizeKey="days"
            groupKey="practice"
            xLabel="Day rate (€)"
            yLabel="Margin %"
            grid
            className="h-72"
          />
        </ChartCard>

        <ChartCard title="Client portfolio" description="YTD revenue by sector and client, k€">
          <Treemap config={PORTFOLIO_CONFIG} data={PORTFOLIO} formatValue={keur} className="h-72" />
        </ChartCard>

        <ChartCard title="Staffing" description="Days billed per consultant per week" className="md:col-span-2 xl:col-span-1">
          <div className="overflow-x-auto">
            <Heatmap data={STAFFING} cellSize={20} scale={{ steps: 5, max: 5 }} legend formatValue={(v) => `${v} days`} />
          </div>
        </ChartCard>

        <ChartCard title="Revenue vs target" description="Year to date by practice, k€">
          <div className="flex flex-col gap-4 [--bullet-label:6.5rem]">
            {TARGETS.map((t) => (
              <BulletChart
                key={t.label}
                label={t.label}
                caption={t.caption}
                value={t.value}
                target={t.target}
                max={1_800}
                bands={[{ to: 900, tone: "danger" }, { to: 1_300, tone: "warning" }, { to: 1_800, tone: "success" }]}
                formatValue={keur}
              />
            ))}
          </div>
        </ChartCard>

        <ChartCard title="Time allocation" description="Share of consultant days, September">
          <StackedBar config={TIME_CONFIG} data={TIME_SPLIT} labelKey="practice" className="h-64" />
        </ChartCard>
      </div>

      <Separator />

      <Card>
        <CardHeader>
          <CardTitle>Cash collection</CardTitle>
          <CardDescription>Invoiced vs collected, with days sales outstanding — built directly on ChartContainer and recharts</CardDescription>
          <CardAction className="text-xs text-muted-foreground">Sep DSO 53 days</CardAction>
        </CardHeader>
        <CardContent>
          <ChartContainer config={CASH_CONFIG} className="h-72">
            <ComposedChart data={CASH}>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="month" tickLine={false} axisLine={false} />
              <YAxis yAxisId="eur" tickLine={false} axisLine={false} width={40} />
              <YAxis yAxisId="days" orientation="right" tickLine={false} axisLine={false} width={32} domain={[0, 70]} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar yAxisId="eur" dataKey="invoiced" fill="var(--color-invoiced)" />
              <Bar yAxisId="eur" dataKey="collected" fill="var(--color-collected)" />
              <Line yAxisId="days" dataKey="dso" stroke="var(--color-dso)" strokeWidth={2} dot={false} />
              <ChartLegend content={<ChartLegendContent />} />
            </ComposedChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  )
}
