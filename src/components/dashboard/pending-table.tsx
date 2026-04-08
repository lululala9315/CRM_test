"use client"

/**
 * 역할: 계약 예정 고객 테이블 — 필터 헤더 + 목록 + 페이지네이션
 * 주요 기능: PendingFilter (카드 헤더), shadcn Table, 페이지 크기 선택, 페이지네이션
 */

import { useState } from "react"
import { PendingFilter } from "@/components/dashboard/pending-filter"
import { Button } from "@/components/ui/button"
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
import {
  ChevronsLeft,
  ChevronLeft,
  ChevronRight,
  ChevronsRight,
} from "lucide-react"

// --- 목업 데이터 ---
const MOCK_ROWS = Array.from({ length: 10 }, (_, i) => ({
  no: 10 - i,
  name: "이*혁",
  gender: "남성",
  birth: "1981.11.27 (40세)",
  phone: "0507-1111-1111",
  region: "서울특별시",
  convertedAt: "2026.01.01  00:00",
}))

export function PendingTable() {
  const [pageSize, setPageSize] = useState("10")
  const [currentPage, setCurrentPage] = useState(1)
  const totalPages = 10

  const getPageNumbers = () => {
    const delta = 2
    const range: (number | "...")[] = []
    let prev = 0
    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= currentPage - delta && i <= currentPage + delta)) {
        if (prev && i - prev > 1) range.push("...")
        range.push(i)
        prev = i
      }
    }
    return range
  }

  return (
    <div className="flex-1 bg-card rounded-lg border border-border/40 overflow-hidden flex flex-col">

      {/* 필터 헤더 */}
      <div className="px-6 pt-6 pb-4">
        <PendingFilter />
      </div>

      {/* 총 건수 + 페이지 크기 */}
      <div className="flex items-center justify-between px-6 py-3">
        <span className="text-[12px] font-medium text-muted-foreground">
          총 <span className="font-semibold">{MOCK_ROWS.length}</span>개
        </span>
        <Select value={pageSize} onValueChange={setPageSize}>
          <SelectTrigger className="!h-7 min-h-0 w-[66px] px-2.5 rounded-md text-[11px] font-medium border-border/60 bg-background shadow-none gap-1 [&_svg]:size-3.5">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="rounded-md border-border/60">
            <SelectItem value="10">10개</SelectItem>
            <SelectItem value="20">20개</SelectItem>
            <SelectItem value="50">50개</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* 테이블 */}
      <div className="px-6 pb-4">
        <Table>
          <TableHeader>
            <TableRow className="border-border/40 hover:bg-transparent">
              <TableHead className="text-[12px] font-semibold text-muted-foreground/70 px-3 w-[60px]">No.</TableHead>
              <TableHead className="text-[12px] font-semibold text-muted-foreground/70 px-3 w-[80px]">이름</TableHead>
              <TableHead className="text-[12px] font-semibold text-muted-foreground/70 px-3 w-[60px]">성별</TableHead>
              <TableHead className="text-[12px] font-semibold text-muted-foreground/70 px-3">생년월일</TableHead>
              <TableHead className="text-[12px] font-semibold text-muted-foreground/70 px-3">연락처</TableHead>
              <TableHead className="text-[12px] font-semibold text-muted-foreground/70 px-3">지역</TableHead>
              <TableHead className="text-[12px] font-semibold text-muted-foreground/70 px-3">계약 예정 상태 전환일</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {MOCK_ROWS.map((row) => (
              <TableRow
                key={row.no}
                className="border-border/30 hover:bg-muted/30 transition-colors"
              >
                <TableCell className="text-[13px] text-muted-foreground/70 px-3 py-3.5">{row.no}</TableCell>
                <TableCell className="px-3 py-3.5">
                  <button className="text-[13px] font-medium text-primary hover:underline underline-offset-2 transition-colors">
                    {row.name}
                  </button>
                </TableCell>
                <TableCell className="text-[13px] text-foreground/80 px-3 py-3.5">{row.gender}</TableCell>
                <TableCell className="text-[13px] text-foreground/80 px-3 py-3.5">{row.birth}</TableCell>
                <TableCell className="text-[13px] text-foreground/80 px-3 py-3.5">{row.phone}</TableCell>
                <TableCell className="text-[13px] text-foreground/80 px-3 py-3.5">{row.region}</TableCell>
                <TableCell className="text-[13px] text-foreground/80 px-3 py-3.5">{row.convertedAt}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* 페이지네이션 */}
      <div className="flex items-center justify-center gap-1 px-6 py-4 border-t border-border/30 mt-auto">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCurrentPage(1)}
          disabled={currentPage === 1}
          className="h-8 w-8 p-0 rounded-md text-muted-foreground/60 hover:text-foreground hover:bg-muted/50 disabled:opacity-30"
        >
          <ChevronsLeft className="h-3.5 w-3.5" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
          disabled={currentPage === 1}
          className="h-8 w-8 p-0 rounded-md text-muted-foreground/60 hover:text-foreground hover:bg-muted/50 disabled:opacity-30"
        >
          <ChevronLeft className="h-3.5 w-3.5" />
        </Button>

        {getPageNumbers().map((n, i) =>
          n === "..." ? (
            <span key={`ellipsis-${i}`} className="h-8 w-8 flex items-center justify-center text-[12px] text-muted-foreground/50">…</span>
          ) : (
            <Button
              key={n}
              variant="ghost"
              size="sm"
              onClick={() => setCurrentPage(n)}
              className={`h-8 w-8 p-0 rounded-md text-[12px] font-medium transition-colors ${
                currentPage === n
                  ? "bg-muted text-foreground hover:bg-muted/80"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }`}
            >
              {n}
            </Button>
          )
        )}

        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
          disabled={currentPage === totalPages}
          className="h-8 w-8 p-0 rounded-md text-muted-foreground/60 hover:text-foreground hover:bg-muted/50 disabled:opacity-30"
        >
          <ChevronRight className="h-3.5 w-3.5" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCurrentPage(totalPages)}
          disabled={currentPage === totalPages}
          className="h-8 w-8 p-0 rounded-md text-muted-foreground/60 hover:text-foreground hover:bg-muted/50 disabled:opacity-30"
        >
          <ChevronsRight className="h-3.5 w-3.5" />
        </Button>
      </div>

    </div>
  )
}
