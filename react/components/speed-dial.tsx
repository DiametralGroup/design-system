"use client"

import * as React from "react"
import { Menu as MenuPrimitive } from "@base-ui/react/menu"
import { XIcon } from "@phosphor-icons/react"

import { Button, buttonVariants } from "./button.js"
import { cn } from "../lib/utils.js"

// A floating action button whose actions fan out on open, ported from daisyUI's
// `fab` (https://daisyui.com/components/fab/). daisyUI builds it out of CSS
// alone: a `tabindex="0"` div plus `:focus-within`, which has no Escape, no
// focus return and no menu role. That mechanism is dropped for Base UI's Menu —
// the same primitive `DropdownMenu` runs on — so the keyboard contract comes
// free and only the layout is ported.
//
// The trigger is the root: it carries the positioning, so `className` moves the
// dial. The default is `fixed`, which is what a FAB wants; a demo or a scoped
// region overrides it with `absolute` and tailwind-merge drops the `fixed`.
function SpeedDial({
  label,
  icon,
  tone,
  children,
  side = "top",
  sideOffset = 8,
  className,
  ...props
}: Omit<MenuPrimitive.Root.Props, "children"> & {
  /** `SpeedDialAction`s, revealed on open. */
  children?: React.ReactNode
  /** Accessible name for the trigger, which has no visible text. */
  label: string
  /** The closed-state glyph. Swapped for an X while open. */
  icon?: React.ReactNode
  tone?: React.ComponentProps<typeof Button>["tone"]
  /** Which way the column fans out. `align` is fixed to the trigger's end
   *  edge — that edge is what the action boxes line up against. */
  side?: "top" | "bottom"
  sideOffset?: number
  className?: string
}) {
  return (
    <MenuPrimitive.Root {...props}>
      <MenuPrimitive.Trigger
        render={
          <Button
            data-slot="speed-dial"
            size="icon-lg"
            tone={tone}
            aria-label={label}
            className={cn("fixed end-6 bottom-6 z-40", className)}
          >
            {/* Both glyphs render and CSS picks one: `aria-expanded` lands on
                the trigger, so the swap needs no open state of its own. */}
            <span className="ds-speed-dial-icon">{icon}</span>
            <XIcon className="ds-speed-dial-icon-close" />
          </Button>
        }
      />
      <MenuPrimitive.Portal>
        <MenuPrimitive.Positioner
          className="ds-speed-dial-positioner"
          side={side}
          align="end"
          sideOffset={sideOffset}
        >
          <MenuPrimitive.Popup
            data-slot="speed-dial-actions"
            className="ds-speed-dial-actions"
          >
            {children}
          </MenuPrimitive.Popup>
        </MenuPrimitive.Positioner>
      </MenuPrimitive.Portal>
    </MenuPrimitive.Root>
  )
}

// One action: its label as a plate and its glyph in a box the size of the
// trigger, so the column lines up under the dial. The whole row is the
// menuitem — the visible label is the accessible name, which is why the glyph
// needs none of its own.
function SpeedDialAction({
  icon,
  children,
  className,
  ...props
}: MenuPrimitive.Item.Props & {
  icon?: React.ReactNode
}) {
  return (
    <MenuPrimitive.Item
      data-slot="speed-dial-action"
      className={cn("ds-speed-dial-action", className)}
      {...props}
    >
      {/* The plate is the quiet half and the box the loud one, so the column
          reads as buttons under the trigger rather than as a stack of chips. */}
      <span className="ds-speed-dial-action-label">{children}</span>
      {/* Styled by `buttonVariants` rather than hand-picked tokens, so the box
          sits on the same fill scale as the trigger — a raw `bg-foreground`
          reads louder than any button in the system once dark mode inverts it.
          It is a span, not a Button: the whole row is already the menu item. */}
      <span
        className={buttonVariants({
          size: "icon-lg",
          className: "ds-speed-dial-action-icon",
        })}
      >
        {icon}
      </span>
    </MenuPrimitive.Item>
  )
}

export { SpeedDial, SpeedDialAction }
