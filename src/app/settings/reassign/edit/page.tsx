/**
 * 역할: 재배정 타입 수정 페이지 — 타입 추가·수정·삭제
 * 주요 기능: 타입 이름·설명 편집, 사용 여부 설정, 행 추가/삭제, 취소/확인
 */

import { ReassignTypeEdit } from "@/components/settings/reassign-type-edit"
import { TitleObserver } from "@/components/title-observer"
import { PageHeader } from "@/components/page-header"

export default function ReassignTypeEditPage() {
  return (
    <div className="h-full overflow-y-auto overflow-x-hidden bg-canvas-tertiary scrollbar-hide flex flex-col min-h-full">

      <PageHeader title="재배정 타입 설정" subtitle="다른 설계사에게 고객 재배정 시, 사유를 설정할 수 있습니다" />
      <TitleObserver />

      {/* 콘텐츠 */}
      <div className="flex-1 px-6 pb-15">
        <ReassignTypeEdit />
      </div>

    </div>
  )
}
