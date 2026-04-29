import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

// pill-* 는 활성/진행 상태 outline 스타일 · tint-* 는 종결 상태 배경 fill 스타일
const badgeVariants = cva(
  "group/badge inline-flex h-5 w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-full border border-transparent px-2 py-0.5 text-[11px] font-medium leading-none tracking-tight whitespace-nowrap transition-[color,background-color,border-color,box-shadow] focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 aria-invalid:border-destructive aria-invalid:ring-destructive/20 [&>svg]:pointer-events-none [&>svg]:size-3!",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground [a]:hover:bg-primary-hover",
        secondary:
          "bg-secondary text-secondary-foreground [a]:hover:bg-secondary/80",
        destructive:
          "bg-destructive/10 text-destructive focus-visible:ring-destructive/20 [a]:hover:bg-destructive/20",
        outline:
          "border-border text-foreground [a]:hover:bg-quaternary [a]:hover:text-muted-foreground",
        ghost:
          "hover:bg-quaternary hover:text-muted-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        // 활성/진행 상태 outline pill — border + text 색으로 의미 구분
        // border는 alpha 기반이라 Tailwind 유틸리티 유지 (globals.css 주석 참고)
        "pill-success":  "bg-transparent border-green-600/30 text-green-tint",
        "pill-warning":  "bg-transparent border-amber-500/40 text-amber-tint",
        "pill-danger":   "bg-transparent border-red-500/40 text-red-tint",
        "pill-neutral":  "bg-transparent border-muted-foreground/25 text-neutral-tint",
        // 종결 상태 tint — 배경 fill로 의미 강조
        "tint-success":  "bg-green-tint text-green-tint border-transparent",
        "tint-warning":  "bg-amber-tint text-amber-tint border-transparent",
        "tint-danger":   "bg-red-tint text-red-tint border-transparent",
        "tint-neutral":  "bg-neutral-tint text-neutral-tint border-transparent",
        "tint-blue":     "bg-blue-tint text-blue-tint border-transparent",
        "tint-muted":    "bg-quaternary text-quaternary border-transparent",
        // 칸반 태그 — 소형 색상 라벨
        "tag-red":   "bg-red-tint text-red-tint border-transparent",
        "tag-blue":  "bg-blue-tint text-blue-tint border-transparent",
        "tag-green": "bg-green-tint text-green-tint border-transparent",
        "tag-dark":  "bg-foreground text-inverse-primary border-transparent",
        "tag-muted": "bg-quaternary text-quaternary border-transparent",
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
