/**
 * 역할: 모든 페이지 상단 타이틀 영역 (h1 + 부제) 통일
 * 주요 기능: 페이지 타이틀 컴포지트 토큰(text-h2-bold, 28/40/600/-0.5px) 적용, 부제 옵션
 * 의존성: globals.css의 text-h2-bold 토큰
 * 참고: design-system 페이지는 탭 구조라 별도. 그 외 모든 페이지는 이 컴포넌트 사용.
 */

import { cn } from "@/lib/utils"

interface PageHeaderProps {
  title: string
  subtitle?: string
  bordered?: boolean
  actions?: React.ReactNode
}

export function PageHeader({ title, subtitle, bordered = false, actions }: PageHeaderProps) {
  return (
    <>
      {/* 스크롤 가림막 — sticky 영역 위(top-0~top-3) 12px 빈 영역에 행이 비치는 것 차단 */}
      <div className="sticky top-0 z-40 h-3 bg-canvas-secondary -mb-3 shrink-0" />
      <div className={cn(
        "px-6 pt-10 pb-6",
        actions && "flex items-start justify-between gap-4",
        bordered && "border-b border-subtle"
      )}>
        <div>
          <h1 className="text-h2-bold text-content-primary [text-wrap:balance]">
            {title}
          </h1>
          {subtitle && (
            <p className="text-body3-normal text-content-assistive mt-2">
              {subtitle}
            </p>
          )}
        </div>
        {actions && <div className="shrink-0 mt-2">{actions}</div>}
      </div>
    </>
  )
}
