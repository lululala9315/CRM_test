/**
 * 역할: KPI 타일 — 라벨 + 큰 숫자 + 변화율 배지
 * 주요 기능: 5개 페이지에서 복붙된 KPI 패턴을 단일 컴포넌트로 통합
 * 의존성: lucide-react (ArrowUpRight, ArrowDownRight)
 * 참고: 카드 wrapper(pt-4 pb-3) 패턴은 KpiGroup 사용. 단일 타일은 KpiCard.
 */

import { ArrowUpRight, ArrowDownRight } from "lucide-react"
import { cn } from "@/lib/utils"

export interface KpiData {
  label: string
  value: string
  unit?: string
  /** 변화율 — 표시할 텍스트(예: "+120건"), 방향, 좋은 변화인지 */
  delta?: { text: string; up: boolean; positive: boolean }
}

export interface KpiCardProps extends KpiData {
  className?: string
}

export function KpiCard({
  label,
  value,
  unit,
  delta,
  className,
  showDivider = false,
}: KpiCardProps & { showDivider?: boolean }) {
  return (
    <div className={cn("flex-1 px-6 relative", className)}>
      {showDivider && (
        <div className="absolute left-0 top-1/2 -translate-y-1/2 h-12 w-px bg-divider-normal" />
      )}
      <p className="text-[12px] font-medium text-content-assistive mb-1.5 tracking-tight leading-none whitespace-nowrap">
        {label}
      </p>
      <div className="flex items-center gap-s8 flex-wrap">
        <div className="flex items-baseline gap-0.5">
          <span className="text-h3-bold tabular-nums text-content-primary">{value}</span>
          {unit && <span className="text-h3-bold tabular-nums text-content-primary">{unit}</span>}
        </div>
        {delta && (
          <div
            className={cn(
              "inline-flex items-center gap-0.5 px-s4 py-px rounded text-[11px] font-semibold",
              delta.positive ? "bg-green-tint text-green-tint" : "bg-red-tint text-red-tint"
            )}
          >
            {delta.up ? (
              <ArrowUpRight className="h-3 w-3 shrink-0" />
            ) : (
              <ArrowDownRight className="h-3 w-3 shrink-0" />
            )}
            {delta.text}
          </div>
        )}
      </div>
    </div>
  )
}

/**
 * KPI 카드 그룹 — 여러 KPI를 한 카드 안에 가로 배치 + 사이 수직 구분선
 * 첫 카드는 구분선 없음, 2번째부터 좌측 구분선 (absolute h-12 w-px bg-divider-normal)
 */
export function KpiGroup({ items, className }: { items: KpiData[]; className?: string }) {
  return (
    <div
      className={cn(
        "bg-canvas-primary rounded-lg pt-4 pb-3 border border-subtle",
        className
      )}
    >
      <div className="flex items-stretch">
        {items.map((kpi, i) => (
          <KpiCard key={kpi.label} {...kpi} showDivider={i > 0} />
        ))}
      </div>
    </div>
  )
}
