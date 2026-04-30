"use client"

/**
 * 역할: 운영/관리자 필터 — 공통 SearchFilter 기반 + 직책/승인/활동 셀렉트
 * 주요 기능: 배정완료 DB와 동일한 SearchFilter 패턴 사용
 */

import { SearchFilter } from "@/components/dashboard/search-filter"

export function AdminFilter() {
  return (
    <SearchFilter
      showPlanner={false}
      extraSelects={[
        {
          label: "직책",
          defaultValue: "all-position",
          options: [
            { value: "all-position", label: "전체" },
            { value: "ceo", label: "최고관리자" },
            { value: "director", label: "사업단장" },
            { value: "branch", label: "지점장" },
            { value: "team", label: "팀장" },
          ],
        },
        {
          label: "승인상태",
          defaultValue: "all-approval",
          options: [
            { value: "all-approval", label: "전체" },
            { value: "approved", label: "승인" },
            { value: "rejected", label: "거절" },
            { value: "pending", label: "대기" },
          ],
        },
        {
          label: "활동상태",
          defaultValue: "all-activity",
          options: [
            { value: "all-activity", label: "전체" },
            { value: "active", label: "정상" },
            { value: "waiting", label: "대기" },
            { value: "suspended", label: "일시제한" },
          ],
        },
      ]}
    />
  )
}
