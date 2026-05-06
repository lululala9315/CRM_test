/**
 * 역할: 재배정 타입 설정 페이지 — 배정 설정 관리 하위
 * 주요 기능: 재배정 시 사유 타입 목록 조회 및 사용 여부 설정
 */

import { ReassignTypeSettings } from "@/components/settings/reassign-type-settings"
import { PageHeader } from "@/components/page-header"
import { Footer } from "@/components/footer"

export default function ReassignTypePage() {
  return (
    <div className="h-full overflow-y-auto overflow-x-hidden bg-canvas-secondary scrollbar-hide flex flex-col min-h-full">

      <PageHeader title="재배정 타입 설정" subtitle="다른 설계사에게 고객 재배정 시, 사유를 설정할 수 있습니다" />

      {/* 콘텐츠 */}
      <div className="flex-1 px-6 pb-15">
        <ReassignTypeSettings />
      </div>

      <Footer />
    </div>
  )
}
