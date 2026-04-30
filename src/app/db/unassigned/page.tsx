/**
 * 역할: 미배정 DB 페이지 — 미배정 고객을 설계사에게 재배정하는 관리 뷰
 * 주요 기능: 조직도, 필터 카드(별도) + 테이블 카드
 */

import { UnassignedDbFilter } from "@/components/dashboard/unassigned-db-filter"
import { UnassignedDbTable } from "@/components/dashboard/unassigned-db-table"
import { BusinessTree } from "@/components/business-tree"
import { TitleObserver } from "@/components/title-observer"
import { PageHeader } from "@/components/page-header"

export default function UnassignedDbPage() {
  return (
    <div className="h-full overflow-y-auto overflow-x-hidden bg-canvas-tertiary scrollbar-hide flex flex-col min-h-full">

      <PageHeader title="미배정 DB" subtitle="배정이 되지 않은 DB를 설계사에게 재배정 할 수 있습니다" />
      <TitleObserver />

      {/* 콘텐츠 — 조직도 + 카드들 */}
      <div className="flex gap-3 px-6 pb-15 items-start">
        <BusinessTree />
        <div className="flex-1 min-w-0">
          <div className="mb-4"><UnassignedDbFilter /></div>
          <UnassignedDbTable />
        </div>
      </div>

    </div>
  )
}
