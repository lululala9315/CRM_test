/**
 * 역할: 계약 예정 고객 페이지 — 계약 진행을 약속한 고객 목록 뷰
 * 주요 기능: 조직도 탐색, 필터 카드, 고객 테이블
 */

import { PendingFilter } from "@/components/dashboard/pending-filter"
import { PendingTable } from "@/components/dashboard/pending-table"
import { BusinessTree } from "@/components/business-tree"
import { Footer } from "@/components/footer"
import { TitleObserver } from "@/components/title-observer"

export default function PendingPage() {
  return (
    <div className="h-full overflow-y-auto overflow-x-hidden bg-canvas-tertiary scrollbar-hide flex flex-col min-h-full">

      {/* 페이지 타이틀 */}
      <div className="px-6 pt-10 pb-6">
        <h1 className="text-[28px] font-semibold tracking-tight leading-tight [text-wrap:balance] text-content-primary">계약 예정 고객</h1>
        <p className="text-[14px] text-content-assistive mt-2">
          계약 진행을 약속한 고객을 관리할 수 있습니다
        </p>
      </div>
      <TitleObserver />

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
