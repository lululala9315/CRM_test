/**
 * 역할: 마이페이지 — 프로필 클릭 시 노출되는 개인정보 페이지
 */

import { MypageSettings } from "@/components/settings/mypage-settings"

export default function MypagePage() {
  return (
    <div className="h-full overflow-y-auto overflow-x-hidden bg-muted/40 scrollbar-hide">
      <div className="px-6 pt-10 pb-6">
        <h1 className="text-[28px] font-semibold text-foreground tracking-tight leading-tight">마이페이지</h1>
        <p className="text-[12px] text-muted-foreground mt-0.5">개인정보를 확인하고 수정할 수 있습니다.</p>
      </div>
      <div className="px-6 pt-6 pb-10">
        <MypageSettings />
      </div>
    </div>
  )
}
