"use client"

/**
 * 역할: 미배정 DB 테이블 — 체크박스 선택 + 선택 재배정 + 정렬 + 페이지네이션
 * 주요 기능: 미배정 고객 목록, 선택 재배정, 최신순/오래된순 정렬
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
import { ArrowUpDown } from "lucide-react"
import { MOCK_CUSTOMERS } from "@/lib/mock-customers"

// --- 목업 데이터 ---
const MOCK_ROWS = MOCK_CUSTOMERS.map((c, i) => {
  // 요청일자: 인덱스 기반으로 분산 (1~30일)
  const day = ((i * 7) % 30) + 1
  const hour = String(((i * 13) % 24)).padStart(2, "0")
  const minute = String(((i * 17) % 60)).padStart(2, "0")
  return {
    ...c,
    requestedAt: `2026.${String((((i * 5) % 4) + 1)).padStart(2, "0")}.${String(day).padStart(2, "0")}  ${hour}:${minute}`,
  }
})

export function UnassignedDbTable({ disabledRowKeys = [] }: { disabledRowKeys?: number[] } = {}) {
  const [selectedIds, setSelectedIds] = useState<number[]>([])
  const [sortOrder, setSortOrder] = useState("latest")
  const [pageSize, setPageSize] = useState("10")
  const [currentPage, setCurrentPage] = useState(1)
  const pageSizeNum = parseInt(pageSize)
  const totalPages = Math.ceil(MOCK_ROWS.length / pageSizeNum)
  // 정렬: 최신순 = no DESC (큰 번호 = 최근), 오래된순 = no ASC
  const sortedRows = [...MOCK_ROWS].sort((a, b) => sortOrder === "latest" ? b.no - a.no : a.no - b.no)
  const displayedRows = sortedRows.slice((currentPage - 1) * pageSizeNum, currentPage * pageSizeNum)

  const allSelected = displayedRows.length > 0 && displayedRows.every(r => selectedIds.includes(r.no))
  const someSelected = displayedRows.some(r => selectedIds.includes(r.no)) && !allSelected

  const toggleAll = () => setSelectedIds(allSelected ? selectedIds.filter(id => !displayedRows.find(r => r.no === id)) : [...new Set([...selectedIds, ...displayedRows.map(r => r.no)])])
  const toggleRow = (no: number) => setSelectedIds(prev =>
    prev.includes(no) ? prev.filter(id => id !== no) : [...prev, no]
  )

  return (
    <div className="flex flex-col gap-0.5">

      {/* 툴바 */}
      <div className="sticky top-3 z-20 bg-canvas-secondary flex h-10 items-center justify-between">
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
          {selectedIds.length === 0 && (
            <button
              type="button"
              onClick={() => { setSortOrder(prev => prev === "latest" ? "oldest" : "latest"); setCurrentPage(1) }}
              className="h-7 pl-2 pr-1.5 inline-flex items-center gap-1 rounded-md text-[13px] font-medium text-content-tertiary hover:bg-fill-subtle hover:text-content-primary transition-colors"
            >
              {sortOrder === "latest" ? "최신순" : "오래된순"}
              <ArrowUpDown className="size-3.5" />
            </button>
          )}
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
      <div className="bg-canvas-primary rounded-lg border-border05 border-subtle overflow-hidden">
        <div className="max-h-[calc(100vh-260px)] overflow-auto">
          <Table>
            <TableHeader className="sticky top-0 z-10 bg-canvas-primary">
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
                <TableHead className="text-left font-semibold text-content-assistive text-[12px] h-10 min-w-40">생년월일</TableHead>
                <TableHead className="text-left font-semibold text-content-assistive text-[12px] h-10 min-w-36">연락처</TableHead>
                <TableHead className="text-left font-semibold text-content-assistive text-[12px] h-10 min-w-24">지역</TableHead>
                <TableHead className="text-left font-semibold text-content-assistive text-[12px] h-10 min-w-40">상담요청</TableHead>
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
                  <TableCell className="text-left num-cell">{row.requestedAt}</TableCell>
                  <TableCell className="text-left !pr-5" onClick={(e) => e.stopPropagation()}>
                    <button className="text-body4-normal text-content-secondary font-medium hover:underline underline-offset-2 transition-colors active:scale-[0.97]">
                      확인
                    </button>
                  </TableCell>
                </TableRow>
              ))}
              {MOCK_ROWS.length === 0 && (
                <TableRow>
                  <TableCell colSpan={9} className="py-16 text-body4-normal text-content-disabled text-center">
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
  )
}
