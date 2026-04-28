/**
 * 역할: 조직 구조 설정 페이지 — 조직 및 관리 체계 하위
 * 주요 기능: 조직 트리 탐색, 하위 조직 추가, 조직 정보 수정
 */

import { OrgStructureTree } from "@/components/organization/structure-tree"
import { Footer } from "@/components/footer"
import { TitleObserver } from "@/components/title-observer"

export default function OrgStructurePage() {
  return (
    <div className="h-full overflow-y-auto overflow-x-hidden bg-canvas-tertiary scrollbar-hide flex flex-col min-h-full">

      {/* 타이틀 */}
      <div className="px-6 pt-10 pb-6">
        <h1 className="text-heading-xl text-content-primary">
          조직 구조 설정
        </h1>
        <p className="text-[14px] text-content-assistive mt-2">
          조직의 구성원 소속과 관리 범위의 기준으로 사용합니다.
        </p>
      </div>
      <TitleObserver />

      {/* 콘텐츠 */}
      <div className="flex-1 px-6 pb-15 pt-2">
        <OrgStructureTree />
      </div>

      <Footer />
    </div>
  )
}
