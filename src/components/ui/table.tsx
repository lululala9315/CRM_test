"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

function Table({ className, ...props }: React.ComponentProps<"table">) {
  return (
    <div
      data-slot="table-container"
      className="relative w-full"
    >
      <table
        data-slot="table"
        className={cn(
          "w-full caption-bottom border-separate border-spacing-0",
          // 카드 둥근 모서리에 자식 셀 맞추기
          "[&>thead>tr:first-child>th:first-child]:rounded-tl-lg",
          "[&>thead>tr:first-child>th:last-child]:rounded-tr-lg",
          "[&>tbody>tr:last-child>td:first-child]:rounded-bl-lg",
          "[&>tbody>tr:last-child>td:last-child]:rounded-br-lg",
          className
        )}
        {...props}
      />
    </div>
  )
}

function TableHeader({ className, ...props }: React.ComponentProps<"thead">) {
  return (
    <thead
      data-slot="table-header"
      className={cn("sticky top-0 z-10", className)}
      {...props}
    />
  )
}

function TableBody({ className, ...props }: React.ComponentProps<"tbody">) {
  return (
    <tbody
      data-slot="table-body"
      // border-separate에서 셀 단위 border 처리. 마지막 row 셀의 border-b 제거
      className={cn("[&>tr:last-child>td]:border-b-0", className)}
      {...props}
    />
  )
}

function TableFooter({ className, ...props }: React.ComponentProps<"tfoot">) {
  return (
    <tfoot
      data-slot="table-footer"
      className={cn(
        "border-t bg-fill-normal font-medium [&>tr]:last:border-b-0",
        className
      )}
      {...props}
    />
  )
}

function TableRow({ className, ...props }: React.ComponentProps<"tr">) {
  return (
    <tr
      data-slot="table-row"
      // border-separate에서 tr border 동작 안 함 → 셀(TableCell)에 border-b 적용
      // hover는 매우 미세하게 (alpha 2%) — 진해지지 않으면서 인터랙션 신호
      className={cn(
        "transition-[background-color] duration-100 hover:bg-alpha-black-02 has-aria-expanded:bg-alpha-black-05 data-[state=selected]:bg-blue-tint data-[state=selected]:hover:bg-primary-subtle-hover",
        className
      )}
      {...props}
    />
  )
}

function TableHead({ className, ...props }: React.ComponentProps<"th">) {
  return (
    <th
      data-slot="table-head"
      className={cn(
        "h-10 px-3 align-middle whitespace-nowrap text-body5-bold leading-none text-content-assistive bg-canvas-primary border-b border-subtle [&:has([role=checkbox])]:pr-0",
        className
      )}
      {...props}
    />
  )
}

function TableCell({ className, ...props }: React.ComponentProps<"td">) {
  return (
    <td
      data-slot="table-cell"
      // border-separate라 셀 단위 border-b로 행 사이 라인 표시 (alpha 보더로 시각 부드럽게)
      className={cn(
        "px-3 py-2.5 h-[44px] align-middle whitespace-nowrap text-body4-normal border-b border-divider-subtle [&:has([role=checkbox])]:pr-0",
        className
      )}
      {...props}
    />
  )
}

function TableCaption({
  className,
  ...props
}: React.ComponentProps<"caption">) {
  return (
    <caption
      data-slot="table-caption"
      className={cn("mt-4 text-sm text-muted-foreground", className)}
      {...props}
    />
  )
}

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
}
