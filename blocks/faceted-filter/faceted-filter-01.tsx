import {
  Card,
  CardBlock,
  Checkbox,
  Item,
  ItemContent,
  ItemGroup,
  ItemTitle,
  Label,
  Tag,
} from "@diametral/design-system/react"

const STATUSES = [
  { id: "confirmed", label: "Confirmed", checked: true },
  { id: "draft", label: "Draft", checked: false },
  { id: "archived", label: "Archived", checked: false },
]

const RESULTS = [
  { name: "Acme — Senior data engineer", rate: "€900 / day" },
  { name: "Globex — Staff designer", rate: "€820 / day" },
  { name: "Initech — Platform lead", rate: "€1,050 / day" },
]

export default function FacetedFilter01() {
  return (
    <div className="ds-block-faceted-filter-01">
      <Card>
        <CardBlock>
          <p className="ds-block-faceted-filter-01__label">
            Status
          </p>
          <div className="ds-block-faceted-filter-01__statuses">
            {STATUSES.map((status) => (
              <div key={status.id} className="ds-block-faceted-filter-01__status">
                <Checkbox
                  id={`faceted-filter-01-${status.id}`}
                  defaultChecked={status.checked}
                />
                <Label htmlFor={`faceted-filter-01-${status.id}`}>
                  {status.label}
                </Label>
              </div>
            ))}
          </div>
        </CardBlock>
        <CardBlock>
          <p className="ds-block-faceted-filter-01__label">
            Discipline
          </p>
          <div className="ds-flex ds-flex-wrap ds-gap-2">
            <Tag tone="info">Data</Tag>
            <Tag>Design</Tag>
            <Tag>Ops</Tag>
            <Tag>Sales</Tag>
          </div>
        </CardBlock>
      </Card>
      <ItemGroup>
        {RESULTS.map((result) => (
          <Item key={result.name} variant="outline">
            <ItemContent>
              <ItemTitle>{result.name}</ItemTitle>
            </ItemContent>
            <span className="ds-block-faceted-filter-01__count">
              {result.rate}
            </span>
          </Item>
        ))}
      </ItemGroup>
    </div>
  )
}
