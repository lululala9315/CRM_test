/**
 * 역할: 상담 진행 고객 페이지 — 보험설계사 CRM 메인 뷰
 * 주요 기능: 통계 요약, 고객 필터링, 조직도 탐색, 칸반 보드
 */

import { KanbanFilter } from "@/components/dashboard/kanban-filter"
import { ConsultingSection } from "@/components/dashboard/consulting-section"
import { StatsSection } from "@/components/dashboard/stats-section"
import { BusinessTree } from "@/components/business-tree"
import { Footer } from "@/components/footer"
import { TitleObserver } from "@/components/title-observer"

export default function Home() {
  return (
    <div className="h-full overflow-y-auto overflow-x-hidden bg-canvas-tertiary scrollbar-hide flex flex-col min-h-full">

      {/* 페이지 타이틀 */}
      <div className="px-6 pt-10 pb-6">
        <h1 className="text-heading-xl text-content-primary">상담 진행 고객</h1>
        <p className="text-[14px] text-content-assistive mt-2">
          배정된 고객의 상담 상태를 관리합니다
        </p>
      </div>
      <TitleObserver />

      {/* 콘텐츠 — 조직도 + 카드들 */}
      <div className="flex gap-3 px-6 pb-15 items-start">
        <BusinessTree />
        {/* flex-col gap-4로 필터~카드 16px 통일 (다른 페이지와 일치) */}
        <div className="flex-1 min-w-0 flex flex-col gap-4">
          <KanbanFilter />
          <StatsSection />
          <ConsultingSection />
        </div>
      </div>

      <Footer />
    </div>
  )
}
