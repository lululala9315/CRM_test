import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

// size variant 추가 — 필터용 sm (h-8, 13px) 지원으로 인라인 !important override 제거
// variant="filter" — 필터 컨트롤용: bg-fill-filter(#E3E8F0) + border-transparent. 검색 아이콘 여백은 pl-* className으로 추가
const inputVariants = cva(
  "w-full min-w-0 rounded-md border border-input bg-transparent transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring-glow disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-ring-glow-destructive",
  {
    variants: {
      size: {
        default: "h-9 px-2.5 py-1 text-sm",
        sm: "h-8 px-2.5 py-1 text-[13px]",
      },
      variant: {
        default: "",
        filter: "bg-fill-filter border-subtle",
      },
    },
    defaultVariants: { size: "default", variant: "default" },
  }
)

type InputProps = Omit<React.ComponentProps<"input">, "size"> & VariantProps<typeof inputVariants>

function Input({ className, size, variant, type, ...props }: InputProps) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(inputVariants({ size, variant }), className)}
      {...props}
    />
  )
}

export { Input }
