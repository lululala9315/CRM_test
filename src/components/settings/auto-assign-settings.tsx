"use client"

/**
 * 역할: 자동 배정 설정 — 자동 배정 사용 여부 선택
 * 주요 기능: 사용함/사용안함 라디오 선택, 확인 저장
 */

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioOption } from "@/components/ui/radio-group"
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
    <div className="flex flex-col gap-s16">
      <div className="bg-canvas-primary rounded-lg border border-subtle overflow-hidden">

        {/* 카드 헤더 — 안내 + info 노트 */}
        <div className="px-s24 pt-s20 pb-s20 border-b border-divider-subtle">
          <p className="text-body3-bold text-content-primary leading-relaxed [text-wrap:pretty]">
            사용함을 선택하시면, 보닥에서 제공하는 DB를 설계사에게 까지 자동 배정해 드립니다.
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
          onValueChange={(v) => setSelected(v as AutoAssignMode)}
          className="gap-0"
        >
          {OPTIONS.map((option, index) => (
            <div key={option.value}>
              {index !== 0 && <div className="mx-s24 h-px bg-divider-subtle" />}
              <RadioOption
                value={option.value}
                label={option.label}
                description={option.description}
              />
            </div>
          ))}
        </RadioGroup>
      </div>

      {/* 하단 액션 — 카드 외부 자연 흐름 */}
      <div className="flex justify-end">
        <Button>확인</Button>
      </div>
    </div>
  )
}
