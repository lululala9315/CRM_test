"use client"

/**
 * 역할: 페이지 타이틀 가시성 → Sticky breadcrumb 표시 여부 공유 컨텍스트
 */

import { createContext, useContext, useState } from "react"

interface BreadcrumbContextValue {
  isTitleVisible: boolean
  setTitleVisible: (v: boolean) => void
}

const BreadcrumbContext = createContext<BreadcrumbContextValue>({
  isTitleVisible: true,
  setTitleVisible: () => {},
})

export function BreadcrumbProvider({ children }: { children: React.ReactNode }) {
  const [isTitleVisible, setTitleVisible] = useState(true)

  return (
    <BreadcrumbContext.Provider value={{ isTitleVisible, setTitleVisible }}>
      {children}
    </BreadcrumbContext.Provider>
  )
}

export function useBreadcrumbVisible() {
  return useContext(BreadcrumbContext)
}
