"use client"

/**
 * 역할: 상담 진행 고객 통합 카드 — 필터 + 통화현황 KPI + 칸반 보드
 * 주요 기능: 필터 최상단 노출, StatsSection 인라인 포함, KanbanBoard
 */

import { KanbanFilter } from "@/components/dashboard/kanban-filter"
import { StatsSection } from "@/components/dashboard/stats-section"
import { KanbanBoard } from "@/components/dashboard/kanban-board"

export function ConsultingSection() {
  return (
    <div className="flex-1 bg-card rounded-lg border border-border/40 overflow-hidden flex flex-col">

      {/* 필터 헤더 — 최상단 노출 */}
      <div className="px-6 pt-6 pb-4">
        <KanbanFilter />
      </div>

      {/* 통화현황 KPI 타일 */}
      <StatsSection />

      {/* KPI ~ 상담현황 구분선 */}
      <div className="mx-6 mt-2 h-px bg-border/40" />

      {/* 칸반 보드 타이틀 */}
      <div className="px-6 pt-8 pb-0">
        <h3 className="text-[20px] font-semibold text-foreground tracking-tight">상담 현황</h3>
      </div>

      {/* 칸반 보드 */}
      <KanbanBoard />

    </div>
  )
}
