/**
 * 역할: 자동 회수 설정 페이지
 * 주요 기능: 배정 후 미상담 시 자동 회수 시간 설정
 */

import { RecallSettings } from "@/components/settings/recall-settings"
import { PageHeader } from "@/components/page-header"
import { Footer } from "@/components/footer"

export default function RecallPage() {
  return (
    <div className="h-full overflow-y-auto overflow-x-hidden bg-canvas-secondary scrollbar-hide flex flex-col min-h-full">
      <PageHeader title="자동 회수 설정" subtitle="배정 후, 상담 미 시도시 DB를 자동으로 회수할 수 있습니다" />
      <div className="flex-1 px-6 pb-15">
        <RecallSettings />
      </div>
      <Footer />
    </div>
  )
}
