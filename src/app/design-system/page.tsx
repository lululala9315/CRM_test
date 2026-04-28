"use client"

/**
 * 역할: 디자인 시스템 가이드 — 개발팀 공유용 라이브 스타일 가이드
 * 주요 기능: 색상(Atomic+Semantic) / 타이포 / 라운드 / 버튼 / 배지 / 테이블 / 레이아웃
 * 의존성: globals.css 토큰, shadcn 컴포넌트, SearchFilter
 */

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { SearchFilter } from "@/components/dashboard/search-filter"
import { PageNumbers, PageSizeSelect } from "@/components/ui/pagination"
import {
  Search, Copy, Check,
} from "lucide-react"

// ── 타입 ──────────────────────────────────────────────────────────────────
type Token = {
  name: string
  cls?: string                 // Tailwind 클래스 오버라이드 (없으면 bg-[var(--name)])
  hex: string                  // 설명 / hex / 참조 표기
  kind?: "bg" | "text" | "border"
  cssVar?: string              // swatch 렌더링에 쓸 CSS 변수 (name과 다를 때)
  copyText?: string            // 클릭 시 복사할 텍스트 (없으면 var(--name))
}
type TokenGroup = { group: string; tokens: Token[] }

// ── Layer 1: Atomic Palette (직접 참조 금지 — Semantic 통해 사용) ─────────

const ATOMIC_COOL_NEUTRAL: TokenGroup = {
  group: "Cool Neutral",
  tokens: [
    { name: "cool-neutral-50",  hex: "→ bg-canvas-secondary" },
    { name: "cool-neutral-100", hex: "→ bg-canvas-tertiary · fill-subtle" },
    { name: "cool-neutral-150", hex: "→ bg-canvas-quaternary · fill-normal" },
    { name: "cool-neutral-200", hex: "→ border-line-subtle · fill-strong" },
    { name: "cool-neutral-250", hex: "→ fill-hover" },
    { name: "cool-neutral-300", hex: "→ border-primary" },
    { name: "cool-neutral-400", hex: "→ text-content-disabled" },
    { name: "cool-neutral-600", hex: "→ text-content-assistive" },
    { name: "cool-neutral-700", hex: "→ text-content-quaternary" },
    { name: "cool-neutral-800", hex: "→ text-content-tertiary" },
    { name: "cool-neutral-900", hex: "→ text-content-secondary" },
    { name: "cool-neutral-990", hex: "→ text-content-primary · #191F28" },
  ],
}

const ATOMIC_BLUE: TokenGroup = {
  group: "Blue",
  tokens: [
    { name: "blue-50",  hex: "→ bg-blue-tint" },
    { name: "blue-500", hex: "→ bg-primary · text-primary / 브랜드 / #3182F6" },
    { name: "blue-700", hex: "→ text-blue-tint" },
  ],
}

const ATOMIC_STATUS: TokenGroup = {
  group: "Red / Green / Amber / Orange",
  tokens: [
    { name: "red-50",     hex: "→ bg-red-tint" },
    { name: "red-500",    hex: "→ destructive / error" },
    { name: "red-600",    hex: "→ text-red-tint" },
    { name: "red-700",    hex: "→ (미사용 — semantic 토큰 없음)" },
    { name: "green-50",   hex: "→ bg-green-tint" },
    { name: "green-400",  hex: "→ text-success-foreground" },
    { name: "green-500",  hex: "→ success" },
    { name: "amber-50",   hex: "→ bg-amber-tint" },
    { name: "amber-500",  hex: "→ warning" },
    { name: "amber-700",  hex: "→ text-amber-tint · warning-foreground" },
    { name: "orange-50",  hex: "→ bg-orange-tint" },
    { name: "orange-390", hex: "→ warning-foreground" },
    { name: "orange-500", hex: "→ warning (일부)" },
  ],
}

// ── Layer 2: Semantic Tokens ───────────────────────────────────────────────

const BG_GROUP: TokenGroup = {
  group: "Surface — bg-canvas-*",
  tokens: [
    { name: "bg-canvas-primary",    cls: "bg-canvas-primary border border-line-subtle",    hex: "#FFFFFF · 카드/모달 배경" },
    { name: "bg-canvas-tertiary",   cls: "bg-canvas-tertiary border border-line-subtle",   hex: "= cool-neutral-100 · 페이지 배경" },
    { name: "bg-canvas-quaternary", cls: "bg-canvas-quaternary border border-line-subtle", hex: "= cool-neutral-150 · 구분·홀수행" },
  ],
}

const TEXT_GROUP: TokenGroup = {
  group: "Content — text-content-*",
  tokens: [
    { name: "text-content-primary",    kind: "text", cssVar: "text-primary",    hex: "= cool-neutral-990 · 타이틀",      copyText: "text-content-primary" },
    { name: "text-content-secondary",  kind: "text", cssVar: "text-secondary",  hex: "= cool-neutral-900 · 본문",        copyText: "text-content-secondary" },
    { name: "text-content-tertiary",   kind: "text", cssVar: "text-tertiary",   hex: "= cool-neutral-800 · 서브 텍스트", copyText: "text-content-tertiary" },
    { name: "text-content-quaternary", kind: "text", cssVar: "text-quaternary", hex: "= cool-neutral-700 · 보조 정보",   copyText: "text-content-quaternary" },
    { name: "text-content-assistive",  kind: "text", cssVar: "text-assistive",  hex: "= cool-neutral-600 · placeholder", copyText: "text-content-assistive" },
    { name: "text-content-disabled",   kind: "text", cssVar: "text-disabled",   hex: "= cool-neutral-400 · 비활성",      copyText: "text-content-disabled" },
    { name: "text-muted-foreground",   kind: "text", cssVar: "muted-foreground", hex: "shadcn 호환 — text-content-assistive와 동일값", copyText: "text-muted-foreground" },
    { name: "text-primary",            kind: "text", cssVar: "primary",          hex: "= #3182F6 · 링크·브랜드 텍스트",   copyText: "text-primary" },
    { name: "text-inverse-primary",    kind: "text", cssVar: "common-100",       hex: "흰색 · 다크 배경 위 (버튼 라벨)", copyText: "text-inverse-primary" },
  ],
}

const BORDER_GROUP: TokenGroup = {
  group: "Line — border-line-*",
  tokens: [
    { name: "border-line-subtle",  kind: "border", cssVar: "border-subtle",  hex: "= cool-neutral-200 · 카드 보더", copyText: "border-line-subtle" },
    { name: "border-border",       kind: "border", hex: "= cool-neutral-300 (shadcn 호환)", cssVar: "border", copyText: "border-border" },
    { name: "border-input",        kind: "border", hex: "= cool-neutral-300 (shadcn input)", cssVar: "input", copyText: "border-input" },
    { name: "border-primary",       kind: "border", cssVar: "primary", hex: "= #3182F6 · 선택 상태", copyText: "border-primary" },
  ],
}

const ACCENT_GROUP: TokenGroup = {
  group: "Accent — 브랜드 블루 (#3182F6)",
  tokens: [
    { name: "accent",              cls: "bg-primary",                                 hex: "bg-primary · #3182F6",          copyText: "bg-primary" },
    { name: "accent / 10%",        cls: "bg-primary/10 border border-line-subtle",         hex: "bg-primary/10 · 검색버튼·틴트",   copyText: "bg-primary/10" },
    { name: "accent / 5%",         cls: "bg-primary/5 border border-line-subtle",          hex: "bg-primary/5 · hover bg",        copyText: "bg-primary/5" },
    { name: "accent-foreground",   cls: "bg-accent-foreground border border-line-subtle", hex: "흰색 · text-inverse-primary",  copyText: "bg-accent-foreground" },
  ],
}

const FILL_GROUP: TokenGroup = {
  group: "Fill — bg-fill-*",
  tokens: [
    { name: "fill-subtle", cls: "bg-fill-subtle border border-line-subtle",  hex: "= cool-neutral-100" },
    { name: "fill-normal", cls: "bg-fill-normal border border-line-subtle",  hex: "= cool-neutral-150" },
    { name: "fill-hover",  cls: "bg-fill-hover border border-line-subtle",   hex: "= cool-neutral-250" },
    { name: "fill-filter", cls: "bg-fill-filter border border-line-subtle",  hex: "= #FFF · 필터 컨트롤" },
  ],
}

const DIVIDER_GROUP: TokenGroup = {
  group: "Divider — bg-divider-* (alpha)",
  tokens: [
    { name: "divider-subtle", cls: "bg-divider-subtle", hex: "alpha 4% · 기본 행 구분" },
    { name: "divider-normal", cls: "bg-divider-normal", hex: "alpha 8% · KPI 수직 구분선" },
  ],
}

const STATUS_GROUP: TokenGroup = {
  group: "Status — 상태색",
  tokens: [
    { name: "success",             cls: "bg-success",                             hex: "= green-500 · bg-success" },
    { name: "success-foreground",  cls: "bg-success-foreground border border-line-subtle", hex: "= green-400 · text-success-foreground" },
    { name: "warning",             cls: "bg-warning",                             hex: "= amber-500 · bg-warning" },
    { name: "warning-foreground",  cls: "bg-warning-foreground",                  hex: "= orange-390 · text-warning-foreground" },
    { name: "destructive",         cls: "bg-destructive",                         hex: "= red-500 · bg-destructive" },
  ],
}

