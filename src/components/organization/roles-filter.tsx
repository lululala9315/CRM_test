"use client"

/**
 * 역할: 직책·권한 설정 필터 — 직책/직급명 + 업무 권한 + 사용 여부 드롭다운
 * 주요 기능: SearchFilter 패턴 통일 (size=sm, border-subtle, bg-canvas-primary)
 */

import { useState } from "react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function RolesFilter() {
  const [roleName, setRoleName]     = useState("all")
  const [permission, setPermission] = useState("all")
  const [usage, setUsage]           = useState("all")

  const handleReset = () => {
    setRoleName("all")
    setPermission("all")
    setUsage("all")
  }

  // 기본값("all")에서 벗어난 필터가 있을 때만 초기화 버튼 노출
  const hasFilter = roleName !== "all" || permission !== "all" || usage !== "all"

  return (
    <div className="flex items-center gap-1.5 flex-wrap">

      {/* 직책/직급명 */}
      <Select value={roleName} onValueChange={setRoleName}>
        <SelectTrigger size="sm" className="min-w-[140px] border-subtle bg-fill-filter text-content-primary">
          <span className="flex items-center gap-1 min-w-0 flex-1">
            <span className="text-content-assistive shrink-0">직책/직급</span>
            <span className="text-content-disabled shrink-0">·</span>
            <SelectValue />
          </span>
        </SelectTrigger>
        <SelectContent position="popper" sideOffset={4} className="rounded-md border-subtle text-[13px]">
          <SelectItem value="all">전체</SelectItem>
          <SelectItem value="top">최고 관리자</SelectItem>
          <SelectItem value="head">사업단장</SelectItem>
          <SelectItem value="branch">지점장</SelectItem>
          <SelectItem value="team">팀장</SelectItem>
          <SelectItem value="planner">플래너</SelectItem>
        </SelectContent>
      </Select>

      {/* 업무 권한 */}
      <Select value={permission} onValueChange={setPermission}>
        <SelectTrigger size="sm" className="min-w-[130px] border-subtle bg-fill-filter text-content-primary">
          <span className="flex items-center gap-1 min-w-0 flex-1">
            <span className="text-content-assistive shrink-0">업무권한</span>
            <span className="text-content-disabled shrink-0">·</span>
            <SelectValue />
          </span>
        </SelectTrigger>
        <SelectContent position="popper" sideOffset={4} className="rounded-md border-subtle text-[13px]">
          <SelectItem value="all">전체</SelectItem>
          <SelectItem value="admin">운영/관리자</SelectItem>
          <SelectItem value="planner">설계사</SelectItem>
        </SelectContent>
      </Select>

      {/* 사용 여부 */}
      <Select value={usage} onValueChange={setUsage}>
        <SelectTrigger size="sm" className="min-w-[120px] border-subtle bg-fill-filter text-content-primary">
          <span className="flex items-center gap-1 min-w-0 flex-1">
            <span className="text-content-assistive shrink-0">사용여부</span>
            <span className="text-content-disabled shrink-0">·</span>
            <SelectValue />
          </span>
        </SelectTrigger>
        <SelectContent position="popper" sideOffset={4} className="rounded-md border-subtle text-[13px]">
          <SelectItem value="all">전체</SelectItem>
          <SelectItem value="active">사용함</SelectItem>
          <SelectItem value="inactive">사용안함</SelectItem>
        </SelectContent>
      </Select>

      {/* 필터 변경 시에만 노출 — 언더라인 primary 텍스트 버튼 */}
      {hasFilter && (
        <button
          onClick={handleReset}
          className="h-8 px-1 text-[12px] font-medium text-primary underline underline-offset-2 decoration-accent hover:opacity-70 active:scale-[0.97] transition-[transform,opacity] duration-100"
        >
          필터 초기화
        </button>
      )}

    </div>
  )
}
