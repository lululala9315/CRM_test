import * as React from "react"
import { Select as SelectPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
  MoreHorizontalIcon,
} from "lucide-react"

function Pagination({ className, ...props }: React.ComponentProps<"nav">) {
  return (
    <nav
      role="navigation"
      aria-label="pagination"
      data-slot="pagination"
      className={cn("mx-auto flex w-full justify-center", className)}
      {...props}
    />
  )
}

function PaginationContent({
  className,
  ...props
}: React.ComponentProps<"ul">) {
  return (
    <ul
      data-slot="pagination-content"
      className={cn("flex items-center gap-1", className)}
      {...props}
    />
  )
}

function PaginationItem({ ...props }: React.ComponentProps<"li">) {
  return <li data-slot="pagination-item" {...props} />
}

type PaginationLinkProps = {
  isActive?: boolean
} & Pick<React.ComponentProps<typeof Button>, "size"> &
  React.ComponentProps<"a">

function PaginationLink({
  className,
  isActive,
  size = "icon",
  ...props
}: PaginationLinkProps) {
  return (
    <Button
      asChild
      variant={isActive ? "outline" : "ghost"}
      size={size}
      className={cn(className)}
    >
      <a
        aria-current={isActive ? "page" : undefined}
        data-slot="pagination-link"
        data-active={isActive}
        {...props}
      />
    </Button>
  )
}

function PaginationPrevious({
  className,
  text = "Previous",
  ...props
}: React.ComponentProps<typeof PaginationLink> & { text?: string }) {
  return (
    <PaginationLink
      aria-label="Go to previous page"
      size="default"
      className={cn("pl-2!", className)}
      {...props}
    >
      <ChevronLeftIcon data-icon="inline-start" />
      <span className="hidden sm:block">{text}</span>
    </PaginationLink>
  )
}

function PaginationNext({
  className,
  text = "Next",
  ...props
}: React.ComponentProps<typeof PaginationLink> & { text?: string }) {
  return (
    <PaginationLink
      aria-label="Go to next page"
      size="default"
      className={cn("pr-2!", className)}
      {...props}
    >
      <span className="hidden sm:block">{text}</span>
      <ChevronRightIcon data-icon="inline-end" />
    </PaginationLink>
  )
}

function PaginationEllipsis({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      aria-hidden
      data-slot="pagination-ellipsis"
      className={cn(
        "flex size-9 items-center justify-center [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    >
      <MoreHorizontalIcon
      />
      <span className="sr-only">More pages</span>
    </span>
  )
}

/**
 * 7슬롯 고정 페이지네이션 — 페이지 이동 시 레이아웃 쉬프트 방지.
 * totalPages ≤ 7: 전체 노출, 그 외: 양 끝 ± 현재 페이지 주변 ± "..." 패턴.
 */
function getPageSlots(currentPage: number, totalPages: number): (number | "ellipsis")[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1)
  }
  if (currentPage <= 4) {
    return [1, 2, 3, 4, 5, "ellipsis", totalPages]
  }
  if (currentPage >= totalPages - 3) {
    return [1, "ellipsis", totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages]
  }
  return [1, "ellipsis", currentPage - 1, currentPage, currentPage + 1, "ellipsis", totalPages]
}

type PageNumbersProps = {
  totalPages: number
  currentPage: number
  onPageChange: (page: number) => void
  className?: string
}

/**
 * 7슬롯 고정 페이지 번호 + 처음/이전/다음/마지막 버튼.
 *
 * 사용 예:
 *   <PageNumbers
 *     totalPages={totalPages}
 *     currentPage={currentPage}
 *     onPageChange={setCurrentPage}
 *   />
 */
