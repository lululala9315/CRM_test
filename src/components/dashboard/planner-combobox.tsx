"use client"

/**
 * 역할: 담당설계사 검색 Combobox — Popover + Command 패턴
 * 주요 기능: 100명 이상 설계사 목록에서 이름 검색 후 선택, "전체" 기본값
 */

import { useState } from "react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { Check, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"


// 목업 설계사 목록 — 실제로는 API에서 가져올 데이터
const PLANNERS = [
  { value: "all", label: "담당 설계사 전체" },
  { value: "hong", label: "홍길동" },
  { value: "kim-cs", label: "김철수" },
  { value: "lee-yh", label: "이영희" },
  { value: "park-jh", label: "박지현" },
  { value: "choi-mj", label: "최민준" },
  { value: "jung-sh", label: "정수현" },
  { value: "kang-hy", label: "강하윤" },
  { value: "yoon-jw", label: "윤지우" },
  { value: "shin-ys", label: "신예슬" },
  { value: "han-dh", label: "한도현" },
]

type PlannerComboboxProps = {
  value?: string
  onValueChange?: (value: string) => void
}

export function PlannerCombobox({ value: controlledValue, onValueChange }: PlannerComboboxProps = {}) {
  const [open, setOpen] = useState(false)
  const [internalValue, setInternalValue] = useState("all")

  const selected = controlledValue ?? internalValue
  const handleSelect = (v: string) => {
    if (controlledValue === undefined) setInternalValue(v)
    onValueChange?.(v)
    setOpen(false)
  }

  const selectedLabel = PLANNERS.find(p => p.value === selected)?.label ?? "담당 설계사 전체"

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          className="flex h-8 items-center justify-between gap-1.5 rounded-md border border-line-subtle bg-fill-filter px-2.5 text-[13px] text-content-primary shadow-none transition-[color,background-color,border-color] min-w-[170px] hover:bg-primary/5 hover:border-primary/30 hover:text-primary focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          <span className="truncate">{selectedLabel}</span>
          <ChevronDown className="h-3.5 w-3.5 shrink-0 text-content-assistive" />
        </button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[220px] p-0 rounded-md border-line-subtle"
        align="start"
        sideOffset={4}
      >
        <Command>
          <CommandInput
            placeholder="설계사 검색..."
            className="h-8 text-[13px]"
          />
          <CommandList className="max-h-[240px]">
            <CommandEmpty className="py-4 text-center text-[13px] text-content-assistive">
              검색 결과 없음
            </CommandEmpty>
            <CommandGroup>
              {PLANNERS.map((planner) => (
                <CommandItem
                  key={planner.value}
                  value={planner.label}
                  onSelect={() => handleSelect(planner.value)}
                  className="text-[13px] gap-2"
                >
                  <Check
                    className={cn(
                      "h-3.5 w-3.5 shrink-0",
                      selected === planner.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {planner.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
