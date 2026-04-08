"use client"

/**
 * 역할: 배정 완료 DB 필터 — 공통 SearchFilter + 지역 multi-select + 통화 조건 체크박스
 * 주요 기능: 1줄 필터바 (담당설계사 + 고객명 + 지역 + 검색 + 초기화 + 체크박스)
 */

import { useState } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { SearchFilter } from "@/components/dashboard/search-filter"
import { RegionMultiSelect } from "@/components/dashboard/region-multi-select"

export function AssignedDbFilter() {
  const [noCall, setNoCall] = useState(false)
  const [missedCall, setMissedCall] = useState(false)

  return (
    <SearchFilter
      extraElements={<RegionMultiSelect />}
    >
      <div className="flex items-center gap-4 ml-1">
        <label className="flex items-center gap-1.5 cursor-pointer">
          <Checkbox
            checked={noCall}
            onCheckedChange={(v) => setNoCall(!!v)}
            className="h-4 w-4 rounded-[4px] border-border/60 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
          />
          <span className="text-[13px] font-medium text-foreground/70">유효통화없음</span>
        </label>
        <label className="flex items-center gap-1.5 cursor-pointer">
          <Checkbox
            checked={missedCall}
            onCheckedChange={(v) => setMissedCall(!!v)}
            className="h-4 w-4 rounded-[4px] border-border/60 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
          />
          <span className="text-[13px] font-medium text-foreground/70">통화 미시도</span>
        </label>
      </div>
    </SearchFilter>
  )
}