function PageNumbers({
  totalPages,
  currentPage,
  onPageChange,
  className,
}: PageNumbersProps) {
  const slots = getPageSlots(currentPage, totalPages)
  const isFirst = currentPage === 1
  const isLast = currentPage === totalPages

  return (
    <div
      data-slot="page-numbers"
      role="navigation"
      aria-label="페이지네이션"
      className={cn("flex items-center justify-center gap-1 py-2", className)}
    >
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onPageChange(1)}
        disabled={isFirst}
        aria-label="첫 페이지"
        className="h-8 w-8 p-0 rounded-md text-content-assistive hover:text-foreground hover:bg-fill-normal disabled:opacity-30"
      >
        <ChevronsLeftIcon className="h-3.5 w-3.5" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={isFirst}
        aria-label="이전 페이지"
        className="h-8 w-8 p-0 rounded-md text-content-assistive hover:text-foreground hover:bg-fill-normal disabled:opacity-30"
      >
        <ChevronLeftIcon className="h-3.5 w-3.5" />
      </Button>

      {slots.map((slot, i) =>
        slot === "ellipsis" ? (
          <span
            key={`ellipsis-${i}`}
            aria-hidden
            className="h-8 w-8 flex items-center justify-center text-body5-medium text-content-disabled"
          >
            …
          </span>
        ) : (
          <Button
            key={slot}
            variant="ghost"
            size="sm"
            onClick={() => onPageChange(slot)}
            aria-current={currentPage === slot ? "page" : undefined}
            aria-label={`${slot} 페이지`}
            className={cn(
              "h-8 w-8 p-0 rounded-md text-body5-medium tabular-nums transition-colors duration-120 active:scale-[0.97]",
              currentPage === slot
                ? "bg-fill-strong text-foreground font-semibold hover:bg-fill-strong"
                : "text-muted-foreground hover:text-foreground hover:bg-fill-muted"
            )}
          >
            {slot}
          </Button>
        )
      )}

      <Button
        variant="ghost"
        size="sm"
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={isLast}
        aria-label="다음 페이지"
        className="h-8 w-8 p-0 rounded-md text-content-assistive hover:text-foreground hover:bg-fill-normal disabled:opacity-30"
      >
        <ChevronRightIcon className="h-3.5 w-3.5" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onPageChange(totalPages)}
        disabled={isLast}
        aria-label="마지막 페이지"
        className="h-8 w-8 p-0 rounded-md text-content-assistive hover:text-foreground hover:bg-fill-normal disabled:opacity-30"
      >
        <ChevronsRightIcon className="h-3.5 w-3.5" />
      </Button>
    </div>
  )
}

type PageSizeSelectProps = {
  value: string
  onValueChange: (value: string) => void
  options?: number[]
  className?: string
}

/**
 * 페이지 사이즈 선택 셀렉트 — 툴바용 미니 셀렉트.
 *
 * 사용 예:
 *   <PageSizeSelect
 *     value={pageSize}
 *     onValueChange={(v) => { setPageSize(v); setCurrentPage(1) }}
 *   />
 */
function PageSizeSelect({
  value,
  onValueChange,
  options = [10, 20, 50],
  className,
}: PageSizeSelectProps) {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectPrimitive.Trigger
        data-slot="page-size-select"
        className={cn(
          "h-7 pl-2 pr-1 inline-flex items-center gap-0.5 rounded-md text-[13px] font-medium text-content-tertiary hover:bg-fill-subtle hover:text-content-primary outline-none transition-colors data-placeholder:text-content-tertiary [&>span]:line-clamp-1",
          className
        )}
      >
        <SelectPrimitive.Value />
        <SelectPrimitive.Icon asChild>
          {/* arrow_drop_down — Material Symbols 모양의 filled triangle */}
          <svg className="size-4 shrink-0 -mr-0.5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M7 10l5 5 5-5z" />
          </svg>
        </SelectPrimitive.Icon>
      </SelectPrimitive.Trigger>
      <SelectContent
        position="popper"
        side="bottom"
        align="end"
        sideOffset={4}
        className="min-w-[var(--radix-select-trigger-width)] rounded-md border-subtle text-body4-normal"
      >
        {options.map((opt) => (
          <SelectItem key={opt} value={String(opt)}>
            {opt}건
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

export {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PageNumbers,
  PageSizeSelect,
}
