"use client"

/**
 * 역할: 통화 조건 multi-select 드롭다운 — Popover + Checkbox
 * 주요 기능: 유효통화없음 / 통화 미시도 체크박스 선택
 */

import { useState } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

const CONDITIONS = [
  { id: "noValidCall", label: "유효통화없음" },
  { id: "missedCall", label: "통화 미시도" },
] as const

export function CallConditionSelect() {
  const [selected, setSelected] = useState<string[]>([])
  const [open, setOpen] = useState(false)

  const toggle = (id: string) => {
    setSelected(prev =>
      prev.includes(id) ? prev.filter(v => v !== id) : [...prev, id]
    )
  }

  const displayText = selected.length === 0 || selected.length === CONDITIONS.length
    ? "전체"
    : CONDITIONS.filter(c => selected.includes(c.id)).map(c => c.label).join(", ")

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          className={cn(
            "flex h-9 items-center justify-between gap-1.5 rounded-md border border-subtle bg-fill-filter px-2.5 text-[13px] shadow-none transition-[color,background-color,border-color] min-w-[120px]",
            "hover:bg-blue-tint hover:border-info hover:text-primary focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring-glow",
            "text-content-primary"
          )}
        >
          <span className="flex items-center gap-1 min-w-0 flex-1">
            <span className="text-content-assistive shrink-0">통화조건</span>
            <span className="text-content-disabled shrink-0">·</span>
            <span className="truncate">{displayText}</span>
          </span>
          <ChevronDown className="h-3.5 w-3.5 shrink-0 text-content-assistive" />
        </button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[180px] p-2 rounded-md border-subtle"
        align="start"
        sideOffset={4}
      >
        {CONDITIONS.map((condition) => (
          <label
            key={condition.id}
            className="flex items-center gap-2 px-2 py-1.5 rounded-md cursor-pointer hover:bg-fill-normal"
          >
            <Checkbox
              checked={selected.includes(condition.id)}
              onCheckedChange={() => toggle(condition.id)}
              className="h-4 w-4 rounded-sm border-subtle data-[state=checked]:bg-primary data-[state=checked]:border-primary"
            />
            <span className="text-[13px] font-medium text-content-secondary">{condition.label}</span>
          </label>
        ))}
      </PopoverContent>
    </Popover>
  )
}
