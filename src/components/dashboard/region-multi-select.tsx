"use client"

/**
 * 역할: 지역 multi-select 드롭다운 — Popover + Checkbox
 * 주요 기능: 지역 전체/개별 선택 (통화 조건은 CallConditionSelect로 분리됨)
 */

import { useState } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

const REGIONS = [
  "서울", "경기", "인천", "부산", "대구", "광주", "대전", "울산",
  "세종", "강원", "충북", "충남", "전남", "전북", "경북", "경남", "제주",
]

export function RegionMultiSelect() {
  const [selectedRegions, setSelectedRegions] = useState<string[]>([])
  const [open, setOpen] = useState(false)

  const isAll = selectedRegions.length === 0
  const allChecked = selectedRegions.length === REGIONS.length

  const toggleAll = () => {
    setSelectedRegions(allChecked ? [] : [...REGIONS])
  }

  const toggleRegion = (region: string) => {
    setSelectedRegions(prev =>
      prev.includes(region) ? prev.filter(r => r !== region) : [...prev, region]
    )
  }

  const displayText = isAll
    ? "지역 전체"
    : selectedRegions.length === 1
      ? selectedRegions[0]
      : `${selectedRegions[0]} 외 ${selectedRegions.length - 1}개`

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          className={cn(
            "flex h-8 items-center justify-between gap-1.5 rounded-md border border-line-subtle bg-fill-filter px-2.5 text-[13px] shadow-none transition-[color,background-color,border-color] min-w-[120px]",
            "hover:bg-blue-tint hover:border-info hover:text-primary focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring-glow",
            "text-content-primary"
          )}
        >
          <span className="truncate">{displayText}</span>
          <ChevronDown className="h-3.5 w-3.5 shrink-0 text-content-assistive" />
        </button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[260px] p-0 rounded-md border-line-subtle"
        align="start"
        sideOffset={4}
      >
        <div className="p-2">
          {/* 전체 선택 */}
          <label className="flex items-center gap-2 px-2 py-1.5 rounded-md cursor-pointer hover:bg-fill-normal">
            <Checkbox
              checked={allChecked}
              onCheckedChange={toggleAll}
              className="h-4 w-4 rounded-sm border-line-subtle data-[state=checked]:bg-primary data-[state=checked]:border-primary"
            />
            <span className="text-[13px] font-medium text-content-primary">전체</span>
          </label>

          {/* 개별 지역 — 3열 그리드 */}
          <div className="mt-1 grid grid-cols-3 gap-0.5 max-h-[200px] overflow-y-auto">
            {REGIONS.map((region) => (
              <label
                key={region}
                className="flex items-center gap-1.5 px-2 py-1.5 rounded-md cursor-pointer hover:bg-fill-normal"
              >
                <Checkbox
                  checked={selectedRegions.includes(region)}
                  onCheckedChange={() => toggleRegion(region)}
                  className="h-3.5 w-3.5 rounded-sm border-line-subtle data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                />
                <span className="text-[12px] text-content-secondary">{region}</span>
              </label>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
