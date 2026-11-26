import {
  PageHeader,
  PageHeaderHeading,
  PageHeaderTitle,
  PageHeaderDescription,
  StatCard,
  StatCardDelta,
  StatCardLabel,
  StatCardSpark,
  StatCardValue,
  Sparkline,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  AreaChart,
  type ChartConfig,
} from "@diametral/design-system/react";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"];
const REVENUE = [12, 19, 14, 23, 28, 26, 34, 41];
const SIGNUPS = [4, 6, 5, 9, 8, 12, 14, 18];

const TREND = MONTHS.map((month, i) => ({
  month,
  revenue: REVENUE[i],
  signups: SIGNUPS[i],
}));
const TREND_CONFIG = {
  revenue: { label: "Revenue", color: "var(--ds-chart-1)" },
  signups: { label: "Sign-ups", color: "var(--ds-chart-2)" },
} satisfies ChartConfig;

export default function Dashboard() {
  return (
    <>
      <PageHeader>
        <PageHeaderHeading>
          <div className="ds-flex ds-flex-col ds-gap-1">
            <PageHeaderTitle>Dashboard</PageHeaderTitle>
            <PageHeaderDescription>
              A snapshot of how the workspace is doing.
            </PageHeaderDescription>
          </div>
        </PageHeaderHeading>
      </PageHeader>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "16px",
          marginBottom: "24px",
        }}
      >
        <StatCard>
          <StatCardLabel>Revenue</StatCardLabel>
          <StatCardValue>€41k</StatCardValue>
          <StatCardDelta direction="up">+18%</StatCardDelta>
          <StatCardSpark>
            <Sparkline data={REVENUE} fill />
          </StatCardSpark>
        </StatCard>
        <StatCard>
          <StatCardLabel>Sign-ups</StatCardLabel>
          <StatCardValue>1,284</StatCardValue>
          <StatCardDelta direction="up">+9%</StatCardDelta>
          <StatCardSpark>
            <Sparkline data={SIGNUPS} fill />
          </StatCardSpark>
        </StatCard>
        <StatCard>
          <StatCardLabel>Active items</StatCardLabel>
          <StatCardValue>128</StatCardValue>
          <StatCardDelta direction="down">-3%</StatCardDelta>
        </StatCard>
        <StatCard>
          <StatCardLabel>Churn</StatCardLabel>
          <StatCardValue>2.4%</StatCardValue>
          <StatCardDelta direction="up">-0.5pt</StatCardDelta>
        </StatCard>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Revenue vs. sign-ups</CardTitle>
        </CardHeader>
        <CardContent>
          <AreaChart config={TREND_CONFIG} data={TREND} xAxisKey="month" grid />
        </CardContent>
      </Card>
    </>
  );
}
