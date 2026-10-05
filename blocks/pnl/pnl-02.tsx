import {
  BarChart,
  BulletChart,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  ComboChart,
  LineChart,
  WaterfallChart,
  type ChartConfig,
  type ComboSeries,
} from "@diametral/design-system/react"

/* The P&L "Graphiques" view: the budget-to-forecast EBITDA bridge, the monthly
   revenue run against budget with the margin rate on a second axis, revenue
   variance by entity, the margin rate against its target, and a rolling
   EBITDA trend. Amounts are formatted fr-FR in full in tooltips and compact
   (k€ / M€) on axes, through each chart's formatter props. */

const full = new Intl.NumberFormat("fr-FR", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 0,
})
const compact = new Intl.NumberFormat("fr-FR", {
  notation: "compact",
  maximumFractionDigits: 1,
})
const eur = (v: number) => full.format(v)
const keur = (v: number) => `${compact.format(v)} €`
const rate = (v: number) => `${v.toLocaleString("fr-FR", { maximumFractionDigits: 1 })} %`

const BRIDGE = [
  { step: "Budget", value: 2784000 },
  { step: "CA", value: -1363226 },
  { step: "Directs", value: -166186 },
  { step: "Structure", value: 25593 },
  { step: "Forecast", value: 1280181 },
]

const MONTHS = ["Janv.", "Févr.", "Mars", "Avr.", "Mai", "Juin", "Juil.", "Août", "Sept.", "Oct.", "Nov.", "Déc."]
const ACTUAL = [452, 471, 503, 488, 470, 490, 455, 380, 470, 520, 530, 512]
const BUDGET = [560, 575, 610, 600, 590, 605, 590, 470, 600, 630, 640, 635]
const MARGIN = [31.2, 30.4, 29.8, 28.1, 27.5, 28.9, 27.1, 25.2, 27.8, 28.4, 29.0, 28.6]

const MONTHLY = MONTHS.map((month, i) => ({
  month,
  actual: ACTUAL[i] * 1000,
  budget: BUDGET[i] * 1000,
  margin: MARGIN[i],
}))

const MONTHLY_CONFIG = {
  actual: { label: "Réel / forecast", color: "var(--ds-chart-2)" },
  budget: { label: "Budget", color: "var(--ds-chart-6)" },
  margin: { label: "Taux de marge brute", color: "var(--ds-chart-5)" },
} satisfies ChartConfig

const MONTHLY_SERIES = [
  { key: "actual", type: "bar" },
  { key: "budget", type: "line" },
  { key: "margin", type: "line", axis: "right" },
] satisfies ComboSeries[]

const BY_ENTITY = [
  { entity: "France", variance: -812400 },
  { entity: "Belgique", variance: -301250 },
  { entity: "Suisse", variance: 48300 },
  { entity: "États-Unis", variance: -297876 },
].map((row) => ({ ...row, status: row.variance < 0 ? "danger" : "success" }))

const ROLLING = MONTHS.map((month, i) => ({
  month,
  ebitda: [1.9, 1.85, 1.78, 1.7, 1.62, 1.55, 1.49, 1.42, 1.38, 1.33, 1.3, 1.28][i] * 1e6,
}))

export default function Pnl02() {
  return (
    <div
      className="ds-grid ds-gap-5 ds-w-full"
      style={{ padding: 32, gridTemplateColumns: "repeat(auto-fit, minmax(420px, 1fr))" }}
    >
      <Card>
        <CardHeader>
          <CardTitle>Pont EBITDA</CardTitle>
          <CardDescription>Budget 2026 (figé) → Forecast actualisé 2026</CardDescription>
        </CardHeader>
        <CardContent>
          <WaterfallChart
            data={BRIDGE}
            nameKey="step"
            valueKey="value"
            totalKeys={["Budget", "Forecast"]}
            formatValue={eur}
            axisFormatter={keur}
            valueAxisWidth={64}
            labels={{ total: "Total", change: "Écart", running: "Cumul" }}
            style={{ height: 280 }}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Chiffre d'affaires mensuel</CardTitle>
          <CardDescription>Réel publié puis forecast, contre budget et taux de marge</CardDescription>
        </CardHeader>
        <CardContent>
          <ComboChart
            config={MONTHLY_CONFIG}
            data={MONTHLY}
            xAxisKey="month"
            series={MONTHLY_SERIES}
            leftAxis={{ tickFormatter: keur, width: 64 }}
            rightAxis={{ tickFormatter: rate, domain: [0, 40], width: 48 }}
            style={{ height: 280 }}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Écart de CA par entité</CardTitle>
          <CardDescription>Forecast actualisé − budget</CardDescription>
        </CardHeader>
        <CardContent>
          <BarChart
            config={{ variance: { label: "Écart" } }}
            data={BY_ENTITY}
            xAxisKey="entity"
            statusKey="status"
            horizontal
            valueFormatter={keur}
            style={{ height: 240 }}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Objectifs</CardTitle>
          <CardDescription>Forecast contre budget</CardDescription>
        </CardHeader>
        <CardContent className="ds-flex ds-flex-col ds-gap-5">
          <BulletChart
            label="Taux de marge brute"
            value={28.1}
            target={44.2}
            max={50}
            bands={[{ to: 30, tone: "danger" }, { to: 40, tone: "warning" }, { to: 50 }]}
            formatValue={rate}
          />
          <BulletChart
            label="Chiffre d'affaires"
            value={5741542}
            target={7104768}
            max={8000000}
            formatValue={keur}
          />
          <BulletChart
            label="EBITDA"
            value={1280181}
            target={2784000}
            max={3000000}
            formatValue={keur}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>EBITDA 12 mois glissants</CardTitle>
          <CardDescription>Fin de période</CardDescription>
        </CardHeader>
        <CardContent>
          <LineChart
            config={{ ebitda: { label: "EBITDA", color: "var(--ds-chart-2)" } }}
            data={ROLLING}
            xAxisKey="month"
            valueAxis
            valueFormatter={keur}
            valueAxisWidth={64}
            style={{ height: 240 }}
          />
        </CardContent>
      </Card>
    </div>
  )
}
