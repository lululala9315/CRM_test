/**
 * 역할: 배정 완료 DB 페이지 — 배정된 DB 재배정 관리
 * 주요 기능: 조직도, 필터 카드(별도) + KPI+테이블 카드
 */

import { BusinessTree } from "@/components/dashboard/business-tree"
import { AssignedDbFilter } from "@/components/dashboard/assigned-db-filter"
import { AssignedDbTable } from "@/components/dashboard/assigned-db-table"

const SHOW_ORG_TREE = true

export default function AssignedDbPage() {
  return (
    <div className="h-full overflow-y-auto overflow-x-hidden bg-muted/40 scrollbar-hide">

      {/* 페이지 타이틀 */}
      <div className="px-6 pt-10 pb-6">
        <h1 className="text-[28px] font-semibold text-foreground tracking-tight leading-tight">배정 완료 DB</h1>
        <p className="text-[12px] text-muted-foreground mt-0.5">
          배정된 DB를 다른 설계사에게 재배정 할 수 있습니다
        </p>
      </div>

      {/* 조직도 + 콘텐츠 */}
      <div className="flex gap-2 px-6 pb-5 items-start">
        <BusinessTree visible={SHOW_ORG_TREE} />
        <div className="flex-1 min-w-0 flex flex-col gap-2">
          {/* 필터 카드 */}
          <div className="bg-card rounded-lg border border-border/40 px-6 py-5">
            <AssignedDbFilter />
          </div>
          {/* KPI + 테이블 카드 */}
          <AssignedDbTable />
        </div>
      </div>

    </div>
  )
}
