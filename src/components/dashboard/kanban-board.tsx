"use client"

import React, { useState, useCallback } from "react"
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  defaultDropAnimationSideEffects,
  DragStartEvent,
  DragOverEvent,
  DragEndEvent
} from "@dnd-kit/core"
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

// 기능 배지 → 디자인 시스템 토큰 매핑 (accent-bg-* / accent-fg-*)
const TAG_COLOR: Record<string, string> = {
  "종합진단":    "bg-red-tint text-red-tint border-transparent",
  "AI 상담내역": "bg-canvas-tertiary text-content-assistive border-transparent",
  "보험료점검":  "bg-green-tint text-green-tint border-transparent",
  "보장확대":    "bg-blue-tint text-blue-tint border-transparent",
}
const TAG_COLOR_DEFAULT = "bg-canvas-tertiary text-content-assistive border-transparent"

// 컬럼 스타일 — 타이틀 옆 원형 도트로 상태 구분 (디자인 시스템 토큰 사용)
const COLUMN_STYLE: Record<string, { dot: string; label: string }> = {
  "col-before":  { dot: "bg-canvas-quaternary",        label: "text-content-tertiary" },
  "col-absent":  { dot: "bg-orange-tint",  label: "text-content-tertiary" },
  "col-success": { dot: "bg-primary",            label: "text-content-tertiary" },
  "col-valid":   { dot: "bg-green-tint",   label: "text-content-tertiary" },
}

// --- Types ---
interface Customer {
  id: string
  name: string
  age: number
  gender: "남" | "여"
  region: string
  phone: string
  assignedAt: string
  firstCalledAt?: string
  lastCalledAt?: string
  callCount: number
  tags: string[]
  isCancelled?: boolean
  deletedAt?: string
}

interface ColumnData {
  id: string
  title: string
  items: string[]
}


// --- Mock Data ---
const INITIAL_CUSTOMERS: Record<string, Customer> = {
  "c1": {
    id: "c1", name: "이*혁", age: 34, gender: "남", region: "서울특별시",
    phone: "0507-1234-1234", assignedAt: "2026.01.21 00:00",
    callCount: 0, tags: ["종합진단", "AI 상담내역"],
  },
  "c2": {
    id: "c2", name: "김*철", age: 42, gender: "남", region: "경기도",
    phone: "0507-1111-2222", assignedAt: "2026.01.21 00:00",
    callCount: 0, tags: ["보험료점검", "AI 상담내역"],
  },
  "c3": {
    id: "c3", name: "최*영", age: 29, gender: "여", region: "인천광역시",
    phone: "0507-3333-4444", assignedAt: "2026.01.21 00:00",
    callCount: 0, tags: ["종합진단"],
  },
  "c4": {
    id: "c4", name: "박*수", age: 38, gender: "남", region: "부산광역시",
    phone: "0507-5555-6666", assignedAt: "2026.01.21 00:00",
    firstCalledAt: "2026.01.21 00:00", lastCalledAt: "2026.01.21 00:00",
    callCount: 1, tags: ["종합진단", "AI 상담내역"],
  },
  "c5": {
    id: "c5", name: "정*희", age: 31, gender: "여", region: "대구광역시",
    phone: "0507-7777-8888", assignedAt: "2026.01.21 00:00",
    firstCalledAt: "2026.01.21 00:00", lastCalledAt: "2026.01.21 00:00",
    callCount: 2, tags: ["보험료점검", "AI 상담내역"],
  },
  "c6": {
    id: "c6", name: "강*호", age: 45, gender: "남", region: "광주광역시",
    phone: "0507-9999-0000", assignedAt: "2026.01.21 00:00",
    firstCalledAt: "2026.01.21 00:00", lastCalledAt: "2026.01.21 00:00",
    callCount: 3, tags: ["종합진단", "AI 상담내역"],
  },
  "c7": {
    id: "c7", name: "윤*나", age: 27, gender: "여", region: "대전광역시",
    phone: "0507-1357-2468", assignedAt: "2026.01.21 00:00",
    firstCalledAt: "2026.01.21 00:00", lastCalledAt: "2026.01.21 00:00",
    callCount: 2, tags: ["종합진단"],
  },
  "c8": {
    id: "c8", name: "송*훈", age: 50, gender: "남", region: "울산광역시",
    phone: "0507-2468-1357", assignedAt: "2026.01.21 00:00",
    firstCalledAt: "2026.01.21 00:00", lastCalledAt: "2026.01.21 00:00",
    callCount: 5, tags: ["보장확대", "AI 상담내역"],
  },
  "c9": {
    id: "c9", name: "임*주", age: 33, gender: "여", region: "세종특별자치시",
    phone: "0507-8888-9999", assignedAt: "2026.01.21 00:00",
    firstCalledAt: "2026.01.21 00:00", lastCalledAt: "2026.01.21 00:00",
    callCount: 1, tags: ["종합진단", "AI 상담내역"],
    isCancelled: true, deletedAt: "2026.02.21",
  },
}

