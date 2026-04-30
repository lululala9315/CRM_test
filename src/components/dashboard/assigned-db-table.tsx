"use client"

/**
 * 역할: 배정 완료 DB 통합 카드 — KPI + 필터 + 테이블 + 페이지네이션
 * 주요 기능: 헤더 배경 제거, 여유로운 행 높이, 우측 페이지네이션
 * 참고: filterSlot prop으로 필터 컴포넌트를 카드 안에 주입받음
 */

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { PageNumbers, PageSizeSelect } from "@/components/ui/pagination"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { MOCK_CUSTOMERS } from "@/lib/mock-customers"

// --- 목업 데이터 ---
const PLANNERS = ["김홍도", "신윤복", "정선", "안견", "이중섭", "박수근", "장욱진", "천경자", "이응노", "남관"]

const MOCK_ROWS = MOCK_CUSTOMERS.map((c, i) => {
  // 배정일자: 분산
  const aDay = ((i * 5) % 28) + 1
  const aHour = String(((i * 13) % 24)).padStart(2, "0")
  const aMin = String(((i * 19) % 60)).padStart(2, "0")
  const assignedAt = `2026.${String((((i * 3) % 4) + 1)).padStart(2, "0")}.${String(aDay).padStart(2, "0")} ${aHour}:${aMin}`

  // 통화 일자/횟수: 분산 + 일부 null
  const noCall = i % 5 === 1
  const cDay = ((i * 11) % 28) + 1
  const cHour = String(((i * 7) % 24)).padStart(2, "0")
  const cMin = String(((i * 23) % 60)).padStart(2, "0")
  const callDate = `2026.${String((((i * 3) % 4) + 1)).padStart(2, "0")}.${String(cDay).padStart(2, "0")} ${cHour}:${cMin}`

  const tryCount = noCall ? null : `${1 + (i * 7) % 30}회`
  const successCount = noCall ? null : `${(i * 3) % 15}회`
  const valid = i % 2 === 0 && !noCall ? `${1 + (i * 5) % 12}회` : null

  return {
    ...c,
    assignedAt,
    firstCall: noCall ? null : callDate,
    lastCall: noCall ? null : callDate,
    callTry: tryCount,
    callSuccess: successCount,
    validCall: valid,
    planner: PLANNERS[i % PLANNERS.length],
  }
})

