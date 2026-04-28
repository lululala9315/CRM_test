/**
 * 역할: 운영/관리자 상세 페이지 — 대기 상태 직원 정보 + 승인/거절 액션
 * 주요 기능: 기본정보·직책·상태 섹션, 하단 목록/수정 버튼
 */

import { MemberDetail } from "@/components/management/member-detail"
import { Button } from "@/components/ui/button"
import { TitleObserver } from "@/components/title-observer"

export default function AdminDetailPage() {
  return (
    <div className="h-full overflow-y-auto overflow-x-hidden bg-canvas-tertiary scrollbar-hide flex flex-col min-h-full">

      {/* 페이지 타이틀 */}
      <div className="px-6 pt-10 pb-6 border-b border-line-subtle">
        <h1 className="text-heading-xl text-content-primary">운영/관리자</h1>
        <p className="text-[14px] text-content-assistive mt-2">
          서비스를 이용하는 직원을 관리할 수 있습니다
        </p>
      </div>
      <TitleObserver />

      {/* 콘텐츠 */}
      <div className="flex-1 px-6 py-8">
        <MemberDetail variant="admin" />
      </div>

      {/* 하단 액션 바 */}
      <div className="px-6 py-4 border-t border-line-subtle flex items-center justify-end gap-2">
        <Button variant="outline" size="default" className="shadow-none">
          목록
        </Button>
        <Button
          size="default"
          className="bg-foreground text-inverse-primary hover:bg-foreground/85 shadow-none"
        >
          수정
        </Button>
      </div>

    </div>
  )
}
