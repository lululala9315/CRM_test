import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  // active:scale — aria-haspopup(드롭다운 트리거)·aria-expanded 제외
  "group/button inline-flex shrink-0 items-center justify-center rounded-md border border-transparent bg-clip-padding font-medium whitespace-nowrap transition-[color,background-color,border-color,box-shadow,transform,opacity] outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring-glow active:not-aria-[haspopup]:scale-[0.97] active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-ring-glow-destructive [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-3.5",
  {
    variants: {
      // 6 variants — 실제 사용 중인 것만
      variant: {
        primary: "bg-primary text-primary-foreground hover:bg-primary-hover",
        secondary:
          "bg-primary-subtle text-primary hover:bg-primary-subtle-hover aria-expanded:bg-primary-subtle-hover aria-expanded:text-primary",
        outline:
          "border-border bg-transparent text-foreground hover:bg-canvas-quaternary hover:text-foreground aria-expanded:bg-canvas-quaternary aria-expanded:text-foreground",
        ghost:
          "hover:bg-canvas-quaternary hover:text-foreground aria-expanded:bg-canvas-quaternary aria-expanded:text-foreground",
        neutral:
          "bg-canvas-quaternary text-foreground hover:bg-fill-hover aria-expanded:bg-fill-hover aria-expanded:text-foreground",
        destructive:
          "bg-destructive-subtle text-destructive hover:bg-destructive-subtle-hover focus-visible:border-destructive-subtle focus-visible:ring-ring-glow-destructive",
      },
      // 5 sizes — default/sm/xs는 user 사용, icon/icon-sm은 shadcn 내부 사용
      size: {
        default:
          "h-9 gap-s4 rounded-lg px-s12 text-body3-medium has-data-[icon=inline-end]:pr-s8 has-data-[icon=inline-start]:pl-s8",
        sm: "h-8 gap-s2 rounded-lg px-s10 text-body4-medium has-data-[icon=inline-end]:pr-s6 has-data-[icon=inline-start]:pl-s6 [&_svg:not([class*='size-'])]:size-3",
        xs: "h-6 gap-s2 rounded-md px-s6 text-[11px] font-medium tracking-tight has-data-[icon=inline-end]:pr-s4 has-data-[icon=inline-start]:pl-s4 [&_svg:not([class*='size-'])]:size-3",
        icon: "size-9 rounded-lg",
        "icon-sm": "size-8 rounded-md",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "primary",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot.Root : "button"

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
