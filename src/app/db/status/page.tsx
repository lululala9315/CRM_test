/**
 * 역할: DB 분배 현황 페이지 — 기간별 DB 공급/철회/상태 확인
 * 주요 기능: 조직도 없음, 전체 너비 테이블 카드
 */

import { DbStatusTable } from "@/components/dashboard/db-status-table"
import { Footer } from "@/components/footer"
import { TitleObserver } from "@/components/title-observer"

export default function DbStatusPage() {
  return (
    <div className="h-full overflow-y-auto overflow-x-hidden bg-canvas-tertiary scrollbar-hide flex flex-col min-h-full">

      {/* 페이지 타이틀 */}
      <div className="px-6 pt-10 pb-6">
        <h1 className="text-[28px] font-semibold tracking-tight leading-tight [text-wrap:balance] text-content-primary">DB 분배 현황</h1>
        <p className="text-[14px] text-content-assistive mt-2">
          각 지점별 설계사 또는 권역별 배정된 DB 수량을 확인할 수 있습니다
        </p>
      </div>
      <TitleObserver />

      {/* 테이블 카드 */}
      <div className="px-6 pb-15">
        <DbStatusTable />
      </div>

      <Footer />
    </div>
  )
}
