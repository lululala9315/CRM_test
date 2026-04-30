"use client"

/**
 * 역할: 통계 요약 섹션 — 주요 KPI 지표 표시
 * 주요 기능: KpiGroup 단일 컴포넌트 사용 — 라벨 + 숫자 + 변화율 배지
 */

import { KpiGroup, type KpiData } from "@/components/ui/kpi-card"

const stats: KpiData[] = [
  { label: "평균 리드 시간",   value: "30:24", unit: "분", delta: { text: "-2:30", up: false, positive: true } },
  { label: "평균 통화 시도율", value: "20",    unit: "%",  delta: { text: "+2.3%", up: true,  positive: true } },
  { label: "평균 통화 성공율", value: "20",    unit: "%",  delta: { text: "-1.1%", up: false, positive: false } },
  { label: "평균 유효 통화율", value: "20",    unit: "%",  delta: { text: "+0.8%", up: true,  positive: true } },
  { label: "평균 통화 시간",   value: "20",    unit: "분", delta: { text: "+1:20", up: true,  positive: true } },
]

export function StatsSection() {
  return <KpiGroup items={stats} />
}
