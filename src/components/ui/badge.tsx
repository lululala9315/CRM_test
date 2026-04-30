import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

// tint-* = 상태/분류 배지 (fill 배경 · tag 스타일 통일)
const badgeVariants = cva(
  "group/badge inline-flex h-5 w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-full border border-transparent px-2 py-0.5 text-[11px] font-medium leading-none tracking-tight whitespace-nowrap transition-[color,background-color,border-color,box-shadow] focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring-glow has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 aria-invalid:border-destructive aria-invalid:ring-ring-glow-destructive [&>svg]:pointer-events-none [&>svg]:size-3!",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground [a]:hover:bg-primary-hover",
        secondary:
          "bg-canvas-secondary text-content-secondary-foreground [a]:hover:bg-canvas-secondary",
        destructive:
          "bg-destructive-subtle text-destructive focus-visible:ring-ring-glow-destructive [a]:hover:bg-destructive-subtle-hover",
        outline:
          "border-border text-foreground [a]:hover:bg-canvas-quaternary [a]:hover:text-muted-foreground",
        ghost:
          "hover:bg-canvas-quaternary hover:text-muted-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        // tint (= tag) — 배경 fill 스타일, 모든 상태/분류 배지에 사용
        "tint-success":  "bg-green-tint text-green-tint",
        "tint-warning":  "bg-amber-tint text-amber-tint",
        "tint-danger":   "bg-red-tint text-red-tint",
        "tint-neutral":  "bg-neutral-tint text-neutral-tint",
        "tint-blue":     "bg-blue-tint text-blue-tint",
        "tint-muted":    "bg-canvas-quaternary text-content-quaternary",
        // tag 별칭 — tint-*와 동일 스타일, 칸반·소형 태그 사용
        "tag-red":   "bg-red-tint text-red-tint",
        "tag-blue":  "bg-blue-tint text-blue-tint",
        "tag-green": "bg-green-tint text-green-tint",
        "tag-muted": "bg-canvas-quaternary text-content-quaternary",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "span"

  return (
    <Comp
      data-slot="badge"
      data-variant={variant}
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
