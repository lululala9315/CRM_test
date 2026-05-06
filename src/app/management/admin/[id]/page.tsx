/**
 * 역할: 운영/관리자 상세 페이지 — 대기 상태 직원 정보 + 승인/거절 액션
 * 주요 기능: 기본정보·직책·상태 섹션, 하단 목록/수정 버튼
 */

import { MemberDetail } from "@/components/management/member-detail"
import { Button } from "@/components/ui/button"
import { PageHeader } from "@/components/page-header"
import { Footer } from "@/components/footer"

export default function AdminDetailPage() {
  return (
    <div className="h-full overflow-y-auto overflow-x-hidden bg-canvas-secondary scrollbar-hide flex flex-col min-h-full">

      <PageHeader title="운영/관리자" subtitle="서비스를 이용하는 직원을 관리할 수 있습니다" bordered />

      {/* 콘텐츠 */}
      <div className="flex-1 px-6 py-8">
        <MemberDetail variant="admin" />
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

      <Footer />
    </div>
  )
}
