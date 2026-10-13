"use client"

import * as React from "react"
import {
  CaretDownIcon,
  MonitorIcon,
  MoonIcon,
  SunIcon,
} from "@phosphor-icons/react"

import { cn } from "../lib/utils.js"
import { Button } from "./button.js"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "./dropdown-menu.js"
import { ToggleGroup, ToggleGroupItem } from "./toggle-group.js"

type ThemeSwitcherMode = "light" | "dark" | "system"

const MODES = [
  { value: "light", label: "Light", Icon: SunIcon },
  { value: "dark", label: "Dark", Icon: MoonIcon },
  { value: "system", label: "System", Icon: MonitorIcon },
] satisfies { value: ThemeSwitcherMode; label: string; Icon: typeof SunIcon }[]

// Fully controlled: the theme itself (storage, media-query sync, system
// resolution) is app wiring, not the design system's job — the consumer
// owns a useTheme()-style hook and passes it straight through. All three
// variants share that contract; they differ only in footprint.
function ThemeSwitcher({
  value,
  onValueChange,
  variant = "segmented",
  className,
  ...props
}: {
  value: ThemeSwitcherMode
  onValueChange: (value: ThemeSwitcherMode) => void
  variant?: "segmented" | "cycle" | "dropdown"
} & Omit<
  React.HTMLAttributes<HTMLElement>,
  "children" | "defaultValue" | "defaultChecked"
>) {
  const index = MODES.findIndex((mode) => mode.value === value)
  const current = MODES[index]

  if (variant === "cycle") {
    // The icon reports the CURRENT mode (state, like the segmented cells);
    // the accessible name announces the ACTION, since clicking advances.
    const next = MODES[(index + 1) % MODES.length]
    return (
      <Button
        data-slot="theme-switcher"
        data-variant="cycle"
        variant="outline"
        size="icon-sm"
        aria-label={`Switch to ${next.label.toLowerCase()} theme`}
        title={`Switch to ${next.label.toLowerCase()}`}
        className={className}
        {...props}
        onClick={() => onValueChange(next.value)}
      >
        <current.Icon weight="fill" />
      </Button>
    )
  }

  if (variant === "dropdown") {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              data-slot="theme-switcher"
              data-variant="dropdown"
              variant="outline"
              size="sm"
              aria-label="Theme"
              className={cn("ds-theme-switcher-dropdown-trigger", className)}
              {...props}
            />
          }
        >
          <current.Icon weight="fill" />
          <CaretDownIcon
            aria-hidden
            className="ds-theme-switcher-dropdown-icon"
          />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="min-w-36">
          <DropdownMenuRadioGroup
            value={value}
            onValueChange={(next) => onValueChange(next as ThemeSwitcherMode)}
          >
            {MODES.map(({ value: mode, label, Icon }) => (
              // Base UI radio items keep the menu open by default (built for
              // multi-toggling) — a theme pick is one-shot, so close on click.
              <DropdownMenuRadioItem key={mode} value={mode} closeOnClick>
                <Icon />
                {label}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  return (
    <ToggleGroup
      data-slot="theme-switcher"
      data-variant="segmented"
      variant="outline"
      size="sm"
      // Joins the three cells into one control and anchors the sliding
      // indicator — see ds-theme-switcher in theme-switcher.css.
      className={cn("ds-theme-switcher", className)}
      value={[value]}
      onValueChange={(next) => {
        // Base UI unpresses an already-pressed item, which would leave the
        // group empty — a theme is never "none", so that click is a no-op.
        const [nextValue] = next
        if (nextValue) onValueChange(nextValue as ThemeSwitcherMode)
      }}
      aria-label="Theme"
      {...props}
    >
      {/* The muted fill slides between cells instead of teleporting. Pitch is
          w-9 minus the 1px seam each non-first cell pulls back with -ms-px.
          First in the DOM so the cells' borders and icons paint above it. */}
      <span
        aria-hidden="true"
        style={{ "--index": index } as React.CSSProperties}
        className="ds-theme-switcher-indicator"
      />
      {MODES.map(({ value: mode, label, Icon }) => (
        <ToggleGroupItem
          key={mode}
          value={mode}
          aria-label={label}
          title={label}
          // The sliding indicator owns the pressed fill, so the item's own
          // bg-muted is switched off — otherwise the fill would appear on the
          // target cell before the indicator arrives. relative keeps the cell
          // painting above the positioned indicator (DOM order decides).
          className="ds-theme-switcher-item"
        >
          <Icon weight={mode === value ? "fill" : "regular"} />
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  )
}

export { ThemeSwitcher }
export type { ThemeSwitcherMode }
