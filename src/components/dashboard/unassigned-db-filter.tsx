"use client"

/**
 * 역할: 미배정 DB 필터 — 담당설계사 없이 고객명 + 지역만 사용
 * 주요 기능: SearchFilter(showPlanner=false) + RegionMultiSelect
 */

import { SearchFilter } from "@/components/dashboard/search-filter"
import { RegionMultiSelect } from "@/components/dashboard/region-multi-select"

export function UnassignedDbFilter() {
  return (
    <SearchFilter
      showPlanner={false}
      extraElements={<RegionMultiSelect />}
    />
  )
}
