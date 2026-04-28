"use client"

/**
 * 역할: 재배정 타입 설정 목록 — 기본 타입 + 사용자 정의 타입 조회
 * 주요 기능: 타입 목록 표시, 수정 페이지 이동
 */

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

const EDITABLE_TYPES = [
  { id: "return",   name: "반환",   description: "입력한 설명이 노출됩니다.", enabled: true  },
  { id: "free",     name: "무상",   description: "입력한 설명이 노출됩니다.", enabled: true  },
  { id: "transfer", name: "양도",   description: "입력한 설명이 노출됩니다.", enabled: true  },
  { id: "penalty",  name: "패널티", description: "입력한 설명이 노출됩니다.", enabled: false },
]

export function ReassignTypeSettings() {
  const router = useRouter()

  return (
    <div className="flex flex-col gap-3">

      {/* 기본 타입 카드 */}
      <div className="bg-canvas-primary rounded-lg border border-line-subtle">
        <div className="flex items-center px-6 py-4">
          <span className="text-[13px] font-semibold text-content-tertiary w-[160px] shrink-0">타입 이름</span>
          <span className="text-[13px] text-content-secondary">기본</span>
        </div>
      </div>

      {/* 사용자 정의 타입 카드 */}
      <div className="bg-canvas-primary rounded-lg border border-line-subtle overflow-hidden">

        {/* 컬럼 헤더 */}
        <div className="flex items-center px-6 py-3">
          <span className="text-[12px] font-medium text-content-assistive w-[160px] shrink-0">타입 이름</span>
          <span className="text-[12px] font-medium text-content-assistive flex-1">설명</span>
          <span className="text-[12px] font-medium text-content-assistive w-[72px] text-right shrink-0">사용 여부</span>
        </div>
        <div className="mx-6 h-px bg-divider-subtle" />

        {/* 타입 행 */}
        {EDITABLE_TYPES.map((type, index) => (
          <div key={type.id}>
            {index !== 0 && <div className="mx-6 h-px bg-divider-subtle" />}
            <div className="flex items-center px-6 py-4">
              <span className="text-[13px] font-medium text-content-secondary w-[160px] shrink-0">{type.name}</span>
              <span className="text-[13px] text-content-quaternary flex-1 min-w-0 truncate">{type.description}</span>
              <span className={
                type.enabled
                  ? "text-[13px] font-medium text-content-secondary w-[72px] text-right shrink-0"
                  : "text-[13px] font-medium text-content-disabled w-[72px] text-right shrink-0"
              }>
                {type.enabled ? "사용함" : "사용안함"}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* 수정 버튼 */}
      <div className="flex justify-end pt-2">
        <Button
          onClick={() => router.push("/settings/reassign/edit")}
        >
          수정
        </Button>
      </div>

    </div>
  )
}
