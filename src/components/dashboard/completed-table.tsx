"use client"

/**
 * 역할: 상담 종료 고객 테이블 — 필터 헤더 + 목록 + 페이지네이션
 * 주요 기능: CompletedFilter (카드 헤더), shadcn Table, 페이지 크기 선택, 페이지네이션
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

type Reason = "상담 거절" | "계약 완료"

const REASON_BADGE: Record<Reason, "tint-warning" | "tint-success"> = {
  "상담 거절": "tint-warning",
  "계약 완료": "tint-success",
}

const MOCK_ROWS: { no: number; name: string; gender: string; birth: string; phone: string; region: string; reason: Reason; endedAt: string }[] =
  Array.from({ length: 50 }, (_, i) => ({
    no: 50 - i,
    name: "이*혁",
    gender: "남성",
    birth: "1981.11.27 (40세)",
    phone: "0507-1111-1111",
    region: "서울특별시",
    reason: i % 2 === 0 ? "상담 거절" : "계약 완료",
    endedAt: "2026.01.01  00:00",
  }))


export function CompletedTable({ disabledRowKeys = [] }: { disabledRowKeys?: number[] } = {}) {
  const [pageSize, setPageSize] = useState("10")
  const [currentPage, setCurrentPage] = useState(1)
  const pageSizeNum = parseInt(pageSize)
  const totalPages = Math.ceil(MOCK_ROWS.length / pageSizeNum)
  const displayedRows = MOCK_ROWS.slice((currentPage - 1) * pageSizeNum, currentPage * pageSizeNum)

  return (
    <div className="sticky top-3 z-[5] flex flex-col gap-0.5">

      {/* 툴바 */}
      <div className="bg-canvas-tertiary flex items-center justify-between py-1">
        <span className="text-[13px] font-medium text-content-assistive tabular-nums">
          전체 {MOCK_ROWS.length}건
        </span>
        <PageSizeSelect
          value={pageSize}
          onValueChange={(v) => { setPageSize(v); setCurrentPage(1) }}
        />
      </div>

      {/* 테이블 카드 */}
      <div className="bg-canvas-primary rounded-lg overflow-hidden border border-line-subtle">

        <div className="overflow-auto max-h-[calc(100svh-10rem)]">
          <Table>
            <TableHeader className="sticky top-0 z-10">
              <TableRow className="border-b border-divider-normal hover:bg-transparent">
                <TableHead className="text-center font-semibold text-content-assistive text-[12px] h-10 w-12">No.</TableHead>
                <TableHead className="text-left font-semibold text-content-assistive text-[12px] h-10 min-w-24">이름</TableHead>
                <TableHead className="text-left font-semibold text-content-assistive text-[12px] h-10 w-16">성별</TableHead>
                <TableHead className="text-left font-semibold text-content-assistive text-[12px] h-10 min-w-40">생년월일</TableHead>
                <TableHead className="text-left font-semibold text-content-assistive text-[12px] h-10 min-w-36">연락처</TableHead>
                <TableHead className="text-left font-semibold text-content-assistive text-[12px] h-10 min-w-24">지역</TableHead>
                <TableHead className="text-left font-semibold text-content-assistive text-[12px] h-10 min-w-24">사유</TableHead>
                <TableHead className="text-left font-semibold text-content-assistive text-[12px] h-10 min-w-40">상담 종료 상태 전환일</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {displayedRows.map((row) => (
                <TableRow
                  key={row.no}
                  className={`cursor-pointer border-divider-subtle hover:bg-fill-subtle transition-colors duration-120${disabledRowKeys.includes(row.no) ? " opacity-40 pointer-events-none select-none" : ""}`}
                  onClick={() => console.log("open detail", row.no)}
                >
                  <TableCell className="text-center num-cell">{row.no}</TableCell>
                  <TableCell className="text-left">{row.name}</TableCell>
                  <TableCell className="text-left">{row.gender}</TableCell>
                  <TableCell className="text-left num-cell">{row.birth}</TableCell>
                  <TableCell className="text-left num-cell">{row.phone}</TableCell>
                  <TableCell className="text-left">{row.region}</TableCell>
                  <TableCell className="text-left">
                    <Badge variant={REASON_BADGE[row.reason]}>{row.reason}</Badge>
                  </TableCell>
                  <TableCell className="text-left num-cell">{row.endedAt}</TableCell>
                </TableRow>
              ))}
              {MOCK_ROWS.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} className="py-16 text-[13px] text-content-disabled text-center">
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
