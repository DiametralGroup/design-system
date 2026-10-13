"use client"

import { cn } from "../lib/utils.js"
import { useControllableValue } from "../hooks/use-controllable-value.js"
import { Input } from "./input.js"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select.js"

// A small, hand-rolled dial-code table — no libphonenumber dependency, same
// trade-off as qr-code's hand-rolled encoder. Covers Diametral's live markets.
const COUNTRIES = [
  { code: "FR", label: "France", dialCode: "+33" },
  { code: "BE", label: "Belgique", dialCode: "+32" },
  { code: "CH", label: "Suisse", dialCode: "+41" },
  { code: "LU", label: "Luxembourg", dialCode: "+352" },
  { code: "DE", label: "Allemagne", dialCode: "+49" },
  { code: "ES", label: "Espagne", dialCode: "+34" },
  { code: "IT", label: "Italie", dialCode: "+39" },
  { code: "GB", label: "Royaume-Uni", dialCode: "+44" },
  { code: "US", label: "États-Unis", dialCode: "+1" },
  { code: "CA", label: "Canada", dialCode: "+1" },
] as const

type CountryCode = (typeof COUNTRIES)[number]["code"]

// Longest dial code first, so `+1` does not shadow a hypothetical longer match.
const BY_DIAL_CODE = [...COUNTRIES].sort(
  (a, b) => b.dialCode.length - a.dialCode.length
)

function splitValue(phone: string, fallback: CountryCode) {
  const match = BY_DIAL_CODE.find((country) =>
    phone.startsWith(country.dialCode)
  )
  if (!match) {
    return { country: fallback, national: phone.replace(/^\+/, "") }
  }
  return { country: match.code, national: phone.slice(match.dialCode.length) }
}

function PhoneInput({
  className,
  value,
  defaultValue = "",
  onValueChange,
  defaultCountry = "FR",
  disabled = false,
  placeholder = "6 12 34 56 78",
  ...inputProps
}: Pick<
  React.ComponentProps<"input">,
  | "id"
  | "name"
  | "aria-label"
  | "aria-labelledby"
  | "aria-describedby"
  | "aria-invalid"
> & {
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  defaultCountry?: CountryCode
  disabled?: boolean
  placeholder?: string
  className?: string
}) {
  const [phone, setPhone] = useControllableValue<string>({
    value,
    defaultValue,
    onChange: onValueChange,
  })

  const { country, national } = splitValue(phone, defaultCountry)
  const dialCode =
    COUNTRIES.find((c) => c.code === country)?.dialCode ?? COUNTRIES[0].dialCode

  const setCountry = (next: string | null) => {
    if (!next) return
    const nextDialCode =
      COUNTRIES.find((c) => c.code === next)?.dialCode ?? dialCode
    setPhone(`${nextDialCode}${national}`)
  }

  const setNational = (next: string) => {
    setPhone(`${dialCode}${next.replace(/[^\d\s]/g, "")}`)
  }

  return (
    <div
      data-slot="phone-input"
      data-disabled={disabled || undefined}
      className={cn("ds-phone-input", className)}
    >
      <Select
        items={COUNTRIES.map((c) => ({ value: c.code, label: c.dialCode }))}
        value={country}
        onValueChange={setCountry}
        disabled={disabled}
      >
        <SelectTrigger
          data-slot="phone-input-country"
          aria-label="Country calling code"
          className="w-fit shrink-0 border-0 ps-0 pe-2"
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {COUNTRIES.map((c) => (
            <SelectItem key={c.code} value={c.code}>
              {c.label} ({c.dialCode})
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Input
        data-slot="phone-input-number"
        type="tel"
        inputMode="tel"
        aria-label={
          inputProps.id || inputProps["aria-labelledby"]
            ? undefined
            : "Phone number"
        }
        {...inputProps}
        value={national}
        disabled={disabled}
        placeholder={placeholder}
        onChange={(event) => setNational(event.target.value)}
        className="flex-1 border-0 ps-2"
      />
    </div>
  )
}

export { PhoneInput }
export type { CountryCode }

// DiametralGroup addition: the props as a named type.
export type PhoneInputProps = React.ComponentProps<typeof PhoneInput>
