/**
 * 역할: 자동 회수 설정 페이지
 * 주요 기능: 배정 후 미상담 시 자동 회수 시간 설정
 */

import { RecallSettings } from "@/components/settings/recall-settings"

export default function RecallPage() {
  return (
    <div className="h-full overflow-y-auto overflow-x-hidden bg-muted/40 scrollbar-hide">
      <div className="px-6 pt-10 pb-6">
        <h1 className="text-[28px] font-semibold text-foreground tracking-tight leading-tight">자동 회수 설정</h1>
        <p className="text-[12px] text-muted-foreground mt-0.5">
          배정 후, 상담 미 시도시 DB를 자동으로 회수할 수 있습니다.
        </p>
      </div>
      <div className="px-6 pb-8">
        <RecallSettings />
      </div>
    </div>
  )
}
