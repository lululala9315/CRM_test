"use client"

/**
 * 역할: 운영/관리자 테이블 — KPI + 체크박스 테이블 + 선택 일괄 승인 + 페이지네이션
 * 주요 기능: 상태 통계 타일, 직원 목록, 승인/거절 버튼, 활동상태 배지
 */

import { useState } from "react"
import { useRouter } from "next/navigation"
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

// --- KPI 타일 데이터 ---
const KPI_ITEMS = [
  { label: "전체",     value: "100", unit: "명" },
  { label: "승인대기", value: "50",  unit: "명" },
  { label: "정상",     value: "10",  unit: "명" },
  { label: "일시제한", value: "10",  unit: "명" },
]


// --- 목업 데이터 ---
type ApprovalStatus = "approved" | "rejected" | "none"
type ActivityStatus = "정상" | "대기" | "일시제한"

const ACTIVITY_COLOR: Record<ActivityStatus, string> = {
  "정상":     "text-content-secondary",
  "대기":     "text-primary",
  "일시제한": "text-content-assistive",
}

type Row = {
  no: number
  name: string
  userId: string
  phone: string
  org: string
  position: string
  joinedAt: string
  approval: ApprovalStatus
  approvalDate: string | null
  activity: ActivityStatus
}

const ORGS = ["본사", "본사 > 사업단 1", "본사 > 사업단 1 > 지점 1", "본사 > 사업단 1 > 지점 1 > 팀 1"]
const POSITIONS = ["최고관리자", "사업단장", "지점장", "팀장"]
const ACTIVITIES: ActivityStatus[] = ["정상", "대기", "일시제한"]

const MOCK_ROWS: Row[] = Array.from({ length: 50 }, (_, i) => ({
  no: 50 - i,
  name: "이민혁",
  userId: "kris",
  phone: "010-1111-1111",
  org: ORGS[i % ORGS.length],
  position: POSITIONS[i % POSITIONS.length],
  joinedAt: "2026.01.01",
  approval: (i % 3 === 0 ? "none" : i % 3 === 1 ? "rejected" : "approved") as ApprovalStatus,
  approvalDate: i % 3 === 0 ? "2026.02.01" : null,
  activity: ACTIVITIES[i % ACTIVITIES.length],
}))

// 승인상태 렌더링 — 승인 완료·거절은 처리 날짜, 대기는 승인/거절 버튼
// min-w-[128px] 고정 — 버튼↔날짜 전환 시 열 너비 reflow 방지
function ApprovalCell({ status, date }: { status: ApprovalStatus; date: string | null }) {
  const [localStatus, setLocalStatus] = useState(status)
  const [actionDate, setActionDate] = useState<string | null>(date)

  const handleApprove = (e: React.MouseEvent) => {
    e.stopPropagation()   // 행 클릭(상세 이동) 방지
    setActionDate("2026.02.01")
    setLocalStatus("approved")
  }

  const handleReject = (e: React.MouseEvent) => {
    e.stopPropagation()
    setActionDate("2026.02.01")
    setLocalStatus("rejected")
  }

  // actionDate가 있으면 처리 완료 — 날짜 표시
  // null이면 미처리 — 버튼 표시 (초기 rejected 포함)
  if (actionDate !== null) {
    return (
      <span className="num-cell text-content-secondary inline-block min-w-[128px]">
        {actionDate}
      </span>
    )
  }

  return (
    <div className="flex items-center justify-start gap-1 min-w-[128px]">
      <Button variant="neutral" size="xs" onClick={handleApprove}>승인</Button>
      <Button variant="destructive" size="xs" onClick={handleReject}>거절</Button>
    </div>
  )
}

