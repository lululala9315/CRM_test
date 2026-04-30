/**
 * 역할: 마이페이지 — 프로필 클릭 시 노출되는 개인정보 페이지
 */

import { MypageSettings } from "@/components/settings/mypage-settings"
import { TitleObserver } from "@/components/title-observer"
import { PageHeader } from "@/components/page-header"

export default function MypagePage() {
  return (
    <div className="h-full overflow-y-auto overflow-x-hidden bg-canvas-tertiary scrollbar-hide flex flex-col min-h-full">
      <PageHeader title="마이페이지" subtitle="개인정보를 확인하고 수정할 수 있습니다" />
      <TitleObserver />
      <div className="px-6 pt-6 pb-15">
        <MypageSettings />
      </div>
    </div>
  )
}