const TINT_GROUP: TokenGroup = {
  group: "Tint — bg-*-tint / text-*-tint",
  tokens: [
    { name: "bg-blue-tint",    cls: "bg-blue-tint",                          hex: "= blue-50" },
    { name: "text-blue-tint",  kind: "text", cssVar: "blue-700",             hex: "= blue-700", copyText: "text-blue-tint" },
    { name: "bg-green-tint",   cls: "bg-green-tint",                         hex: "= green-50" },
    { name: "text-green-tint", kind: "text", cssVar: "green-450",            hex: "= green-450", copyText: "text-green-tint" },
    { name: "bg-red-tint",     cls: "bg-red-tint",                           hex: "= red-50" },
    { name: "text-red-tint",   kind: "text", cssVar: "red-600",              hex: "= red-600", copyText: "text-red-tint" },
    { name: "bg-orange-tint",  cls: "bg-orange-tint",                        hex: "= orange-50" },
    { name: "bg-amber-tint",   cls: "bg-amber-tint",                         hex: "= amber-50" },
    { name: "text-amber-tint", kind: "text", cssVar: "amber-700",            hex: "= amber-700", copyText: "text-amber-tint" },
    { name: "bg-neutral-tint", cls: "bg-neutral-tint border border-line-subtle", hex: "= bg-subtle" },
    { name: "text-neutral-tint", kind: "text", cssVar: "text-assistive",     hex: "= text-content-assistive", copyText: "text-neutral-tint" },
  ],
}

const CHART_GROUP: TokenGroup = {
  group: "Chart — Blue→Purple 5단계",
  tokens: [
    { name: "chart-1", cls: "bg-chart-1", hex: "oklch(0.845 0.143 165) · 주지표" },
    { name: "chart-2", cls: "bg-chart-2", hex: "oklch(0.696 0.170 162)" },
    { name: "chart-3", cls: "bg-chart-3", hex: "oklch(0.596 0.145 163)" },
    { name: "chart-4", cls: "bg-chart-4", hex: "oklch(0.508 0.118 166)" },
    { name: "chart-5", cls: "bg-chart-5", hex: "oklch(0.432 0.095 167) · 보조지표" },
  ],
}

// ── 라운드 ────────────────────────────────────────────────────────────────
const RADIUS_REFERENCE = [
  { cls: "rounded-r4",    px: 4    },
  { cls: "rounded-r6",    px: 6    },
  { cls: "rounded-r8",    px: 8    },
  { cls: "rounded-r10",   px: 10   },
  { cls: "rounded-r12",   px: 12   },
  { cls: "rounded-r16",   px: 16   },
  { cls: "rounded-r20",   px: 20   },
  { cls: "rounded-r24",   px: 24   },
  { cls: "rounded-r9999", px: 9999 },
]

const RADIUS_RULES = [
  { level: "카드 / 컨테이너",          cls: "rounded-r24",   note: "24px · 카드, 리스트" },
  { level: "모달",                     cls: "rounded-r20",   note: "20px" },
  { level: "리스트 행",                cls: "rounded-r16",   note: "16px" },
  { level: "배지 · 태그",              cls: "rounded-r12",   note: "12px" },
  { level: "버튼 · 입력 컨트롤 (h-9)", cls: "rounded-r8",    note: "8px (= rounded-lg alias)" },
  { level: "pill",                     cls: "rounded-r9999", note: "9999px (= rounded-full alias)" },
  { level: "❌ 금지",                   cls: "rounded-xl",    note: "사용 금지" },
]

// ── 스페이싱 ──────────────────────────────────────────────────────────────
const SPACING_SCALE = [
  { px: 4,  s: "s4",  usage: "아이콘-텍스트 gap" },
  { px: 8,  s: "s8",  usage: "인라인 gap" },
  { px: 12, s: "s12", usage: "badge px · 소형 컨트롤" },
  { px: 16, s: "s16", usage: "카드 간 gap · 필터↔테이블 mb" },
  { px: 20, s: "s20", usage: "카드 내 section py" },
  { px: 24, s: "s24", usage: "페이지 수평 px · 카드 내부 px" },
  { px: 32, s: "s32", usage: "섹션 간 gap" },
  { px: 40, s: "s40", usage: "페이지 타이틀 pt" },
  { px: 60, s: "—",   usage: "콘텐츠 하단 pb-15 (Tailwind 네이티브)" },
]

const SPACING_PATTERNS = [
  { label: "페이지 수평 패딩",     cls: "px-s24",        note: "24px — 모든 페이지 공통" },
  { label: "타이틀 영역",          cls: "pt-s40 pb-s24", note: "40px top, 24px bottom" },
  { label: "콘텐츠 하단",          cls: "pb-15",         note: "60px — Footer 위 여백 (Tailwind 네이티브)" },
  { label: "카드 간 간격",         cls: "gap-s16",       note: "16px — flex-col gap" },
  { label: "필터 ↔ 테이블",        cls: "mb-s16",        note: "16px — 필터 래퍼" },
  { label: "툴바 ↔ 테이블",        cls: "gap-s2",        note: "2px — sticky 블록 내부" },
  { label: "카드 내부 수평 패딩",   cls: "px-s24",        note: "24px — 카드 콘텐츠" },
  { label: "카드 내부 구분선",      cls: "mx-s24 h-px",   note: "좌우 24px 인셋 필수" },
  { label: "BusinessTree ↔ 본문",  cls: "gap-s12",       note: "12px" },
]

// ── 버튼 ──────────────────────────────────────────────────────────────────
// 6 variants — 모두 실제 사용 중
const BUTTON_VARIANTS = [
  { label: "default",     variant: "default" as const,     desc: "메인 액션 — 저장 / 재배정 / 확인" },
  { label: "secondary",   variant: "secondary" as const,   desc: "보조 액션 — 필터 검색 (서브틀 브랜드)" },
  { label: "outline",     variant: "outline" as const,     desc: "약한 강조 — 취소 / 보조 옵션" },
  { label: "ghost",       variant: "ghost" as const,       desc: "투명 — 페이지네이션 / 아이콘 트리거" },
  { label: "neutral",     variant: "neutral" as const,     desc: "중립 액션 — 작업 영역 토글" },
  { label: "destructive", variant: "destructive" as const, desc: "위험 액션 — 삭제 / 회수" },
]

// 3 sizes — user 코드에서 사용
const BUTTON_SIZES = [
  { size: "xs" as const,      h: "h-6",    usage: "테이블 인라인 (승인/거절)" },
  { size: "sm" as const,      h: "h-8",    usage: "페이지네이션 / 보조 버튼" },
  { size: "default" as const, h: "h-9",    usage: "주요 액션 / 필터 컨트롤 (가장 흔함)" },
]

// 1 size — 단독 아이콘 버튼 (icon-sm은 sheet/dialog/sidebar 내부 전용)
const ICON_SIZES = [
  { size: "icon" as const, dim: "36px" },
]

// ── shadcn 컴포넌트 현황 ──────────────────────────────────────────────────
// 출처: CLAUDE.md "(설치됨, 사용 중인 것만 26개)"
const SHADCN_USED = [
  { name: "button",       note: "전체 액션 버튼" },
  { name: "badge",        note: "상태 배지" },
  { name: "table",        note: "모든 데이터 테이블" },
  { name: "select",       note: "필터 드롭다운" },
  { name: "checkbox",     note: "테이블 멀티선택" },
  { name: "input",        note: "검색 인풋" },
  { name: "pagination",   note: "PageNumbers / PageSizeSelect" },
  { name: "sidebar",      note: "layout.tsx 사이드바" },
  { name: "radio-group",  note: "설정 3개 파일" },
  { name: "popover",      note: "날짜 선택, 멀티셀렉트" },
  { name: "tabs",         note: "대시보드 기간 탭" },
  { name: "calendar",     note: "날짜 범위 선택" },
  { name: "dialog",       note: "확인 모달" },
  { name: "command",      note: "설계사 검색 combobox" },
  { name: "collapsible",  note: "사이드바 메뉴" },
  { name: "avatar",       note: "사용자 아이콘" },
  { name: "tooltip",      note: "아이콘 설명" },
  { name: "scroll-area",  note: "커스텀 스크롤" },
  { name: "breadcrumb",   note: "sticky-breadcrumb.tsx" },
  { name: "chart",        note: "대시보드 차트" },
  { name: "sheet",        note: "sidebar.tsx 내부" },
  { name: "skeleton",     note: "sidebar.tsx 내부" },
  { name: "separator",    note: "sidebar.tsx 내부" },
  { name: "textarea",     note: "input-group.tsx 내부" },
  { name: "input-group",  note: "command.tsx 내부" },
  { name: "toggle",       note: "설치됨 (미사용)" },
]

const SHADCN_REMOVED = [
  "accordion", "alert", "alert-dialog", "aspect-ratio",
  "button-group", "card", "carousel", "combobox",
  "context-menu", "drawer", "dropdown-menu", "label",
  "navigation-menu", "resizable", "slider", "sonner",
  "switch", "toggle-group",
]

