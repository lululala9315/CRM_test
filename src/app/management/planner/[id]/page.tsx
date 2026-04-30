/**
 * 역할: 설계사 상세 페이지 — 대기 상태 설계사 정보 + 승인/거절 액션
 * 주요 기능: 기본정보·직책·상태 섹션, 하단 목록/수정 버튼
 */

import { MemberDetail } from "@/components/management/member-detail"
import { Button } from "@/components/ui/button"
import { TitleObserver } from "@/components/title-observer"
import { PageHeader } from "@/components/page-header"

export default function PlannerDetailPage() {
  return (
    <div className="h-full overflow-y-auto overflow-x-hidden bg-canvas-tertiary scrollbar-hide flex flex-col min-h-full">

      <PageHeader title="설계사" subtitle="보험 설계/상담업무를 진행하는 설계사를 관리할 수 있습니다" bordered />
      <TitleObserver />

      {/* 콘텐츠 */}
      <div className="flex-1 px-6 py-8">
        <MemberDetail variant="planner" />
      </div>

      {/* 하단 액션 바 */}
      <div className="px-6 py-4 border-t border-subtle flex items-center justify-end gap-2">
        <Button variant="outline" size="default" className="shadow-none">
          목록
        </Button>
        <Button
          size="default"
          className="bg-foreground text-inverse-primary hover:bg-foreground-hover shadow-none"
        >
          수정
        </Button>
      </div>

    </div>
  )
}
