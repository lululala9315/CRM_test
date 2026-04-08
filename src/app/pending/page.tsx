/**
 * 역할: 계약 예정 고객 페이지 — 계약 진행을 약속한 고객 목록 뷰
 * 주요 기능: 조직도 탐색, 고객 테이블 (필터는 카드 내부)
 */

import { BusinessTree } from "@/components/dashboard/business-tree"
import { PendingTable } from "@/components/dashboard/pending-table"

const SHOW_ORG_TREE = true

export default function PendingPage() {
  return (
    <div className="h-full overflow-y-auto overflow-x-hidden bg-muted/40 scrollbar-hide">

      {/* 페이지 타이틀 */}
      <div className="px-6 pt-10 pb-6">
        <h1 className="text-[28px] font-semibold text-foreground tracking-tight leading-tight">계약 예정 고객</h1>
        <p className="text-[12px] text-muted-foreground mt-0.5">
          계약 진행을 약속한 고객을 관리할 수 있습니다
        </p>
      </div>

      {/* 조직도 + 테이블 카드 */}
      <div className="flex gap-2 px-6 pb-5 items-start">

        <BusinessTree visible={SHOW_ORG_TREE} />

        <PendingTable />

      </div>

    </div>
  )
}
