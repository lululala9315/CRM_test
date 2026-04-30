/**
 * 역할: 설계사 페이지 — 설계사 목록 관리
 * 주요 기능: 조직도, 필터 카드, KPI + 체크박스 테이블 카드
 */

import { PlannerFilter } from "@/components/management/planner-filter"
import { PlannerTable } from "@/components/management/planner-table"
import { BusinessTree } from "@/components/business-tree"
import { TitleObserver } from "@/components/title-observer"
import { PageHeader } from "@/components/page-header"

export default function PlannerPage() {
  return (
    <div className="h-full overflow-y-auto overflow-x-hidden bg-canvas-tertiary scrollbar-hide flex flex-col min-h-full">

      <PageHeader title="설계사" subtitle="보험 설계/상담업무를 진행하는 설계사를 관리할 수 있습니다" />
      <TitleObserver />

      {/* 콘텐츠 — 조직도 + 카드들 */}
      <div className="flex-1 flex gap-3 px-6 pb-15 items-start">
        <BusinessTree />
        <div className="flex-1 min-w-0">
          <div className="mb-4"><PlannerFilter /></div>
          <PlannerTable />
        </div>
      </div>

    </div>
  )
}
