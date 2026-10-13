"use client"

import * as React from "react"
import {
  DayPicker,
  getDefaultClassNames,
  type DayButton,
  type Locale,
} from "react-day-picker"

import { cn } from "../lib/utils.js"
import { Button, buttonVariants } from "./button.js"
import {
  CaretLeftIcon,
  CaretRightIcon,
  CaretDownIcon,
} from "@phosphor-icons/react"

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  captionLayout = "label",
  buttonVariant = "ghost",
  locale,
  formatters,
  components,
  ...props
}: React.ComponentProps<typeof DayPicker> & {
  buttonVariant?: React.ComponentProps<typeof Button>["variant"]
}) {
  const defaultClassNames = getDefaultClassNames()

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("ds-calendar", className)}
      captionLayout={captionLayout}
      locale={locale}
      formatters={{
        formatMonthDropdown: (date) =>
          date.toLocaleString(locale?.code, { month: "short" }),
        ...formatters,
      }}
      classNames={{
        root: cn("ds-calendar-root", defaultClassNames.root),
        months: cn("ds-calendar-months", defaultClassNames.months),
        month: cn("ds-calendar-month", defaultClassNames.month),
        nav: cn("ds-calendar-nav", defaultClassNames.nav),
        button_previous: cn(
          buttonVariants({ variant: buttonVariant }),
          "ds-calendar-nav-button size-(--cell-size) p-0",
          defaultClassNames.button_previous
        ),
        button_next: cn(
          buttonVariants({ variant: buttonVariant }),
          "ds-calendar-nav-button size-(--cell-size) p-0",
          defaultClassNames.button_next
        ),
        month_caption: cn(
          "ds-calendar-month-caption",
          defaultClassNames.month_caption
        ),
        dropdowns: cn("ds-calendar-dropdowns", defaultClassNames.dropdowns),
        dropdown_root: cn(
          "ds-calendar-dropdown-root",
          defaultClassNames.dropdown_root
        ),
        dropdown: cn("ds-calendar-dropdown", defaultClassNames.dropdown),
        caption_label: cn(
          "ds-calendar-caption-label",
          captionLayout !== "label" && "ds-calendar-caption-label--dropdown",
          defaultClassNames.caption_label
        ),
        month_grid: cn("ds-calendar-month-grid", defaultClassNames.month_grid),
        weekdays: cn("ds-calendar-weekdays", defaultClassNames.weekdays),
        weekday: cn("ds-calendar-weekday", defaultClassNames.weekday),
        week: cn("ds-calendar-week", defaultClassNames.week),
        week_number_header: cn(
          "ds-calendar-week-number-header",
          defaultClassNames.week_number_header
        ),
        week_number: cn(
          "ds-calendar-week-number",
          defaultClassNames.week_number
        ),
        day: cn(
          "ds-calendar-day",
          props.showWeekNumber
            ? "ds-calendar-day--round-start-second"
            : "ds-calendar-day--round-start-first",
          defaultClassNames.day
        ),
        range_start: cn(
          "ds-calendar-range-start",
          defaultClassNames.range_start
        ),
        range_middle: cn(
          "ds-calendar-range-middle",
          defaultClassNames.range_middle
        ),
        range_end: cn("ds-calendar-range-end", defaultClassNames.range_end),
        today: cn("ds-calendar-today", defaultClassNames.today),
        outside: cn("ds-calendar-outside", defaultClassNames.outside),
        disabled: cn("ds-calendar-disabled", defaultClassNames.disabled),
        hidden: cn("ds-calendar-hidden", defaultClassNames.hidden),
        ...classNames,
      }}
      components={{
        Root: ({ className, rootRef, ...props }) => {
          return (
            <div
              data-slot="calendar"
              ref={rootRef}
              className={cn(className)}
              {...props}
            />
          )
        },
        Chevron: ({ className, orientation, ...props }) => {
          if (orientation === "left") {
            return (
              <CaretLeftIcon
                className={cn(
                  "ds-calendar-chevron ds-calendar-chevron--directional size-4",
                  className
                )}
                {...props}
              />
            )
          }

          if (orientation === "right") {
            return (
              <CaretRightIcon
                className={cn(
                  "ds-calendar-chevron ds-calendar-chevron--directional size-4",
                  className
                )}
                {...props}
              />
            )
          }

          return (
            <CaretDownIcon
              className={cn("ds-calendar-chevron", className)}
              {...props}
            />
          )
        },
        DayButton: ({ ...props }) => (
          <CalendarDayButton locale={locale} {...props} />
        ),
        WeekNumber: ({ children, ...props }) => {
          return (
            <td {...props}>
              <div className="ds-calendar-week-number-cell">{children}</div>
            </td>
          )
        },
        ...components,
      }}
      {...props}
    />
  )
}

function CalendarDayButton({
  className,
  day,
  modifiers,
  locale,
  ...props
}: React.ComponentProps<typeof DayButton> & { locale?: Partial<Locale> }) {
  const defaultClassNames = getDefaultClassNames()

  const ref = React.useRef<HTMLButtonElement>(null)
  React.useEffect(() => {
    if (modifiers.focused) ref.current?.focus()
  }, [modifiers.focused])

  return (
    <Button
      // DiametralGroup addition: incoming creates this ref but never attaches
      // it, so the focus effect above could not move focus.
      ref={ref}
      variant="ghost"
      size="icon"
      data-day={day.date.toLocaleDateString(locale?.code)}
      data-selected-single={
        modifiers.selected &&
        !modifiers.range_start &&
        !modifiers.range_end &&
        !modifiers.range_middle
      }
      data-range-start={modifiers.range_start}
      data-range-end={modifiers.range_end}
      data-range-middle={modifiers.range_middle}
      className={cn(
        "ds-calendar-day-button aspect-square size-auto w-full min-w-(--cell-size)",
        defaultClassNames.day,
        className
      )}
      {...props}
    />
  )
}

export { Calendar, CalendarDayButton }
