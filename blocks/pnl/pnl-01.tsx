import * as React from "react"

import {
  Alert,
  AlertDescription,
  Button,
  Checkbox,
  Label,
  Segmented,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  StatCardDelta,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Tabs,
  Wordmark,
} from "@diametral/design-system/react"

/* A P&L restitution screen: product bar, view tabs, the filter row, a headline
   band and the statement itself. Every figure goes through one fr-FR formatter
   (narrow no-break space thousands, comma decimals), and every variance is
   toned by whether it is good news — amounts are signed, costs negative, so a
   positive variance is favourable on every line. */

const amount = new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 0 })
const decimal = new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 1 })
const percent = new Intl.NumberFormat("fr-FR", {
  style: "percent",
  maximumFractionDigits: 1,
  signDisplay: "exceptZero",
})

const fmt = (v: number | null) => (v == null ? "–" : amount.format(v))
const tone = (v: number) => (v > 0 ? "favorable" : v < 0 ? "unfavorable" : "neutral")

const VIEWS = ["Restitution", "Graphiques", "Saisie", "Scénarios", "Contrôles", "Journal"]

const ENTITIES = { all: "Toutes les entités", fr: "Diametral France", be: "Diametral Belgique" }
const YEARS = { "2026": "2026", "2025": "2025" }
const VERSIONS = { fc: "Forecast actualisé 2026", bud: "Budget 2026 (figé)" }
const MODES = [
  { value: "month", label: "Mois" },
  { value: "ytd", label: "Cumul YTD" },
  { value: "ltm", label: "12 mois glissants" },
  { value: "year", label: "Projection annuelle" },
]

const KPIS = [
  { label: "Chiffre d'affaires", value: 5741542, unit: "€", delta: -0.192 },
  { label: "Marge brute", value: 1610940, unit: "€", delta: -0.487 },
  { label: "Taux de marge brute", value: 28.1, unit: "%", delta: -16.1, points: true },
  { label: "EBITDA", value: 1280181, unit: "€", delta: -0.54 },
  { label: "Résultat net", value: 1205330, unit: "€", delta: -0.527 },
]

type Line = {
  code: string
  label: string
  kind?: "section" | "total" | "grand-total"
  budget?: number | null
  actual?: number | null
  forecast?: number | null
}

const STATEMENT: Line[] = [
  { code: "", label: "Compte de résultat", kind: "section" },
  { code: "REV_INT", label: "CA Interne", budget: 556800, actual: null, forecast: 244080 },
  { code: "REV_HOF", label: "CA Head of", budget: 89088, actual: null, forecast: 43392 },
  { code: "REV_EXT", label: "CA Externe", budget: 6458880, actual: 2874416, forecast: 5454070 },
  { code: "TOT_CA", label: "Chiffre d'affaires", kind: "total", budget: 7104768, actual: 2874416, forecast: 5741542 },
  { code: "COUT_CONSULT", label: "Coûts consultants", budget: -3786240, actual: -2237693, forecast: -3952763 },
  { code: "SOUS_TRAIT", label: "Sous-traitance", budget: -111360, actual: -52169, forecast: -106409 },
  { code: "ACHATS", label: "Achats directs", budget: -66816, actual: -38887, forecast: -71431 },
  { code: "TOT_MB", label: "Marge brute", kind: "total", budget: 3140352, actual: 545668, forecast: 1610940 },
  { code: "LOYERS", label: "Loyers et charges locatives", budget: -133632, actual: -134400, forecast: -199488 },
  { code: "HONORAIRES", label: "Honoraires", budget: -55680, actual: null, forecast: -27120 },
  { code: "AUTRES_CHARGES", label: "Autres charges externes", budget: -89088, actual: -22790, forecast: -66182 },
  { code: "TOT_EBITDA", label: "EBITDA", kind: "total", budget: 2784000, actual: 388477, forecast: 1280181 },
  { code: "IS", label: "Impôt sur les sociétés", budget: -200448, actual: null, forecast: -58579 },
  { code: "TOT_RN", label: "Résultat net", kind: "grand-total", budget: 2550144, actual: 388477, forecast: 1205330 },
]

function Num({ value, toned }: { value: number | null | undefined; toned?: boolean }) {
  const empty = value == null
  const cls = [
    "ds-table__num",
    empty && "ds-table__num--empty",
    toned && !empty && value !== 0 && `ds-table__num--${tone(value)}`,
  ]
    .filter(Boolean)
    .join(" ")
  return <TableCell className={cls}>{empty ? "–" : fmt(value)}</TableCell>
}

