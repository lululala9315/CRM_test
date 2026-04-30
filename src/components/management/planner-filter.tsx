"use client"

/**
 * 역할: 설계사 필터 — 기수 + 이름 + 휴대폰 + 소속/직책/활동상태 셀렉트
 * 주요 기능: SearchFilter 패턴 기반, 설계사 전용 필터 구성
 */

import { SearchFilter } from "@/components/dashboard/search-filter"

export function PlannerFilter() {
  return (
    <SearchFilter
      showPlanner={false}
      extraSelects={[
        {
          label: "기수",
          defaultValue: "all-generation",
          options: [
            { value: "all-generation", label: "전체" },
            { value: "1st", label: "1기" },
            { value: "2nd", label: "2기" },
            { value: "3rd", label: "3기" },
          ],
        },
        {
          label: "소속",
          defaultValue: "all-org",
          options: [
            { value: "all-org", label: "전체" },
            { value: "hq", label: "본사" },
            { value: "div1", label: "사업단 1" },
            { value: "div2", label: "사업단 2" },
          ],
        },
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
