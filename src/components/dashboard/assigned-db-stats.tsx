"use client"

/**
 * 역할: 배정 완료 DB 통계 카드 — 배정/통화 KPI 5개 타일
 * 주요 기능: StatsSection과 동일한 타일 스타일, DB 전용 지표
 */

const stats = [
  { label: "총 배정 DB",     value: "33",   unit: "건" },
  { label: "통화 시도",      value: "30",   unit: "건" },
  { label: "통화 미시도",    value: "3",    unit: "건" },
  { label: "평균 성공율",    value: "25.8", unit: "%" },
  { label: "평균 유효통화율", value: "40.5", unit: "%" },
]

export function AssignedDbStats() {
  return (
    <div className="bg-canvas-primary rounded-lg border border-line-subtle px-6 py-6">
      <div className="flex gap-3">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="flex-1 bg-fill-subtle rounded-lg p-6 transition-[background-color,border-color] duration-150 hover:bg-fill-normal border border-transparent hover:border-line-subtle"
          >
            <p className="text-[13px] font-medium text-content-assistive mb-3 tracking-tight leading-none">
              {stat.label}
            </p>
            <div className="flex items-baseline gap-0.5">
              <span className="text-kpi text-content-primary">
                {stat.value}{stat.unit}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