export default function Pnl01() {
  const [mode, setMode] = React.useState("year")
  const [published, setPublished] = React.useState(true)

  return (
    <div className="ds-flex ds-flex-col ds-w-full">
      <header className="ds-flex ds-items-center ds-gap-4" style={{ padding: "18px 32px 6px" }}>
        <Wordmark variant="square" name="Diametral" sub="Pilotage P&L" />
      </header>

      <div style={{ paddingInline: 32 }}>
        <Tabs items={VIEWS.map((v) => ({ id: v, label: v }))} defaultValue="Restitution" />
      </div>

      <main className="ds-flex ds-flex-col ds-gap-5" style={{ padding: "18px 32px 48px" }}>
        <div className="ds-flex ds-flex-wrap ds-items-center ds-gap-3">
          <Select items={ENTITIES} defaultValue="all">
            <SelectTrigger aria-label="Entité" style={{ width: "auto", minWidth: 220 }}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(ENTITIES).map(([value, label]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select items={YEARS} defaultValue="2026">
            <SelectTrigger aria-label="Exercice" style={{ width: "auto", minWidth: 110 }}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(YEARS).map(([value, label]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Segmented items={MODES} value={mode} onChange={setMode} />
          {(["fc", "bud"] as const).map((v) => (
            <Select key={v} items={VERSIONS} defaultValue={v}>
              <SelectTrigger
                aria-label={v === "fc" ? "Version" : "Référence"}
                style={{ width: "auto" }}
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(VERSIONS).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ))}
        </div>

        <div className="ds-flex ds-items-center ds-justify-between">
          <div className="ds-flex ds-items-center ds-gap-2">
            <Checkbox
              id="pnl-published"
              checked={published}
              onCheckedChange={(v) => setPublished(Boolean(v))}
            />
            <Label htmlFor="pnl-published">Mois publiés uniquement</Label>
          </div>
          <Button variant="outline">Export Excel</Button>
        </div>

        <div className="ds-statgrid">
          {KPIS.map((k) => (
            <div key={k.label} className="ds-statgrid__cell">
              <div className="ds-statgrid__label">{k.label}</div>
              <div className="ds-statgrid__value" style={{ fontSize: 30, whiteSpace: "nowrap" }}>
                {k.unit === "%" ? decimal.format(k.value) : amount.format(k.value)}
                <small> {k.unit}</small>
              </div>
              <StatCardDelta tone={tone(k.delta)}>
                {k.points
                  ? `${k.delta > 0 ? "+" : ""}${decimal.format(k.delta)} pt`
                  : percent.format(k.delta)}
                <span className="ds-text-muted"> vs Budget 2026</span>
              </StatCardDelta>
            </div>
          ))}
        </div>

        <div className="ds-flex ds-items-baseline ds-justify-between">
          <h2 className="ds-title ds-title--md" style={{ margin: 0 }}>
            Toutes les entités
          </h2>
          <span className="ds-text-sm ds-text-muted">année 2026</span>
        </div>

        <Alert tone="info">
          <AlertDescription>
            Forecast actualisé 2026 : réel publié de janvier à juin, forecast ensuite.
          </AlertDescription>
        </Alert>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Code</TableHead>
              <TableHead>Libellé</TableHead>
              <TableHead className="ds-table__num">Budget 2026 (figé)</TableHead>
              <TableHead className="ds-table__num">Réel 2026 à fin juin</TableHead>
              <TableHead className="ds-table__num">Forecast actualisé 2026</TableHead>
              <TableHead className="ds-table__num">Écart</TableHead>
              <TableHead className="ds-table__num">Écart %</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {STATEMENT.map((line) => {
              if (line.kind === "section") {
                return (
                  <TableRow key={line.label} className="ds-table-row--section">
                    <TableCell colSpan={7}>{line.label}</TableCell>
                  </TableRow>
                )
              }
              const variance =
                line.forecast != null && line.budget != null ? line.forecast - line.budget : null
              const ratio = variance != null && line.budget ? variance / Math.abs(line.budget) : null
              const rowClass =
                line.kind === "grand-total"
                  ? "ds-table-row--total ds-table-row--grand-total"
                  : line.kind === "total"
                    ? "ds-table-row--total"
                    : undefined
              return (
                <TableRow key={line.code} className={rowClass}>
                  <TableCell className="ds-table__code">{line.code}</TableCell>
                  <TableCell>{line.label}</TableCell>
                  <Num value={line.budget} />
                  <Num value={line.actual} />
                  <Num value={line.forecast} />
                  <Num value={variance} toned />
                  <TableCell
                    className={[
                      "ds-table__num",
                      ratio == null ? "ds-table__num--empty" : `ds-table__num--${tone(ratio)}`,
                    ].join(" ")}
                  >
                    {ratio == null ? "–" : percent.format(ratio)}
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </main>
    </div>
  )
}
