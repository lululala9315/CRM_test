"use client"

/**
 * 역할: 상담 종료 고객 필터 — 공통 SearchFilter + 사유 셀렉트 추가
 */

import { SearchFilter } from "@/components/dashboard/search-filter"

const REASON_OPTIONS = [
  { value: "all", label: "전체" },
  { value: "reject", label: "상담 거절" },
  { value: "contract", label: "계약 완료" },
]

export function CompletedFilter() {
  return (
    <SearchFilter
      extraSelects={[{ label: "사유", defaultValue: "all", options: REASON_OPTIONS }]}
    />
  )
}
