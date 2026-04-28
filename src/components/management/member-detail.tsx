"use client"

/**
 * 역할: 운영/관리자·설계사 상세 페이지 공통 컴포넌트 — 기본정보·직책·상태 섹션
 * 주요 기능: 정의형 테이블 레이아웃, 대기 상태 승인/거절 버튼, 조직 경로 표시
 */

import { useState } from "react"
import { ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

// --- 타입 ---
type ApprovalStatus = "pending" | "approved" | "rejected"
type ActivityStatus = "정상" | "대기" | "일시제한"

export type MemberDetailData = {
  userId: string
  name: string
  phone: string
  subPhone: string | null
  position: string
  role: string
  org: string[]
  approvalStatus: ApprovalStatus
  approvalDate: string | null
  activityStatus: ActivityStatus
  joinedAt: string
  lastLoginAt: string | null
}

// --- 목업 — 대기 케이스 ---
const MOCK_ADMIN: MemberDetailData = {
  userId: "kris",
  name: "이민혁",
  phone: "010-4659-1516",
  subPhone: null,
  position: "사업단장",
  role: "운영/관리자",
  org: ["본부", "A 사업단"],
  approvalStatus: "pending",
  approvalDate: null,
  activityStatus: "대기",
  joinedAt: "2026.01.01",
  lastLoginAt: null,
}

const MOCK_PLANNER: MemberDetailData = {
  userId: "planner01",
  name: "이민혁",
  phone: "010-4659-1516",
  subPhone: null,
  position: "플래너",
  role: "설계사",
  org: ["본부", "A 사업단", "1지점"],
  approvalStatus: "pending",
  approvalDate: null,
  activityStatus: "대기",
  joinedAt: "2026.01.01",
  lastLoginAt: null,
}

// --- 활동상태 색상 ---
const ACTIVITY_COLOR: Record<ActivityStatus, string> = {
  "정상":     "text-content-secondary",
  "대기":     "text-primary",
  "일시제한": "text-content-assistive",
}

// --- 빈 값 대시 ---
function NullDash() {
  return <span className="text-content-disabled">-</span>
}

// --- 정의형 테이블 행 ---
function DetailRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex min-h-[52px] border-b border-line-subtle last:border-0">
      {/* 제목열 (LabelCell) — 회색 배경, 고정 너비 */}
      <div className="w-[180px] shrink-0 flex items-center justify-center bg-fill-subtle px-4 py-3 border-r border-line-subtle">
        <span className="text-[13px] font-medium text-content-assistive text-center leading-snug">
          {label}
        </span>
      </div>
      {/* 값열 (ValueCell) — 흰색 배경 */}
      <div className="flex-1 flex items-center px-5 py-3 bg-white">
        {children}
      </div>
    </div>
  )
}

// --- 섹션 헤더 ---
function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-[14px] font-semibold text-content-primary mb-3 flex items-center gap-1.5">
      <span className="text-primary text-[16px] leading-none">•</span>
      {children}
    </h2>
  )
}

// --- 승인상태 셀 ---
function ApprovalStatusCell({
  status,
  date,
}: {
  status: ApprovalStatus
  date: string | null
}) {
  const [localStatus, setLocalStatus] = useState(status)
  // 버튼 클릭 시 처리 일자 기록 — 초기값은 기존 date, 없으면 null
  const [actionDate, setActionDate] = useState<string | null>(date)

  const handleApprove = () => {
    setActionDate("2026.02.01")   // 실제 구현 시 서버 응답 날짜로 교체
    setLocalStatus("approved")
  }

  const handleReject = () => {
    setActionDate("2026.02.01")
    setLocalStatus("rejected")
  }

  // actionDate가 있으면 처리 완료 — 날짜 표시
  if (actionDate !== null) {
    return (
      <span className="text-[13px] text-content-secondary num-cell">
        {actionDate}
      </span>
    )
  }

  // pending 또는 미처리 — 승인하기 / 승인거절 버튼
  return (
    <div className="flex items-center gap-2">
      <span className="text-[13px] font-medium text-primary mr-1">대기</span>
      <Button
        size="sm"
        className="bg-foreground text-inverse-primary hover:bg-foreground/85 shadow-none"
        onClick={handleApprove}
      >
        승인하기
      </Button>
      <Button
        size="sm"
        variant="destructive"
        className="shadow-none"
        onClick={handleReject}
      >
        승인거절
      </Button>
    </div>
  )
}

// --- 메인 컴포넌트 ---
export function MemberDetail({ variant }: { variant: "admin" | "planner" }) {
  const data = variant === "admin" ? MOCK_ADMIN : MOCK_PLANNER

  return (
    <div className="flex flex-col gap-8 max-w-[860px]">

      {/* 기본 정보 */}
      <section>
        <SectionTitle>기본 정보</SectionTitle>
        <div className="border border-line-subtle rounded-lg overflow-hidden">
          <DetailRow label="아이디">
            <span className="text-[13px] text-content-secondary">{data.userId}</span>
          </DetailRow>
          <DetailRow label="이름">
            <span className="text-[13px] text-content-secondary">{data.name}</span>
          </DetailRow>
          <DetailRow label="휴대폰 번호">
            <span className="text-[13px] text-content-secondary num-cell">{data.phone}</span>
          </DetailRow>
          <DetailRow label="보조 휴대폰 번호">
            <span className="text-[13px] text-content-secondary num-cell">
              {data.subPhone ?? <NullDash />}
            </span>
          </DetailRow>
        </div>
      </section>

      {/* 직책 및 소속 */}
      <section>
        <SectionTitle>직책 및 소속</SectionTitle>
        <div className="border border-line-subtle rounded-lg overflow-hidden">
          <DetailRow label="직책">
            <span className="text-[13px] text-content-secondary">{data.position}</span>
          </DetailRow>
          <DetailRow label="업무">
            <span className="text-[13px] text-content-secondary">{data.role}</span>
          </DetailRow>
          <DetailRow label="소속">
            <span className="text-[13px] text-content-secondary flex items-center gap-1">
              {data.org.map((item, i) => (
                <span key={i} className="flex items-center gap-1">
                  {i > 0 && (
                    <ChevronRight className="h-3.5 w-3.5 text-content-assistive shrink-0" />
                  )}
                  {item}
                </span>
              ))}
            </span>
          </DetailRow>
        </div>
      </section>

      {/* 상태 정보 */}
      <section>
        <SectionTitle>상태 정보</SectionTitle>
        <div className="border border-line-subtle rounded-lg overflow-hidden">
          <DetailRow label="승인상태">
            <ApprovalStatusCell
              status={data.approvalStatus}
              date={data.approvalDate}
            />
          </DetailRow>
          <DetailRow label="활동상태">
            <span className={`text-[13px] font-medium ${ACTIVITY_COLOR[data.activityStatus]}`}>
              {data.activityStatus}
            </span>
          </DetailRow>
          <DetailRow label="가입일">
            <span className="text-[13px] text-content-secondary num-cell">{data.joinedAt}</span>
          </DetailRow>
          <DetailRow label="최근 접속일">
            <span className="text-[13px] text-content-secondary num-cell">
              {data.lastLoginAt ?? <NullDash />}
            </span>
          </DetailRow>
        </div>
      </section>

    </div>
  )
}
