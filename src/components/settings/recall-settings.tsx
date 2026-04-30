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
    <div className="flex flex-col gap-s16">
      <div className="bg-canvas-primary rounded-lg border border-subtle overflow-hidden">

        {/* 카드 헤더 — 안내 + info 노트 */}
        <div className="px-s24 pt-s20 pb-s20 border-b border-divider-subtle">
          <p className="text-body3-bold text-content-primary leading-relaxed [text-wrap:pretty]">
            설계사에게 배정한 DB를 설정한 시간 내 상담을 시작하지 않으면
            자동으로 DB를 미배정으로 회수할 수 있어요.
          </p>
          <div className="mt-s12 flex items-start gap-s8 bg-blue-tint-soft border border-info rounded-md px-s12 py-s10">
            <Info className="h-4 w-4 text-blue-tint mt-px shrink-0" />
            <p className="text-body4-medium text-blue-tint leading-relaxed">
              변경한 설정 값은 <span className="font-semibold">익일 00:00시</span> 부터 적용됩니다.
            </p>
          </div>
        </div>

        {/* 옵션 */}
        <RadioGroup
          value={selected}
          onValueChange={(v) => setSelected(v as RecallMode)}
          className="gap-0"
        >
          <RadioOption value="disabled" label="사용안함" />
          <div className="mx-s24 h-px bg-divider-subtle" />
          <RadioOption value="enabled" label="사용함">
            <div
              className={cn(
                "mt-s4 flex items-center gap-s8 transition-opacity",
                selected === "enabled" ? "opacity-100" : "opacity-40 pointer-events-none"
              )}
              onClick={(e) => e.stopPropagation()}
            >
              <Input
                type="number"
                value={hours}
                onChange={(e) => setHours(e.target.value)}
                min={1}
                className="w-[72px] border-subtle bg-canvas-tertiary text-center text-[13px]"
              />
              <span className="text-body4-normal text-content-assistive">
                시간 이내 상담 미 시도 시, 미배정으로 자동 회수됩니다.
              </span>
            </div>
          </RadioOption>
        </RadioGroup>

      </div>

      {/* 하단 액션 — 카드 외부 자연 흐름 */}
      <div className="flex justify-end">
        <Button>확인</Button>
      </div>
    </div>
  )
}
