"use client"

/**
 * 역할: 공통 검색 필터 바 — 담당설계사 + 고객명 + 추가 셀렉트(선택) + 초기화
 * 주요 기능: h-9 통일, 필터 변경 시에만 초기화 버튼 노출, extraFilters로 추가 필터 주입 가능
 */

import { useState } from "react"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { PlannerCombobox } from "@/components/dashboard/planner-combobox"
import { Search } from "lucide-react"

export type FilterSelectOption = {
  value: string
  label: string
}

type SearchFilterProps = {
  // 담당설계사 Combobox 표시 여부 (기본 true)
  showPlanner?: boolean
  // 추가 셀렉트 필터 목록 (사유 등)
  extraSelects?: {
    label: string
    defaultValue: string
    options: FilterSelectOption[]
  }[]
  // 추가 커스텀 요소 — 고객명 Input 뒤, 초기화 버튼 앞에 배치 (multi-select 등)
  extraElements?: React.ReactNode
  // 초기화 버튼 뒤에 삽입되는 추가 요소 (체크박스 등)
  children?: React.ReactNode
}

export function SearchFilter({ showPlanner = true, extraSelects, extraElements, children }: SearchFilterProps) {
  const [plannerValue, setPlannerValue] = useState("all")
  const [inputValue, setInputValue] = useState("")
  const [extraValues, setExtraValues] = useState<string[]>(
    () => extraSelects?.map(s => s.defaultValue) ?? []
  )

  // 기본값에서 벗어난 필터가 하나라도 있으면 초기화 버튼 노출
  const hasFilter =
    plannerValue !== "all" ||
    inputValue.trim() !== "" ||
    extraValues.some((v, i) => v !== (extraSelects?.[i]?.defaultValue ?? ""))

  const handleReset = () => {
    setPlannerValue("all")
    setInputValue("")
    setExtraValues(extraSelects?.map(s => s.defaultValue) ?? [])
  }

  return (
    <div className="flex items-center gap-1.5 flex-wrap">

      {/* 담당설계사 Combobox — 검색 가능 */}
      {showPlanner && (
        <PlannerCombobox value={plannerValue} onValueChange={setPlannerValue} />
      )}

      {/* 고객명 Input */}
      <div className="relative flex items-center">
        <Search className="pointer-events-none absolute left-2.5 h-3.5 w-3.5 text-content-disabled" />
        <Input
          variant="filter"
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
          className="w-[160px] pl-8 placeholder:text-content-assistive"
          placeholder="고객명 검색"
          aria-label="고객명 검색"
        />
      </div>

      {/* 추가 셀렉트 필터 (사유 등) */}
      {extraSelects?.map((filter, i) => (
        <ExtraSelect
          key={i}
          label={filter.label}
          value={extraValues[i] ?? filter.defaultValue}
          onValueChange={v =>
            setExtraValues(prev => prev.map((ev, idx) => (idx === i ? v : ev)))
          }
          options={filter.options}
        />
      ))}

      {/* 추가 커스텀 요소 (multi-select 등) */}
      {extraElements}

      {/* 필터 변경 시에만 노출 — 언더라인 primary 텍스트 버튼 */}
      {hasFilter && (
        <button
          onClick={handleReset}
          className="h-8 px-1 text-[12px] font-medium text-primary underline underline-offset-2 decoration-primary hover:opacity-70 active:scale-[0.97] transition-[transform,opacity] duration-100"
        >
          필터 초기화
        </button>
      )}

      {/* 추가 요소 (체크박스 등) */}
      {children}

    </div>
  )
}

// 추가 셀렉트 — 부모에서 label/value/onValueChange 받아 controlled로 동작
function ExtraSelect({
  label,
  value,
  onValueChange,
  options,
}: {
  label: string
  value: string
  onValueChange: (v: string) => void
  options: FilterSelectOption[]
}) {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className="min-w-[130px] border-subtle border-border05 bg-fill-filter text-content-primary">
        <span className="flex items-center gap-1 min-w-0 flex-1">
          <span className="text-content-assistive shrink-0">{label}</span>
          <span className="text-content-disabled shrink-0">·</span>
          <SelectValue />
        </span>
      </SelectTrigger>
      <SelectContent position="popper" sideOffset={4} className="rounded-md border-subtle text-[13px]">
        {options.map((opt) => (
          <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
