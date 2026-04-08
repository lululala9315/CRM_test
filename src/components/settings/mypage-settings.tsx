"use client"

/**
 * 역할: 마이페이지 — 개인정보 확인 및 수정
 * 주요 기능: 기본 정보, 보안 설정, 직책 및 소속 조회/수정
 */

import { Button } from "@/components/ui/button"
import { Trash2, ChevronRight } from "lucide-react"

// --- 공통: 섹션 헤더 ---
function SectionHeader({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <span className="w-1.5 h-1.5 rounded-full bg-foreground/60 shrink-0" />
      <h2 className="text-[15px] font-semibold text-foreground">{title}</h2>
    </div>
  )
}

// --- 공통: 테이블 래퍼 ---
function InfoTable({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-card rounded-lg border border-border/40 overflow-hidden">
      {children}
    </div>
  )
}

// --- 공통: 테이블 행 ---
function InfoRow({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="flex items-center border-b border-border/30 last:border-b-0">
      {/* 라벨 */}
      <div className="w-[148px] shrink-0 self-stretch flex items-center px-5 py-4 bg-muted/30 border-r border-border/30">
        <span className="text-[13px] font-semibold text-foreground/60">{label}</span>
      </div>
      {/* 값 */}
      <div className="flex-1 flex items-center gap-3 px-5 py-4 min-h-[56px]">
        {children}
      </div>
    </div>
  )
}

// --- 메인 ---
export function MypageSettings() {
  return (
    <div className="flex flex-col gap-8">

      {/* ── 기본 정보 ── */}
      <div>
        <SectionHeader title="기본 정보" />
        <InfoTable>
          <InfoRow label="아이디">
            <span className="text-[14px] text-foreground">kris</span>
          </InfoRow>

          <InfoRow label="이름">
            <span className="text-[14px] text-foreground">이민혁</span>
            <Button variant="outline" size="sm" className="rounded-md border-border/60 shadow-none text-[13px]">
              실명수정
            </Button>
          </InfoRow>

          <InfoRow label="휴대폰 번호 (메인)">
            <span className="text-[14px] text-foreground tabular-nums">010-4659-1516</span>
            <Button variant="outline" size="sm" className="rounded-md border-border/60 shadow-none text-[13px]">
              변경하기
            </Button>
          </InfoRow>

          <InfoRow label="휴대폰 번호 (보조)">
            <span className="text-[14px] text-foreground tabular-nums">010-4659-1516</span>
            <Button variant="outline" size="sm" className="rounded-md border-border/60 shadow-none text-[13px]">
              변경하기
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-md text-muted-foreground/50 hover:text-destructive hover:bg-destructive/5">
              <Trash2 className="h-4 w-4" />
            </Button>
          </InfoRow>
        </InfoTable>
      </div>

      {/* ── 보안 설정 ── */}
      <div>
        <SectionHeader title="보안 설정" />
        <InfoTable>
          <InfoRow label="비밀번호">
            <Button size="sm" className="rounded-md bg-primary text-primary-foreground hover:bg-primary/90 shadow-none text-[13px] shrink-0">
              재설정하기
            </Button>
            <span className="text-[13px] text-muted-foreground leading-relaxed">
              비밀번호 재설정 완료 후, 개인정보 보호를 위해 다시 로그인이 필요합니다.
            </span>
          </InfoRow>

          <InfoRow label="OTP 인증">
            <Button size="sm" className="rounded-md bg-primary text-primary-foreground hover:bg-primary/90 shadow-none text-[13px] shrink-0">
              재설정하기
            </Button>
            <span className="text-[13px] text-muted-foreground leading-relaxed">
              OTP 재설정 완료 후, 개인정보 보호를 위해 다시 로그인이 필요합니다.
            </span>
          </InfoRow>
        </InfoTable>
      </div>

      {/* ── 직책 및 소속 ── */}
      <div>
        <SectionHeader title="직책 및 소속" />
        <InfoTable>
          <InfoRow label="직책/직급">
            <span className="text-[14px] text-foreground">최고관리자</span>
          </InfoRow>

          <InfoRow label="업무 권한">
            <span className="text-[14px] text-foreground">본사 운영 업무</span>
          </InfoRow>

          <InfoRow label="소속">
            <div className="flex items-center gap-1.5 flex-wrap">
              {["본부", "사업단 1", "지점 1", "팀 1"].map((node, i, arr) => (
                <div key={node} className="flex items-center gap-1.5">
                  <span className="text-[14px] text-foreground">{node}</span>
                  {i < arr.length - 1 && (
                    <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/40 shrink-0" />
                  )}
                </div>
              ))}
            </div>
          </InfoRow>
        </InfoTable>
      </div>

    </div>
  )
}
