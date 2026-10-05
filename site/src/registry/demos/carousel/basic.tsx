import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@diametral/design-system/react"

export default function CarouselBasic() {
  return (
    <div className="w-full max-w-sm">
      <Carousel>
        <CarouselContent>
          {Array.from({ length: 4 }, (_, index) => (
            <CarouselItem key={index}>
              <div className="flex aspect-video items-center justify-center border border-border bg-muted/50 font-mono text-sm text-muted-foreground">
                {index + 1} / 4
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  )
}
