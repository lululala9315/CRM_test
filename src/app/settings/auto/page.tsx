/**
 * 역할: 자동 배정 설정 페이지
 * 주요 기능: 자동 배정 사용 여부 설정
 */

import { AutoAssignSettings } from "@/components/settings/auto-assign-settings"

export default function AutoAssignPage() {
  return (
    <div className="h-full overflow-y-auto overflow-x-hidden bg-muted/40 scrollbar-hide">
      <div className="px-6 pt-10 pb-6">
        <h1 className="text-[28px] font-semibold text-foreground tracking-tight leading-tight">자동 배정 설정</h1>
        <p className="text-[12px] text-muted-foreground mt-0.5">
          설계사에게 자동 배정 여부를 설정할 수 있습니다.
        </p>
      </div>
      <div className="px-6 pb-8">
        <AutoAssignSettings />
      </div>
    </div>
  )
}
