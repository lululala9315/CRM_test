/**
 * 역할: 자동 회수 설정 페이지
 * 주요 기능: 배정 후 미상담 시 자동 회수 시간 설정
 */

import { RecallSettings } from "@/components/settings/recall-settings"
import { Footer } from "@/components/footer"
import { TitleObserver } from "@/components/title-observer"

export default function RecallPage() {
  return (
    <div className="h-full overflow-y-auto overflow-x-hidden bg-canvas-tertiary scrollbar-hide flex flex-col min-h-full">
      <div className="px-6 pt-10 pb-6">
        <h1 className="text-[28px] font-semibold tracking-tight leading-tight [text-wrap:balance] text-content-primary">자동 회수 설정</h1>
        <p className="text-[14px] text-content-assistive mt-2">
          배정 후, 상담 미 시도시 DB를 자동으로 회수할 수 있습니다
        </p>
      </div>
      <TitleObserver />
      <div className="flex-1 px-6 pb-15">
        <RecallSettings />
      </div>
      <Footer />
    </div>
  )
}