// ── 탭 그룹 ──────────────────────────────────────────────────────────────
//   Foundations: 디자인 토큰 (색상/타이포/토큰)
//   Components:  단일 컴포넌트 데모 (버튼/배지/필터/카드/페이지네이션)
//   Patterns:    조합 패턴 (테이블/레이아웃)
//   Code:        구현 참조 (차트/shadcn 현황)
type TabId = "foundations" | "components" | "patterns" | "code"
type TabSection = { id: string; label: string }
type Tab = { id: TabId; label: string; desc: string; sections: TabSection[] }

const TABS: Tab[] = [
  {
    id: "foundations",
    label: "Foundations",
    desc: "디자인 토큰",
    sections: [
      { id: "colors-atomic",   label: "색상 — Atomic" },
      { id: "colors-semantic", label: "색상 — Semantic" },
      { id: "typography",      label: "타이포그래피" },
      { id: "radius",          label: "라운드" },
      { id: "spacing",         label: "스페이싱" },
    ],
  },
  {
    id: "components",
    label: "Components",
    desc: "단일 UI 요소",
    sections: [
      { id: "buttons",    label: "버튼" },
      { id: "badges",     label: "배지" },
      { id: "filters",    label: "필터 컨트롤" },
      { id: "cards",      label: "카드" },
      { id: "pagination", label: "페이지네이션" },
    ],
  },
  {
    id: "patterns",
    label: "Patterns",
    desc: "조합 패턴",
    sections: [
      { id: "tables", label: "테이블" },
      { id: "layout", label: "레이아웃" },
    ],
  },
  {
    id: "code",
    label: "Code",
    desc: "구현 참조",
    sections: [
      { id: "charts", label: "차트 팔레트" },
      { id: "shadcn", label: "shadcn 현황" },
    ],
  },
]

const TOC = TABS.flatMap(t => t.sections)

// ── 섹션 래퍼 ─────────────────────────────────────────────────────────────
//   tab prop: 어느 탭에 속하는지 표시. 부모 컨테이너의 data-active-tab에 따라 표시/숨김
function Section({ id, title, desc, children, tab }: {
  id: string; title: string; desc?: string; children: React.ReactNode; tab: TabId
}) {
  return (
    <section id={id} data-tab={tab} className="scroll-mt-24">
      <div className="mb-5">
        <h2 className="text-[18px] font-semibold tracking-tight text-content-primary leading-snug">{title}</h2>
        {desc && <p className="text-[13px] text-content-assistive mt-1 leading-relaxed">{desc}</p>}
      </div>
      <div className="flex flex-col gap-6">{children}</div>
    </section>
  )
}

// ── 서브 레이블 ───────────────────────────────────────────────────────────
function SubLabel({ children, note }: { children: React.ReactNode; note?: string }) {
  return (
    <div className="flex items-baseline gap-2 mb-3">
      <p className="text-[12px] font-semibold text-content-primary tracking-tight uppercase">{children}</p>
      {note && <span className="text-[11px] text-content-assistive normal-case">{note}</span>}
    </div>
  )
}

// ── 토큰 행 ───────────────────────────────────────────────────────────────
function TokenRow({ name, cls, hex, kind = "bg", cssVar, copyText }: Token) {
  const [copied, setCopied] = useState(false)
  const varRef = cssVar ?? name
  const textToCopy = copyText ?? `var(--${name})`

  const copy = () => {
    navigator.clipboard.writeText(textToCopy)
    setCopied(true)
    setTimeout(() => setCopied(false), 1200)
  }

  const swatch = (() => {
    if (kind === "text") {
      return (
        <div className="h-8 w-8 rounded-md shrink-0 bg-canvas-primary border border-line-subtle grid place-items-center">
          <span style={{ color: `var(--${varRef})`, fontSize: 14, fontWeight: 600, lineHeight: 1 }}>Aa</span>
        </div>
      )
    }
    if (kind === "border") {
      return <div className="h-8 w-8 rounded-md shrink-0 bg-canvas-primary" style={{ border: `2px solid var(--${varRef})` }} />
    }
    // bg: cls 있으면 Tailwind 클래스 사용, 없으면 inline style (동적 클래스는 Tailwind 스캐너 미감지)
    if (cls) {
      return <div className={`h-8 w-8 rounded-md shrink-0 ${cls}`} />
    }
    return (
      <div className="h-8 w-8 rounded-md shrink-0 border border-line-subtle"
           style={{ backgroundColor: `var(--${varRef})` }} />
    )
  })()

  return (
    <button
      onClick={copy}
      title={`복사: ${textToCopy}`}
      className="group flex items-center gap-3 px-3 py-2 rounded-md hover:bg-fill-normal transition-colors duration-150 text-left w-full"
    >
      {swatch}
      <div className="flex-1 min-w-0">
        <p className="text-[12px] font-medium text-content-primary truncate">{name}</p>
      </div>
      {copied
        ? <Check className="h-3.5 w-3.5 text-primary shrink-0" />
        : <Copy className="h-3.5 w-3.5 text-content-disabled opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
      }
    </button>
  )
}

// ── 토큰 그룹 카드 ────────────────────────────────────────────────────────
function TokenGroupCard({ group, tokens }: TokenGroup) {
  return (
    <div className="rounded-lg border border-line-subtle bg-canvas-primary overflow-hidden">
      <div className="px-3 py-2 border-b border-divider-subtle bg-fill-subtle">
        <p className="text-[11px] font-semibold text-content-primary">{group}</p>
      </div>
      <div className="flex flex-col p-1">
        {tokens.map(t => <TokenRow key={t.name} {...t} />)}
      </div>
    </div>
  )
}

// ── 페이지네이션 데모 ─────────────────────────────────────────────────────
function PaginationDemo() {
  const [currentPage, setCurrentPage] = useState(3)
  const [pageSize, setPageSize] = useState("10")
  return (
    <div className="p-4 flex flex-col gap-3">
      <div className="flex items-center justify-between py-1">
        <div className="flex items-center gap-1">
          <span className="text-[12px] text-content-assistive tabular-nums">총 143건</span>
          <PageSizeSelect
            value={pageSize}
            onValueChange={(v) => { setPageSize(v); setCurrentPage(1) }}
          />
        </div>
        <p className="text-[11px] text-content-assistive">아무 번호나 눌러 7슬롯 고정 확인</p>
      </div>
      <PageNumbers
        totalPages={15}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />
    </div>
  )
}

// ── 타이포 샘플 행 ────────────────────────────────────────────────────────
function TypoRow({ token, size, weight, lh, ls = "-0.5px", sample, cls, tag }: {
  token: string; size: string; weight: string; lh: string; ls?: string
  sample: string; cls?: string; tag?: "underline" | "reading"
}) {
  const wLabel = weight === "600" ? "semibold" : weight === "500" ? "medium" : "regular"
  return (
    <div className="flex items-start gap-4 py-3 border-b border-divider-subtle last:border-b-0">
      <div className="w-64 shrink-0 pt-0.5">
        <div className="flex items-center gap-1.5 mb-0.5">
          <p className="text-[12px] font-medium text-content-primary">{token}</p>
          {tag === "underline" && (
            <span className="text-[9px] bg-primary/10 text-primary rounded px-1 py-px leading-none font-medium">underline</span>
          )}
          {tag === "reading" && (
            <span className="text-[9px] bg-fill-normal text-content-tertiary rounded px-1 py-px leading-none font-medium">reading</span>
          )}
        </div>
        <p className="text-[11px] text-content-assistive tabular-nums">{size} · {wLabel} · lh {lh} · ls {ls}</p>
      </div>
      <p className={`${cls ?? token} flex-1 min-w-0 text-content-primary overflow-hidden`}>{sample}</p>
    </div>
  )
}

// ── 컨트롤 샘플 ───────────────────────────────────────────────────────────
function ControlSample({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-[11px] font-medium text-content-assistive">{label}</p>
      <div>{children}</div>
    </div>
  )
}

