/**
 * 역할: 자동 배정 설정 페이지
 * 주요 기능: 자동 배정 사용 여부 설정
 */

import { AutoAssignSettings } from "@/components/settings/auto-assign-settings"
import { TitleObserver } from "@/components/title-observer"
import { PageHeader } from "@/components/page-header"

export default function AutoAssignPage() {
  return (
    <div className="h-full overflow-y-auto overflow-x-hidden bg-canvas-tertiary scrollbar-hide flex flex-col min-h-full">
      <PageHeader title="자동 배정 설정" subtitle="설계사에게 자동 배정 여부를 설정할 수 있습니다" />
      <TitleObserver />
      <div className="flex-1 px-6 pb-15">
        <AutoAssignSettings />
      </div>
    </div>
  )
}
