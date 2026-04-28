/**
 * 역할: 직책·권한 설정 페이지 — 조직 및 관리 체계 하위
 * 주요 기능: 직책/직급 목록 조회, 업무 권한 및 사용 여부 관리, 등록
 */

import { RolesFilter } from "@/components/organization/roles-filter"
import { RolesTable } from "@/components/organization/roles-table"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { TitleObserver } from "@/components/title-observer"

export default function RolesPage() {
  return (
    <div className="h-full overflow-y-auto overflow-x-hidden bg-canvas-tertiary scrollbar-hide flex flex-col min-h-full">

      {/* 타이틀 + 등록 버튼 */}
      <div className="px-6 pt-10 pb-6 flex items-start justify-between">
        <div>
          <h1 className="text-heading-xl text-content-primary">
            직책·권한 설정
          </h1>
          <p className="text-[14px] text-content-assistive mt-2">
            조직을 담당하는 직책 및 메뉴 권한을 부여합니다
          </p>
        </div>
        <Button className="mt-2 gap-1.5">
          <Plus className="h-4 w-4" />
          등록하기
        </Button>
      </div>
      <TitleObserver />

      {/* 필터 */}
      <div className="px-6 mb-4">
        <RolesFilter />
      </div>

      {/* 테이블 */}
      <div className="flex-1 px-6 pb-15">
        <RolesTable />
      </div>

    </div>
  )
}
