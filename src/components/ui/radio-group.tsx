"use client"

import * as React from "react"
import { RadioGroup as RadioGroupPrimitive } from "radix-ui"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

function RadioGroup({
  className,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Root>) {
  return (
    <RadioGroupPrimitive.Root
      data-slot="radio-group"
      className={cn("grid w-full gap-3", className)}
      {...props}
    />
  )
}

const radioGroupItemVariants = cva(
  [
    "group/radio-group-item peer relative flex aspect-square shrink-0 items-center justify-center rounded-full border-2 border-subtle outline-none transition-colors",
    "after:absolute after:-inset-x-3 after:-inset-y-2",
    "focus-visible:ring-3 focus-visible:ring-ring-glow",
    "disabled:cursor-not-allowed disabled:opacity-50",
    "aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-ring-glow-destructive",
    "data-[state=checked]:border-primary",
  ].join(" "),
  {
    variants: {
      size: {
        default: "size-[18px]",
        sm: "size-4",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
)

function RadioGroupItem({
  className,
  size,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Item> &
  VariantProps<typeof radioGroupItemVariants>) {
  return (
    <RadioGroupPrimitive.Item
      data-slot="radio-group-item"
      className={cn(radioGroupItemVariants({ size }), className)}
      {...props}
    >
      <RadioGroupPrimitive.Indicator
        data-slot="radio-group-indicator"
        className="flex items-center justify-center"
      >
        <span
          className={cn(
            "rounded-full bg-primary",
            size === "sm" ? "size-2" : "size-2.5"
          )}
        />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  )
}

/**
 * 옵션 카드 패턴 — 큰 클릭 영역 + 라벨 + 설명 + 부가 children
 *
 * 선택 상태에 따른 배경색·라벨 색상 변경은 CSS `:has()`로 자동 처리됩니다.
 * 외부에서 selected prop을 따로 넘길 필요가 없습니다.
 *
 * 사용 예:
 *   <RadioGroup value={selected} onValueChange={setSelected} className="gap-0">
 *     <RadioOption value="enabled" label="사용함" description="..." />
 *     <RadioOption value="disabled" label="사용안함" />
 *   </RadioGroup>
 */
type RadioOptionProps = {
  value: string
  label: React.ReactNode
  description?: React.ReactNode
  children?: React.ReactNode
} & Omit<React.ComponentProps<"label">, "children">

function RadioOption({
  value,
  label,
  description,
  children,
  className,
  ...props
}: RadioOptionProps) {
  return (
    <label
      data-slot="radio-option"
      className={cn(
        "group/radio-option flex w-full cursor-pointer items-start gap-s12 px-s24 py-s16 text-left transition-colors",
        "has-[[data-state=unchecked]]:hover:bg-alpha-black-02",
        className
      )}
      {...props}
    >
      <RadioGroupItem value={value} className="mt-0.5" />
      <div className="flex min-w-0 flex-1 flex-col gap-s4">
        <span
          className={cn(
            "text-body3-bold leading-snug transition-colors",
            "text-content-tertiary",
            "group-has-[[data-state=checked]]/radio-option:text-primary"
          )}
        >
          {label}
        </span>
        {description && (
          <span
            className={cn(
              "text-body4-normal leading-relaxed transition-colors",
              "text-content-assistive",
              "group-has-[[data-state=checked]]/radio-option:text-content-secondary"
            )}
          >
            {description}
          </span>
        )}
        {children}
      </div>
    </label>
  )
}

export { RadioGroup, RadioGroupItem, RadioOption }
