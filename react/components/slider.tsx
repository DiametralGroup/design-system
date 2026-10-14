"use client"

import { Slider as SliderPrimitive } from "@base-ui/react/slider"

import { cn } from "../lib/utils.js"

function Slider({
  className,
  defaultValue,
  value,
  min = 0,
  max = 100,
  // DiametralGroup addition: Base UI never routes Root's label down to the
  // thumb's native <input>, so a single-thumb slider forwards it explicitly.
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
  ...props
}: SliderPrimitive.Root.Props) {
  const _values = Array.isArray(value)
    ? value
    : Array.isArray(defaultValue)
      ? defaultValue
      : [(value ?? defaultValue ?? min) as number]
  const singleThumb = _values.length === 1

  return (
    <SliderPrimitive.Root
      className={cn("ds-slider", className)}
      data-slot="slider"
      defaultValue={defaultValue}
      value={value}
      min={min}
      max={max}
      thumbAlignment="edge"
      aria-labelledby={ariaLabelledBy}
      {...props}
    >
      <SliderPrimitive.Control className="ds-slider-control">
        <SliderPrimitive.Track data-slot="slider-track" className="ds-slider-track">
          <SliderPrimitive.Indicator
            data-slot="slider-range"
            className="ds-slider-range"
          />
        </SliderPrimitive.Track>
        {Array.from({ length: _values.length }, (_, index) => (
          <SliderPrimitive.Thumb
            data-slot="slider-thumb"
            key={index}
            className="ds-slider-thumb"
            aria-label={singleThumb ? ariaLabel : undefined}
            aria-labelledby={singleThumb ? ariaLabelledBy : undefined}
          />
        ))}
      </SliderPrimitive.Control>
    </SliderPrimitive.Root>
  )
}

export { Slider }
