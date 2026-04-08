"use client"

/**
 * 역할: 자동 회수 설정 — 배정 후 미상담 시 자동 회수 시간 설정
 * 주요 기능: 사용안함/사용함 라디오, 사용함 선택 시 시간 입력
 */

import { useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Info } from "lucide-react"

type RecallMode = "disabled" | "enabled"

export function RecallSettings() {
  const [selected, setSelected] = useState<RecallMode>("enabled")
  const [hours, setHours] = useState("30")

  return (
    <div className="flex flex-col gap-3">
      <div className="bg-card rounded-lg border border-border/40 overflow-hidden">

        {/* 안내 */}
        <div className="px-6 pt-6 pb-6">
          <p className="text-[14px] font-semibold text-foreground leading-relaxed">
            설계사에게 배정한 DB를 설정한 시간 내 상담을 시작하지 않으면
            자동으로 DB를 미배정으로 회수할 수 있어요.
          </p>
          <div className="mt-4 flex items-start gap-2.5 bg-primary/5 border border-primary/10 rounded-md px-4 py-3">
            <Info className="h-4 w-4 text-primary/70 mt-0.5 shrink-0" />
            <p className="text-[13px] text-primary/80 leading-relaxed font-medium">
              변경한 설정 값은 <span className="font-semibold">익일 00:00시</span> 부터 적용됩니다.
            </p>
          </div>
        </div>
        <div className="mx-6 h-px bg-border/30" />

        {/* 사용안함 */}
        <button
          onClick={() => setSelected("disabled")}
          className={cn(
            "w-full flex items-start gap-4 px-6 py-4 text-left transition-colors",
            selected === "disabled" ? "bg-primary/[0.06]" : "hover:bg-muted/30"
          )}
        >
          <div className={cn(
            "mt-0.5 w-[18px] h-[18px] rounded-full border-2 flex items-center justify-center shrink-0 transition-colors",
            selected === "disabled" ? "border-primary" : "border-border/50"
          )}>
            {selected === "disabled" && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
          </div>
          <div className="flex flex-col gap-1">
            <span className={cn(
              "text-[15px] font-semibold transition-colors",
              selected === "disabled" ? "text-foreground" : "text-foreground/50"
            )}>
              사용안함
            </span>
          </div>
        </button>

        <div className="mx-6 h-px bg-border/20" />

        {/* 사용함 */}
        <button
          onClick={() => setSelected("enabled")}
          className={cn(
            "w-full flex items-start gap-4 px-6 py-4 text-left transition-colors",
            selected === "enabled" ? "bg-primary/[0.06]" : "hover:bg-muted/30"
          )}
        >
          <div className={cn(
            "mt-0.5 w-[18px] h-[18px] rounded-full border-2 flex items-center justify-center shrink-0 transition-colors",
            selected === "enabled" ? "border-primary" : "border-border/50"
          )}>
            {selected === "enabled" && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
          </div>
          <div className="flex flex-col gap-2">
            <span className={cn(
              "text-[15px] font-semibold transition-colors",
              selected === "enabled" ? "text-foreground" : "text-foreground/50"
            )}>
              사용함
            </span>
            {/* 시간 입력 — 항상 노출, 미선택 시 흐리게 */}
            <div
              className={cn(
                "flex items-center gap-2 transition-opacity",
                selected === "enabled" ? "opacity-100" : "opacity-30 pointer-events-none"
              )}
              onClick={e => e.stopPropagation()}
            >
              <Input
                type="number"
                value={hours}
                onChange={e => setHours(e.target.value)}
                min={1}
                className="w-[72px] h-8 rounded-md border-border/60 bg-background shadow-none text-center !text-[13px] md:!text-[13px]"
              />
              <span className="text-[13px] text-muted-foreground/70">
                시간 이내 상담 미 시도 시, 미배정으로 자동 회수됩니다.
              </span>
            </div>
          </div>
        </button>

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
