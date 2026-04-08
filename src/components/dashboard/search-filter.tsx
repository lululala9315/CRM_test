"use client"

/**
 * 역할: 공통 검색 필터 바 — 담당설계사 + 고객명 + 추가 셀렉트(선택) + 검색 + 초기화
 * 주요 기능: h-8 통일, 페이지별 extraFilters로 추가 필터 주입 가능
 */

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { PlannerCombobox } from "@/components/dashboard/planner-combobox"
import { Search, RotateCcw } from "lucide-react"

export type FilterSelectOption = {
  value: string
  label: string
}

type SearchFilterProps = {
  // 추가 셀렉트 필터 목록 (사유 등)
  extraSelects?: {
    defaultValue: string
    options: FilterSelectOption[]
  }[]
  // 추가 커스텀 요소 — 고객명 Input 뒤, 검색 버튼 앞에 배치 (multi-select 등)
  extraElements?: React.ReactNode
  // 검색+초기화 버튼 뒤에 삽입되는 추가 요소 (체크박스 등)
  children?: React.ReactNode
}

export function SearchFilter({ extraSelects, extraElements, children }: SearchFilterProps) {
  return (
    <div className="flex items-center gap-1.5 flex-wrap">

      {/* 담당설계사 Combobox — 검색 가능 */}
      <PlannerCombobox />

      {/* 고객명 Input */}
      <div className="relative flex items-center">
        <Search className="pointer-events-none absolute left-2.5 h-3.5 w-3.5 text-muted-foreground" />
        <Input
          className="!h-8 w-[160px] rounded-md border-border/60 pl-8 shadow-none bg-background text-[13px] placeholder:text-muted-foreground/80"
          placeholder="고객명 검색"
        />
      </div>

      {/* 추가 셀렉트 필터 (사유 등) */}
      {extraSelects?.map((filter, i) => (
        <ExtraSelect key={i} defaultValue={filter.defaultValue} options={filter.options} />
      ))}

      {/* 추가 커스텀 요소 (multi-select 등) */}
      {extraElements}

      {/* 검색 */}
      <Button
        size="sm"
        className="px-4 rounded-md bg-primary/10 text-primary hover:bg-primary/20 active:scale-95 shadow-none"
      >
        검색
      </Button>

      {/* 초기화 */}
      <Button
        variant="outline"
        size="icon-sm"
        className="rounded-md border-border/60 hover:bg-muted/50 active:scale-95 shadow-none"
      >
        <RotateCcw className="h-3.5 w-3.5 text-muted-foreground" />
      </Button>

      {/* 추가 요소 (체크박스 등) */}
      {children}

    </div>
  )
}

// 추가 셀렉트 내부 컴포넌트 — 각자 state 관리
function ExtraSelect({ defaultValue, options }: { defaultValue: string; options: FilterSelectOption[] }) {
  const [value, setValue] = useState(defaultValue)

  return (
    <Select value={value} onValueChange={setValue}>
      <SelectTrigger size="sm" className="min-w-[120px] rounded-md border-border/60 shadow-none bg-background gap-1.5 text-[13px] text-foreground">
        <SelectValue />
      </SelectTrigger>
      <SelectContent className="rounded-md border-border/60 text-[13px]">
        {options.map((opt) => (
          <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
