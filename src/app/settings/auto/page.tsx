/**
 * 역할: 자동 배정 설정 페이지
 * 주요 기능: 자동 배정 사용 여부 설정
 */

import { AutoAssignSettings } from "@/components/settings/auto-assign-settings"
import { Footer } from "@/components/footer"
import { TitleObserver } from "@/components/title-observer"

export default function AutoAssignPage() {
  return (
    <div className="h-full overflow-y-auto overflow-x-hidden bg-canvas-tertiary scrollbar-hide flex flex-col min-h-full">
      <div className="px-6 pt-10 pb-6">
        <h1 className="text-[28px] font-semibold tracking-tight leading-tight [text-wrap:balance] text-content-primary">자동 배정 설정</h1>
        <p className="text-[14px] text-content-assistive mt-2">
          설계사에게 자동 배정 여부를 설정할 수 있습니다
        </p>
      </div>
      <TitleObserver />
      <div className="flex-1 px-6 pb-15">
        <AutoAssignSettings />
      </div>
      <Footer />
    </div>
  )
}
