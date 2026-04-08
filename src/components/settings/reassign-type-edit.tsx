"use client"

/**
 * 역할: 재배정 타입 수정 페이지 — 타입 추가/수정/삭제
 * 주요 기능: 타입 이름·설명 Input, 사용 여부 라디오, 행 추가/삭제, 취소/확인
 */

import { useState } from "react"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Trash2, Plus } from "lucide-react"

type ReassignType = {
  id: string
  name: string
  description: string
  enabled: boolean
}

const INITIAL_TYPES: ReassignType[] = [
  { id: "return",   name: "반환",   description: "입력한 설명이 노출됩니다.", enabled: true  },
  { id: "free",     name: "무상",   description: "입력한 설명이 노출됩니다.", enabled: true  },
  { id: "transfer", name: "양도",   description: "입력한 설명이 노출됩니다.", enabled: true  },
  { id: "penalty",  name: "패널티", description: "입력한 설명이 노출됩니다.", enabled: false },
]

export function ReassignTypeEdit() {
  const router = useRouter()
  const [types, setTypes] = useState(INITIAL_TYPES)

  const updateType = (id: string, field: keyof ReassignType, value: string | boolean) => {
    setTypes(prev => prev.map(t => t.id === id ? { ...t, [field]: value } : t))
  }

  const deleteType = (id: string) => {
    setTypes(prev => prev.filter(t => t.id !== id))
  }

  const addType = () => {
    setTypes(prev => [...prev, {
      id: `type-${Date.now()}`,
      name: "",
      description: "",
      enabled: true,
    }])
  }

  return (
    <div className="flex flex-col gap-3">

      {/* 기본 타입 카드 (읽기 전용) */}
      <div className="bg-card rounded-lg border border-border/40">
        <div className="flex items-center px-6 py-4">
          <span className="text-[13px] font-semibold text-foreground/70 w-[160px] shrink-0">타입 이름</span>
          <span className="text-[13px] text-muted-foreground/50">기본</span>
        </div>
      </div>

      {/* 편집 가능한 타입 카드 */}
      <div className="bg-card rounded-lg border border-border/40 overflow-hidden">

        {/* 컬럼 헤더 */}
        <div className="flex items-center gap-4 px-6 py-3">
          <span className="text-[12px] font-semibold text-muted-foreground/70 w-[160px] shrink-0">타입 이름</span>
          <span className="text-[12px] font-semibold text-muted-foreground/70 flex-1">설명</span>
          <span className="text-[12px] font-semibold text-muted-foreground/70 w-[160px] shrink-0">사용 여부</span>
          <span className="w-8 shrink-0" />
        </div>
        <div className="mx-6 h-px bg-border/40" />

        {/* 타입 행 */}
        {types.map((type, index) => (
          <div key={type.id}>
            {index !== 0 && <div className="mx-6 h-px bg-border/30" />}
            <div className="flex items-center gap-4 px-6 py-3.5">

              {/* 타입 이름 Input */}
              <div className="w-[160px] shrink-0">
                <Input
                  value={type.name}
                  onChange={e => updateType(type.id, "name", e.target.value)}
                  placeholder="타입 이름"
                  className="h-8 rounded-md border-border/60 bg-background shadow-none !text-[13px] md:!text-[13px]"
                />
              </div>

              {/* 설명 Input */}
              <div className="flex-1 min-w-0">
                <Input
                  value={type.description}
                  onChange={e => updateType(type.id, "description", e.target.value)}
                  placeholder="설명을 입력하세요"
                  className="h-8 rounded-md border-border/60 bg-background shadow-none !text-[13px] md:!text-[13px]"
                />
              </div>

              {/* 사용 여부 라디오 */}
              <div className="flex items-center gap-5 w-[160px] shrink-0">
                <button
                  onClick={() => updateType(type.id, "enabled", true)}
                  className="flex items-center gap-1.5 cursor-pointer"
                >
                  <div className={cn(
                    "w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors",
                    type.enabled ? "border-primary" : "border-border/60"
                  )}>
                    {type.enabled && <div className="w-2 h-2 rounded-full bg-primary" />}
                  </div>
                  <span className="text-[13px] text-foreground/80">사용함</span>
                </button>
                <button
                  onClick={() => updateType(type.id, "enabled", false)}
                  className="flex items-center gap-1.5 cursor-pointer"
                >
                  <div className={cn(
                    "w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors",
                    !type.enabled ? "border-primary" : "border-border/60"
                  )}>
                    {!type.enabled && <div className="w-2 h-2 rounded-full bg-primary" />}
                  </div>
                  <span className="text-[13px] text-foreground/80">사용안함</span>
                </button>
              </div>

              {/* 삭제 버튼 */}
              <button
                onClick={() => deleteType(type.id)}
                className="w-8 flex justify-center p-1.5 rounded-md text-muted-foreground/40 hover:text-destructive hover:bg-destructive/10 transition-colors shrink-0"
              >
                <Trash2 className="h-4 w-4" />
              </button>

            </div>
          </div>
        ))}
      </div>

      {/* 타입 추가 버튼 */}
      <Button
        variant="outline"
        onClick={addType}
        className="w-full rounded-md border-border/60 text-[13px] font-medium text-muted-foreground hover:text-foreground shadow-none gap-1.5"
      >
        <Plus className="h-4 w-4" />
        타입 추가
      </Button>

      {/* 하단 취소/확인 */}
      <div className="flex flex-col gap-4 mt-4">
        <div className="h-px bg-border/40" />
        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            onClick={() => router.push("/settings/reassign")}
            className="px-8 rounded-md border-border/60 shadow-none"
          >
            취소
          </Button>
          <Button
            onClick={() => router.push("/settings/reassign")}
            className="px-8 rounded-md bg-foreground text-background hover:bg-foreground/90 shadow-none"
          >
            확인
          </Button>
        </div>
      </div>

    </div>
  )
}
