"use client"

/**
 * 역할: 배정 완료 DB 필터 — 공통 SearchFilter + 통화조건 + 지역 (각각 별도 드롭다운)
 * 주요 기능: 1줄 필터바 (담당설계사 + 고객명 + 통화조건 + 지역 + 검색 + 초기화)
 */

import { SearchFilter } from "@/components/dashboard/search-filter"
import { CallConditionSelect } from "@/components/dashboard/call-condition-select"
import { RegionMultiSelect } from "@/components/dashboard/region-multi-select"

export function AssignedDbFilter() {
  return (
    <SearchFilter
      extraElements={
        <>
          <CallConditionSelect />
          <RegionMultiSelect />
        </>
      }
    />
  )
}
