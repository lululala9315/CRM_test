/**
 * 역할: 배정 완료 DB 페이지 — 배정된 DB 재배정 관리
 * 주요 기능: 조직도, KPI + 필터·테이블 통합 카드
 */

import { AssignedDbFilter } from "@/components/dashboard/assigned-db-filter"
import { AssignedDbTable } from "@/components/dashboard/assigned-db-table"
import { BusinessTree } from "@/components/business-tree"
import { TitleObserver } from "@/components/title-observer"
import { PageHeader } from "@/components/page-header"

export default function AssignedDbPage() {
  return (
    <div className="h-full overflow-y-auto overflow-x-hidden bg-canvas-tertiary scrollbar-hide flex flex-col min-h-full">

      <PageHeader title="배정 완료 DB" subtitle="배정된 DB를 다른 설계사에게 재배정 할 수 있습니다" />
      <TitleObserver />

      {/* 콘텐츠 — 조직도 + 필터/KPI/테이블 카드 */}
      <div className="flex gap-3 px-6 pb-15 items-start">
        <BusinessTree />
        <div className="flex-1 min-w-0">
          <div className="mb-4"><AssignedDbFilter /></div>
          <AssignedDbTable />
        </div>
      </div>

    </div>
  )
}
