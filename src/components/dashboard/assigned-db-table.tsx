"use client"

/**
 * 역할: 배정 완료 DB 통합 카드 — 필터 + KPI + 테이블
 * 주요 기능: 필터(담당설계사/고객명/조건/지역), StatsSection, 체크박스 테이블, 선택 재배정
 */

import { useState } from "react"
import { StatsSection } from "@/components/dashboard/stats-section"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
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
  name: string
  gender: string
  birth: string
  phone: string
  region: string
  assignedAt: string
  firstCall: string | null
  lastCall: string | null
  callTry: string | null
  callSuccess: string | null
  validCall: string | null
  planner: string
}

const MOCK_ROWS: Row[] = [
  { no: 10, name: "이*혁", gender: "남성", birth: "1981.11.27 (40세)", phone: "0507-1111-1111", region: "서울특별시", assignedAt: "2026.01.01 00:00", firstCall: "2026.01.01 00:00", lastCall: "2026.01.01 00:00", callTry: "10회", callSuccess: "10회", validCall: null,    planner: "김홍도" },
  { no: 9,  name: "이*혁", gender: "남성", birth: "1981.11.27 (40세)", phone: "0507-1111-1111", region: "서울특별시", assignedAt: "2026.01.01 00:00", firstCall: null,               lastCall: null,               callTry: null,    callSuccess: null,    validCall: null,    planner: "김홍도" },
  { no: 8,  name: "이*혁", gender: "남성", birth: "1981.11.27 (40세)", phone: "0507-1111-1111", region: "서울특별시", assignedAt: "2026.01.01 00:00", firstCall: "2026.01.01 00:00", lastCall: "2026.01.01 00:00", callTry: "10회", callSuccess: "10회", validCall: "10회", planner: "김홍도" },
  { no: 7,  name: "이*혁", gender: "남성", birth: "1981.11.27 (40세)", phone: "0507-1111-1111", region: "서울특별시", assignedAt: "2026.01.01 00:00", firstCall: "2026.01.01 00:00", lastCall: null,               callTry: null,    callSuccess: null,    validCall: null,    planner: "김홍도" },
  { no: 6,  name: "이*혁", gender: "남성", birth: "1981.11.27 (40세)", phone: "0507-1111-1111", region: "서울특별시", assignedAt: "2026.01.01 00:00", firstCall: "2026.01.01 00:00", lastCall: "2026.01.01 00:00", callTry: "10회", callSuccess: "10회", validCall: null,    planner: "김홍도" },
  { no: 5,  name: "이*혁", gender: "남성", birth: "1981.11.27 (40세)", phone: "0507-1111-1111", region: "서울특별시", assignedAt: "2026.01.01 00:00", firstCall: "2026.01.01 00:00", lastCall: "2026.01.01 00:00", callTry: "10회", callSuccess: "10회", validCall: null,    planner: "김홍도" },
  { no: 4,  name: "이*혁", gender: "남성", birth: "1981.11.27 (40세)", phone: "0507-1111-1111", region: "서울특별시", assignedAt: "2026.01.01 00:00", firstCall: "2026.01.01 00:00", lastCall: "2026.01.01 00:00", callTry: "10회", callSuccess: "10회", validCall: "10회", planner: "김홍도" },
  { no: 3,  name: "이*혁", gender: "남성", birth: "1981.11.27 (40세)", phone: "0507-1111-1111", region: "서울특별시", assignedAt: "2026.01.01 00:00", firstCall: null,               lastCall: null,               callTry: null,    callSuccess: null,    validCall: null,    planner: "김홍도" },
  { no: 2,  name: "이*혁", gender: "남성", birth: "1981.11.27 (40세)", phone: "0507-1111-1111", region: "서울특별시", assignedAt: "2026.01.01 00:00", firstCall: "2026.01.01 00:00", lastCall: "2026.01.01 00:00", callTry: "10회", callSuccess: "10회", validCall: "10회", planner: "김홍도" },
  { no: 1,  name: "이*혁", gender: "남성", birth: "1981.11.27 (40세)", phone: "0507-1111-1111", region: "서울특별시", assignedAt: "2026.01.01 00:00", firstCall: "2026.01.01 00:00", lastCall: "2026.01.01 00:00", callTry: "10회", callSuccess: "10회", validCall: "10회", planner: "김홍도" },
]

