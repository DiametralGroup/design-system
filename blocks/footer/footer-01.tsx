import { Button, Wordmark } from "@diametral/design-system/react"

const COLUMNS = [
  { heading: "Product", links: ["Matrix", "Margin engine", "Reporting"] },
  { heading: "Company", links: ["About", "Careers", "Contact"] },
  { heading: "Resources", links: ["Docs", "Changelog", "Status"] },
]

export default function Footer01() {
  return (
    <div className="ds-block-footer-01">
      <div className="ds-marks ds-block-footer-01__cta">
        <p className="ds-kicker">Get started</p>
        <h2 className="ds-title ds-block-footer-01__title">
          Bring structure to your pricing.
        </h2>
        <p className="ds-block-footer-01__lede">
          Stand up your first pricing matrix in minutes — no build step, no
          black box.
        </p>
        <Button variant="primary" size="lg" render={<a href="#footer-01" />}>
          Open the demo app
        </Button>
      </div>

      <hr className="ds-rule-x ds-rule-x--accent" />

      <footer className="ds-block-footer-01__columns">
        <div>
          <Wordmark />
          <p className="ds-block-footer-01__tagline">
            Minimal · Enduring · Elegant. Pricing intelligence on a visible
            grid.
          </p>
        </div>
        {COLUMNS.map((column) => (
          <nav key={column.heading} aria-label={column.heading}>
            <h3 className="ds-block-footer-01__heading">
              {column.heading}
            </h3>
            <ul className="ds-block-footer-01__links">
              {column.links.map((link) => (
                <li key={link}>
                  <a
                    href="#footer-01"
                    className="ds-block-footer-01__link"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </footer>
    </div>
  )
}
