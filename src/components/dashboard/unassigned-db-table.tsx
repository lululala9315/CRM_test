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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

// --- 목업 데이터 ---
type Row = {
  no: number
  name: string
  gender: string
  birth: string
  phone: string
  region: string
  requestedAt: string
}

const MOCK_ROWS: Row[] = Array.from({ length: 50 }, (_, i) => ({
  no: 50 - i,
  name: "이*혁",
  gender: "남성",
  birth: "1981.11.27 (40세)",
  phone: "0507-1111-1111",
  region: "서울특별시",
  requestedAt: "2026.01.01  00:00",
}))

export function UnassignedDbTable({ disabledRowKeys = [] }: { disabledRowKeys?: number[] } = {}) {
  const [selectedIds, setSelectedIds] = useState<number[]>([])
  const [sortOrder, setSortOrder] = useState("latest")
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

  return (
    <div className="sticky top-3 z-[5] flex flex-col gap-0.5">

      {/* 툴바 */}
      <div className="bg-canvas-tertiary flex items-center justify-between py-1">
        <span className="text-[13px] font-medium text-content-assistive tabular-nums">
          {selectedIds.length > 0
            ? `${selectedIds.length}건 선택`
            : `전체 ${MOCK_ROWS.length}건`
          }
        </span>
        <div className="flex items-center gap-1">
          <Select value={sortOrder} onValueChange={(v) => { setSortOrder(v); setCurrentPage(1) }}>
            <SelectTrigger className="h-7 px-2 py-0 border-transparent bg-transparent shadow-none gap-1 !text-[12px] text-content-assistive hover:bg-fill-subtle hover:text-content-primary rounded-md">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="rounded-md border-line-subtle text-[13px]">
              <SelectItem value="latest">최신순</SelectItem>
              <SelectItem value="oldest">오래된순</SelectItem>
            </SelectContent>
          </Select>
          <PageSizeSelect
            value={pageSize}
            onValueChange={(v) => { setPageSize(v); setCurrentPage(1) }}
          />
          <Button>
            선택 재배정
          </Button>
        </div>
      </div>

      {/* 테이블 카드 */}
      <div className="bg-canvas-primary rounded-lg overflow-hidden border border-line-subtle">

        <div className="overflow-auto max-h-[calc(100svh-10rem)]">
          <Table>
            <TableHeader className="sticky top-0 z-10">
              <TableRow className="border-b border-divider-normal hover:bg-transparent">
                <TableHead className="text-left h-10 w-10 !pl-3 !pr-1">
                  <Checkbox
                    checked={allSelected}
                    ref={(el) => {
                      if (el) (el as HTMLButtonElement & { indeterminate?: boolean }).indeterminate = someSelected
                    }}
                    onCheckedChange={toggleAll}
                    className="h-4 w-4 rounded-sm border-line-subtle data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                  />
                </TableHead>
                <TableHead className="text-center font-semibold text-content-assistive text-[12px] h-10 w-12 !pl-1">No.</TableHead>
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
                  className={`cursor-pointer border-divider-subtle hover:bg-fill-subtle transition-colors duration-120 data-[state=selected]:bg-primary/5${disabledRowKeys.includes(row.no) ? " opacity-40 pointer-events-none select-none" : ""}`}
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
                      className="h-4 w-4 rounded-sm border-line-subtle data-[state=checked]:bg-primary data-[state=checked]:border-primary"
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
                    <button className="text-[13px] text-content-secondary font-medium hover:underline underline-offset-2 transition-colors active:scale-[0.97]">
                      확인
                    </button>
                  </TableCell>
                </TableRow>
              ))}
              {MOCK_ROWS.length === 0 && (
                <TableRow>
                  <TableCell colSpan={9} className="py-16 text-[13px] text-content-disabled text-center">
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
