/**
 * 역할: 상담 종료 고객 페이지 — 상담이 거절 또는 계약 완료로 종료된 고객 목록 뷰
 * 주요 기능: 조직도 탐색, 필터 카드, 고객 테이블
 */

import { CompletedFilter } from "@/components/dashboard/completed-filter"
import { CompletedTable } from "@/components/dashboard/completed-table"
import { BusinessTree } from "@/components/business-tree"
import { TitleObserver } from "@/components/title-observer"
import { PageHeader } from "@/components/page-header"

export default function CompletedPage() {
  return (
    <div className="h-full overflow-y-auto overflow-x-hidden bg-canvas-tertiary scrollbar-hide flex flex-col min-h-full">

      <PageHeader title="상담 종료 고객" subtitle="상담을 거절로 종료된 고객을 관리할 수 있습니다" />
      <TitleObserver />

      {/* 콘텐츠 — 조직도 + 카드들 */}
      <div className="flex gap-3 px-6 pb-15 items-start">
        <BusinessTree />
        <div className="flex-1 min-w-0">
          <div className="mb-4"><CompletedFilter /></div>
          <CompletedTable />
        </div>
      </div>

    </div>
  )
}