const TOTAL_PAGES = 10

export function AssignedDbTable() {
  const [selectedIds, setSelectedIds] = useState<number[]>([])
  const [pageSize, setPageSize] = useState("10")
  const [currentPage, setCurrentPage] = useState(1)

  const allSelected = selectedIds.length === MOCK_ROWS.length
  const someSelected = selectedIds.length > 0 && !allSelected

  const toggleAll = () => setSelectedIds(allSelected ? [] : MOCK_ROWS.map(r => r.no))
  const toggleRow = (no: number) => setSelectedIds(prev =>
    prev.includes(no) ? prev.filter(id => id !== no) : [...prev, no]
  )

  // 현재 페이지 주변 ±2 + 첫/끝 페이지 + 줄임표 패턴
  const getPageNumbers = () => {
    const delta = 2
    const range: (number | "...")[] = []
    let prev = 0
    for (let i = 1; i <= TOTAL_PAGES; i++) {
      if (i === 1 || i === TOTAL_PAGES || (i >= currentPage - delta && i <= currentPage + delta)) {
        if (prev && i - prev > 1) range.push("...")
        range.push(i)
        prev = i
      }
    }
    return range
  }

  return (
    <div className="bg-card rounded-lg border border-border/40 overflow-hidden flex flex-col">

      {/* KPI 타일 */}
      <StatsSection />

      {/* 총 건수 + 선택 재배정 + 페이지 크기 */}
      <div className="flex items-center justify-between px-6 py-3">
        <span className="text-[12px] font-medium text-muted-foreground">
          총 <span className="font-semibold">{MOCK_ROWS.length}</span>개
        </span>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            disabled={selectedIds.length === 0}
            className="bg-primary text-primary-foreground hover:bg-primary/90 active:scale-95"
          >
            선택 재배정
          </Button>
          <Select value={pageSize} onValueChange={setPageSize}>
            <SelectTrigger className="h-8 w-[72px] px-2.5 rounded-md text-[12px] font-medium border-border/60 bg-background shadow-none gap-1.5">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="rounded-md border-border/60">
              <SelectItem value="10">10개</SelectItem>
              <SelectItem value="20">20개</SelectItem>
              <SelectItem value="50">50개</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* 테이블 */}
      <div className="px-6 pb-2 overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-border/40 hover:bg-transparent">
              {/* 전체 선택 체크박스 */}
              <TableHead className="w-10 px-3">
                <Checkbox
                  checked={allSelected}
                  ref={(el) => {
                    if (el) (el as HTMLButtonElement & { indeterminate?: boolean }).indeterminate = someSelected
                  }}
                  onCheckedChange={toggleAll}
                  className="h-4 w-4 rounded-[4px] border-border/60 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                />
              </TableHead>
              <TableHead className="text-[12px] font-semibold text-muted-foreground/70 px-3 w-[48px]">No.</TableHead>
              <TableHead className="text-[12px] font-semibold text-muted-foreground/70 px-3 w-[72px]">이름</TableHead>
              <TableHead className="text-[12px] font-semibold text-muted-foreground/70 px-3 w-[52px]">성별</TableHead>
              <TableHead className="text-[12px] font-semibold text-muted-foreground/70 px-3">생년월일</TableHead>
              <TableHead className="text-[12px] font-semibold text-muted-foreground/70 px-3">연락처</TableHead>
              <TableHead className="text-[12px] font-semibold text-muted-foreground/70 px-3">지역</TableHead>
              <TableHead className="text-[12px] font-semibold text-muted-foreground/70 px-3">배정시간</TableHead>
              <TableHead className="text-[12px] font-semibold text-muted-foreground/70 px-3">최초통화</TableHead>
              <TableHead className="text-[12px] font-semibold text-muted-foreground/70 px-3">최근통화</TableHead>
              <TableHead className="text-[12px] font-semibold text-muted-foreground/70 px-3 text-center">통화시도</TableHead>
              <TableHead className="text-[12px] font-semibold text-muted-foreground/70 px-3 text-center">통화성공</TableHead>
              <TableHead className="text-[12px] font-semibold text-muted-foreground/70 px-3 text-center">유효통화</TableHead>
              <TableHead className="text-[12px] font-semibold text-muted-foreground/70 px-3">담당 설계사</TableHead>
              <TableHead className="text-[12px] font-semibold text-muted-foreground/70 px-3 text-center">배정이력</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {MOCK_ROWS.map((row) => (
              <TableRow
                key={row.no}
                className="border-border/30 hover:bg-muted/30 transition-colors"
                data-state={selectedIds.includes(row.no) ? "selected" : undefined}
              >
                <TableCell className="px-3 py-3.5">
                  <Checkbox
                    checked={selectedIds.includes(row.no)}
                    onCheckedChange={() => toggleRow(row.no)}
                    className="h-4 w-4 rounded-[4px] border-border/60 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                  />
                </TableCell>
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
                <TableCell className="text-[13px] text-foreground/80 px-3 py-3.5">{row.assignedAt}</TableCell>
                <TableCell className="text-[13px] text-foreground/80 px-3 py-3.5">{row.firstCall ?? <span className="text-muted-foreground/40">-</span>}</TableCell>
                <TableCell className="text-[13px] text-foreground/80 px-3 py-3.5">{row.lastCall ?? <span className="text-muted-foreground/40">-</span>}</TableCell>
                <TableCell className="text-[13px] text-foreground/80 px-3 py-3.5 text-center">{row.callTry ?? <span className="text-muted-foreground/40">-</span>}</TableCell>
                <TableCell className="text-[13px] text-foreground/80 px-3 py-3.5 text-center">{row.callSuccess ?? <span className="text-muted-foreground/40">-</span>}</TableCell>
                <TableCell className="text-[13px] text-foreground/80 px-3 py-3.5 text-center">{row.validCall ?? <span className="text-muted-foreground/40">-</span>}</TableCell>
                <TableCell className="text-[13px] text-foreground/80 px-3 py-3.5">{row.planner}</TableCell>
                <TableCell className="px-3 py-3.5 text-center">
                  <button className="text-[13px] font-medium text-primary hover:underline underline-offset-2 transition-colors">
                    확인
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* 페이지네이션 */}
      <div className="flex items-center justify-center gap-1 px-6 py-4 border-t border-border/30 mt-auto">
        <Button variant="ghost" size="sm" onClick={() => setCurrentPage(1)} disabled={currentPage === 1}
          className="h-8 w-8 p-0 rounded-md text-muted-foreground/60 hover:text-foreground hover:bg-muted/50 disabled:opacity-30">
          <ChevronsLeft className="h-3.5 w-3.5" />
        </Button>
        <Button variant="ghost" size="sm" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}
          className="h-8 w-8 p-0 rounded-md text-muted-foreground/60 hover:text-foreground hover:bg-muted/50 disabled:opacity-30">
          <ChevronLeft className="h-3.5 w-3.5" />
        </Button>

        {getPageNumbers().map((n, i) =>
          n === "..." ? (
            <span key={`ellipsis-${i}`} className="h-8 w-8 flex items-center justify-center text-[12px] text-muted-foreground/50">…</span>
          ) : (
            <Button key={n} variant="ghost" size="sm" onClick={() => setCurrentPage(n)}
              className={`h-8 w-8 p-0 rounded-md text-[12px] font-medium transition-colors ${
                currentPage === n
                  ? "bg-muted text-foreground hover:bg-muted/80"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }`}>
              {n}
            </Button>
          )
        )}

        <Button variant="ghost" size="sm" onClick={() => setCurrentPage(p => Math.min(TOTAL_PAGES, p + 1))} disabled={currentPage === TOTAL_PAGES}
          className="h-8 w-8 p-0 rounded-md text-muted-foreground/60 hover:text-foreground hover:bg-muted/50 disabled:opacity-30">
          <ChevronRight className="h-3.5 w-3.5" />
        </Button>
        <Button variant="ghost" size="sm" onClick={() => setCurrentPage(TOTAL_PAGES)} disabled={currentPage === TOTAL_PAGES}
          className="h-8 w-8 p-0 rounded-md text-muted-foreground/60 hover:text-foreground hover:bg-muted/50 disabled:opacity-30">
          <ChevronsRight className="h-3.5 w-3.5" />
        </Button>
      </div>

    </div>
  )
}
