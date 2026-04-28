"use client"

/**
 * 역할: 통계 요약 섹션 — 주요 KPI 지표 표시
 * 주요 기능: 세로 구분선 KPI 타일 (정보 표시 전용, 인터랙션 없음)
 * 참고: 카드 래핑 없음 — 호출부에서 카드 컨테이너 제공
 */

const stats = [
  { label: "평균 리드 시간",   value: "30:24", unit: "분" },
  { label: "평균 통화 시도율", value: "20",    unit: "%" },
  { label: "평균 통화 성공율", value: "20",    unit: "%" },
  { label: "평균 유효 통화율", value: "20",    unit: "%" },
  { label: "평균 통화 시간",   value: "20",    unit: "분" },
]

export function StatsSection() {
  return (
    <div className="bg-canvas-primary rounded-lg py-5 border border-line-subtle">
      <div className="flex items-stretch">
        {stats.map((stat, i) => (
          <div
            key={stat.label}
            className="flex-1 px-6 relative"
          >
            {i > 0 && (
              <div className="absolute left-0 top-1/2 -translate-y-1/2 h-12 w-px bg-divider-normal" />
            )}
            <p className="text-[12px] font-medium text-content-assistive mb-2.5 tracking-tight leading-none whitespace-nowrap">
              {stat.label}
            </p>
            <div className="flex items-baseline gap-0.5">
              <span className="text-kpi text-content-primary">
                {stat.value}
              </span>
              <span className="text-kpi text-content-primary">
                {stat.unit}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
