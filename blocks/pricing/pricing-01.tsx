import {
  Badge,
  Button,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@diametral/design-system/react"

const PLANS = [
  {
    name: "Starter",
    price: "€0",
    features: ["1 pricing matrix", "3 seats", "Manual export"],
    cta: "Start free",
    featured: false,
  },
  {
    name: "Growth",
    price: "€49",
    features: [
      "Unlimited matrices",
      "20 seats",
      "Live margin engine",
      "API access",
    ],
    cta: "Choose Growth",
    featured: true,
  },
  {
    name: "Scale",
    price: "€199",
    features: [
      "Everything in Growth",
      "Unlimited seats",
      "SSO & audit log",
      "Dedicated support",
    ],
    cta: "Contact sales",
    featured: false,
  },
]

export default function Pricing01() {
  return (
    <div className="ds-block-pricing-01">
      {PLANS.map((plan) => (
        <Card
          key={plan.name}
          className={
            plan.featured
              ? "ds-frame--accent ds-block-pricing-01__plan"
              : "ds-block-pricing-01__plan"
          }
        >
          <CardHeader>
            {plan.featured ? (
              <Badge variant="accent">Most popular</Badge>
            ) : (
              <span className="ds-gridlabel">{plan.name}</span>
            )}
            <p className="ds-block-pricing-01__price">
              {plan.price}
              <small className="ds-block-pricing-01__period">/ mo</small>
            </p>
          </CardHeader>
          <CardContent>
            <ul className="ds-block-pricing-01__features">
              {plan.features.map((feature) => (
                <li key={feature} className="ds-block-pricing-01__feature">
                  {feature}
                </li>
              ))}
            </ul>
          </CardContent>
          <CardFooter>
            <Button variant="primary" block render={<a href="#pricing-01" />}>
              {plan.cta}
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