const INITIAL_COLUMNS: Record<string, ColumnData> = {
  "col-before":  { id: "col-before",  title: "통화 전",  items: ["c1", "c2", "c3"] },
  "col-absent":  { id: "col-absent",  title: "부재중",   items: ["c4", "c5"] },
  "col-success": { id: "col-success", title: "통화성공", items: ["c6", "c7"] },
  "col-valid":   { id: "col-valid",   title: "유효통화", items: ["c8", "c9"] },
}

// 컬럼 렌더링 순서 — 통화 흐름 기준 고정
const COLUMN_ORDER = ["col-before", "col-absent", "col-success", "col-valid"] as const


// --- 카드 ---
const CustomerCard = React.memo(({ customer, isDragging }: { customer: Customer; isDragging?: boolean }) => {
  const dates = [
    { label: "배정일",    value: customer.assignedAt?.split(" ")[0] ?? "-" },
    { label: "최초통화",  value: customer.firstCalledAt?.split(" ")[0] ?? "-" },
    { label: "최근통화",  value: customer.lastCalledAt?.split(" ")[0] ?? "-" },
  ]

  return (
    <div className={cn(
      "relative bg-canvas-primary rounded-md border border-line-subtle overflow-hidden",
      "cursor-grab active:cursor-grabbing select-none",
      "hover:border-border hover:shadow-sm transition-[color,border-color,box-shadow] duration-150",
      isDragging && "opacity-40 shadow-md"
    )}>

      <div className="px-3.5 pt-3.5 pb-3">

        {/* 이름 — 단독 강조 */}
        <p className="text-[14px] font-semibold text-content-primary leading-tight mb-0.5">
          {customer.name}
        </p>

        {/* 인적사항 — 이름 아래 서브 라인 */}
        <p className="text-[12px] text-content-assistive mb-3">
          {customer.age}세 · {customer.gender} · {customer.region.split(" ")[0]}
        </p>

        {/* 날짜 — 라벨 축약 + 날짜만 표시 */}
        <div className="space-y-1 mb-3">
          {dates.map(({ label, value }) => (
            <div key={label} className="flex items-center justify-between">
              <span className="text-[11px] text-content-assistive w-[44px] shrink-0">{label}</span>
              <span className="text-[11px] text-content-assistive tabular-nums tracking-tighter">{value}</span>
            </div>
          ))}
        </div>

        {/* 구분선 */}
        <div className="h-px bg-divider-subtle mb-2.5" />

        {/* 푸터: 배지 + 통화 횟수 */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1 min-w-0">
            {(customer.tags ?? []).slice(0, 2).map(tag => (
              <Badge
                key={tag}
                className={cn("text-[10px] font-medium px-1.5 h-[18px] tracking-tight shrink-0", TAG_COLOR[tag] ?? TAG_COLOR_DEFAULT)}
              >
                {tag}
              </Badge>
            ))}
          </div>
          <span className="text-[11px] tabular-nums text-content-assistive shrink-0">
            {customer.callCount}회
          </span>
        </div>

      </div>

      {/* 취소 고객 오버레이 */}
      {customer.isCancelled && (
        <div className="absolute inset-0 bg-foreground/20 backdrop-blur-[1px] flex flex-col items-center justify-center gap-0.5 px-3.5">
          <p className="text-[12px] font-semibold text-background leading-snug text-center">
            상담 취소 요청
          </p>
          <p className="text-[11px] text-background/80 leading-snug text-center">
            {customer.deletedAt} 삭제 예정
          </p>
        </div>
      )}

    </div>
  )
})

CustomerCard.displayName = "CustomerCard"

const SortableCustomerCard = ({ id, customer }: { id: string; customer: Customer }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id })
  return (
    <div ref={setNodeRef} style={{ transform: CSS.Translate.toString(transform), transition }} {...attributes} {...listeners}>
      <CustomerCard customer={customer} isDragging={isDragging} />
    </div>
  )
}


