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
      <span className="w-1.5 h-1.5 rounded-full bg-canvas-quaternary shrink-0" />
      <h2 className="text-[15px] font-semibold text-content-primary">{title}</h2>
    </div>
  )
}

// --- 공통: 테이블 래퍼 ---
function InfoTable({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-canvas-primary rounded-lg border border-line-subtle overflow-hidden">
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
    <div className="flex items-center border-b border-divider-subtle last:border-b-0">
      {/* 라벨 */}
      <div className="w-[148px] shrink-0 self-stretch flex items-center px-5 py-4 bg-fill-subtle border-r border-divider-subtle">
        <span className="text-[13px] font-semibold text-content-quaternary">{label}</span>
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
            <span className="text-[14px] text-content-primary">kris</span>
          </InfoRow>

          <InfoRow label="이름">
            <span className="text-[14px] text-content-primary">이민혁</span>
            <Button variant="outline" size="sm" className="border-line-subtle text-[13px]">
              실명수정
            </Button>
          </InfoRow>

          <InfoRow label="휴대폰 번호 (메인)">
            <span className="text-[14px] text-content-primary tabular-nums">010-4659-1516</span>
            <Button variant="outline" size="sm" className="border-line-subtle text-[13px]">
              변경
            </Button>
          </InfoRow>

          <InfoRow label="휴대폰 번호 (보조)">
            <span className="text-[14px] text-content-primary tabular-nums">010-4659-1516</span>
            <Button variant="outline" size="sm" className="border-line-subtle text-[13px]">
              변경
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-md text-content-disabled hover:text-destructive hover:bg-red-tint">
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
            <Button size="sm" className="text-[13px] shrink-0">
              재설정
            </Button>
            <span className="text-[13px] text-content-assistive leading-relaxed">
              비밀번호 재설정 완료 후, 개인정보 보호를 위해 다시 로그인이 필요합니다.
            </span>
          </InfoRow>

          <InfoRow label="OTP 인증">
            <Button size="sm" className="text-[13px] shrink-0">
              재설정
            </Button>
            <span className="text-[13px] text-content-assistive leading-relaxed">
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
            <span className="text-[14px] text-content-primary">최고관리자</span>
          </InfoRow>

          <InfoRow label="업무 권한">
            <span className="text-[14px] text-content-primary">본사 운영 업무</span>
          </InfoRow>

          <InfoRow label="소속">
            <div className="flex items-center gap-1.5 flex-wrap">
              {["본부", "사업단 1", "지점 1", "팀 1"].map((node, i, arr) => (
                <div key={node} className="flex items-center gap-1.5">
                  <span className="text-[14px] text-content-primary">{node}</span>
                  {i < arr.length - 1 && (
                    <ChevronRight className="h-3.5 w-3.5 text-content-disabled shrink-0" />
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
