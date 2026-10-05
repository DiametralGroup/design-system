import {
  Badge,
  Button,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Tag,
} from "@diametral/design-system/react"

const PROFILES = { all: "All profiles", junior: "Junior", senior: "Senior" }
const SORTS = { "rate-asc": "Rate ↑", "rate-desc": "Rate ↓" }

export default function FilterBar01() {
  return (
    <div className="ds-block-filter-bar-01">
      <Tag onRemove={() => {}}>Region: EU</Tag>
      <Tag onRemove={() => {}}>Active</Tag>
      <Badge variant="secondary">24 results</Badge>

      <div className="ds-block-filter-bar-01__spacer" />

      <Select items={PROFILES} defaultValue="all">
        <SelectTrigger aria-label="Profile">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {Object.entries(PROFILES).map(([value, label]) => (
            <SelectItem key={value} value={value}>
              {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select items={SORTS} defaultValue="rate-asc">
        <SelectTrigger aria-label="Sort">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {Object.entries(SORTS).map(([value, label]) => (
            <SelectItem key={value} value={value}>
              {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button size="sm">Clear</Button>
    </div>
  )
}
