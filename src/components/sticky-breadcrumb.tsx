"use client"

/**
 * 역할: 스크롤 시 헤더 바로 아래에 슬라이드인 되는 Breadcrumb 바
 * 주요 기능: usePathname으로 라우트 → 레이블 매핑, height 트랜지션으로 레이아웃 쉬프트 없이 등장
 */

import { useEffect, Fragment } from "react"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { useBreadcrumbVisible } from "@/components/breadcrumb-context"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

// 라우트 → breadcrumb 레이블 맵 (사이드바 그룹명 > 메뉴명 구조)
const ROUTE_MAP: Record<string, string[]> = {
  "/":                        ["배정 고객 관리", "상담 진행 고객"],
  "/pending":                 ["배정 고객 관리", "계약 예정 고객"],
  "/completed":               ["배정 고객 관리", "상담 종료 고객"],
  "/db/assigned":             ["DB 배정 관리", "배정 완료 DB"],
  "/db/unassigned":           ["DB 배정 관리", "미배정 DB"],
  "/db/status":               ["DB 배정 관리", "DB 분배 현황"],
  "/management/admin":        ["직원/설계사 관리", "운영/관리자"],
  "/management/planner":      ["직원/설계사 관리", "설계사"],
  "/settings/reassign":       ["배정 설정 관리", "재배정 타입 설정"],
  "/settings/reassign/edit":  ["배정 설정 관리", "재배정 타입 설정", "편집"],
  "/settings/auto":           ["배정 설정 관리", "자동 배정 설정"],
  "/settings/recall":         ["배정 설정 관리", "자동 회수 설정"],
  "/organization/roles":      ["조직 및 관리 체계", "직책·권한 설정"],
  "/organization/structure":  ["조직 및 관리 체계", "조직 구조 설정"],
  "/mypage":                  ["마이페이지"],
}

function getBreadcrumbs(pathname: string): string[] {
  if (ROUTE_MAP[pathname]) return ROUTE_MAP[pathname]
  // 동적 라우트 (/management/admin/123 등) — 부모 경로 레이블 + "상세"
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
  const { isTitleVisible, setTitleVisible } = useBreadcrumbVisible()

  // 라우트 변경 시 타이틀 가시성 초기화 — 새 페이지에서 breadcrumb 즉시 숨김
  useEffect(() => {
    setTitleVisible(true)
  }, [pathname, setTitleVisible])

  const crumbs = getBreadcrumbs(pathname)
  const isVisible = !isTitleVisible && crumbs.length > 0

  return (
    <div
      className={cn(
        "overflow-hidden transition-[height] duration-200 ease-out",
        isVisible ? "h-11" : "h-0"
      )}
      aria-hidden={!isVisible}
    >
      <div className="h-11 flex items-center px-6 border-b border-divider-normal bg-canvas-tertiary">
        <Breadcrumb>
          <BreadcrumbList className="gap-1.5 sm:gap-1.5">
            {crumbs.map((crumb, i) => (
              <Fragment key={i}>
                <BreadcrumbItem>
                  {i === crumbs.length - 1 ? (
                    // 현재 페이지: 동일 사이즈·굵기, 색상만 블랙
                    <BreadcrumbPage className="text-[14px] font-medium text-content-primary">
                      {crumb}
                    </BreadcrumbPage>
                  ) : (
                    // 상위 경로: 동일 사이즈·굵기, 색상 muted
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
    </div>
  )
}