export function AdminTable({ disabledRowKeys = [] }: { disabledRowKeys?: number[] }) {
  const router = useRouter()
  const [selectedIds, setSelectedIds] = useState<number[]>([])
  const [sortOrder, setSortOrder] = useState("latest")
  const [pageSize, setPageSize] = useState("10")
  const [currentPage, setCurrentPage] = useState(1)
  const pageSizeNum = parseInt(pageSize)
  const totalPages = Math.ceil(MOCK_ROWS.length / pageSizeNum)
  const displayedRows = MOCK_ROWS.slice((currentPage - 1) * pageSizeNum, currentPage * pageSizeNum)

  const allSelected = displayedRows.length > 0 && displayedRows.every(r => selectedIds.includes(r.no))
  const someSelected = displayedRows.some(r => selectedIds.includes(r.no)) && !allSelected
  const hasSelection = selectedIds.length > 0

  const toggleAll = () => setSelectedIds(allSelected
    ? selectedIds.filter(id => !displayedRows.find(r => r.no === id))
    : [...new Set([...selectedIds, ...displayedRows.map(r => r.no)])]
  )
  const toggleRow = (no: number) => setSelectedIds(prev =>
    prev.includes(no) ? prev.filter(id => id !== no) : [...prev, no]
  )

  // 고정 7슬롯 페이지네이션 — 페이지 이동 시 레이아웃 쉬프트 방지
  // 패턴: [1, …, c-1, c, c+1, …, TOTAL] 또는 양끝 근접 시 연속 표시
  const getPageNumbers = (): (number | "...")[] => {
    const total = totalPages
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)

    if (currentPage <= 4) {
      return [1, 2, 3, 4, 5, "...", total]
    }
    if (currentPage >= total - 3) {
      return [1, "...", total - 4, total - 3, total - 2, total - 1, total]
    }
    return [1, "...", currentPage - 1, currentPage, currentPage + 1, "...", total]
  }

  return (
    <div className="flex flex-col gap-8">

      {/* KPI 타일 카드 */}
      <div className="bg-canvas-primary rounded-lg py-5 border border-line-subtle">
        <div className="flex items-stretch">
          {KPI_ITEMS.map((stat, i) => (
            <div
              key={stat.label}
              className="flex-1 px-6 relative"
            >
              {i > 0 && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 h-12 w-px bg-divider-normal" />
              )}
              <p className="text-[12px] font-medium text-content-assistive mb-2.5 tracking-tight leading-none whitespace-nowrap">
                {stat.label}
              </p>
              <div className="flex items-baseline gap-0.5">
                <span className="text-[24px] font-semibold tracking-tight text-content-primary leading-none tabular-nums">
                  {stat.value}
                </span>
                <span className="text-[24px] font-semibold tracking-tight text-content-primary leading-none">
                  {stat.unit}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 툴바 + 테이블 + 페이지네이션 */}
      <div className="sticky top-3 z-[5] flex flex-col gap-0.5">

      {/* 툴바 */}
      <div className="bg-canvas-tertiary flex items-center justify-between py-1">
        <span className="text-[12px] font-medium text-content-assistive tabular-nums">
          {hasSelection
            ? `${selectedIds.length}건 선택`
            : `전체 ${MOCK_ROWS.length}건`
          }
        </span>
        <div className="flex items-center gap-1">
          {/* 선택 시: 정렬 숨기고 일괄 승인 버튼 노출 */}
          {!hasSelection && (
            <Select value={sortOrder} onValueChange={(v) => { setSortOrder(v); setCurrentPage(1) }}>
              <SelectTrigger className="h-7 px-2 py-0 border-transparent bg-transparent shadow-none gap-1 !text-[12px] text-content-assistive hover:bg-fill-subtle hover:text-content-primary rounded-md">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="rounded-md border-line-subtle text-[13px]">
                <SelectItem value="latest">최신순</SelectItem>
                <SelectItem value="oldest">오래된순</SelectItem>
              </SelectContent>
            </Select>
          )}
          <Select value={pageSize} onValueChange={(v) => { setPageSize(v); setCurrentPage(1) }}>
            <SelectTrigger className="h-7 px-2 py-0 border-transparent bg-transparent shadow-none gap-1 !text-[12px] text-content-assistive hover:bg-fill-subtle hover:text-content-primary rounded-md">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="rounded-md border-line-subtle text-[13px]">
              <SelectItem value="10">10건</SelectItem>
              <SelectItem value="20">20건</SelectItem>
              <SelectItem value="50">50건</SelectItem>
            </SelectContent>
          </Select>
          {hasSelection && (
            <Button>
              선택 일괄 승인
            </Button>
          )}
        </div>
      </div>

      {/* 테이블 카드 */}
      <div className="bg-canvas-primary rounded-lg overflow-hidden border border-line-subtle">

        <div className="overflow-auto max-h-[calc(100svh-10rem)]">
          <Table className="table-fixed w-auto min-w-full">
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
                <TableHead className="text-left font-semibold text-content-assistive text-[12px] h-10 w-24">이름</TableHead>
                <TableHead className="text-left font-semibold text-content-assistive text-[12px] h-10 w-24">아이디</TableHead>
                <TableHead className="text-left font-semibold text-content-assistive text-[12px] h-10 w-36">휴대폰번호</TableHead>
                <TableHead className="text-left font-semibold text-content-assistive text-[12px] h-10 w-52">소속</TableHead>
                <TableHead className="text-left font-semibold text-content-assistive text-[12px] h-10 w-24">직책</TableHead>
                <TableHead className="text-left font-semibold text-content-assistive text-[12px] h-10 w-40">가입일</TableHead>
                <TableHead className="text-left font-semibold text-content-assistive text-[12px] h-10 w-36">승인상태</TableHead>
                <TableHead className="text-left font-semibold text-content-assistive text-[12px] h-10 w-24">활동상태</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {displayedRows.map((row) => (
                <TableRow
                  key={row.no}
                  className={`cursor-pointer border-divider-subtle hover:bg-fill-subtle transition-colors duration-120 data-[state=selected]:bg-primary/5${disabledRowKeys.includes(row.no) ? " opacity-40 pointer-events-none select-none" : ""}`}
                  data-state={selectedIds.includes(row.no) ? "selected" : undefined}
                  onClick={() => router.push(`/management/admin/${row.no}`)}
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
                  <TableCell className="text-center num-cell !pl-1">{row.no}</TableCell>
                  <TableCell className="text-left">{row.name}</TableCell>
                  <TableCell className="text-left num-cell">{row.userId}</TableCell>
                  <TableCell className="text-left num-cell">{row.phone}</TableCell>
                  <TableCell className="text-left">{row.org}</TableCell>
                  <TableCell className="text-left">{row.position}</TableCell>
                  <TableCell className="text-left num-cell">{row.joinedAt}</TableCell>
                  <TableCell className="text-left" onClick={(e) => e.stopPropagation()}>
                    <ApprovalCell status={row.approval} date={row.approvalDate} />
                  </TableCell>
                  <TableCell className={`text-left font-medium ${ACTIVITY_COLOR[row.activity]}`}>{row.activity}</TableCell>
                </TableRow>
              ))}
              {MOCK_ROWS.length === 0 && (
                <TableRow>
                  <TableCell colSpan={10} className="py-16 text-[13px] text-content-disabled text-center">
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
    </div>
  )
}