export function AssignedDbTable({ disabledRowKeys = [] }: { disabledRowKeys?: number[] } = {}) {
  const [selectedIds, setSelectedIds] = useState<number[]>([])
  const [pageSize, setPageSize] = useState("10")
  const [currentPage, setCurrentPage] = useState(1)
  const pageSizeNum = parseInt(pageSize)
  const totalPages = Math.ceil(MOCK_ROWS.length / pageSizeNum)
  const displayedRows = MOCK_ROWS.slice((currentPage - 1) * pageSizeNum, currentPage * pageSizeNum)

  const allSelected = displayedRows.length > 0 && displayedRows.every(r => selectedIds.includes(r.no))
  const someSelected = displayedRows.some(r => selectedIds.includes(r.no)) && !allSelected

  const toggleAll = () => setSelectedIds(allSelected ? selectedIds.filter(id => !displayedRows.find(r => r.no === id)) : [...new Set([...selectedIds, ...displayedRows.map(r => r.no)])])
  const toggleRow = (no: number) => setSelectedIds(prev =>
    prev.includes(no) ? prev.filter(id => id !== no) : [...prev, no]
  )

  const STAT_TILES = [
    { label: "총 배정 DB",       value: "33", unit: "건" },
    { label: "통화 시도",        value: "30", unit: "건" },
    { label: "통화 미시도",      value: "3",  unit: "건" },
    { label: "평균 성공율",      value: "25.8", unit: "%" },
    { label: "평균 유효통화율",  value: "40.5", unit: "%" },
  ]

  return (
    <div className="flex flex-col gap-8">

      {/* KPI 타일 카드 */}
      <div className="bg-canvas-primary rounded-lg pt-4 pb-3 border border-subtle">
        <div className="flex items-stretch">
          {STAT_TILES.map((stat, i) => (
            <div
              key={stat.label}
              className="flex-1 px-6 relative"
            >
              {i > 0 && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 h-12 w-px bg-divider-normal" />
              )}
              <p className="text-[12px] font-medium text-content-assistive mb-1.5 tracking-tight leading-none whitespace-nowrap">
                {stat.label}
              </p>
              <div className="flex items-baseline gap-0.5">
                <span className="text-h3-bold tabular-nums text-content-primary">
                  {stat.value}
                </span>
                <span className="text-h3-bold tabular-nums text-content-primary">
                  {stat.unit}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 툴바 + 테이블 + 페이지네이션 */}
      <div className="flex flex-col gap-0.5">

      {/* 툴바 */}
      <div className="sticky top-3 z-20 bg-canvas-tertiary flex h-10 items-center justify-between">
        <span className="text-body4-medium text-content-tertiary tabular-nums">
          {selectedIds.length > 0 ? (
            <>
              <span className="text-primary font-semibold">{selectedIds.length}</span>건 선택
            </>
          ) : (
            `전체 ${MOCK_ROWS.length}건`
          )}
        </span>
        <div className="flex items-center gap-1">
          <PageSizeSelect
            value={pageSize}
            onValueChange={(v) => { setPageSize(v); setCurrentPage(1) }}
          />
          {selectedIds.length > 0 && (
            <Button size="sm">
              선택 재배정
            </Button>
          )}
        </div>
      </div>

      {/* 테이블 카드 — 가로 스크롤만, sticky 헤더 없음 */}
      <div className="bg-canvas-primary rounded-lg border border-subtle overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-canvas-primary">
              <TableRow className="border-b border-divider-normal hover:bg-transparent">
                <TableHead className="text-left h-10 w-10 !pl-3 !pr-1">
                  <Checkbox
                    checked={allSelected}
                    ref={(el) => {
                      if (el) (el as HTMLButtonElement & { indeterminate?: boolean }).indeterminate = someSelected
                    }}
                    onCheckedChange={toggleAll}
                    className="h-4 w-4 rounded-sm border-subtle data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                  />
                </TableHead>
                <TableHead className="!text-center font-semibold text-content-assistive text-[12px] h-10 w-12 !pl-1">No.</TableHead>
                <TableHead className="text-left font-semibold text-content-assistive text-[12px] h-10 min-w-24">이름</TableHead>
                <TableHead className="text-left font-semibold text-content-assistive text-[12px] h-10 w-16">성별</TableHead>
                <TableHead className="text-left font-semibold text-content-assistive text-[12px] h-10 min-w-32">생년월일</TableHead>
                <TableHead className="text-left font-semibold text-content-assistive text-[12px] h-10 min-w-32">연락처</TableHead>
                <TableHead className="text-left font-semibold text-content-assistive text-[12px] h-10 min-w-24">지역</TableHead>
                <TableHead className="text-left font-semibold text-content-assistive text-[12px] h-10 min-w-28">배정시간</TableHead>
                <TableHead className="text-left font-semibold text-content-assistive text-[12px] h-10 min-w-28">최초통화</TableHead>
                <TableHead className="text-left font-semibold text-content-assistive text-[12px] h-10 min-w-28">최근통화</TableHead>
                <TableHead className="text-left font-semibold text-content-assistive text-[12px] h-10 w-16">통화시도</TableHead>
                <TableHead className="text-left font-semibold text-content-assistive text-[12px] h-10 w-16">통화성공</TableHead>
                <TableHead className="text-left font-semibold text-content-assistive text-[12px] h-10 w-16">유효통화</TableHead>
                <TableHead className="text-left font-semibold text-content-assistive text-[12px] h-10 min-w-24">담당 설계사</TableHead>
                <TableHead className="text-left font-semibold text-content-assistive text-[12px] h-10 w-20 !pr-5">배정이력</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {displayedRows.map((row) => (
                <TableRow
                  key={row.no}
                  className={`cursor-pointer border-divider-subtle${disabledRowKeys.includes(row.no) ? " opacity-40 pointer-events-none select-none" : ""}`}
                  data-state={selectedIds.includes(row.no) ? "selected" : undefined}
                  onClick={() => console.log("open detail", row.no)}
                >
                  <TableCell
                    className="text-left w-10 !pl-3 !pr-1"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Checkbox
                      checked={selectedIds.includes(row.no)}
                      onCheckedChange={() => toggleRow(row.no)}
                      disabled={disabledRowKeys.includes(row.no)}
                      className="h-4 w-4 rounded-sm border-subtle data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                    />
                  </TableCell>
                  <TableCell className="text-center num-cell">{row.no}</TableCell>
                  <TableCell className="text-left">{row.name}</TableCell>
                  <TableCell className="text-left">{row.gender}</TableCell>
                  <TableCell className="text-left num-cell">{row.birth}</TableCell>
                  <TableCell className="text-left num-cell">{row.phone}</TableCell>
                  <TableCell className="text-left">{row.region}</TableCell>
                  <TableCell className="text-left num-cell">{row.assignedAt}</TableCell>
                  <TableCell className="text-left num-cell">{row.firstCall ?? <span className="text-content-disabled">-</span>}</TableCell>
                  <TableCell className="text-left num-cell">{row.lastCall ?? <span className="text-content-disabled">-</span>}</TableCell>
                  <TableCell className="text-left num-cell">{row.callTry ?? <span className="text-content-disabled">-</span>}</TableCell>
                  <TableCell className="text-left num-cell">{row.callSuccess ?? <span className="text-content-disabled">-</span>}</TableCell>
                  <TableCell className="text-left num-cell">{row.validCall ?? <span className="text-content-disabled">-</span>}</TableCell>
                  <TableCell className="text-left">{row.planner}</TableCell>
                  <TableCell className="text-left !pr-5" onClick={(e) => e.stopPropagation()}>
                    <button className="text-body4-normal text-content-secondary font-medium hover:underline underline-offset-2 transition-colors active:scale-[0.97]">
                      확인
                    </button>
                  </TableCell>
                </TableRow>
              ))}
              {MOCK_ROWS.length === 0 && (
                <TableRow>
                  <TableCell colSpan={15} className="py-16 text-body4-normal text-content-disabled text-center">
                    데이터가 없습니다
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* 페이지네이션 */}
      <PageNumbers
        totalPages={totalPages}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        className="mt-1"
      />
      </div>
    </div>
  )
}
