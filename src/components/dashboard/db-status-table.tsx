"use client"

/**
 * 역할: DB 분배 현황 테이블 — 기간별 DB 공급/철회/상태 목록
 * 주요 기능: 테이블, 페이지 크기 선택, 페이지네이션
 */

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { PageNumbers, PageSizeSelect } from "@/components/ui/pagination"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

// --- 목업 데이터 ---
type Status = "진행 예정" | "진행중" | "종료"

type Row = {
  no: number
  period: string
  contractQty: string
  actualQty: string
  cancelQty: string | null
  status: Status
}

const MOCK_ROWS: Row[] = Array.from({ length: 50 }, (_, i) => ({
  no: 50 - i,
  period: "2026.01.01~2026.01.31",
  contractQty: "1,100건",
  actualQty: "1,100건",
  cancelQty: i % 5 === 0 ? "1,100건" : null,
  status: (i % 3 === 0 ? "진행 예정" : i % 3 === 1 ? "진행중" : "종료") as Status,
}))

const STATUS_BADGE: Record<Status, { variant: "tint-blue" | "tint-success" | "tint-muted" }> = {
  "진행 예정": { variant: "tint-blue" },
  "진행중":   { variant: "tint-success" },
  "종료":     { variant: "tint-muted" },
}

export function DbStatusTable({ disabledRowKeys = [] }: { disabledRowKeys?: number[] }) {
  const [pageSize, setPageSize] = useState("10")
  const [currentPage, setCurrentPage] = useState(1)
  const pageSizeNum = parseInt(pageSize)
  const totalPages = Math.ceil(MOCK_ROWS.length / pageSizeNum)
  const displayedRows = MOCK_ROWS.slice((currentPage - 1) * pageSizeNum, currentPage * pageSizeNum)

  return (
    <div className="flex flex-col gap-0.5">

      {/* 툴바 */}
      <div className="sticky top-3 z-20 bg-canvas-tertiary flex items-center justify-between py-1">
        <span className="text-body5-medium text-content-assistive tabular-nums">
          전체 {MOCK_ROWS.length}건
        </span>
        <PageSizeSelect
          value={pageSize}
          onValueChange={(v) => { setPageSize(v); setCurrentPage(1) }}
        />
      </div>

      {/* 테이블 카드 */}
      <div className="bg-canvas-primary rounded-lg border border-subtle">

          <Table>
            <TableHeader className="sticky top-[44px] z-30 bg-canvas-primary">
              <TableRow className="border-b border-divider-normal hover:bg-transparent">
                <TableHead className="!text-center font-semibold text-content-assistive text-[12px] h-10 w-12 !pl-1">No.</TableHead>
                <TableHead className="text-left font-semibold text-content-assistive text-[12px] h-10 min-w-40">기간</TableHead>
                <TableHead className="text-left font-semibold text-content-assistive text-[12px] h-10 min-w-40">계약 공급 수량</TableHead>
                <TableHead className="text-left font-semibold text-content-assistive text-[12px] h-10 min-w-40">실 공급 수량</TableHead>
                <TableHead className="text-left font-semibold text-content-assistive text-[12px] h-10 min-w-24">철회 수량</TableHead>
                <TableHead className="text-left font-semibold text-content-assistive text-[12px] h-10 min-w-24">상태</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {displayedRows.map((row) => (
                <TableRow
                  key={row.no}
                  className={`cursor-pointer border-divider-subtle${disabledRowKeys.includes(row.no) ? " opacity-40 pointer-events-none select-none" : ""}`}
                  onClick={() => console.log("open detail", row.no)}
                >
                  <TableCell className="text-center num-cell">{row.no}</TableCell>
                  <TableCell className="text-left num-cell">{row.period}</TableCell>
                  <TableCell className="text-left num-cell">{row.contractQty}</TableCell>
                  <TableCell className="text-left num-cell">{row.actualQty}</TableCell>
                  <TableCell className="text-left num-cell">
                    {row.cancelQty ?? <span className="text-content-disabled">-</span>}
                  </TableCell>
                  <TableCell className="text-left">
                    <Badge variant={STATUS_BADGE[row.status].variant}>{row.status}</Badge>
                  </TableCell>
                </TableRow>
              ))}
              {MOCK_ROWS.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="py-16 text-body4-normal text-content-disabled text-center">
                    데이터가 없습니다
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

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