// --- Main Board ---
export function KanbanBoard() {
  const [columns, setColumns] = useState(INITIAL_COLUMNS)
  const [customers] = useState(INITIAL_CUSTOMERS)
  const [activeId, setActiveId] = useState<string | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  const findContainer = useCallback((id: string) => {
    if (id in columns) return id
    return Object.keys(columns).find(key => columns[key].items.includes(id))
  }, [columns])

  const handleDragStart = (e: DragStartEvent) => setActiveId(e.active.id as string)

  const handleDragOver = (e: DragOverEvent) => {
    const { active, over } = e
    const overId = over?.id
    if (!overId || active.id === overId) return
    const ac = findContainer(active.id as string)
    const oc = findContainer(overId as string)
    if (!ac || !oc || ac === oc) return
    setColumns(prev => {
      const ai = prev[ac].items
      const oi = prev[oc].items
      const oIdx = oi.indexOf(overId as string)
      const newIdx = overId in prev
        ? oi.length + 1
        : oIdx >= 0
          ? oIdx + (over && oIdx === oi.length - 1 && e.delta.y > 0 ? 1 : 0)
          : oi.length + 1
      return {
        ...prev,
        [ac]: { ...prev[ac], items: ai.filter(i => i !== active.id) },
        [oc]: { ...prev[oc], items: [...oi.slice(0, newIdx), active.id as string, ...oi.slice(newIdx)] },
      }
    })
  }

  const handleDragEnd = (e: DragEndEvent) => {
    const { active, over } = e
    if (over?.id) {
      const ac = findContainer(active.id as string)
      const oc = findContainer(over.id as string)
      if (ac && oc && ac === oc) {
        const ai = columns[ac].items.indexOf(active.id as string)
        const oi = columns[oc].items.indexOf(over.id as string)
        if (ai !== oi) {
          setColumns(prev => ({
            ...prev,
            [oc]: { ...prev[oc], items: arrayMove(prev[oc].items, ai, oi) },
          }))
        }
      }
    }
    setActiveId(null)
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      autoScroll={false}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      {/* 칸반 보드 — 4개 컬럼 균등 분할 */}
      <div className="flex gap-3 px-6 pt-5 pb-7 w-full">
        {COLUMN_ORDER.map(colId => {
          const column = columns[colId]
          const style = COLUMN_STYLE[colId] ?? { dot: "bg-foreground/20", label: "text-content-quaternary" }

          return (
            <div
              key={column.id}
              className="flex-1 min-w-0 flex flex-col bg-canvas-quaternary rounded-lg overflow-hidden"
            >
              {/* 컬럼 헤더 */}
              <div className="flex items-center gap-2 px-3.5 py-3">
                <span className={cn("w-2 h-2 rounded-full shrink-0", style.dot)} />
                <span className={cn("text-[13px] font-semibold tracking-tight", style.label)}>
                  {column.title}
                </span>
                <div className="flex items-center justify-center bg-canvas-quaternary rounded-sm px-1.5 h-5 min-w-[20px]">
                  <span className="text-[11px] font-semibold tabular-nums text-content-tertiary">
                    {column.items.length}
                  </span>
                </div>
              </div>
              <SortableContext id={column.id} items={column.items} strategy={verticalListSortingStrategy}>
                <div className="flex flex-col gap-2 p-2 min-h-[80px] max-h-[780px] overflow-y-auto scrollbar-hide">
                  {column.items.length === 0 ? (
                    <p className="text-[12px] text-content-disabled text-center py-6">
                      해당 고객이 없습니다
                    </p>
                  ) : (
                    column.items.map(id => (
                      <SortableCustomerCard key={id} id={id} customer={customers[id]} />
                    ))
                  )}
                </div>
              </SortableContext>
            </div>
          )
        })}
      </div>




      <DragOverlay dropAnimation={{
        sideEffects: defaultDropAnimationSideEffects({ styles: { active: { opacity: "0.2" } } })
      }}>
        {activeId && (
          <div className="shadow-xl rounded-lg scale-[1.02] rotate-[1deg]">
            <CustomerCard customer={customers[activeId]} />
          </div>
        )}
      </DragOverlay>
    </DndContext>
  )
}
