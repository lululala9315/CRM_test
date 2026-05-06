/**
 * 역할: DB 분배 현황 페이지 — 기간별 DB 공급/철회/상태 확인
 * 주요 기능: 조직도 없음, 전체 너비 테이블 카드
 */

import { DbStatusTable } from "@/components/dashboard/db-status-table"
import { PageHeader } from "@/components/page-header"
import { Footer } from "@/components/footer"

export default function DbStatusPage() {
  return (
    <div className="h-full overflow-y-auto overflow-x-hidden bg-canvas-secondary scrollbar-hide flex flex-col min-h-full">

      <PageHeader title="DB 분배 현황" subtitle="각 지점별 설계사 또는 권역별 배정된 DB 수량을 확인할 수 있습니다" />

      {/* 테이블 카드 */}
      <div className="px-6 pb-15">
        <DbStatusTable />
      </div>

      <Footer />
    </div>
  )
}
