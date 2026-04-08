"use client"

/**
 * 역할: 통계 요약 섹션 — 주요 KPI 지표 표시
 * 주요 기능: 토스증권 analytics 스타일 — 흰 타일 + 테두리 + 큰 값
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
    <div className="px-6 pt-4 pb-6">
      <div className="flex gap-2">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="flex-1 bg-[#f8f9fa] rounded-lg px-4 py-4 border border-transparent"
          >
            <p className="text-[12px] font-medium text-muted-foreground/70 mb-2 tracking-tight leading-none">
              {stat.label}
            </p>
            <div className="flex items-baseline gap-0.5">
              <span className="text-[26px] font-semibold tracking-tighter text-[#334155] leading-none">
                {stat.value}{stat.unit}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
