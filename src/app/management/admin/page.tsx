/**
 * 역할: 운영/관리자 페이지 — 서비스를 이용하는 직원 관리
 * 주요 기능: 조직도, 필터 카드, KPI + 체크박스 테이블 카드
 */

import { AdminFilter } from "@/components/management/admin-filter"
import { AdminTable } from "@/components/management/admin-table"
import { BusinessTree } from "@/components/business-tree"
import { TitleObserver } from "@/components/title-observer"
import { PageHeader } from "@/components/page-header"

export default function AdminPage() {
  return (
    <div className="h-full overflow-y-auto overflow-x-hidden bg-canvas-tertiary scrollbar-hide flex flex-col min-h-full">

      <PageHeader title="운영/관리자" subtitle="서비스를 이용하는 직원을 관리할 수 있습니다" />
      <TitleObserver />

      {/* 콘텐츠 — 조직도 + 카드들 */}
      <div className="flex-1 flex gap-3 px-6 pb-15 items-start">
        <BusinessTree />
        <div className="flex-1 min-w-0">
          <div className="mb-4"><AdminFilter /></div>
          <AdminTable />
        </div>
      </div>

    </div>
  )
}
