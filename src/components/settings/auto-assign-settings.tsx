"use client"

/**
 * 역할: 자동 배정 설정 — 자동 배정 사용 여부 선택
 * 주요 기능: 사용함/사용안함 라디오 선택, 확인 저장
 */

import { useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Info } from "lucide-react"

type AutoAssignMode = "disabled" | "enabled"

const OPTIONS: { value: AutoAssignMode; label: string; description: string }[] = [
  {
    value: "disabled",
    label: "사용안함",
    description: '해당 조직의 "DB 배정 관리 > 미배정 DB" 메뉴로 이관되며, 직접 설계사에게 배정하셔야 해요.',
  },
  {
    value: "enabled",
    label: "사용함",
    description: "해당 조직의 소속된 설계사에게 1/N으로 자동 배정되며, 퇴사한 설계사가 있다면 해촉 처리해 주세요.",
  },
]

export function AutoAssignSettings() {
  const [selected, setSelected] = useState<AutoAssignMode>("disabled")

  return (
    <div className="flex flex-col gap-3">
      <div className="bg-card rounded-lg border border-border/40 overflow-hidden">

        {/* 안내 */}
        <div className="px-6 pt-6 pb-6">
          <p className="text-[14px] font-semibold text-foreground leading-relaxed">
            사용함을 선택하시면, 보닥에서 제공하는 DB를 설계사에게 까지 자동 배정해 드립니다.
          </p>
          <div className="mt-4 flex items-start gap-2.5 bg-primary/5 border border-primary/10 rounded-md px-4 py-3">
            <Info className="h-4 w-4 text-primary/70 mt-0.5 shrink-0" />
            <p className="text-[13px] text-primary/80 leading-relaxed font-medium">
              변경한 설정 값은 <span className="font-semibold">익일 00:00시</span> 부터 적용됩니다.
            </p>
          </div>
        </div>
        <div className="mx-6 h-px bg-border/30" />

        {/* 옵션 */}
        {OPTIONS.map((option, index) => {
          const isSelected = selected === option.value
          return (
            <div key={option.value}>
              {index !== 0 && <div className="mx-6 h-px bg-border/20" />}
              <button
                onClick={() => setSelected(option.value)}
                className={cn(
                  "w-full flex items-start gap-4 px-6 py-4 text-left transition-colors",
                  isSelected ? "bg-primary/[0.06]" : "hover:bg-muted/30"
                )}
              >
                <div className={cn(
                  "mt-0.5 w-[18px] h-[18px] rounded-full border-2 flex items-center justify-center shrink-0 transition-colors",
                  isSelected ? "border-primary" : "border-border/50"
                )}>
                  {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
                </div>
                <div className="flex flex-col gap-1">
                  <span className={cn(
                    "text-[15px] font-semibold leading-snug transition-colors",
                    isSelected ? "text-foreground" : "text-foreground/50"
                  )}>
                    {option.label}
                  </span>
                  <span className={cn(
                    "text-[13px] leading-relaxed transition-colors",
                    isSelected ? "text-muted-foreground/80" : "text-muted-foreground/40"
                  )}>
                    {option.description}
                  </span>
                </div>
              </button>
            </div>
          )
        })}
      </div>

      {/* 하단 */}
      <div className="flex flex-col gap-4">
        <div className="h-px bg-border/40" />
        <div className="flex justify-end">
          <Button className="px-8 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 shadow-none">
            확인
          </Button>
        </div>
      </div>
    </div>
  )
}
