"use client"

/**
 * 역할: 상세 페이지에서만 헤더 아래 노출되는 Breadcrumb 바
 * 주요 기능: 동적 라우트(상세 페이지)에서 부모 경로 레이블 + "상세" 표시
 * 참고: 목록 페이지에서는 사이드바 active + PageHeader가 위치 정보를 충분히 보여주므로 미노출
 */

import { Fragment } from "react"
import { usePathname } from "next/navigation"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

// 부모 경로 → 레이블 맵 (상세 페이지의 부모 경로 lookup용)
const ROUTE_MAP: Record<string, string[]> = {
  "/management/admin":        ["직원/설계사 관리", "운영/관리자"],
  "/management/planner":      ["직원/설계사 관리", "설계사"],
}

function getBreadcrumbs(pathname: string): string[] {
  // 동적 상세 페이지에서만 노출 — segments 마지막이 부모 경로의 자식 ID
  const segments = pathname.split("/").filter(Boolean)
  if (segments.length >= 2) {
    const parentPath = "/" + segments.slice(0, -1).join("/")
    const parentLabels = ROUTE_MAP[parentPath]
    if (parentLabels) return [...parentLabels, "상세"]
  }
  return []
}

export function StickyBreadcrumb() {
  const pathname = usePathname()
  const crumbs = getBreadcrumbs(pathname)

  if (crumbs.length === 0) return null

  return (
    <div className="h-11 flex items-center px-6 border-b border-divider-normal bg-canvas-secondary">
      <Breadcrumb>
        <BreadcrumbList className="gap-1.5 sm:gap-1.5">
          {crumbs.map((crumb, i) => (
            <Fragment key={i}>
              <BreadcrumbItem>
                {i === crumbs.length - 1 ? (
                  <BreadcrumbPage className="text-[14px] font-medium text-content-primary">
                    {crumb}
                  </BreadcrumbPage>
                ) : (
                  <span className="text-[14px] font-medium text-content-assistive">{crumb}</span>
                )}
              </BreadcrumbItem>
              {i < crumbs.length - 1 && (
                <BreadcrumbSeparator className="[&>svg]:size-3" />
              )}
            </Fragment>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  )
}
