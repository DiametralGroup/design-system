import * as React from "react"

// Codifies the controlled/uncontrolled pattern rating.tsx hand-rolled: track
// an uncontrolled fallback, but defer to `value` the moment it's defined, and
// only update the fallback while uncontrolled.
function useControllableValue<T>({
  value,
  defaultValue,
  onChange,
}: {
  value?: T
  defaultValue: T
  onChange?: (value: T) => void
}): [T, (value: T) => void] {
  const [uncontrolled, setUncontrolled] = React.useState(defaultValue)
  const current = value ?? uncontrolled

  const setValue = React.useCallback(
    (next: T) => {
      if (value === undefined) {
        setUncontrolled(next)
      }
      onChange?.(next)
    },
    [value, onChange]
  )

  return [current, setValue]
}

export { useControllableValue }