// ── DS Migration 테이블 ────────────────────────────────────────────────────
// shadcn 원본 토큰 → 이 프로젝트 토큰 매핑을 시각화
function MigrationTable({ rows }: {
  rows: { from: string; to: string; reason: string }[]
}) {
  return (
    <div className="rounded-lg border border-line-subtle bg-canvas-primary overflow-hidden">
      <table className="w-full text-[12px]">
        <thead>
          <tr className="border-b border-divider-normal bg-fill-subtle">
            <th className="text-left py-2 px-3 font-semibold text-content-assistive">shadcn 기본 (설치 직후)</th>
            <th className="text-left py-2 px-3 font-semibold text-content-assistive">이 프로젝트 (적용 후)</th>
            <th className="text-left py-2 px-3 font-semibold text-content-assistive w-44">변경 이유</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className="border-t border-divider-subtle">
              <td className="py-2 px-3">
                <code className="text-[10px] bg-fill-normal text-content-assistive px-1 py-0.5 rounded">{r.from}</code>
              </td>
              <td className="py-2 px-3">
                <code className="text-[10px] bg-primary/10 text-primary px-1 py-0.5 rounded">{r.to}</code>
              </td>
              <td className="py-2 px-3 text-content-assistive text-[11px]">{r.reason}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ── 메인 페이지 ───────────────────────────────────────────────────────────
export default function DesignSystemPage() {
  const [activeTab, setActiveTab] = useState<TabId>("foundations")
  const [activeId, setActiveId] = useState<string>(TABS[0].sections[0].id)

  // 현재 탭의 섹션만 IntersectionObserver 추적
  useEffect(() => {
    const currentSections = TABS.find(t => t.id === activeTab)?.sections ?? []
    if (currentSections.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActiveId(entry.target.id)
        }
      },
      { rootMargin: "-20% 0% -60% 0%", threshold: 0 }
    )
    currentSections.forEach(s => {
      const el = document.getElementById(s.id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [activeTab])

  // 탭 전환 시 첫 섹션으로 스크롤 + 사이드 nav 동기화
  const handleTabChange = (next: TabId) => {
    setActiveTab(next)
    const first = TABS.find(t => t.id === next)?.sections[0]
    if (first) {
      setActiveId(first.id)
      requestAnimationFrame(() => {
        document.getElementById(first.id)?.scrollIntoView({ behavior: "smooth", block: "start" })
      })
    }
  }

  const currentTab = TABS.find(t => t.id === activeTab)!

  return (
    <div className="h-full overflow-y-auto overflow-x-hidden bg-canvas-tertiary scrollbar-hide">
      {/* 타이틀 */}
      <div className="px-6 pt-10 pb-4">
        <h1 className="text-[28px] font-semibold tracking-tight leading-tight text-content-primary [text-wrap:balance]">
          디자인 시스템
        </h1>
      </div>

      {/* 탭 네비게이션 — sticky */}
      <div className="sticky top-0 z-20 bg-canvas-tertiary/95 backdrop-blur-sm border-b border-line-subtle">
        <div className="px-6 flex items-end gap-1">
          {TABS.map(t => (
            <button
              key={t.id}
              onClick={() => handleTabChange(t.id)}
              className={`px-4 pt-3 pb-2.5 -mb-px border-b-2 transition-all duration-150 ${
                activeTab === t.id
                  ? "border-primary text-content-primary"
                  : "border-transparent text-content-assistive hover:text-content-primary hover:bg-fill-subtle"
              }`}
            >
              <span className="text-[14px] font-semibold tracking-tight leading-none">{t.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-8 px-6 pt-8 pb-20">

        {/* 사이드 nav — 현재 탭의 섹션만 */}
        <aside className="w-[160px] shrink-0 sticky top-24 self-start">
          <p className="text-[10px] font-semibold text-content-disabled uppercase tracking-wider mb-2">{currentTab.label}</p>
          <nav className="flex flex-col gap-0.5">
            {currentTab.sections.map((item, i) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className={`flex items-center gap-2 text-[12px] rounded-md px-2 py-1.5 transition-colors duration-120 ${
                  activeId === item.id
                    ? "bg-primary/10 text-primary font-semibold"
                    : "text-content-assistive hover:text-content-primary hover:bg-fill-normal"
                }`}
              >
                {item.label}
              </a>
            ))}
          </nav>
        </aside>

        {/* 본문 — 현재 탭만 보이게 (CSS는 globals.css 하단 .ds-tab-container 룰 참고) */}
        <div className="ds-tab-container flex-1 min-w-0 flex flex-col gap-12" data-active-tab={activeTab}>

          {/* 01. Atomic Palette */}
          <Section
            tab="foundations"
            id="colors-atomic"
            title="색상 — Atomic Palette"
          >
            <div>
              <SubLabel>Cool Neutral</SubLabel>
              <div className="grid grid-cols-1 gap-2">
                <TokenGroupCard {...ATOMIC_COOL_NEUTRAL} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <SubLabel>Blue</SubLabel>
                <TokenGroupCard {...ATOMIC_BLUE} />
              </div>
              <div>
                <SubLabel>Red / Green / Amber / Orange</SubLabel>
                <TokenGroupCard {...ATOMIC_STATUS} />
              </div>
            </div>
          </Section>

          {/* 02. Semantic Tokens */}
          <Section
            tab="foundations"
            id="colors-semantic"
            title="색상 — Semantic Tokens"
          >
            {/* Semantic Sync 안내 */}
            <div className="rounded-lg border border-line-subtle bg-canvas-quaternary p-4 flex flex-col gap-3">
              <div>
                <p className="text-[12px] font-semibold text-content-primary mb-1">Semantic Sync — Figma 1:1 토큰 (마이그레이션 완료)</p>
                <p className="text-[11px] text-content-assistive">bg-canvas-* / text-content-* / border-line-* 는 Figma 토큰명 직접 사용. shadcn 표준과 충돌 없음.</p>
              </div>
              {/* 브랜드(accent) SWAP은 아직 진행 중 — 4b/4.5단계 대기 */}
              <div className="rounded-md border border-primary/20 bg-primary/5 p-3">
                <p className="text-[11px] font-semibold text-primary mb-1.5">⚠ 브랜드 토큰 SWAP 잔존 (4b/4.5 완료 전)</p>
                <div className="grid grid-cols-2 gap-x-6 gap-y-0.5">
                  {[
                    { cls: "bg-primary",              shadcn: "서브틀 hover",   ours: "브랜드 블루 #3182F6" },
                    { cls: "text-primary",             shadcn: "서브틀 글자",   ours: "브랜드 블루 링크" },
                    { cls: "text-inverse-primary",  shadcn: "서브틀 위 글자", ours: "흰 글자 (버튼 위)" },
                  ].map(r => (
                    <div key={r.cls} className="flex items-baseline gap-1.5 py-0.5">
                      <code className="text-[11px] text-primary shrink-0">{r.cls}</code>
                      <span className="text-[10px] text-content-assistive">→ {r.ours}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <TokenGroupCard {...BG_GROUP} />
              <TokenGroupCard {...BORDER_GROUP} />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <TokenGroupCard {...TEXT_GROUP} />
              <div className="flex flex-col gap-3">
                <TokenGroupCard {...ACCENT_GROUP} />
                <TokenGroupCard {...FILL_GROUP} />
                <TokenGroupCard {...DIVIDER_GROUP} />
              </div>
            </div>

            <TokenGroupCard {...STATUS_GROUP} />

            <div>
              <SubLabel>Tint & Badge 색상</SubLabel>
              <TokenGroupCard {...TINT_GROUP} />
            </div>
          </Section>

          {/* 03. 타이포그래피 */}
          <Section
            tab="foundations"
            id="typography"
            title="타이포그래피"
          >
            <div>
              <SubLabel>Reference Composite Tokens</SubLabel>
              <div className="rounded-lg border border-line-subtle bg-canvas-primary overflow-hidden">
                <TypoRow token="text-h1-bold"      size="36px" weight="600" lh="46px" sample="보닥 플래너 for KB라이프" />
                <TypoRow token="text-h2-bold"      size="34px" weight="600" lh="40px" sample="상담 진행 고객" />
                <TypoRow token="text-h2"           size="34px" weight="500" lh="40px" sample="상담 진행 고객" />
                <TypoRow token="text-h3-bold"      size="24px" weight="600" lh="36px" sample="재배정 타입 설정" />
                <TypoRow token="text-h3"           size="24px" weight="500" lh="36px" sample="재배정 타입 설정" />
                <TypoRow token="text-h4"           size="22px" weight="600" lh="32px" sample="배정 완료 DB" />
                <TypoRow token="text-h5-bold"             size="20px" weight="600" lh="30px" sample="설계사 검색" />
                <TypoRow token="text-h5-bold-underline"   size="20px" weight="600" lh="30px" sample="설계사 검색" tag="underline" />
                <TypoRow token="text-h5-medium"           size="20px" weight="500" lh="30px" sample="설계사 검색" />
                <TypoRow token="text-h5"                  size="20px" weight="400" lh="30px" sample="설계사 검색" />
                <TypoRow token="text-body1-bold"          size="18px" weight="600" lh="28px" sample="고객명 · 담당 설계사" />
                <TypoRow token="text-body1"               size="18px" weight="500" lh="28px" sample="고객명 · 담당 설계사" />
                <TypoRow token="text-body2_bold"          size="16px" weight="600" lh="24px" sample="배정된 고객의 상담 상태를 관리합니다" />
                <TypoRow token="text-body2_bold_underline" size="16px" weight="600" lh="24px" sample="배정된 고객의 상담 상태를 관리합니다" tag="underline" />
                <TypoRow token="text-body2_medium"        size="16px" weight="500" lh="24px" sample="배정된 고객의 상담 상태를 관리합니다" />
                <TypoRow token="text-body2_normal"        size="16px" weight="400" lh="24px" sample="배정된 고객의 상담 상태를 관리합니다" />
                <TypoRow token="text-body2_reading"       size="16px" weight="400" lh="24px" ls="-1px" sample="배정된 고객의 상담 상태를 관리합니다" tag="reading" />
                <TypoRow token="text-body3_bold"          size="14px" weight="600" lh="22px" sample="이민혁 · 010-1111-1111 · 2026.01.01" />
                <TypoRow token="text-body3_bold_underline" size="14px" weight="600" lh="22px" sample="이민혁 · 010-1111-1111 · 2026.01.01" tag="underline" />
                <TypoRow token="text-body3_medium"        size="14px" weight="500" lh="22px" sample="이민혁 · 010-1111-1111 · 2026.01.01" />
                <TypoRow token="text-body3_normal"        size="14px" weight="400" lh="22px" sample="이민혁 · 010-1111-1111 · 2026.01.01" />
                <TypoRow token="text-body3_underline"     size="14px" weight="400" lh="22px" sample="이민혁 · 010-1111-1111 · 2026.01.01" tag="underline" />
                <TypoRow token="text-body3_reading"       size="14px" weight="400" lh="24px" ls="-1px" sample="이민혁 · 010-1111-1111 · 2026.01.01" tag="reading" />
                <TypoRow token="text-body4_bold"          size="13px" weight="600" lh="20px" sample="정상 · 계약 예정 · 상담 종료" />
                <TypoRow token="text-body4_medium"        size="13px" weight="500" lh="18px" sample="정상 · 계약 예정 · 상담 종료" />
                <TypoRow token="text-body4_normal"        size="13px" weight="400" lh="18px" sample="정상 · 계약 예정 · 상담 종료" />
                <TypoRow token="text-body4_underline"     size="13px" weight="400" lh="18px" sample="정상 · 계약 예정 · 상담 종료" tag="underline" />
                <TypoRow token="text-body4_reading"       size="13px" weight="400" lh="18px" ls="-1px" sample="정상 · 계약 예정 · 상담 종료" tag="reading" />
                <TypoRow token="text-body5_bold"          size="12px" weight="600" lh="20px" sample="담당 설계사 · 상태" />
                <TypoRow token="text-body5_medium"        size="12px" weight="500" lh="16px" sample="담당 설계사 · 상태" />
                <TypoRow token="text-body5_normal"        size="12px" weight="400" lh="16px" sample="담당 설계사 · 상태" />
                <TypoRow token="text-body5_underline"     size="12px" weight="400" lh="16px" sample="담당 설계사 · 상태" tag="underline" />
                <TypoRow token="text-body5_reading"       size="12px" weight="400" lh="16px" ls="-1px" sample="담당 설계사 · 상태" tag="reading" />
                <TypoRow token="text-caption_bold"        size="10px" weight="600" lh="16px" sample="레이블 · 구분" />
                <TypoRow token="text-caption"             size="10px" weight="400" lh="16px" sample="레이블 · 구분" />
                <TypoRow token="text-caption_underline"   size="10px" weight="400" lh="16px" sample="레이블 · 구분" tag="underline" />
              </div>
            </div>

          </Section>

          {/* 04. 라운드 계층 */}
          <Section tab="foundations" id="radius" title="라운드 계층">

            <div>
              <SubLabel>Reference 토큰 시각화</SubLabel>
              <div className="flex flex-wrap items-end gap-4">
                {RADIUS_REFERENCE.map(r => (
                  <div key={r.cls} className="flex flex-col items-center gap-2">
                    <div
                      className="w-12 h-12 bg-primary/10 border border-primary/25"
                      style={{ borderRadius: r.px >= 9999 ? "9999px" : `${r.px}px` }}
                    />
                    <div className="text-center">
                      <code className="text-[10px] text-primary block">{r.cls}</code>
                      <p className="text-[10px] text-content-assistive">{r.px >= 9999 ? "pill" : `${r.px}px`}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <SubLabel>사용 계층 규칙</SubLabel>
              <div className="rounded-lg border border-line-subtle bg-canvas-primary overflow-hidden">
                <table className="w-full text-[12px]">
                  <thead>
                    <tr className="border-b border-divider-normal bg-fill-subtle">
                      <th className="text-left py-2 px-3 font-semibold text-content-assistive">레벨</th>
                      <th className="text-left py-2 px-3 font-semibold text-content-assistive">클래스</th>
                      <th className="text-left py-2 px-3 font-semibold text-content-assistive">설명</th>
                    </tr>
                  </thead>
                  <tbody>
                    {RADIUS_RULES.map(r => (
                      <tr key={r.level} className="border-t border-divider-subtle">
                        <td className="py-2.5 px-3 text-content-primary">{r.level}</td>
                        <td className="py-2.5 px-3">
                          <code className={`text-[11px] px-1.5 py-0.5 rounded ${
                            r.cls === "rounded-xl" ? "bg-red-50 text-red-600" : "bg-primary/10 text-primary"
                          }`}>{r.cls}</code>
                        </td>
                        <td className="py-2.5 px-3 text-content-assistive">{r.note}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div>
              <SubLabel>Border Width</SubLabel>
              <div className="flex gap-6 flex-wrap items-end">
                <div className="flex flex-col gap-2">
                  <code className="text-[11px] bg-primary/10 text-primary px-1.5 py-0.5 rounded w-fit">border-border05</code>
                  <div className="h-10 w-28 rounded-md bg-canvas-primary" style={{ border: "0.5px solid var(--border-subtle)" }} />
                  <p className="text-[11px] text-content-assistive">0.5px · 특수 케이스</p>
                </div>
                <div className="flex flex-col gap-2">
                  <code className="text-[11px] bg-primary/10 text-primary px-1.5 py-0.5 rounded w-fit">border / border-border10</code>
                  <div className="h-10 w-28 rounded-md bg-canvas-primary border border-line-subtle" />
                  <p className="text-[11px] text-content-assistive">1px · 기본 (Tailwind border)</p>
                </div>
              </div>
            </div>

            <div>
              <SubLabel>Shadow</SubLabel>
              <div className="flex gap-6 flex-wrap items-end">
                {[
                  { cls: "shadow-xs",  note: "필터 컨트롤 · 소형 팝업" },
                  { cls: "shadow-sm",  note: "카드 팝업 · select" },
                  { cls: "shadow-md",  note: "모달 · 사이드바" },
                ].map(s => (
                  <div key={s.cls} className="flex flex-col gap-2">
                    <code className="text-[11px] bg-primary/10 text-primary px-1.5 py-0.5 rounded w-fit">{s.cls}</code>
                    <div className={`h-10 w-28 rounded-md bg-canvas-primary ${s.cls}`} />
                    <p className="text-[11px] text-content-assistive">{s.note}</p>
                  </div>
                ))}
              </div>
            </div>
          </Section>

          {/* 05. 스페이싱 */}
          <Section tab="foundations" id="spacing" title="스페이싱">

            <div>
              <SubLabel>스케일 시각화</SubLabel>
              <div className="flex items-end gap-3 flex-wrap">
                {SPACING_SCALE.map(s => (
                  <div key={s.px} className="flex flex-col items-center gap-1.5">
                    <div className="w-8 bg-primary/15 border border-primary/25 rounded-sm" style={{ height: `${s.px}px` }} />
                    <div className="text-center">
                      <p className="text-[11px] font-semibold text-content-primary tabular-nums">{s.px}px</p>
                      <p className="text-[10px] text-primary">{s.s}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <SubLabel>주요 사용 패턴</SubLabel>
              <div className="rounded-lg border border-line-subtle bg-canvas-primary overflow-hidden">
                <table className="w-full text-[12px]">
                  <thead>
                    <tr className="border-b border-divider-normal bg-fill-subtle">
                      <th className="text-left py-2 px-3 font-semibold text-content-assistive w-44">용도</th>
                      <th className="text-left py-2 px-3 font-semibold text-content-assistive w-36">클래스</th>
                      <th className="text-left py-2 px-3 font-semibold text-content-assistive">설명</th>
                    </tr>
                  </thead>
                  <tbody>
                    {SPACING_PATTERNS.map(p => (
                      <tr key={p.label} className="border-t border-divider-subtle">
                        <td className="py-2.5 px-3 font-medium text-content-primary">{p.label}</td>
                        <td className="py-2.5 px-3">
                          <code className="text-[11px] bg-primary/10 text-primary px-1.5 py-0.5 rounded">{p.cls}</code>
                        </td>
                        <td className="py-2.5 px-3 text-content-assistive">{p.note}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </Section>

          {/* 06. 카드 */}
          <Section tab="components" id="cards" title="카드">

            <div>
              <SubLabel>기본 카드</SubLabel>
              <div className="bg-canvas-primary rounded-lg border border-line-subtle">
                <div className="px-6 pt-5 pb-3">
                  <p className="text-[14px] font-semibold text-content-primary">카드 타이틀</p>
                  <p className="text-[12px] text-content-assistive mt-0.5">bg-canvas-primary · rounded-lg · border-line-subtle</p>
                </div>
                <div className="mx-6 h-px bg-divider-subtle" />
                <div className="px-6 py-4">
                  <p className="text-[13px] text-content-secondary">
                    내부 구분선:{" "}
                    <code className="text-[11px] bg-primary/10 text-primary px-1.5 py-0.5 rounded">mx-6 h-px bg-divider-subtle</code>
                    {" "}— 좌우 mx-6 인셋 필수
                  </p>
                </div>
              </div>
            </div>

            <div>
              <SubLabel>KPI 타일 카드</SubLabel>
              <div className="bg-canvas-primary rounded-lg py-5 border border-line-subtle">
                <div className="flex items-stretch">
                  {[
                    { label: "전체", value: "100", unit: "명" },
                    { label: "승인대기", value: "50", unit: "명" },
                    { label: "정상", value: "10", unit: "명" },
                    { label: "일시제한", value: "10", unit: "명" },
                  ].map((stat, i) => (
                    <div key={stat.label} className="flex-1 px-6 relative">
                      {i > 0 && <div className="absolute left-0 top-1/2 -translate-y-1/2 h-12 w-px bg-divider-normal" />}
                      <p className="text-[12px] font-medium text-content-assistive mb-2.5 tracking-tight leading-none whitespace-nowrap">{stat.label}</p>
                      <div className="flex items-baseline gap-0.5">
                        <span className="text-kpi text-content-primary tabular-nums">{stat.value}</span>
                        <span className="text-kpi text-content-primary">{stat.unit}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <p className="text-[11px] text-content-assistive mt-1.5">
                수직 구분선:{" "}
                <code className="text-[11px] bg-primary/10 text-primary px-1.5 py-0.5 rounded">absolute h-12 w-px bg-divider-normal</code>
              </p>
            </div>
          </Section>

          {/* 07. 버튼 */}
          <Section tab="components" id="buttons" title="버튼">

            <div>
              <SubLabel>Variant × Size 매트릭스</SubLabel>
              <div className="rounded-lg border border-line-subtle bg-canvas-primary overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-[12px]">
                    <thead>
                      <tr className="border-b border-divider-normal bg-fill-subtle">
                        <th className="text-left py-2 px-3 font-semibold text-content-assistive w-28">variant</th>
                        {BUTTON_SIZES.map(s => (
                          <th key={s.size} className="py-2 px-3 text-center font-semibold text-content-assistive">
                            <div>{s.size}</div>
                            <div className="text-[10px] font-normal">{s.h}</div>
                          </th>
                        ))}
                        <th className="py-2 px-3 text-left font-semibold text-content-assistive">설명</th>
                      </tr>
                    </thead>
                    <tbody>
                      {BUTTON_VARIANTS.map(v => (
                        <tr key={v.label} className="border-t border-divider-subtle">
                          <td className="py-3 px-3 font-medium text-content-tertiary">{v.label}</td>
                          {BUTTON_SIZES.map(s => (
                            <td key={s.size} className="py-3 px-3 text-center">
                              <Button size={s.size} variant={v.variant}>
                                버튼
                              </Button>
                            </td>
                          ))}
                          <td className="py-3 px-3 text-content-assistive text-[11px]">{v.desc}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div>
              <SubLabel>아이콘 버튼 사이즈</SubLabel>
              <div className="flex items-end gap-4">
                {ICON_SIZES.map(s => (
                  <div key={s.size} className="flex flex-col items-center gap-2">
                    <Button variant="outline" size={s.size} className="border-line-subtle">
                      <Search />
                    </Button>
                    <div className="text-center">
                      <code className="text-[10px] text-primary block">{s.size}</code>
                      <p className="text-[10px] text-content-assistive">{s.dim}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <SubLabel>DS Migration — shadcn → 이 프로젝트</SubLabel>
              <div className="rounded-lg border border-line-subtle bg-canvas-primary overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-[11px]">
                    <thead>
                      <tr className="border-b border-divider-normal bg-fill-subtle">
                        <th className="text-left py-2 px-3 font-semibold text-content-assistive w-28">variant</th>
                        <th className="text-left py-2 px-3 font-semibold text-content-assistive">bg / border</th>
                        <th className="text-left py-2 px-3 font-semibold text-content-assistive">text</th>
                        <th className="text-left py-2 px-3 font-semibold text-content-assistive text-content-assistive">hover</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { v: "default",     bg: "bg-primary",         text: "text-inverse-primary", hover: "bg-primary/90"      },
                        { v: "secondary",   bg: "bg-primary/10",      text: "text-primary",            hover: "bg-primary/20"      },
                        { v: "outline",     bg: "border-border",     text: "text-content-primary",        hover: "bg-canvas-quaternary"     },
                        { v: "ghost",       bg: "—",                 text: "text-content-primary",        hover: "bg-canvas-quaternary"     },
                        { v: "neutral",     bg: "bg-canvas-quaternary",     text: "text-content-primary",        hover: "bg-fill-hover"     },
                        { v: "destructive", bg: "bg-destructive/10", text: "text-destructive",       hover: "bg-destructive/20" },
                      ].map(r => (
                        <tr key={r.v} className="border-t border-divider-subtle">
                          <td className="py-2 px-3 text-content-tertiary font-medium">{r.v}</td>
                          <td className="py-2 px-3">
                            <code className="text-[10px] bg-primary/10 text-primary px-1 py-0.5 rounded">{r.bg}</code>
                          </td>
                          <td className="py-2 px-3">
                            <code className="text-[10px] bg-primary/10 text-primary px-1 py-0.5 rounded">{r.text}</code>
                          </td>
                          <td className="py-2 px-3">
                            <code className="text-[10px] bg-fill-normal text-content-secondary px-1 py-0.5 rounded">{r.hover}</code>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="px-3 py-2 border-t border-divider-subtle text-[11px] text-content-assistive flex flex-wrap gap-x-4 gap-y-1">
                  <span>focus →{" "}<code className="text-[10px] bg-primary/10 text-primary px-1 py-0.5 rounded">border-ring ring-ring/50</code></span>
                  <span>disabled →{" "}<code className="text-[10px] bg-primary/10 text-primary px-1 py-0.5 rounded">opacity-50 pointer-events-none</code></span>
                </div>
              </div>
              <MigrationTable rows={[
                { from: "bg-canvas-primary text-inverse-primary",      to: "bg-primary text-inverse-primary",      reason: "primary SWAP — primary는 흰 배경이므로 brand action = accent" },
                { from: "hover:bg-primary (shadcn 서브틀 hover)",   to: "hover:bg-canvas-quaternary / hover:bg-muted",  reason: "accent↔muted SWAP — shadcn accent는 우리 시스템에서 brand blue" },
                { from: "data-[state=checked]:bg-canvas-primary",         to: "data-[state=checked]:bg-primary",        reason: "Checkbox ON 상태 — primary SWAP 동일 적용" },
              ]} />
            </div>
          </Section>

          {/* 08. 필터 */}
          <Section tab="components" id="filters" title="필터">

            <div>
              <SubLabel>SearchFilter 라이브 데모</SubLabel>
              <SearchFilter
                extraSelects={[{
                  defaultValue: "all",
                  options: [
                    { value: "all", label: "상태 전체" },
                    { value: "active", label: "진행중" },
                    { value: "done", label: "완료" },
                  ],
                }]}
              />
            </div>

            <div>
              <SubLabel>개별 컨트롤 패턴</SubLabel>
              <div className="grid grid-cols-3 gap-4">
                <ControlSample label="Select — size='sm' border-line-subtle bg-fill-filter">
                  <Select defaultValue="all">
                    <SelectTrigger size="sm" className="border-line-subtle bg-fill-filter gap-1.5 text-content-primary">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-md border-line-subtle text-[13px]">
                      <SelectItem value="all">상태 전체</SelectItem>
                      <SelectItem value="active">진행중</SelectItem>
                    </SelectContent>
                  </Select>
                </ControlSample>
                <ControlSample label="Input — variant='filter' size='sm'">
                  <div className="relative flex items-center">
                    <Search className="pointer-events-none absolute left-2.5 h-3.5 w-3.5 text-content-disabled" />
                    <Input variant="filter" size="sm" className="pl-8 placeholder:text-content-assistive" placeholder="고객명 검색" />
                  </div>
                </ControlSample>
                <ControlSample label="필터 초기화 (변경 시 노출)">
                  <button className="h-8 px-1 text-[12px] font-medium text-primary underline underline-offset-2 decoration-accent hover:opacity-70 active:scale-[0.97] transition-[transform,opacity] duration-100">
                    필터 초기화
                  </button>
                </ControlSample>
              </div>
              <p className="text-[11px] text-content-assistive mt-2">
                컨트롤 공통:{" "}
                <code className="text-[11px] bg-primary/10 text-primary px-1 py-0.5 rounded">bg-fill-filter border-line-subtle shadow-none rounded-md h-8</code>
                {" "}· 초기화는 아이콘 버튼 금지
              </p>
            </div>

            <div>
              <SubLabel>DS Migration — Input / Select</SubLabel>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-[11px] font-semibold text-content-primary mb-2">Input</p>
                  <MigrationTable rows={[
                    { from: "border-input (1px, border-line-primary)",  to: 'variant="filter" → border-line-subtle',     reason: "필터용 연한 보더" },
                    { from: "bg-transparent",                      to: 'variant="filter" → bg-fill-filter',   reason: "페이지 bg-canvas-tertiary 위 대비" },
                    { from: "text-content-assistive (placeholder)", to: "placeholder:text-content-assistive",          reason: "assistive = 우리 시스템 placeholder 토큰" },
                  ]} />
                </div>
                <div>
                  <p className="text-[11px] font-semibold text-content-primary mb-2">Select</p>
                  <MigrationTable rows={[
                    { from: "bg-primary (shadcn 서브틀 hover)",     to: "hover:bg-primary/5 + border-primary/30 + text-primary", reason: "brand 컬러 명시적 hover (accent↔muted SWAP)" },
                    { from: "bg-popover border-border (Content)",  to: "border-line-subtle className 추가",        reason: "필터용 보더를 subtle로 오버라이드" },
                    { from: "bg-background (Trigger 기본)",        to: "bg-fill-filter className 추가",       reason: "필터용 흰 배경 명시" },
                  ]} />
                </div>
              </div>
            </div>

            <div>
              <SubLabel>필터 위치 패턴</SubLabel>
              <div className="grid grid-cols-2 gap-3">
                {[
                  {
                    title: "패턴 A — 카드 헤더 내부",
                    pages: "/ (홈) · /pending",
                    sketch: (
                      <div className="rounded-md border border-line-subtle bg-canvas-primary">
                        <div className="px-3 py-2 flex items-center justify-between border-b border-divider-subtle">
                          <p className="text-[11px] font-semibold text-content-primary">카드 타이틀</p>
                          <div className="h-6 w-20 rounded bg-fill-filter border border-line-subtle" />
                        </div>
                        <div className="h-12 flex items-center justify-center">
                          <p className="text-[11px] text-content-assistive">테이블</p>
                        </div>
                      </div>
                    ),
                  },
                  {
                    title: "패턴 B — 별도 카드 (mb-4)",
                    pages: "/completed · /db/* · /management/*",
                    sketch: (
                      <div className="flex flex-col gap-2">
                        <div className="rounded-md border border-line-subtle bg-canvas-primary px-3 py-2 flex gap-2">
                          <div className="h-6 w-16 rounded bg-fill-filter border border-line-subtle" />
                          <div className="h-6 w-20 rounded bg-fill-filter border border-line-subtle" />
                        </div>
                        <div className="rounded-md border border-line-subtle bg-canvas-primary h-12 flex items-center justify-center">
                          <p className="text-[11px] text-content-assistive">테이블</p>
                        </div>
                      </div>
                    ),
                  },
                ].map(p => (
                  <div key={p.title} className="rounded-lg border border-line-subtle bg-canvas-primary p-3">
                    <p className="text-[11px] font-semibold text-content-primary mb-2">{p.title}</p>
                    {p.sketch}
                    <p className="text-[10px] text-content-assistive mt-2">{p.pages}</p>
                  </div>
                ))}
              </div>
            </div>
          </Section>

          {/* 09. 테이블 */}
          <Section tab="patterns" id="tables" title="테이블">
            <div className="rounded-lg border border-line-subtle bg-canvas-primary overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="border-b border-divider-normal hover:bg-transparent">
                    <TableHead className="text-center font-semibold text-content-assistive text-[12px] h-10 w-12">No.</TableHead>
                    <TableHead className="text-left font-semibold text-content-assistive text-[12px] h-10">이름</TableHead>
                    <TableHead className="text-left font-semibold text-content-assistive text-[12px] h-10">휴대폰번호</TableHead>
                    <TableHead className="text-left font-semibold text-content-assistive text-[12px] h-10">소속</TableHead>
                    <TableHead className="text-left font-semibold text-content-assistive text-[12px] h-10">가입일</TableHead>
                    <TableHead className="text-left font-semibold text-content-assistive text-[12px] h-10">상태</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[1, 2, 3].map(i => (
                    <TableRow key={i} className="cursor-pointer border-divider-subtle hover:bg-fill-subtle transition-colors duration-120">
                      <TableCell className="text-center num-cell">{i}</TableCell>
                      <TableCell className="text-left text-content-primary">이민혁</TableCell>
                      <TableCell className="text-left num-cell">010-1111-1111</TableCell>
                      <TableCell className="text-left">본사 &gt; 사업단 1 &gt; 지점 1</TableCell>
                      <TableCell className="text-left num-cell">2026.01.01</TableCell>
                      <TableCell className="text-left">
                        <Badge variant="pill-success">정상</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <div className="rounded-lg border border-line-subtle bg-canvas-primary overflow-hidden">
              <table className="w-full text-[12px]">
                <thead>
                  <tr className="border-b border-divider-normal bg-fill-subtle">
                    <th className="text-left py-2 px-3 font-semibold text-content-assistive">속성</th>
                    <th className="text-left py-2 px-3 font-semibold text-content-assistive">값</th>
                    <th className="text-left py-2 px-3 font-semibold text-content-assistive">비고</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { attr: "TableHead 높이", val: "h-10 (40px)", note: "개별 파일 오버라이드 금지" },
                    { attr: "TableCell 높이", val: "h-[44px]", note: "터치 타겟 최소값" },
                    { attr: "TableCell 패딩", val: "px-3 py-2.5", note: "" },
                    { attr: "No. 컬럼",       val: "text-center", note: "헤더+셀 동일" },
                    { attr: "나머지 컬럼",     val: "text-left", note: "기본" },
                    { attr: "숫자/날짜/전화",  val: "num-cell", note: "tabular-nums + tracking" },
                    { attr: "행 hover",        val: "hover:bg-fill-subtle", note: "" },
                    { attr: "선택 행",         val: "data-[state=selected]:bg-primary/5", note: "" },
                  ].map(r => (
                    <tr key={r.attr} className="border-t border-divider-subtle">
                      <td className="py-2.5 px-3 font-medium text-content-primary">{r.attr}</td>
                      <td className="py-2.5 px-3"><code className="text-[11px] bg-primary/10 text-primary px-1.5 py-0.5 rounded">{r.val}</code></td>
                      <td className="py-2.5 px-3 text-content-assistive">{r.note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Section>

          {/* 10. 배지 */}
          <Section tab="components" id="badges" title="배지">
            <div className="grid grid-cols-3 gap-6">
              <div>
                <SubLabel>pill — 활성·진행 상태</SubLabel>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="pill-success">정상</Badge>
                  <Badge variant="pill-warning">일시제한</Badge>
                  <Badge variant="pill-danger">실패</Badge>
                  <Badge variant="pill-neutral">대기</Badge>
                </div>
                <div className="mt-3 flex flex-col gap-1">
                  {[
                    { v: "pill-success", desc: "border-green-600/30" },
                    { v: "pill-warning", desc: "border-amber-500/40" },
                    { v: "pill-danger",  desc: "border-red-500/40" },
                    { v: "pill-neutral", desc: "border-muted-foreground/25" },
                  ].map(b => (
                    <div key={b.v} className="flex items-center gap-2">
                      <code className="text-[10px] text-primary">{b.v}</code>
                      <span className="text-[10px] text-content-assistive">{b.desc}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <SubLabel>tint — 종결·분류 상태</SubLabel>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="tint-success">계약 완료</Badge>
                  <Badge variant="tint-warning">상담 거절</Badge>
                  <Badge variant="tint-danger">실패</Badge>
                  <Badge variant="tint-neutral">종료</Badge>
                  <Badge variant="tint-blue">진행 예정</Badge>
                  <Badge variant="tint-muted">보류</Badge>
                </div>
                <div className="mt-3 flex flex-col gap-1">
                  {[
                    { v: "tint-success", desc: "green-50 / green-450" },
                    { v: "tint-warning", desc: "amber-50 / amber-700" },
                    { v: "tint-danger",  desc: "red-50 / red-600" },
                    { v: "tint-neutral", desc: "bg-subtle / text-content-assistive" },
                    { v: "tint-blue",    desc: "accent-bg-blue / accent-fg-blue" },
                    { v: "tint-muted",   desc: "bg-canvas-quaternary / text-content-quaternary" },
                  ].map(b => (
                    <div key={b.v} className="flex items-center gap-2">
                      <code className="text-[10px] text-primary">{b.v}</code>
                      <span className="text-[10px] text-content-assistive">{b.desc}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <SubLabel>tag — 컴팩트 태그</SubLabel>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="tint-danger">긴급</Badge>
                  <Badge variant="tint-blue">신규</Badge>
                  <Badge variant="tint-success">완료</Badge>
                  <Badge variant="tint-neutral">보류</Badge>
                  <Badge variant="tag-dark">VIP</Badge>
                </div>
                <p className="text-[10px] text-content-assistive mt-2">칸반 태그는 <code className="text-primary">tint-*</code> variant 우선 사용. <code className="text-content-assistive">tag-dark</code>(다크 강조)만 별도 유지.</p>
                <div className="mt-2 flex flex-col gap-1">
                  {[
                    { v: "tint-danger",  desc: "긴급 · 실패" },
                    { v: "tint-blue",    desc: "신규 · 진행 예정" },
                    { v: "tint-success", desc: "완료 · 계약" },
                    { v: "tint-warning", desc: "주의 · 거절" },
                    { v: "tint-neutral", desc: "보류 · 종료" },
                    { v: "tag-dark",     desc: "VIP · 다크 강조 전용" },
                  ].map(b => (
                    <div key={b.v} className="flex items-center gap-2">
                      <code className="text-[10px] text-primary">{b.v}</code>
                      <span className="text-[10px] text-content-assistive">{b.desc}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <SubLabel>Base Variant</SubLabel>
              <div className="flex flex-wrap gap-2">
                <Badge variant="default">default (bg-primary)</Badge>
                <Badge variant="secondary">secondary</Badge>
                <Badge variant="destructive">destructive</Badge>
                <Badge variant="outline">outline</Badge>
                <Badge variant="ghost">ghost</Badge>
                <Badge variant="link">link</Badge>
              </div>
            </div>

            <div>
              <SubLabel>DS Migration — shadcn → 이 프로젝트</SubLabel>
              <MigrationTable rows={[
                { from: "bg-canvas-primary text-inverse-primary (default variant)", to: "bg-primary text-inverse-primary",                     reason: "primary SWAP — brand badge = accent" },
                { from: "—",                                                    to: "pill-* variants 추가",                                  reason: "활성/진행 상태용 outline pill (shadcn에 없음)" },
                { from: "—",                                                    to: "tint-* variants 추가",                                  reason: "종결/분류용 배경 fill (badge-tint-* 전용 토큰)" },
                { from: "—",                                                    to: "bg-badge-tint-success-bg / text-badge-tint-success-fg", reason: "시맨틱 배지 색상 — globals.css에 전용 변수로 분리" },
                { from: "bg-primary text-inverse-primary (shadcn secondary)", to: "bg-canvas-secondary text-secondary-foreground",               reason: "shadcn secondary = 우리 accent와 다른 값" },
              ]} />
            </div>
          </Section>

          {/* 11. 페이지네이션 */}
          <Section tab="components" id="pagination" title="페이지네이션">
            <div className="rounded-lg border border-line-subtle bg-canvas-primary">
              <PaginationDemo />
            </div>
            <div className="rounded-lg border border-line-subtle bg-canvas-primary overflow-hidden">
              <table className="w-full text-[12px]">
                <thead>
                  <tr className="border-b border-divider-normal bg-fill-subtle">
                    <th className="text-left py-2 px-3 font-semibold text-content-assistive">컴포넌트</th>
                    <th className="text-left py-2 px-3 font-semibold text-content-assistive">사용법</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { comp: "PageNumbers",   usage: '<PageNumbers totalPages={n} currentPage={p} onPageChange={setPage} />' },
                    { comp: "PageSizeSelect", usage: '<PageSizeSelect value={pageSize} onValueChange={(v) => { setPageSize(v); setCurrentPage(1) }} />' },
                  ].map(r => (
                    <tr key={r.comp} className="border-t border-divider-subtle">
                      <td className="py-2.5 px-3 font-medium text-content-primary">{r.comp}</td>
                      <td className="py-2.5 px-3"><code className="text-[11px] bg-primary/10 text-primary px-1.5 py-0.5 rounded">{r.usage}</code></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Section>

          {/* 12. 차트 */}
          <Section tab="code" id="charts" title="차트 팔레트">
            <div className="flex gap-3 items-end">
              {[
                { name: "chart-1", note: "1순위 · 주지표" },
                { name: "chart-2", note: "2순위" },
                { name: "chart-3", note: "3순위" },
                { name: "chart-4", note: "4순위" },
                { name: "chart-5", note: "5순위 · 보조지표" },
              ].map((c, i) => (
                <div key={c.name} className="flex flex-col items-center gap-1.5 flex-1">
                  <div
                    className={`w-full rounded-md bg-[var(--${c.name})]`}
                    style={{ height: `${56 - i * 4}px` }}
                  />
                  <code className="text-[10px] text-primary text-center">{c.name}</code>
                  <p className="text-[10px] text-content-assistive text-center">{c.note}</p>
                </div>
              ))}
            </div>
            <p className="text-[11px] text-content-assistive">
              Area 차트 3선: chart-1(시도율) / chart-3(성공율) / chart-5(유효율) ·
              바 차트: chart-1 → chart-5 순서
            </p>
          </Section>

          {/* 13. 레이아웃 */}
          <Section tab="patterns" id="layout" title="레이아웃 패턴">
            {[
              {
                title: "패턴 1 — BusinessTree + 필터[별도] + 테이블",
                pages: "/completed · /db/assigned · /db/unassigned · /management/* · /organization/*",
                code: `<div className="flex gap-3 px-6 pb-15 items-start">
  <BusinessTree />
  <div className="flex-1 min-w-0">
    <div className="mb-4"><XxxFilter /></div>
    <XxxTable />
  </div>
</div>`,
                sketch: (
                  <div className="bg-canvas-tertiary rounded-md border border-line-subtle p-2 flex gap-2 h-28">
                    <div className="w-16 bg-fill-subtle rounded border border-line-subtle flex items-center justify-center shrink-0">
                      <p className="text-[9px] text-content-assistive font-medium">Tree</p>
                    </div>
                    <div className="flex-1 flex flex-col gap-1.5">
                      <div className="h-7 bg-canvas-primary rounded border border-line-subtle flex items-center px-2">
                        <p className="text-[9px] text-content-assistive">필터 (mb-4)</p>
                      </div>
                      <div className="flex-1 bg-canvas-primary rounded border border-line-subtle flex items-center px-2">
                        <p className="text-[9px] text-content-assistive">테이블</p>
                      </div>
                    </div>
                  </div>
                ),
              },
              {
                title: "패턴 2 — BusinessTree + 카드들",
                pages: "/ (홈) · /pending",
                code: `<div className="flex gap-3 px-6 pb-15 items-start">
  <BusinessTree />
  <div className="flex-1 min-w-0 flex flex-col gap-4">
    {/* 카드들 */}
  </div>
</div>`,
                sketch: (
                  <div className="bg-canvas-tertiary rounded-md border border-line-subtle p-2 flex gap-2 h-28">
                    <div className="w-16 bg-fill-subtle rounded border border-line-subtle flex items-center justify-center shrink-0">
                      <p className="text-[9px] text-content-assistive font-medium">Tree</p>
                    </div>
                    <div className="flex-1 flex flex-col gap-1.5">
                      <div className="flex-1 bg-canvas-primary rounded border border-line-subtle flex items-center px-2">
                        <p className="text-[9px] text-content-assistive">카드 1 (KPI/필터 내장)</p>
                      </div>
                      <div className="flex-1 bg-canvas-primary rounded border border-line-subtle flex items-center px-2">
                        <p className="text-[9px] text-content-assistive">카드 2</p>
                      </div>
                    </div>
                  </div>
                ),
              },
              {
                title: "패턴 3 — BusinessTree 없음 (전체 너비)",
                pages: "/db/status · 설정 페이지 (/settings/*)",
                code: `<div className="px-6 pb-15">
  <XxxTable />
</div>`,
                sketch: (
                  <div className="bg-canvas-tertiary rounded-md border border-line-subtle p-2 h-20">
                    <div className="h-full bg-canvas-primary rounded border border-line-subtle flex items-center px-2">
                      <p className="text-[9px] text-content-assistive">테이블 또는 설정 카드 (전체 너비)</p>
                    </div>
                  </div>
                ),
              },
            ].map(p => (
              <div key={p.title}>
                <SubLabel note={p.pages}>{p.title}</SubLabel>
                <div className="grid grid-cols-2 gap-3">
                  {p.sketch}
                  <div className="rounded-lg border border-line-subtle bg-canvas-primary p-3 overflow-x-auto">
                    <pre className="text-[10px] text-content-tertiary font-mono leading-relaxed">{p.code}</pre>
                  </div>
                </div>
              </div>
            ))}
          </Section>

          {/* 14. shadcn 현황 */}
          <Section
            tab="code"
            id="shadcn"
            title="shadcn 컴포넌트 현황"
          >
            <div>
              <SubLabel note={`${SHADCN_USED.length}개 · CLAUDE.md 기준`}>설치됨 (사용 중 / 설치 유지)</SubLabel>
              <div className="grid grid-cols-3 gap-2">
                {SHADCN_USED.map(c => (
                  <div
                    key={c.name}
                    className={`flex items-center justify-between rounded-lg border px-3 py-2 ${
                      c.note === "설치됨 (미사용)"
                        ? "border-line-subtle bg-fill-subtle"
                        : "border-line-subtle bg-canvas-primary"
                    }`}
                  >
                    <div>
                      <code className="text-[12px] font-medium text-content-primary">{c.name}</code>
                      <p className="text-[10px] text-content-assistive mt-0.5">{c.note}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <SubLabel note={`${SHADCN_REMOVED.length}개 · npx shadcn@latest add [name] 으로 재추가`}>제거됨 (필요 시 재설치)</SubLabel>
              <div className="flex flex-wrap gap-1.5">
                {SHADCN_REMOVED.map(name => (
                  <code
                    key={name}
                    className="text-[11px] text-content-assistive bg-fill-normal rounded-md px-2 py-1"
                  >
                    {name}
                  </code>
                ))}
              </div>
            </div>

            <div className="rounded-lg border border-line-subtle bg-fill-subtle p-4">
              <p className="text-[12px] font-semibold text-content-primary mb-1">새 컴포넌트 추가 후 필수 작업</p>
              <code className="text-[12px] text-content-secondary font-mono">npx shadcn@latest add [component]</code>
              <div className="mt-3 flex flex-col gap-1">
                {[
                  "bg-canvas-primary → bg-primary (액션 버튼 색상)",
                  "bg-primary → bg-muted (서브틀 hover)",
                  "font-bold → font-semibold",
                  "rounded-xl → rounded-lg",
                  "dark:* 클래스 전부 제거",
                  "data-[state=checked]:bg-canvas-primary → data-[state=checked]:bg-primary",
                ].map(step => (
                  <div key={step} className="flex items-center gap-2 text-[11px] text-content-secondary">
                    <span className="text-primary">→</span>
                    {step}
                  </div>
                ))}
              </div>
            </div>
          </Section>

        </div>
      </div>
    </div>
  )
}
