/**
 * 역할: 재배정 타입 설정 페이지 — 배정 설정 관리 하위
 * 주요 기능: 재배정 시 사유 타입 목록 조회 및 사용 여부 설정
 */

import { ReassignTypeSettings } from "@/components/settings/reassign-type-settings"

export default function ReassignTypePage() {
  return (
    <div className="h-full overflow-y-auto overflow-x-hidden bg-muted/40 scrollbar-hide">

      {/* 페이지 타이틀 */}
      <div className="px-6 pt-10 pb-6">
        <h1 className="text-[28px] font-semibold text-foreground tracking-tight leading-tight">재배정 타입 설정</h1>
        <p className="text-[12px] text-muted-foreground mt-0.5">
          다른 설계사에게 고객 재배정 시, 사유를 설정할 수 있습니다.
        </p>
      </div>

      {/* 콘텐츠 */}
      <div className="px-6 pb-8">
        <ReassignTypeSettings />
      </div>

    </div>
  )
}
