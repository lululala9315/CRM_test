/**
 * 역할: 상담 진행 고객 페이지 — 보험설계사 CRM 메인 뷰
 * 주요 기능: 통계 요약, 고객 필터링, 조직도 탐색, 칸반 보드
 */

import { BusinessTree } from "@/components/dashboard/business-tree"
import { ConsultingSection } from "@/components/dashboard/consulting-section"

const SHOW_ORG_TREE = true

export default function Home() {
  return (
    <div className="h-full overflow-y-auto overflow-x-hidden bg-muted/40 scrollbar-hide">

      {/* 페이지 타이틀 */}
      <div className="px-6 pt-10 pb-6">
        <h1 className="text-[28px] font-semibold text-foreground tracking-tight leading-tight">상담 진행 고객</h1>
        <p className="text-[12px] text-muted-foreground mt-0.5">
          배정된 고객의 상담 상태를 관리합니다
        </p>
      </div>

      {/* 조직도 + 콘텐츠 */}
      <div className="flex gap-2 px-6 pb-5 items-start">

        <BusinessTree visible={SHOW_ORG_TREE} />

        <div className="flex-1 min-w-0 flex flex-col gap-3">

          {/* 통합 카드 — 필터 + 통화현황 + 칸반 */}
          <ConsultingSection />

        </div>
      </div>

    </div>
  )
}
