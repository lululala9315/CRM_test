"use client"

/**
 * 역할: 상담 진행 고객 통합 카드 — 통화현황 KPI + 칸반 보드
 * 주요 기능: StatsSection 인라인 포함, KanbanBoard (필터는 페이지에서 별도 카드)
 */

import { KanbanBoard } from "@/components/dashboard/kanban-board"

export function ConsultingSection() {
  return (
    <div className="flex-1 bg-canvas-primary rounded-lg border border-subtle overflow-hidden flex flex-col">

      {/* 칸반 보드 타이틀 */}
      <div className="px-6 pt-5 pb-0">
        <h3 className="text-[20px] font-semibold text-content-primary tracking-tight">상담 현황</h3>
      </div>

      {/* 칸반 보드 */}
      <KanbanBoard />

    </div>
  )
}
