/**
 * 역할: 계약 예정 고객 페이지 — 계약 진행을 약속한 고객 목록 뷰
 * 주요 기능: 조직도 탐색, 필터 카드, 고객 테이블
 */

import { PendingFilter } from "@/components/dashboard/pending-filter"
import { PendingTable } from "@/components/dashboard/pending-table"
import { BusinessTree } from "@/components/business-tree"
import { PageHeader } from "@/components/page-header"
import { Footer } from "@/components/footer"

export default function PendingPage() {
  return (
    <div className="h-full overflow-y-auto overflow-x-hidden bg-canvas-secondary scrollbar-hide flex flex-col min-h-full">

      <PageHeader title="계약 예정 고객" subtitle="계약 진행을 약속한 고객을 관리할 수 있습니다" />

      {/* 콘텐츠 — 조직도 + 카드들 */}
      <div className="flex gap-3 px-6 pb-15 items-start">
        <BusinessTree />
        <div className="flex-1 min-w-0">
          <div className="mb-4"><PendingFilter /></div>
          <PendingTable />
        </div>
      </div>

      <Footer />
    </div>
  )
}
