"use client"

/**
 * 역할: 직책·권한 설정 테이블 — 직책 목록 + 페이지네이션 + 등록 버튼
 * 주요 기능: 직책/직급 목록, 체크박스 없음, 하단 등록 버튼
 */

import { useState } from "react"
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
type Row = {
  no: number
  title: string
  permission: string
  usage: string
  createdAt: string
  updatedAt: string | null
}

const TITLES = ["최고 관리자", "사업단장", "지점장", "팀장", "플래너", "직책명"]
const PERMISSIONS = ["운영/관리자", "설계사"]

const MOCK_ROWS: Row[] = Array.from({ length: 50 }, (_, i) => ({
  no: 50 - i,
  title: TITLES[i % TITLES.length],
  permission: PERMISSIONS[i % PERMISSIONS.length],
  usage: "사용함",
  createdAt: "2026.01.01",
  updatedAt: i % 5 === 1 ? "2026.01.02" : null,
}))

// null 값 표시용 대시
function NullDash() {
  return <span className="text-content-disabled">-</span>
}

export function RolesTable({ disabledRowKeys = [] }: { disabledRowKeys?: number[] }) {
  const [pageSize, setPageSize] = useState("10")
  const [currentPage, setCurrentPage] = useState(1)
  const pageSizeNum = parseInt(pageSize)
  const totalPages = Math.ceil(MOCK_ROWS.length / pageSizeNum)
  const displayedRows = MOCK_ROWS.slice((currentPage - 1) * pageSizeNum, currentPage * pageSizeNum)

  // 고정 7슬롯 페이지네이션 — 페이지 이동 시 레이아웃 쉬프트 방지
  const getPageNumbers = (): (number | "...")[] => {
    const total = totalPages
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
    if (currentPage <= 4) return [1, 2, 3, 4, 5, "...", total]
    if (currentPage >= total - 3) return [1, "...", total - 4, total - 3, total - 2, total - 1, total]
    return [1, "...", currentPage - 1, currentPage, currentPage + 1, "...", total]
  }

  return (
    <div className="sticky top-3 z-[5] flex flex-col gap-0.5">

      {/* 툴바 */}
      <div className="bg-canvas-tertiary flex items-center justify-between py-1">
        <span className="text-[13px] font-medium text-content-assistive tabular-nums">
          총 {MOCK_ROWS.length}개
        </span>
        <Select value={pageSize} onValueChange={(v) => { setPageSize(v); setCurrentPage(1) }}>
          <SelectTrigger className="h-7 px-2 py-0 border-transparent bg-transparent shadow-none gap-1 !text-[12px] text-content-assistive hover:bg-fill-subtle hover:text-content-primary rounded-md">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="rounded-md border-line-subtle text-[13px]">
            <SelectItem value="10">10개</SelectItem>
            <SelectItem value="20">20개</SelectItem>
            <SelectItem value="50">50개</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* 테이블 카드 */}
      <div className="bg-canvas-primary rounded-lg overflow-hidden border border-line-subtle">

        <div className="overflow-auto max-h-[calc(100svh-10rem)]">
          <Table>
            <TableHeader className="sticky top-0 z-10">
              <TableRow className="border-b border-divider-normal hover:bg-transparent">
                <TableHead className="text-center font-semibold text-content-assistive text-[12px] h-10 w-12 !pl-1">No.</TableHead>
                <TableHead className="text-left font-semibold text-content-assistive text-[12px] h-10 min-w-24">직책/직급</TableHead>
                <TableHead className="text-left font-semibold text-content-assistive text-[12px] h-10 min-w-40">업무 권한</TableHead>
                <TableHead className="text-left font-semibold text-content-assistive text-[12px] h-10 min-w-24">사용 여부</TableHead>
                <TableHead className="text-left font-semibold text-content-assistive text-[12px] h-10 min-w-40">등록일</TableHead>
                <TableHead className="text-left font-semibold text-content-assistive text-[12px] h-10 min-w-40">수정일</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {displayedRows.map((row) => (
                <TableRow
                  key={row.no}
                  className={`cursor-pointer border-divider-subtle hover:bg-fill-subtle transition-colors duration-120${disabledRowKeys.includes(row.no) ? " opacity-40 pointer-events-none select-none" : ""}`}
                >
                  <TableCell className="text-center num-cell !pl-1">{row.no}</TableCell>
                  <TableCell className="text-left">{row.title}</TableCell>
                  <TableCell className="text-left">{row.permission}</TableCell>
                  <TableCell className="text-left">{row.usage}</TableCell>
                  <TableCell className="text-left num-cell">{row.createdAt}</TableCell>
                  <TableCell className="text-left num-cell">
                    {row.updatedAt ?? <NullDash />}
                  </TableCell>
                </TableRow>
              ))}
              {MOCK_ROWS.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="py-16 text-[13px] text-content-disabled text-center">
                    데이터가 없습니다
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

      </div>

      {/* 페이지네이션 */}
      <div className="flex items-center justify-center gap-1 py-2 mt-1">
        <Button variant="ghost" size="sm" onClick={() => setCurrentPage(1)} disabled={currentPage === 1}
          aria-label="첫 페이지"
          className="h-8 w-8 p-0 rounded-md text-content-assistive hover:text-content-primary hover:bg-fill-normal disabled:opacity-30">
          <ChevronsLeft className="h-3.5 w-3.5" />
        </Button>
        <Button variant="ghost" size="sm" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}
          aria-label="이전 페이지"
          className="h-8 w-8 p-0 rounded-md text-content-assistive hover:text-content-primary hover:bg-fill-normal disabled:opacity-30">
          <ChevronLeft className="h-3.5 w-3.5" />
        </Button>

        {getPageNumbers().map((n, i) =>
          n === "..." ? (
            <span key={`ellipsis-${i}`} className="h-8 w-8 flex items-center justify-center text-[12px] text-content-disabled">…</span>
          ) : (
            <Button key={n} variant="ghost" size="sm" onClick={() => setCurrentPage(n)}
              className={`h-8 w-8 p-0 rounded-md text-[12px] font-medium tabular-nums transition-colors duration-120 active:scale-[0.97] ${
                currentPage === n
                  ? "bg-canvas-quaternary text-content-primary font-semibold hover:bg-canvas-quaternary"
                  : "text-content-assistive hover:text-content-primary hover:bg-fill-normal"
              }`}>
              {n}
            </Button>
          )
        )}

        <Button variant="ghost" size="sm" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
          aria-label="다음 페이지" disabled={currentPage === totalPages}
          className="h-8 w-8 p-0 rounded-md text-content-assistive hover:text-content-primary hover:bg-fill-normal disabled:opacity-30">
          <ChevronRight className="h-3.5 w-3.5" />
        </Button>
        <Button variant="ghost" size="sm" onClick={() => setCurrentPage(totalPages)}
          aria-label="마지막 페이지" disabled={currentPage === totalPages}
          className="h-8 w-8 p-0 rounded-md text-content-assistive hover:text-content-primary hover:bg-fill-normal disabled:opacity-30">
          <ChevronsRight className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  )
}
