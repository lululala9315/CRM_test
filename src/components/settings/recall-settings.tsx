"use client"

/**
 * 역할: 자동 회수 설정 — 배정 후 미상담 시 자동 회수 시간 설정
 * 주요 기능: 사용안함/사용함 라디오, 사용함 선택 시 시간 입력
 */

import { useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioOption } from "@/components/ui/radio-group"
import { Info } from "lucide-react"

type RecallMode = "disabled" | "enabled"

export function RecallSettings() {
  const [selected, setSelected] = useState<RecallMode>("enabled")
  const [hours, setHours] = useState("30")

  return (
    <div className="flex flex-col gap-3">
      <div className="bg-canvas-primary rounded-lg border border-line-subtle overflow-hidden">

        {/* 안내 */}
        <div className="px-6 pt-6 pb-6">
          <p className="text-[14px] font-semibold text-content-primary leading-relaxed">
            설계사에게 배정한 DB를 설정한 시간 내 상담을 시작하지 않으면
            자동으로 DB를 미배정으로 회수할 수 있어요.
          </p>
          <div className="mt-4 flex items-start gap-2.5 bg-blue-tint border border-info rounded-md px-4 py-3">
            <Info className="h-4 w-4 text-blue-tint mt-0.5 shrink-0" />
            <p className="text-[13px] text-blue-tint leading-relaxed font-medium">
              변경한 설정 값은 <span className="font-semibold">익일 00:00시</span> 부터 적용됩니다.
            </p>
          </div>
        </div>
        <div className="mx-6 h-px bg-divider-subtle" />

        {/* 옵션 */}
        <RadioGroup
          value={selected}
          onValueChange={(v) => setSelected(v as RecallMode)}
          className="gap-0"
        >
          <RadioOption value="disabled" label="사용안함" />
          <div className="mx-6 h-px bg-divider-subtle" />
          <RadioOption value="enabled" label="사용함">
            {/* 시간 입력 — 항상 노출, 미선택 시 흐리게.
                stopPropagation으로 input 영역 클릭이 라디오 재선택을 일으키지 않도록 차단. */}
            <div
              className={cn(
                "mt-1 flex items-center gap-2 transition-opacity",
                selected === "enabled" ? "opacity-100" : "opacity-30 pointer-events-none"
              )}
              onClick={(e) => e.stopPropagation()}
            >
              <Input
                type="number"
                value={hours}
                onChange={(e) => setHours(e.target.value)}
                min={1}
                className="w-[72px] border-line-subtle bg-canvas-tertiary text-center text-[13px]"
              />
              <span className="text-[13px] text-content-assistive">
                시간 이내 상담 미 시도 시, 미배정으로 자동 회수됩니다.
              </span>
            </div>
          </RadioOption>
        </RadioGroup>

      </div>

      {/* 하단 */}
      <div className="flex flex-col gap-4">
        <div className="h-px bg-divider-subtle" />
        <div className="flex justify-end">
          <Button>
            확인
          </Button>
        </div>
      </div>
    </div>
  )
}
