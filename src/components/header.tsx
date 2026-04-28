"use client"

import Link from "next/link"
import { useSidebar } from "@/components/ui/sidebar"
import { User, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

// 사이드바 상태에 따라 다른 아이콘을 보여주는 원형 토글 버튼
// 사이드바 아이콘 컬럼(4rem) 너비 컨테이너 안에 중앙 정렬하여 아이콘과 맞춤
function SidebarToggle() {
  const { state, toggleSidebar } = useSidebar()
  const isExpanded = state === "expanded"

  return (
    <div className="flex w-[var(--sidebar-width-icon)] shrink-0 items-center justify-center">
      <button
        onClick={toggleSidebar}
        aria-label={isExpanded ? "사이드바 닫기" : "사이드바 열기"}
        className="h-8 w-8 rounded-md flex items-center justify-center text-content-quaternary hover:text-content-secondary hover:bg-canvas-quaternary transition-colors duration-150"
      >
        <Menu className="h-4 w-4" strokeWidth={2} />
      </button>
    </div>
  )
}

export function Header() {
  return (
    <header className="flex h-12 shrink-0 items-center justify-between border-b border-divider-normal bg-canvas-tertiary">

      {/* 좌측: 토글 + 로고 + 구분선 + KB라이프 로고 */}
      <div className="flex items-center">
        <SidebarToggle />
        <Link href="/" className="flex items-center hover:opacity-75 transition-opacity">
          <span className="text-[18px] font-semibold text-content-primary tracking-tight mr-2">보닥 플래너</span>
          <div className="h-4 w-px bg-border shrink-0 mr-2" />
          {/* 실제 이미지 760×449 비율 유지 — 높이 22px 기준 */}
          <img
            src="/kb-life-logo2.svg"
            alt="KB라이프"
            style={{ height: "18px", width: "auto" }}
            className="opacity-90"
          />
        </Link>
      </div>

      {/* 우측: 세션 + 연장 + 프로필 */}
      <div className="flex items-center gap-2 pr-4">
        <span className="font-medium text-xs tabular-nums tracking-tighter text-content-assistive">세션 10:00</span>
        <Button variant="outline" size="xs" className="text-xs">연장</Button>
        <div className="h-4 w-px bg-border mx-0.5 shrink-0" />
        <Link href="/mypage">
          <Avatar className="h-7 w-7 cursor-pointer hover:ring-2 hover:ring-border transition-[box-shadow]">
            <AvatarFallback className="bg-canvas-quaternary">
              <User className="h-3.5 w-3.5 text-content-assistive" />
            </AvatarFallback>
          </Avatar>
        </Link>
      </div>

    </header>
  )
}
