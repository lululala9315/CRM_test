"use client"

/**
 * 역할: 지역 multi-select 드롭다운 — Popover + Checkbox
 * 주요 기능: "지역 전체" 또는 선택된 지역 개수 표시, 체크박스 토글
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

  // "전체" 토글 — 전체 선택 또는 전체 해제
  const toggleAll = () => {
    setSelectedRegions(allChecked ? [] : [...REGIONS])
  }

  // 개별 지역 토글
  const toggleRegion = (region: string) => {
    setSelectedRegions(prev => {
      if (prev.includes(region)) {
        return prev.filter(r => r !== region)
      }
      return [...prev, region]
    })
  }

  // 트리거 텍스트
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
            "flex h-8 items-center justify-between gap-1.5 rounded-md border border-border/60 bg-background px-2.5 text-[13px] shadow-none transition-colors min-w-[120px]",
            "hover:bg-muted/50 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
            isAll ? "text-foreground" : "text-foreground"
          )}
        >
          <span className="truncate">{displayText}</span>
          <ChevronDown className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
        </button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[240px] p-2 rounded-md border-border/60"
        align="start"
        sideOffset={4}
      >
        {/* 전체 선택 */}
        <label className="flex items-center gap-2 px-2 py-1.5 rounded-md cursor-pointer hover:bg-muted/50">
          <Checkbox
            checked={allChecked}
            onCheckedChange={toggleAll}
            className="h-4 w-4 rounded-[4px] border-border/60 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
          />
          <span className="text-[13px] font-medium text-foreground">전체</span>
        </label>

        {/* 구분선 */}
        <div className="mx-2 my-1 h-px bg-border/30" />

        {/* 개별 지역 — 3열 그리드 */}
        <div className="grid grid-cols-3 gap-0.5 max-h-[200px] overflow-y-auto">
          {REGIONS.map((region) => (
            <label
              key={region}
              className="flex items-center gap-1.5 px-2 py-1.5 rounded-md cursor-pointer hover:bg-muted/50"
            >
              <Checkbox
                checked={selectedRegions.includes(region)}
                onCheckedChange={() => toggleRegion(region)}
                className="h-3.5 w-3.5 rounded-[3px] border-border/60 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
              />
              <span className="text-[12px] text-foreground/80">{region}</span>
            </label>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  )
}
