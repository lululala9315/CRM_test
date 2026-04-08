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
      <div className="bg-card rounded-lg border border-border/40">
        <div className="flex items-center px-6 py-4">
          <span className="text-[13px] font-semibold text-foreground/70 w-[160px] shrink-0">타입 이름</span>
          <span className="text-[13px] text-foreground/80">기본</span>
        </div>
      </div>

      {/* 사용자 정의 타입 카드 */}
      <div className="bg-card rounded-lg border border-border/40 overflow-hidden">

        {/* 컬럼 헤더 */}
        <div className="flex items-center px-6 py-3">
          <span className="text-[12px] font-semibold text-muted-foreground/70 w-[160px] shrink-0">타입 이름</span>
          <span className="text-[12px] font-semibold text-muted-foreground/70 flex-1">설명</span>
          <span className="text-[12px] font-semibold text-muted-foreground/70 w-[72px] text-right shrink-0">사용 여부</span>
        </div>
        <div className="mx-6 h-px bg-border/40" />

        {/* 타입 행 */}
        {EDITABLE_TYPES.map((type, index) => (
          <div key={type.id}>
            {index !== 0 && <div className="mx-6 h-px bg-border/30" />}
            <div className="flex items-center px-6 py-4">
              <span className="text-[13px] font-medium text-foreground/80 w-[160px] shrink-0">{type.name}</span>
              <span className="text-[13px] text-foreground/60 flex-1 min-w-0 truncate">{type.description}</span>
              <span className={
                type.enabled
                  ? "text-[13px] font-medium text-foreground/80 w-[72px] text-right shrink-0"
                  : "text-[13px] font-medium text-muted-foreground/50 w-[72px] text-right shrink-0"
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
          className="px-8 rounded-md bg-foreground text-background hover:bg-foreground/90 shadow-none"
        >
          수정
        </Button>
      </div>

    </div>
  )
}
