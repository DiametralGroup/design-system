import { Button } from "@diametral/design-system/react"

export default function Hero01() {
  return (
    <section
      className="ds-gridlines ds-block-hero-01"
      style={{ ["--ds-grid-cols" as string]: 6 }}
    >
      <p className="ds-kicker">Pricing intelligence</p>
      <h1 className="ds-title ds-block-hero-01__title">
        Price every mission with confidence.
      </h1>
      <p className="ds-block-hero-01__lede">
        A flat, structured pricing matrix that turns delegation thresholds,
        staffing and margin into one defensible number — visible structure, no
        black boxes.
      </p>
      <div className="ds-block-hero-01__actions">
        <Button variant="primary" size="lg" render={<a href="#hero-01" />}>
          Open the demo
        </Button>
        <Button size="lg" render={<a href="#hero-01" />}>
          Read the docs
        </Button>
      </div>
    </section>
  )
}
