/**
 * 역할: 마이페이지 — 프로필 클릭 시 노출되는 개인정보 페이지
 */

import { MypageSettings } from "@/components/settings/mypage-settings"
import { Footer } from "@/components/footer"
import { TitleObserver } from "@/components/title-observer"

export default function MypagePage() {
  return (
    <div className="h-full overflow-y-auto overflow-x-hidden bg-canvas-tertiary scrollbar-hide flex flex-col min-h-full">
      <div className="px-6 pt-10 pb-6">
        <h1 className="text-[28px] font-semibold tracking-tight leading-tight [text-wrap:balance] text-content-primary">마이페이지</h1>
        <p className="text-[14px] text-content-assistive mt-2">개인정보를 확인하고 수정할 수 있습니다</p>
      </div>
      <TitleObserver />
      <div className="px-6 pt-6 pb-15">
        <MypageSettings />
      </div>
      <Footer />
    </div>
  )
}
