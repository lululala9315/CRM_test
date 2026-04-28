"use client"

/**
 * 역할: 페이지 타이틀 h1 아래에 배치 — 화면 밖으로 나가면 Breadcrumb 표시 트리거
 * 사용법: 각 페이지 타이틀 영역 마지막에 <TitleObserver /> 추가
 * 참고: IntersectionObserver 대신 scroll 이벤트 사용
 *       — overflow-hidden 중첩 구조에서 IO가 불안정하므로 직접 감지
 */

import { useEffect, useRef } from "react"
import { useBreadcrumbVisible } from "@/components/breadcrumb-context"

// 가장 가까운 스크롤 가능 조상 요소를 찾는 헬퍼
function findScrollContainer(el: HTMLElement | null): HTMLElement | null {
  if (!el) return null
  const overflow = window.getComputedStyle(el).overflowY
  if (overflow === "auto" || overflow === "scroll") return el
  return findScrollContainer(el.parentElement)
}

export function TitleObserver() {
  const ref = useRef<HTMLDivElement>(null)
  const { setTitleVisible } = useBreadcrumbVisible()

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const container = findScrollContainer(el.parentElement)
    if (!container) return

    // 센티넬 div의 bottom이 컨테이너 상단 위로 올라갔으면 타이틀 비가시 처리
    const check = () => {
      const rect = el.getBoundingClientRect()
      const containerRect = container.getBoundingClientRect()
      setTitleVisible(rect.bottom > containerRect.top)
    }

    container.addEventListener("scroll", check, { passive: true })
    // 사이드바 접힘/펼침 시 레이아웃이 리플로우되므로 resize로도 재체크
    window.addEventListener("resize", check, { passive: true })
    check() // 초기 상태 즉시 반영

    return () => {
      container.removeEventListener("scroll", check)
      window.removeEventListener("resize", check)
      setTitleVisible(true)
    }
  }, [setTitleVisible])

  return <div ref={ref} aria-hidden="true" />
}
