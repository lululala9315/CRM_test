"use client"

/**
 * 역할: 디자인 시스템 가이드 — 개발팀 공유용 라이브 스타일 가이드
 * 주요 기능: 색상(Atomic+Semantic) / 타이포 / 라운드 / 버튼 / 배지 / 테이블 / 레이아웃
 * 의존성: globals.css 토큰, shadcn 컴포넌트, SearchFilter
 */

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
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
  Search, Copy, Check, User, Menu,
} from "lucide-react"

// ── Semantic Color 데이터 (CodeIt 스타일 테이블 레이아웃용) ──────────────
type ColorEntry = {
  token: string        // Tailwind 클래스명 (복사 대상)
  cssVar: string       // CSS 변수 이름 (swatch 렌더링용)
  hex: string          // hex 값 또는 참조 표기
  desc: string         // 용도 설명
  kind?: "bg" | "text" | "border"
  subtle?: boolean     // 밝은 bg swatch에 테두리 추가
}
type SemanticGroup = { group: string; entries: ColorEntry[] }

const SEMANTIC_COLORS: SemanticGroup[] = [
  {
    group: "Background",
    entries: [
      { token: "bg-canvas-primary",    cssVar: "bg-primary",    hex: "#ffffff", desc: "카드·모달 배경",        subtle: true },
      { token: "bg-canvas-secondary",  cssVar: "bg-secondary",  hex: "#f9fafb", desc: "hover 미세 배경",        subtle: true },
      { token: "bg-canvas-secondary",   cssVar: "bg-tertiary",   hex: "#f2f4f6", desc: "페이지 기본 배경",       subtle: true },
      { token: "bg-canvas-quaternary", cssVar: "bg-subtle",     hex: "#eceef1", desc: "구분·홀수행·섹션 구분",  subtle: true },
    ],
  },
  {
    group: "Fill",
    entries: [
      { token: "bg-fill-subtle",  cssVar: "fill-subtle",  hex: "#f2f4f6", desc: "테이블 헤더·서브행",    subtle: true },
      { token: "bg-fill-normal",  cssVar: "fill-normal",  hex: "#eceef1", desc: "hover 배경",             subtle: true },
      { token: "bg-fill-hover",   cssVar: "fill-hover",   hex: "#dbdfe3", desc: "pressed 상태",           subtle: true },
      { token: "bg-fill-filter",  cssVar: "fill-filter",  hex: "#ffffff", desc: "필터 컨트롤 (페이지 배경 위 대비용)", subtle: true },
      { token: "bg-fill-muted",   cssVar: "fill-muted",   hex: "#f9fafb", desc: "테이블 행 hover",        subtle: true },
    ],
  },
  {
    group: "Text",
    entries: [
      { token: "text-content-primary",    cssVar: "text-primary",    hex: "#191f28", desc: "제목·강조 텍스트",   kind: "text" },
      { token: "text-content-secondary",  cssVar: "text-secondary",  hex: "#333d4b", desc: "본문 텍스트",        kind: "text" },
      { token: "text-content-tertiary",   cssVar: "text-tertiary",   hex: "#4e5968", desc: "서브텍스트·설명",    kind: "text" },
      { token: "text-content-quaternary", cssVar: "text-quaternary", hex: "#6b7684", desc: "보조 정보",          kind: "text" },
      { token: "text-content-assistive",  cssVar: "text-assistive",  hex: "#8b95a1", desc: "placeholder·힌트",  kind: "text" },
      { token: "text-content-disabled",   cssVar: "text-disabled",   hex: "#b0b8c1", desc: "비활성 텍스트",      kind: "text" },
      { token: "text-inverse-primary",    cssVar: "common-100",      hex: "#ffffff", desc: "브랜드 버튼 위 흰 글자", kind: "text" },
    ],
  },
  {
    group: "Brand",
    entries: [
      { token: "bg-primary",              cssVar: "primary",              hex: "#3182f6", desc: "메인 액션 버튼·강조 배경" },
      { token: "text-primary",            cssVar: "primary",              hex: "#3182f6", desc: "링크·브랜드 텍스트·아이콘", kind: "text" },
      { token: "bg-primary-subtle",       cssVar: "primary-subtle",       hex: "#e8f3ff", desc: "사이드바·트리 선택 배경 (blue-50)", subtle: true },
      { token: "bg-primary-subtle-hover", cssVar: "primary-subtle-hover", hex: "#d8eaff", desc: "선택 항목 hover (blue-75)", subtle: true },
      { token: "bg-blue-tint",            cssVar: "blue-50",              hex: "#e8f3ff", desc: "테이블 선택 행·info 박스",  subtle: true },
    ],
  },
  {
    group: "Border",
    entries: [
      { token: "border-subtle", cssVar: "border-subtle", hex: "#e5e8eb", desc: "카드·컨테이너 기본 보더", kind: "border" },
      { token: "border-border",      cssVar: "border",        hex: "#d1d6db", desc: "shadcn 호환 보더",         kind: "border" },
      { token: "border-primary",     cssVar: "primary",       hex: "#3182f6", desc: "선택·포커스 상태 보더",    kind: "border" },
    ],
  },
  {
    group: "Alpha (overlay · divider)",
    entries: [
      { token: "bg-alpha-black-02", cssVar: "alpha-black-02", hex: "rgba 2%",  desc: "테이블 행 hover (가장 미세)",    subtle: true },
      { token: "bg-alpha-black-05", cssVar: "alpha-black-05", hex: "rgba 5%",  desc: "사이드바 메뉴 hover · expanded", subtle: true },
      { token: "bg-alpha-black-10", cssVar: "alpha-black-10", hex: "rgba 10%", desc: "팝오버 backdrop" },
      { token: "bg-alpha-black-18", cssVar: "alpha-black-18", hex: "rgba 18%", desc: "모달 backdrop (옅은)" },
      { token: "bg-divider-subtle", cssVar: "divider-subtle", hex: "alpha-blue 4%", desc: "카드 내 구분선 (가장 약)",  subtle: true },
      { token: "bg-divider-normal", cssVar: "divider-normal", hex: "alpha-blue 8%", desc: "일반 구분선 · 강조 라인",   subtle: true },
      { token: "border-divider-subtle", cssVar: "divider-subtle", hex: "alpha-blue 4%", desc: "테이블 셀 가로 보더 (행 라인)", kind: "border" },
      { token: "border-divider-normal", cssVar: "divider-normal", hex: "alpha-blue 8%", desc: "구분선 보더 (강조 필요시)", kind: "border" },
    ],
  },
  {
    group: "Status",
    entries: [
      { token: "bg-success",      cssVar: "success",     hex: "#03b26c", desc: "성공 Solid (버튼·아이콘)" },
      { token: "bg-warning",      cssVar: "warning",     hex: "#f59e0b", desc: "경고 Solid (버튼·아이콘)" },
      { token: "bg-destructive",  cssVar: "destructive", hex: "#f04452", desc: "오류·삭제 Solid" },
      { token: "bg-green-tint",   cssVar: "green-50",    hex: "#f0faf6", desc: "성공 Tint 배경 (배지·태그)",   subtle: true },
      { token: "text-green-tint", cssVar: "green-450",   hex: "#0cbb75", desc: "성공 Tint 텍스트",             kind: "text" },
      { token: "bg-amber-tint",   cssVar: "amber-50",    hex: "#fffbeb", desc: "경고 Tint 배경 (배지·태그)",   subtle: true },
      { token: "text-amber-tint", cssVar: "amber-700",   hex: "#b45309", desc: "경고 Tint 텍스트",             kind: "text" },
      { token: "bg-red-tint",     cssVar: "red-50",      hex: "#ffeeee", desc: "오류 Tint 배경 (배지·태그)",   subtle: true },
      { token: "text-red-tint",   cssVar: "red-600",     hex: "#e42939", desc: "오류 Tint 텍스트",             kind: "text" },
      { token: "text-blue-tint",  cssVar: "blue-700",    hex: "#1b64da", desc: "정보 Tint 텍스트 (info 배지)", kind: "text" },
    ],
  },
]

// ── Chart (Code 탭용) ──────────────────────────────────────────────────────
const CHART_COLORS = [
  { name: "chart-1", hex: "#3182f6",  note: "blue-500 · 주지표" },
  { name: "chart-2", hex: "violet-500", note: "2순위" },
  { name: "chart-3", hex: "violet-550", note: "3순위" },
  { name: "chart-4", hex: "violet-600", note: "4순위" },
  { name: "chart-5", hex: "violet-650", note: "보조지표" },
]

// ── 색상 팔레트 전체 스케일 ───────────────────────────────────────────────
const PALETTE_FAMILIES = [
  {
    name: "Cool Neutral",
    family: "cool-neutral",
    steps: [50,100,150,200,250,300,350,400,450,500,550,600,650,700,750,800,850,900,950],
    semantic: { 50:"canvas-secondary", 100:"canvas-tertiary", 150:"canvas-quaternary", 200:"line-subtle", 250:"fill-hover", 300:"border", 400:"text-disabled", 600:"text-assistive", 700:"text-quaternary", 800:"text-tertiary", 900:"text-secondary" } as Record<number,string>,
  },
  {
    name: "Blue",
    family: "blue",
    steps: [50,75,100,150,200,250,300,350,400,450,500,550,600,650,700,750,800,850,900,950],
    semantic: { 50:"blue-tint / primary-subtle", 75:"primary-subtle-hover", 350:"ring", 500:"primary / chart-1", 700:"text-blue-tint" } as Record<number,string>,
  },
  {
    name: "Violet",
    family: "violet",
    steps: [50,100,150,200,250,300,350,400,450,500,550,600,650,700,750,800,850,900,950],
    semantic: { 500:"chart-2", 550:"chart-3", 600:"chart-4", 650:"chart-5" } as Record<number,string>,
  },
  {
    name: "Red",
    family: "red",
    steps: [50,100,150,200,250,300,350,400,450,500,550,600,650,700,750,800,850],
    semantic: { 50:"red-tint", 500:"destructive", 600:"text-red-tint" } as Record<number,string>,
  },
  {
    name: "Green",
    family: "green",
    steps: [50,100,150,200,250,300,350,400,450,500,550,600,650,700,750,800,850],
    semantic: { 50:"green-tint", 400:"success-fg", 500:"success" } as Record<number,string>,
  },
  {
    name: "Amber",
    family: "amber",
    steps: [50,100,150,200,250,300,350,400,450,500,550,600,650,700,750,800,850],
    semantic: { 50:"amber-tint", 500:"warning", 700:"text-amber-tint" } as Record<number,string>,
  },
  // Alpha 토큰은 atomic 색상이 아닌 의미 기반 (overlay/divider/selected) → Semantic 섹션에서 노출
]

// ── 라운드 ────────────────────────────────────────────────────────────────
// Tailwind 네이티브 표준 사용. r-토큰(rounded-r4 등)은 폐기 (사용처 미미).
const RADIUS_REFERENCE = [
  { cls: "rounded-sm",   px: 2    },
  { cls: "rounded",      px: 4    },
  { cls: "rounded-md",   px: 6    },
  { cls: "rounded-lg",   px: 8    },
  { cls: "rounded-full", px: 9999 },
]

const RADIUS_RULES = [
  { level: "카드 · 컨테이너",          cls: "rounded-lg",   note: "8px — 가장 많이 사용" },
  { level: "버튼 (default/sm)",         cls: "rounded-lg",   note: "8px" },
  { level: "필터 컨트롤 · 작은 버튼",   cls: "rounded-md",   note: "6px — h-8/h-6 컨트롤" },
  { level: "체크박스 · 미세 라운드",    cls: "rounded-sm",   note: "2px" },
  { level: "pill · 원형 (avatar/dot)",  cls: "rounded-full", note: "9999px" },
  { level: "❌ 금지",                   cls: "rounded-xl",   note: "12px+ 라운드 사용 금지" },
]

// ── 스페이싱 ──────────────────────────────────────────────────────────────
// Tailwind 네이티브 4px 그리드 단일 사용. s-토큰은 폐기 (사실상 미사용 + 동일 px값).
// 표는 px 값 중심: prefix(p/m/gap/px/pt 등)는 상황에 따라 자유 조합.
const SPACING_SCALE = [
  { px: 4,  key: "1",  usage: "아이콘 ↔ 텍스트 인라인 간격" },
  { px: 8,  key: "2",  usage: "타이트한 인라인 gap" },
  { px: 12, key: "3",  usage: "배지 padding · BusinessTree ↔ 본문 gap" },
  { px: 16, key: "4",  usage: "카드 간 gap · 필터 ↔ 테이블 mb" },
  { px: 20, key: "5",  usage: "카드 내부 세로 패딩 (py)" },
  { px: 24, key: "6",  usage: "페이지·카드 수평 패딩 (px)" },
  { px: 32, key: "8",  usage: "섹션 간 gap" },
  { px: 40, key: "10", usage: "페이지 타이틀 상단 패딩 (pt)" },
  { px: 60, key: "15", usage: "콘텐츠 하단 패딩 (pb-15)" },
]

// ── 버튼 ──────────────────────────────────────────────────────────────────
// 6 variants — 모두 실제 사용 중
const BUTTON_VARIANTS = [
  { label: "primary",     variant: "primary" as const,     desc: "메인 액션 — 저장 / 재배정 / 확인" },
  { label: "secondary",   variant: "secondary" as const,   desc: "보조 액션 — 필터 검색 (서브틀 브랜드)" },
  { label: "outline",     variant: "outline" as const,     desc: "약한 강조 — 취소 / 보조 옵션" },
  { label: "ghost",       variant: "ghost" as const,       desc: "투명 — 페이지네이션 / 아이콘 트리거" },
  { label: "neutral",     variant: "neutral" as const,     desc: "중립 액션 — 작업 영역 토글" },
  { label: "destructive", variant: "destructive" as const, desc: "위험 액션 — 삭제 / 회수" },
]

// 3 sizes — user 코드에서 사용
const BUTTON_SIZES = [
  { size: "xs" as const,      h: "h-6 · 11px",    usage: "테이블 인라인 (승인/거절)" },
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
type TabId = "foundations" | "guide" | "components" | "patterns" | "code"
type TabSubSection = { id: string; label: string }
type TabSection = { id: string; label: string; sub?: TabSubSection[] }
type Tab = { id: TabId; label: string; desc: string; sections: TabSection[] }

const TABS: Tab[] = [
  {
    id: "foundations",
    label: "기초",
    desc: "디자인 토큰",
    sections: [
      {
        id: "colors", label: "색상",
        sub: [
          { id: "colors-palette",  label: "Atomic 팔레트" },
          { id: "colors-semantic", label: "Semantic 토큰" },
        ],
      },
      {
        id: "typography", label: "타이포그래피",
        sub: [
          { id: "typography-atomic",    label: "Atomic 토큰" },
          { id: "typography-composite", label: "Semantic 타이포" },
        ],
      },
      { id: "radius",  label: "라운드" },
      { id: "border",  label: "보더" },
      { id: "shadow",  label: "그림자" },
      { id: "spacing", label: "스페이싱" },
    ],
  },
  {
    id: "guide",
    label: "가이드",
    desc: "토큰 사용 규칙 + 매핑",
    sections: [
      { id: "decision-tree", label: "토큰 선택 가이드" },
      { id: "naming",        label: "네이밍 규칙" },
      { id: "tailwind-map",  label: "Tailwind 매핑표" },
      { id: "brand",         label: "브랜드 커스터마이징" },
    ],
  },
  {
    id: "components",
    label: "컴포넌트",
    desc: "단일 UI 요소",
    sections: [
      { id: "navigation", label: "내비게이션" },
      { id: "buttons",    label: "버튼" },
      { id: "badges",     label: "배지" },
      { id: "filters",    label: "필터 컨트롤" },
      { id: "cards",      label: "카드" },
      { id: "pagination", label: "페이지네이션" },
    ],
  },
  {
    id: "patterns",
    label: "패턴",
    desc: "조합 패턴",
    sections: [
      { id: "tables", label: "테이블" },
      { id: "layout", label: "레이아웃" },
    ],
  },
  {
    id: "code",
    label: "코드",
    desc: "구현 참조",
    sections: [
      { id: "charts", label: "차트 팔레트" },
      { id: "shadcn", label: "shadcn 현황" },
    ],
  },
]


// ── 섹션 래퍼 — 가독성 ↑ (h3 타이틀 + 충분한 여백) ─────────────────────────
function Section({ id, title, desc, children, tab }: {
  id: string; title: string; desc?: string; children: React.ReactNode; tab: TabId
}) {
  return (
    <section id={id} data-tab={tab} className="scroll-mt-24">
      <div className="mb-s32 pb-s20 border-b border-subtle">
        <h2 className="text-h2-bold tracking-tight text-content-primary [text-wrap:balance]">{title}</h2>
        {desc && <p className="text-body3-normal text-content-tertiary mt-s8 leading-relaxed [text-wrap:pretty]">{desc}</p>}
      </div>
      <div className="flex flex-col gap-s48">{children}</div>
    </section>
  )
}

// ── 서브 레이블 — 명확한 섹션 헤더 (h5 사이즈) ───────────────────────────
function SubLabel({ children, note }: { children: React.ReactNode; note?: string }) {
  return (
    <div className="flex flex-col gap-s6 mb-s16">
      <p className="text-h5-bold text-content-primary tracking-tight [text-wrap:balance]">{children}</p>
      {note && <span className="text-body4-normal text-content-tertiary leading-relaxed">{note}</span>}
    </div>
  )
}

// ── shadcn 출처 표시 — 어떤 shadcn 컴포넌트를 썼는지 + 공식 문서 링크 ────────
function ShadcnRef({ components, sourceFile }: { components: string[]; sourceFile?: string }) {
  return (
    <div className="flex flex-wrap items-center gap-s8 mb-s12 px-s12 py-s8 rounded-md bg-canvas-quaternary border border-subtle">
      <span className="text-body5-bold text-content-tertiary">shadcn:</span>
      {components.map(c => (
        <a
          key={c}
          href={`https://ui.shadcn.com/docs/components/${c}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-body5-medium text-primary hover:underline underline-offset-2 decoration-primary"
        >
          {c} ↗
        </a>
      ))}
      {sourceFile && (
        <>
          <span className="text-content-disabled">·</span>
          <code className="text-body5-normal text-content-assistive font-mono">{sourceFile}</code>
        </>
      )}
    </div>
  )
}

// ── Semantic Color Row ────────────────────────────────────────────────────
function SemanticRow({ token, cssVar, hex, desc, kind = "bg", subtle }: ColorEntry) {
  const [copied, setCopied] = useState(false)
  const copy = () => {
    navigator.clipboard.writeText(token)
    setCopied(true)
    setTimeout(() => setCopied(false), 1200)
  }

  const swatch = kind === "text" ? (
    <div className="h-12 w-16 rounded-md shrink-0 bg-canvas-primary border border-subtle grid place-items-center">
      <span style={{ color: `var(--${cssVar})`, fontWeight: 700, fontSize: 20, lineHeight: 1 }}>Aa</span>
    </div>
  ) : kind === "border" ? (
    <div className="h-12 w-16 rounded-md shrink-0 bg-canvas-primary" style={{ border: `3px solid var(--${cssVar})` }} />
  ) : (
    <div
      className={`h-12 w-16 rounded-md shrink-0 ${subtle ? "border border-subtle" : ""}`}
      style={{ backgroundColor: `var(--${cssVar})` }}
    />
  )

  return (
    <button
      onClick={copy}
      className="group flex items-center gap-4 px-4 py-3 hover:bg-alpha-black-05 active:scale-[0.99] transition-[background-color,transform] duration-100 text-left w-full"
    >
      {swatch}
      {/* 토큰 정보 — 2줄 구조: 1줄 토큰명 / 2줄 cssVar · hex · 설명 */}
      <div className="flex flex-col min-w-0 flex-1 gap-1">
        <code className="text-body4-bold text-content-primary leading-none">{token}</code>
        <div className="flex items-center gap-2 min-w-0">
          <code className="text-[11px] text-content-disabled font-mono leading-none shrink-0">--{cssVar}</code>
          <span className="text-content-disabled leading-none shrink-0">·</span>
          <code className="text-[11px] font-mono text-content-tertiary leading-none shrink-0">{hex}</code>
          <span className="text-content-disabled leading-none shrink-0">·</span>
          <span className="text-[12px] text-content-tertiary leading-none min-w-0 truncate">{desc}</span>
        </div>
      </div>
      {/* Copy 항상 노출 */}
      {copied
        ? <Check className="h-4 w-4 text-primary shrink-0" />
        : <Copy className="h-4 w-4 text-content-disabled opacity-40 group-hover:opacity-100 transition-opacity shrink-0" />
      }
    </button>
  )
}

// ── Semantic Section (그룹 래퍼) ──────────────────────────────────────────
function SemanticSection({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="bg-canvas-primary rounded-lg border-border05 border-subtle overflow-hidden">
      {/* 그룹 레이블 — 좌측 4px 컬러 바 + 텍스트 */}
      <div className="flex items-center gap-3 px-4 py-2.5 border-b border-subtle bg-canvas-quaternary">
        <p className="text-[12px] font-semibold text-content-secondary tracking-tight">{label}</p>
      </div>
      <div className="divide-y divide-divider-subtle">
        {children}
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
          <span className="text-body5-normal text-content-assistive tabular-nums">총 143건</span>
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
    <div className="flex items-center gap-4 px-4 py-3 border-b border-divider-subtle last:border-b-0">
      <div className="w-56 shrink-0">
        <div className="flex items-center gap-1.5 mb-0.5">
          <code className="text-[11px] font-semibold text-primary bg-primary-subtle px-1.5 py-0.5 rounded leading-none">{token}</code>
          {tag === "underline" && (
            <span className="text-[9px] bg-fill-normal text-content-tertiary rounded px-1 py-px leading-none font-medium">underline</span>
          )}
          {tag === "reading" && (
            <span className="text-[9px] bg-fill-normal text-content-tertiary rounded px-1 py-px leading-none font-medium">reading</span>
          )}
        </div>
        <p className="text-[10px] text-content-disabled tabular-nums mt-0.5">{size} / {wLabel} / lh {lh} / ls {ls}</p>
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

// ── 색상 팔레트 스트립 ────────────────────────────────────────────────────
// 클릭하면 CSS 변수명 복사. semantic 연결 스텝은 step 숫자를 파란색으로 표시.
function ColorPalette({ name, family, steps, semantic }: {
  name: string; family: string; steps: number[]
  semantic?: Record<number, string>
}) {
  const [copiedVar, setCopiedVar] = useState<string | null>(null)

  const handleCopy = (cssVar: string) => {
    navigator.clipboard.writeText(cssVar)
    setCopiedVar(cssVar)
    setTimeout(() => setCopiedVar(null), 1200)
  }

  return (
    <div className="flex flex-col gap-1.5">
      <p className="text-[11px] font-semibold text-content-secondary tracking-tight">{name}</p>
      <div className="flex gap-px">
        {steps.map((step, i) => {
          const label = semantic?.[step]
          const isFirst = i === 0
          const isLast = i === steps.length - 1
          // alpha-* 토큰은 step을 zero-pad (alpha-black-02 등)
          const stepStr = family.startsWith("alpha-") ? String(step).padStart(2, "0") : String(step)
          const cssVar = `--${family}-${stepStr}`
          const isCopied = copiedVar === cssVar
          return (
            <button
              key={step}
              className="flex-1 flex flex-col gap-1 group active:scale-[0.96] transition-transform duration-100"
              onClick={() => handleCopy(cssVar)}
              title={label ? `${cssVar}\n→ ${label}\n클릭하면 복사` : `${cssVar}\n클릭하면 복사`}
            >
              <div
                className={cn(
                  "h-20 relative",
                  isFirst && "rounded-l-md",
                  isLast && "rounded-r-md",
                  // alpha 토큰: 흰색 배경 위에 알파 색상 → 실제 사용 컨텍스트와 가까움
                  family.startsWith("alpha-") && "bg-canvas-primary"
                )}
                style={{ backgroundColor: family.startsWith("alpha-") ? undefined : `var(--${family}-${stepStr})` }}
              >
                {family.startsWith("alpha-") && (
                  <div className="absolute inset-0" style={{ backgroundColor: `var(--${family}-${stepStr})` }} />
                )}
                {/* 복사 완료 오버레이 */}
                {isCopied && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/25 rounded-[inherit]">
                    <Check className="h-3 w-3 text-white drop-shadow" />
                  </div>
                )}
              </div>
              <p
                className={`text-caption tabular-nums text-center ${label ? "text-primary font-semibold" : "text-content-disabled"}`}
              >
                {step}
              </p>
            </button>
          )
        })}
      </div>
      <p className="text-[10px] text-content-disabled mt-1">클릭하면 CSS 변수명 복사 (예: --{family}-500) · 파란 숫자 = 시맨틱 토큰 연결</p>
    </div>
  )
}

// ── DS Migration 테이블 ────────────────────────────────────────────────────
// shadcn 원본 토큰 → 이 프로젝트 토큰 매핑을 시각화
function MigrationTable({ rows }: {
  rows: { from: string; to: string; reason: string }[]
}) {
  return (
    <div className="rounded-lg border-border05 border-subtle bg-canvas-primary overflow-hidden">
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
                <code className="text-[10px] bg-primary-subtle text-primary px-1 py-0.5 rounded">{r.to}</code>
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

  // 현재 탭의 섹션 + 서브섹션 모두 IntersectionObserver 추적
  useEffect(() => {
    const currentSections = TABS.find(t => t.id === activeTab)?.sections ?? []
    if (currentSections.length === 0) return

    const allIds = currentSections.flatMap(s => [s.id, ...(s.sub?.map(sub => sub.id) ?? [])])

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActiveId(entry.target.id)
        }
      },
      { rootMargin: "-20% 0% -60% 0%", threshold: 0 }
    )
    allIds.forEach(id => {
      const el = document.getElementById(id)
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
    <div className="h-full overflow-y-auto overflow-x-hidden bg-canvas-secondary scrollbar-hide">
      {/* 타이틀 */}
      <div className="px-6 pt-10 pb-4">
        <h1 className="text-[28px] font-semibold tracking-tight leading-tight text-content-primary [text-wrap:balance]">
          디자인 시스템
        </h1>
        <p className="text-[14px] text-content-assistive mt-2">Semantic Sync 토큰 (Figma 1:1 + shadcn 표준 호환)</p>
      </div>

      {/* 탭 네비게이션 — sticky */}
      <div className="sticky top-0 z-20 bg-canvas-secondary/95 backdrop-blur-sm border-b border-subtle">
        <div className="px-6 flex items-end gap-1">
          {TABS.map(t => (
            <button
              key={t.id}
              onClick={() => handleTabChange(t.id)}
              className={`px-4 pt-3 pb-2.5 -mb-px border-b-2 active:scale-[0.97] transition-[border-color,color,background-color,transform] duration-150 ${
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

        {/* 사이드 nav — 현재 탭의 섹션 + 서브섹션 */}
        <aside className="w-[180px] shrink-0 sticky top-24 self-start">
          <p className="text-[10px] font-semibold text-content-disabled uppercase tracking-wider mb-2">{currentTab.label}</p>
          <nav className="flex flex-col gap-px">
            {currentTab.sections.map((item) => {
              const isParentActive = activeId === item.id || item.sub?.some(s => s.id === activeId)
              return (
                <div key={item.id}>
                  {/* 섹션 상위 항목 — 활성 시 좌측 vertical bar + bg + bold */}
                  <a
                    href={`#${item.id}`}
                    className={`relative flex items-center text-[13px] rounded-md pl-3 pr-2 py-1.5 transition-colors duration-120 ${
                      isParentActive
                        ? "text-primary font-semibold bg-primary-subtle"
                        : "text-content-tertiary font-medium hover:text-content-primary hover:bg-alpha-black-05"
                    }`}
                  >
                    {isParentActive && (
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 rounded-full bg-primary" />
                    )}
                    {item.label}
                  </a>
                  {/* 서브섹션 — 활성 부모일 때만 표시 */}
                  {item.sub && isParentActive && (
                    <div className="ml-3 mt-0.5 mb-1 pl-2 border-l border-subtle flex flex-col gap-px">
                      {item.sub.map(sub => (
                        <a
                          key={sub.id}
                          href={`#${sub.id}`}
                          className={`text-[11px] rounded px-1.5 py-1 transition-colors duration-120 ${
                            activeId === sub.id
                              ? "text-primary font-semibold bg-primary-subtle"
                              : "text-content-assistive hover:text-content-primary hover:bg-alpha-black-05"
                          }`}
                        >
                          {sub.label}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </nav>
        </aside>

        {/* 본문 — 현재 탭만 보이게 (CSS는 globals.css 하단 .ds-tab-container 룰 참고) */}
        <div className="ds-tab-container flex-1 min-w-0 max-w-[1280px] flex flex-col gap-s64" data-active-tab={activeTab}>

          {/* 색상 — 팔레트 + Semantic 통합 */}
          <Section
            tab="foundations"
            id="colors"
            title="색상"
            desc="Atomic 팔레트(전체 스케일) → Semantic 토큰(컴포넌트 실사용) 2단계 구조. 파란 숫자 = Semantic 연결 스텝."
          >
            {/* Atomic Palette 스트립 — 카드 없이 직접 노출 */}
            <div id="colors-palette" className="scroll-mt-24 flex flex-col gap-4">
              <SubLabel note="컴포넌트에서 직접 사용 금지 — 시맨틱 토큰을 통해서만 참조">전체 팔레트</SubLabel>
              {PALETTE_FAMILIES.map(f => (
                <ColorPalette key={f.family} name={f.name} family={f.family} steps={f.steps} semantic={f.semantic} />
              ))}
            </div>

            {/* Semantic Colors */}
            <div id="colors-semantic" className="scroll-mt-24">
              <SubLabel note="클릭하면 Tailwind 클래스명 복사">시맨틱 토큰</SubLabel>
              {/* 컬럼 헤더 — 새 SemanticRow 구조 (3 영역) */}
              <div className="flex items-center gap-4 px-4 py-3 mb-2 rounded-lg border-border05 border-subtle bg-canvas-quaternary">
                <div className="h-12 w-16 rounded-md bg-primary shrink-0" />
                <div className="flex flex-col flex-1 gap-1 min-w-0">
                  <code className="text-body4-bold text-content-primary leading-none">bg-primary</code>
                  <div className="flex items-center gap-2">
                    <code className="text-[11px] text-content-disabled font-mono leading-none">--primary</code>
                    <span className="text-content-disabled leading-none">·</span>
                    <code className="text-[11px] font-mono text-content-tertiary leading-none">#3182f6</code>
                    <span className="text-content-disabled leading-none">·</span>
                    <span className="text-[12px] text-content-tertiary leading-none">메인 액션 버튼 · 강조 배경</span>
                  </div>
                </div>
                <Copy className="h-4 w-4 text-content-disabled shrink-0" />
              </div>
              <p className="text-[11px] text-content-assistive mb-2 px-1">↑ 컬럼 구조 예시 (실제 토큰 카드 구조와 동일) · 토큰 카드 클릭 시 클래스명 복사</p>
              <div className="flex flex-col gap-2">
                {SEMANTIC_COLORS.map(group => (
                  <SemanticSection key={group.group} label={group.group}>
                    {group.entries.map(e => <SemanticRow key={e.token + e.cssVar} {...e} />)}
                  </SemanticSection>
                ))}
              </div>
            </div>
          </Section>

          {/* 03. 타이포그래피 */}
          <Section
            tab="foundations"
            id="typography"
            title="타이포그래피"
          >
            {/* Atomic Tokens — Font Size / Weight / Tracking / Leading */}
            <div id="typography-atomic" className="scroll-mt-24 flex flex-col gap-6">

              {/* Font Size */}
              <div>
                <SubLabel note="Tailwind: font-size-10 ~ font-size-36">font-size</SubLabel>
                <div className="rounded-lg border-border05 border-subtle bg-canvas-primary overflow-hidden">
                  {/* 컬럼 헤더 */}
                  <div className="flex items-center gap-4 px-4 py-2 border-b border-subtle bg-canvas-quaternary">
                    <span className="text-[11px] font-semibold text-content-tertiary tracking-tight w-24 shrink-0">미리보기</span>
                    <span className="text-[11px] font-semibold text-content-tertiary tracking-tight w-52 shrink-0">클래스</span>
                    <span className="text-[11px] font-semibold text-content-tertiary tracking-tight w-10 shrink-0">px</span>
                    <span className="text-[11px] font-semibold text-content-tertiary tracking-tight flex-1">용도</span>
                  </div>
                  <div className="divide-y divide-divider-subtle">
                    {[
                      { token: "font-size-10", px: 10, usage: "레이블, 배지 텍스트" },
                      { token: "font-size-12", px: 12, usage: "툴바, 보조 정보" },
                      { token: "font-size-13", px: 13, usage: "테이블 셀, 필터 값" },
                      { token: "font-size-14", px: 14, usage: "버튼 기본, 본문" },
                      { token: "font-size-16", px: 16, usage: "카드 제목, 중요 텍스트" },
                      { token: "font-size-18", px: 18, usage: "섹션 제목" },
                      { token: "font-size-20", px: 20, usage: "카드 타이틀 (h5)" },
                      { token: "font-size-22", px: 22, usage: "모달 제목 (h4)" },
                      { token: "font-size-24", px: 24, usage: "페이지 소제목 (h3)" },
                      { token: "font-size-28", px: 28, usage: "페이지 타이틀 (h2)" },
                      { token: "font-size-34", px: 34, usage: "대형 타이틀" },
                      { token: "font-size-36", px: 36, usage: "히어로 텍스트 (h1)" },
                    ].map(({ token, px, usage }) => (
                      <div key={token} className="flex items-center gap-4 px-4 py-2">
                        <div className="w-24 shrink-0 overflow-hidden">
                          <span className="text-content-primary font-medium leading-none block" style={{ fontSize: `${px}px` }}>Aa</span>
                        </div>
                        <div className="flex items-center gap-2 shrink-0 w-52">
                          <code className="text-[12px] font-semibold text-primary bg-primary-subtle px-1.5 py-0.5 rounded">{token}</code>
                        </div>
                        <span className="text-[11px] font-semibold text-content-tertiary tabular-nums w-10 shrink-0">{px}px</span>
                        <span className="text-body5-normal text-content-assistive">{usage}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Font Weight */}
              <div>
                <SubLabel note="Tailwind: font-weight-normal / font-weight-medium / font-weight-semibold">font-weight</SubLabel>
                <div className="rounded-lg border-border05 border-subtle bg-canvas-primary overflow-hidden">
                  {/* 컬럼 헤더 */}
                  <div className="flex items-center gap-4 px-4 py-2 border-b border-subtle bg-canvas-quaternary">
                    <span className="text-[11px] font-semibold text-content-tertiary tracking-tight w-48 shrink-0">미리보기</span>
                    <span className="text-[11px] font-semibold text-content-tertiary tracking-tight w-52 shrink-0">클래스</span>
                    <span className="text-[11px] font-semibold text-content-tertiary tracking-tight w-8 shrink-0">값</span>
                    <span className="text-[11px] font-semibold text-content-tertiary tracking-tight flex-1">용도</span>
                  </div>
                  <div className="divide-y divide-divider-subtle">
                    {[
                      { value: 400, cls: "font-weight-normal",   note: "본문, 보조 텍스트, placeholder" },
                      { value: 500, cls: "font-weight-medium",   note: "버튼 라벨, 필터 값, 테이블 헤더" },
                      { value: 600, cls: "font-weight-semibold", note: "타이틀, 강조, KPI 수치 — 이 프로젝트 주력 굵기" },
                    ].map(w => (
                      <div key={w.value} className="flex items-center gap-4 px-4 py-3">
                        <span className={`${w.cls} text-content-primary text-[16px] w-48 shrink-0`} style={{ letterSpacing: "-0.5px" }}>
                          보닥 플래너 Bonydak
                        </span>
                        <div className="flex items-center gap-2 shrink-0 w-52">
                          <code className="text-[11px] font-semibold text-primary bg-primary-subtle px-1.5 py-0.5 rounded">{w.cls}</code>
                        </div>
                        <span className="text-[11px] font-semibold text-content-tertiary tabular-nums w-8 shrink-0">{w.value}</span>
                        <span className="text-body5-normal text-content-assistive">{w.note}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Letter Spacing */}
              <div>
                <SubLabel note="Tailwind: font_letter_spacing-0 / font_letter_spacing-050 / font_letter_spacing-100">font_letter_spacing</SubLabel>
                <div className="rounded-lg border-border05 border-subtle bg-canvas-primary overflow-hidden">
                  {/* 컬럼 헤더 */}
                  <div className="flex items-center gap-4 px-4 py-2 border-b border-subtle bg-canvas-quaternary">
                    <span className="text-[11px] font-semibold text-content-tertiary tracking-tight w-48 shrink-0">미리보기</span>
                    <span className="text-[11px] font-semibold text-content-tertiary tracking-tight w-52 shrink-0">클래스</span>
                    <span className="text-[11px] font-semibold text-content-tertiary tracking-tight w-12 shrink-0">값</span>
                    <span className="text-[11px] font-semibold text-content-tertiary tracking-tight flex-1">용도</span>
                  </div>
                  <div className="divide-y divide-divider-subtle">
                    {[
                      { value: "0",      tw: "font_letter_spacing-0",   note: "shadcn 기본 — 이 프로젝트에서 거의 미사용" },
                      { value: "-0.5px", tw: "font_letter_spacing-050", note: "composite 토큰 기본값 — 대부분의 UI 텍스트" },
                      { value: "-1px",   tw: "font_letter_spacing-100", note: "긴 본문 가독성용" },
                    ].map(item => (
                      <div key={item.value} className="flex items-center gap-4 px-4 py-3">
                        <span className="text-content-primary text-[16px] font-medium w-48 shrink-0" style={{ letterSpacing: item.value }}>
                          보닥 플래너 Bonydak
                        </span>
                        <div className="flex items-center gap-2 shrink-0 w-52">
                          <code className="text-[11px] font-semibold text-primary bg-primary-subtle px-1.5 py-0.5 rounded">{item.tw}</code>
                        </div>
                        <code className="text-[11px] font-semibold text-content-tertiary tabular-nums w-12 shrink-0 font-mono">{item.value}</code>
                        <span className="text-body5-normal text-content-assistive">{item.note}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Line Height */}
              <div>
                <SubLabel note="Tailwind: line-height-120 ~ line-height-160">line-height</SubLabel>
                <div className="rounded-lg border-border05 border-subtle bg-canvas-primary overflow-hidden">
                  {/* 컬럼 헤더 */}
                  <div className="flex items-center gap-4 px-4 py-2 border-b border-subtle bg-canvas-quaternary">
                    <span className="text-[11px] font-semibold text-content-tertiary tracking-tight w-48 shrink-0">미리보기</span>
                    <span className="text-[11px] font-semibold text-content-tertiary tracking-tight w-52 shrink-0">클래스</span>
                    <span className="text-[11px] font-semibold text-content-tertiary tracking-tight w-8 shrink-0">값</span>
                    <span className="text-[11px] font-semibold text-content-tertiary tracking-tight flex-1">용도</span>
                  </div>
                  <div className="divide-y divide-divider-subtle">
                    {[
                      { value: 1.2, tw: "line-height-120", note: "제목류 — 헤딩, 강조 숫자" },
                      { value: 1.3, tw: "line-height-130", note: "서브타이틀" },
                      { value: 1.4, tw: "line-height-140", note: "버튼, 배지, 짧은 레이블" },
                      { value: 1.6, tw: "line-height-160", note: "본문 — composite 토큰 기본 행간" },
                    ].map(item => (
                      <div key={item.value} className="flex items-center gap-4 px-4 py-3">
                        <div className="w-48 shrink-0">
                          <span className="text-content-primary text-[13px] font-medium block" style={{ lineHeight: item.value, letterSpacing: "-0.5px" }}>
                            보닥 플래너<br/>Bonydak Planner
                          </span>
                        </div>
                        <div className="flex items-center gap-2 shrink-0 w-52">
                          <code className="text-[11px] font-semibold text-primary bg-primary-subtle px-1.5 py-0.5 rounded">{item.tw}</code>
                        </div>
                        <code className="text-[11px] font-semibold text-content-tertiary tabular-nums w-8 shrink-0 font-mono">{item.value}</code>
                        <span className="text-body5-normal text-content-assistive">{item.note}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

            </div>

            <div id="typography-composite" className="scroll-mt-24">
              <SubLabel note="font-size / line-height / font-weight / letter-spacing 하나로 묶인 Semantic 클래스 — text-h* / text-body* / text-caption">Semantic 타이포 토큰</SubLabel>
              <div className="rounded-lg border-border05 border-subtle bg-canvas-primary overflow-hidden">
                <TypoRow token="text-h3-bold"    size="24px" weight="600" lh="36px" sample="재배정 타입 설정 — 상담 관리" />
                <TypoRow token="text-h4"         size="22px" weight="600" lh="32px" sample="배정 완료 DB" />
                <TypoRow token="text-h5-bold"    size="20px" weight="600" lh="30px" sample="설계사 검색" />
                <TypoRow token="text-body3-bold"   size="14px" weight="600" lh="22px" sample="이민혁 · 010-1111-1111 · 2026.01.01" />
                <TypoRow token="text-body3-medium" size="14px" weight="500" lh="22px" sample="이민혁 · 010-1111-1111 · 2026.01.01" />
                <TypoRow token="text-body3-normal" size="14px" weight="400" lh="22px" sample="이민혁 · 010-1111-1111 · 2026.01.01" />
                <TypoRow token="text-body4-bold"   size="13px" weight="600" lh="20px" sample="정상 · 계약 예정 · 상담 종료" />
                <TypoRow token="text-body4-medium" size="13px" weight="500" lh="18px" sample="정상 · 계약 예정 · 상담 종료" />
                <TypoRow token="text-body4-normal" size="13px" weight="400" lh="18px" sample="정상 · 계약 예정 · 상담 종료" />
                <TypoRow token="text-body5-bold"   size="12px" weight="600" lh="20px" sample="담당 설계사 · 상태" />
                <TypoRow token="text-body5-medium" size="12px" weight="500" lh="16px" sample="담당 설계사 · 상태" />
                <TypoRow token="text-body5-normal" size="12px" weight="400" lh="16px" sample="담당 설계사 · 상태" />
                <TypoRow token="text-caption"      size="10px" weight="400" lh="16px" sample="레이블 · 구분" />
              </div>
            </div>

          </Section>

          {/* 04. 라운드 */}
          <Section tab="foundations" id="radius" title="라운드">

            <div>
              <SubLabel>토큰 시각화</SubLabel>
              <div className="flex flex-wrap items-end gap-6">
                {RADIUS_REFERENCE.map(r => (
                  <div key={r.cls} className="flex flex-col items-center gap-2.5">
                    <div
                      className="w-20 h-20 bg-primary-subtle border border-subtle"
                      style={{ borderRadius: r.px >= 9999 ? "9999px" : `${r.px}px` }}
                    />
                    <div className="text-center">
                      <code className="text-body5-medium text-primary block">{r.cls}</code>
                      <p className="text-caption text-content-assistive tabular-nums mt-0.5">{r.px >= 9999 ? "pill" : `${r.px}px`}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <SubLabel>사용 계층 규칙</SubLabel>
              <div className="rounded-lg border-border05 border-subtle bg-canvas-primary overflow-hidden">
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
                            r.cls === "rounded-xl" ? "bg-red-50 text-red-600" : "bg-primary-subtle text-primary"
                          }`}>{r.cls}</code>
                        </td>
                        <td className="py-2.5 px-3 text-content-assistive">{r.note}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </Section>

          {/* 05. Border */}
          <Section tab="foundations" id="border" title="Border">

            <div>
              <SubLabel>보더 굵기</SubLabel>
              <div className="flex gap-6 flex-wrap items-end">
                {[
                  { cls: "border-border05", px: "0.5px", note: "특수 케이스 — 얇은 구분이 필요한 경우", style: "0.5px solid var(--border-subtle)" },
                  { cls: "border",          px: "1px",   note: "기본값 — Tailwind 표준 (border-border10 동일)", style: undefined },
                ].map(b => (
                  <div key={b.cls} className="flex flex-col gap-2">
                    <code className="text-[11px] bg-primary-subtle text-primary px-1.5 py-0.5 rounded w-fit">{b.cls}</code>
                    <div
                      className={`h-16 w-32 rounded-md bg-canvas-primary ${b.style ? "" : "border border-subtle"}`}
                      style={b.style ? { border: b.style } : undefined}
                    />
                    <p className="text-[11px] font-semibold text-content-tertiary">{b.px}</p>
                    <p className="text-[11px] text-content-assistive max-w-[128px]">{b.note}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <SubLabel note="border-subtle / border-border / border-primary">보더 색상</SubLabel>
              <div className="flex gap-6 flex-wrap items-end">
                {[
                  { cls: "border-subtle",  cssVar: "--border-subtle",  hex: "#e5e8eb", note: "카드·컨테이너 기본 보더 (cool-neutral-200)" },
                  { cls: "border-border",  cssVar: "--border",         hex: "#d1d6db", note: "shadcn 호환 보더 (cool-neutral-300)" },
                  { cls: "border-primary", cssVar: "--primary",        hex: "#3182f6", note: "선택·포커스 상태" },
                ].map(b => (
                  <div key={b.cls} className="flex flex-col gap-2">
                    <code className="text-[11px] bg-primary-subtle text-primary px-1.5 py-0.5 rounded w-fit">{b.cls}</code>
                    <div className="h-16 w-32 rounded-md bg-canvas-primary" style={{ border: `2px solid var(${b.cssVar})` }} />
                    <code className="text-[10px] font-mono text-content-assistive bg-fill-normal px-1.5 py-0.5 rounded w-fit">{b.hex}</code>
                    <p className="text-[11px] text-content-assistive max-w-[128px]">{b.note}</p>
                  </div>
                ))}
              </div>
            </div>
          </Section>

          {/* 06. Shadow */}
          <Section tab="foundations" id="shadow" title="Shadow">

            <div>
              <SubLabel>그림자 스케일</SubLabel>
              <div className="flex gap-8 flex-wrap items-end">
                {[
                  { cls: "shadow-xs",  note: "필터 컨트롤 · 소형 팝업" },
                  { cls: "shadow-sm",  note: "카드 팝업 · select" },
                  { cls: "shadow-md",  note: "모달 · 사이드바" },
                  { cls: "shadow-lg",  note: "대형 팝오버" },
                  { cls: "shadow-xl",  note: "드래그 중 카드" },
                ].map(s => (
                  <div key={s.cls} className="flex flex-col gap-2">
                    <code className="text-[11px] bg-primary-subtle text-primary px-1.5 py-0.5 rounded w-fit">{s.cls}</code>
                    <div className={`h-16 w-32 rounded-lg bg-canvas-primary ${s.cls}`} />
                    <p className="text-[11px] text-content-assistive max-w-[128px]">{s.note}</p>
                  </div>
                ))}
              </div>
            </div>
          </Section>

          {/* 05. 스페이싱 */}
          <Section tab="foundations" id="spacing" title="스페이싱">

            <div>
              <SubLabel note="Tailwind 네이티브 4px 그리드. 1 = 4px / 2 = 8px / 4 = 16px / 6 = 24px ...">토큰 스케일</SubLabel>
              <div className="flex items-end gap-3 flex-wrap">
                {SPACING_SCALE.map(s => (
                  <div key={s.px} className="flex flex-col items-center gap-1.5">
                    <div className="w-10 bg-primary-subtle border border-subtle rounded-sm" style={{ height: `${Math.min(s.px, 60)}px` }} />
                    <div className="text-center">
                      <p className="text-[11px] font-semibold text-content-primary tabular-nums">{s.px}px</p>
                      <code className="text-[10px] text-primary block">{s.key}</code>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <SubLabel note="Tailwind 네이티브 4px 그리드 — prefix(p / m / gap / px / pt 등)는 상황에 따라 자유 조합">사용 패턴</SubLabel>
              <div className="rounded-lg border-border05 border-subtle bg-canvas-primary overflow-hidden">
                <table className="w-full text-[12px]">
                  <thead>
                    <tr className="border-b border-divider-normal bg-fill-subtle">
                      <th className="text-left py-2 px-3 font-semibold text-content-tertiary w-16">px</th>
                      <th className="text-left py-2 px-3 font-semibold text-content-tertiary w-24">Tailwind 키</th>
                      <th className="text-left py-2 px-3 font-semibold text-content-tertiary">사용 패턴</th>
                    </tr>
                  </thead>
                  <tbody>
                    {SPACING_SCALE.map(s => (
                      <tr key={s.px} className="border-t border-divider-subtle">
                        <td className="py-2.5 px-3 font-semibold tabular-nums text-content-primary">{s.px}</td>
                        <td className="py-2.5 px-3">
                          <code className="text-[11px] bg-primary-subtle text-primary px-1.5 py-0.5 rounded">{s.key}</code>
                        </td>
                        <td className="py-2.5 px-3 text-content-secondary">{s.usage}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </Section>

          {/* G1. 토큰 선택 가이드 (Decision Tree) */}
          <Section
            tab="guide"
            id="decision-tree"
            title="토큰 선택 가이드"
            desc="어떤 색·간격·라운드를 쓸지 헷갈릴 때. 위에서부터 질문에 답하면 정답이 나오도록 설계."
          >
            <div>
              <SubLabel note="컴포넌트에서 색을 결정할 때 따라가는 흐름">색상 — 무엇을 표현하나?</SubLabel>
              <div className="rounded-lg border-border05 border-subtle bg-canvas-primary p-s24">
                <div className="flex flex-col gap-s8 text-[13px]">
                  <div className="flex items-start gap-s12">
                    <span className="text-content-disabled font-mono shrink-0 w-4">1.</span>
                    <p className="text-content-primary">
                      <strong className="text-primary">브랜드 액션</strong>인가? (저장/확인/메인 CTA) →{" "}
                      <code className="bg-primary-subtle text-primary px-1.5 py-0.5 rounded text-[12px]">bg-primary</code> /{" "}
                      <code className="bg-primary-subtle text-primary px-1.5 py-0.5 rounded text-[12px]">text-primary</code>
                    </p>
                  </div>
                  <div className="flex items-start gap-s12">
                    <span className="text-content-disabled font-mono shrink-0 w-4">2.</span>
                    <p className="text-content-primary">
                      <strong>상태</strong> 표현인가? → 성공{" "}
                      <code className="bg-green-tint text-green-tint px-1.5 py-0.5 rounded text-[12px]">tint-success</code>{" "}
                      · 경고 <code className="bg-amber-tint text-amber-tint px-1.5 py-0.5 rounded text-[12px]">tint-warning</code>{" "}
                      · 오류 <code className="bg-red-tint text-red-tint px-1.5 py-0.5 rounded text-[12px]">tint-danger</code>{" "}
                      · 정보 <code className="bg-blue-tint text-blue-tint px-1.5 py-0.5 rounded text-[12px]">tint-blue</code>{" "}
                      · 중립 <code className="bg-canvas-quaternary text-content-quaternary px-1.5 py-0.5 rounded text-[12px]">tint-muted</code>
                    </p>
                  </div>
                  <div className="flex items-start gap-s12">
                    <span className="text-content-disabled font-mono shrink-0 w-4">3.</span>
                    <p className="text-content-primary">
                      <strong>면적이 큰 배경</strong>인가? (페이지·카드·모달) →{" "}
                      <code className="bg-fill-subtle text-content-secondary px-1.5 py-0.5 rounded text-[12px]">bg-canvas-*</code>{" "}
                      (primary=흰 / tertiary=페이지 / quaternary=섹션)
                    </p>
                  </div>
                  <div className="flex items-start gap-s12">
                    <span className="text-content-disabled font-mono shrink-0 w-4">4.</span>
                    <p className="text-content-primary">
                      <strong>작은 컴포넌트 배경</strong>인가? (배지·필 / 컨트롤 hover) →{" "}
                      <code className="bg-fill-subtle text-content-secondary px-1.5 py-0.5 rounded text-[12px]">bg-fill-*</code>{" "}
                      (subtle=hover / strong=강조)
                    </p>
                  </div>
                  <div className="flex items-start gap-s12">
                    <span className="text-content-disabled font-mono shrink-0 w-4">5.</span>
                    <p className="text-content-primary">
                      <strong>텍스트</strong>인가? →{" "}
                      <code className="bg-fill-subtle text-content-secondary px-1.5 py-0.5 rounded text-[12px]">text-content-*</code>{" "}
                      (primary 진함 → assistive 옅음 → disabled 회색). 진함과 옅음 사이가 모호하면 한 단계 진한 쪽 선택.
                    </p>
                  </div>
                  <div className="flex items-start gap-s12">
                    <span className="text-content-disabled font-mono shrink-0 w-4">6.</span>
                    <p className="text-content-primary">
                      <strong>오버레이/구분선</strong>인가? → 행 hover{" "}
                      <code className="bg-fill-subtle text-content-secondary px-1.5 py-0.5 rounded text-[12px]">bg-alpha-black-02</code>{" "}
                      / 셀 보더{" "}
                      <code className="bg-fill-subtle text-content-secondary px-1.5 py-0.5 rounded text-[12px]">border-divider-subtle</code>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <SubLabel note="px 단위로 선택하지 말고 의미로 선택">간격 / 라운드 / 굵기</SubLabel>
              <div className="grid grid-cols-3 gap-s16">
                <div className="rounded-lg border-border05 border-subtle bg-canvas-primary p-s16">
                  <p className="text-[12px] font-semibold text-content-primary mb-s8">간격 (gap / padding)</p>
                  <ul className="text-[12px] text-content-tertiary space-y-1.5 leading-relaxed">
                    <li>아이콘↔텍스트 → <code className="text-primary">gap-s4</code> (4px)</li>
                    <li>인라인 → <code className="text-primary">gap-s8</code> (8px)</li>
                    <li>카드↔카드 → <code className="text-primary">gap-s16</code> (16px)</li>
                    <li>섹션 간 → <code className="text-primary">gap-s32</code> (32px)</li>
                  </ul>
                </div>
                <div className="rounded-lg border-border05 border-subtle bg-canvas-primary p-s16">
                  <p className="text-[12px] font-semibold text-content-primary mb-s8">라운드</p>
                  <ul className="text-[12px] text-content-tertiary space-y-1.5 leading-relaxed">
                    <li>카드·컨테이너 → <code className="text-primary">rounded-lg</code> (8px)</li>
                    <li>필터·버튼(sm/xs) → <code className="text-primary">rounded-md</code> (6px)</li>
                    <li>체크박스 → <code className="text-primary">rounded-sm</code> (2px)</li>
                    <li>pill·avatar → <code className="text-primary">rounded-full</code></li>
                  </ul>
                </div>
                <div className="rounded-lg border-border05 border-subtle bg-canvas-primary p-s16">
                  <p className="text-[12px] font-semibold text-content-primary mb-s8">굵기 (font-weight)</p>
                  <ul className="text-[12px] text-content-tertiary space-y-1.5 leading-relaxed">
                    <li>본문 → <code className="text-primary">font-normal</code> (400)</li>
                    <li>레이블 → <code className="text-primary">font-medium</code> (500)</li>
                    <li>제목·강조 → <code className="text-primary">font-semibold</code> (600)</li>
                    <li><code className="text-red-600">font-bold</code> 사용 금지</li>
                  </ul>
                </div>
              </div>
            </div>
          </Section>

          {/* G2. 네이밍 규칙 */}
          <Section
            tab="guide"
            id="naming"
            title="네이밍 규칙"
            desc="토큰 이름은 의미로 읽힌다. Prefix가 카테고리, Suffix가 위계."
          >
            <div>
              <SubLabel>Prefix — 무엇을 다루는 토큰인가</SubLabel>
              <div className="rounded-lg border-border05 border-subtle bg-canvas-primary overflow-hidden">
                <table className="w-full text-[12px]">
                  <thead>
                    <tr className="border-b border-divider-normal bg-fill-subtle">
                      <th className="text-left py-2 px-3 font-semibold text-content-tertiary w-44">Prefix</th>
                      <th className="text-left py-2 px-3 font-semibold text-content-tertiary w-48">예시</th>
                      <th className="text-left py-2 px-3 font-semibold text-content-tertiary">의미</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { prefix: "bg-canvas-*",     ex: "bg-canvas-primary",   meaning: "면적 큰 배경 (페이지·카드·모달)" },
                      { prefix: "bg-fill-*",       ex: "bg-fill-subtle",      meaning: "작은 컴포넌트 배경 (배지·hover)" },
                      { prefix: "bg-primary-*",    ex: "bg-primary-subtle",   meaning: "브랜드 강조 배경" },
                      { prefix: "bg-{color}-tint", ex: "bg-green-tint",       meaning: "상태 색 tint 배경" },
                      { prefix: "bg-alpha-*",      ex: "bg-alpha-black-02",   meaning: "투명 오버레이 (반투명 hover/딤)" },
                      { prefix: "text-content-*",  ex: "text-content-primary", meaning: "일반 텍스트 색 (위계별)" },
                      { prefix: "text-inverse-*",  ex: "text-inverse-primary", meaning: "반전 텍스트 (브랜드 위 흰글자)" },
                      { prefix: "text-{color}-tint", ex: "text-green-tint",   meaning: "상태 색 tint 텍스트 (배지 안)" },
                      { prefix: "border-*",        ex: "border-subtle",       meaning: "보더 색·굵기" },
                      { prefix: "border-divider-*", ex: "border-divider-subtle", meaning: "셀·구분선 (alpha 기반)" },
                    ].map((r, i) => (
                      <tr key={i} className="border-t border-divider-subtle">
                        <td className="py-2 px-3"><code className="text-[11px] bg-primary-subtle text-primary px-1.5 py-0.5 rounded">{r.prefix}</code></td>
                        <td className="py-2 px-3"><code className="text-[11px] font-mono text-content-tertiary">{r.ex}</code></td>
                        <td className="py-2 px-3 text-content-secondary">{r.meaning}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div>
              <SubLabel>Suffix — 위계와 상태</SubLabel>
              <div className="grid grid-cols-2 gap-s16">
                <div className="rounded-lg border-border05 border-subtle bg-canvas-primary p-s16">
                  <p className="text-[12px] font-semibold text-content-primary mb-s8">위계 (진함 → 옅음)</p>
                  <code className="text-[12px] text-content-tertiary block leading-relaxed font-mono">
                    primary → secondary → tertiary → quaternary → assistive → disabled
                  </code>
                  <p className="text-[11px] text-content-assistive mt-s8">진할수록 강조, 옅을수록 보조</p>
                </div>
                <div className="rounded-lg border-border05 border-subtle bg-canvas-primary p-s16">
                  <p className="text-[12px] font-semibold text-content-primary mb-s8">상태</p>
                  <code className="text-[12px] text-content-tertiary block leading-relaxed font-mono">
                    -hover · -pressed · -subtle · -strong · -inverse
                  </code>
                  <p className="text-[11px] text-content-assistive mt-s8">interaction과 강조도 표현</p>
                </div>
              </div>
            </div>

            <div>
              <SubLabel note="이런 패턴은 사용 금지 — 빌드 통과해도 디자인 시스템 위반">❌ 금지 패턴</SubLabel>
              <div className="rounded-lg border border-red-200 bg-red-50/50 p-s16">
                <ul className="text-[12px] text-content-secondary space-y-2 leading-relaxed">
                  <li>
                    <code className="bg-red-100 text-red-700 px-1.5 py-0.5 rounded text-[11px]">bg-blue-500</code>{" "}
                    같은 <strong>raw atomic 토큰 직접 사용</strong> — 반드시 semantic을 거쳐서 (예: <code className="bg-fill-subtle text-content-secondary px-1.5 py-0.5 rounded text-[11px]">bg-primary</code>)
                  </li>
                  <li>
                    <code className="bg-red-100 text-red-700 px-1.5 py-0.5 rounded text-[11px]">dark:bg-canvas-primary</code>{" "}
                    — <strong>다크모드 미지원</strong>. 모든 dark: prefix 금지
                  </li>
                  <li>
                    <code className="bg-red-100 text-red-700 px-1.5 py-0.5 rounded text-[11px]">rounded-xl</code>{" "}
                    이상 — <strong>Vega 스타일 상한선</strong>. 카드는 rounded-lg(8px)까지
                  </li>
                  <li>
                    <code className="bg-red-100 text-red-700 px-1.5 py-0.5 rounded text-[11px]">font-bold</code>{" "}
                    — atomic <code className="bg-fill-subtle text-content-secondary px-1.5 py-0.5 rounded text-[11px]">font-weight-bold</code>로만 허용. 일반은 font-semibold
                  </li>
                  <li>
                    <code className="bg-red-100 text-red-700 px-1.5 py-0.5 rounded text-[11px]">bg-primary/10</code>{" "}
                    같은 <strong>alpha modifier</strong> — semantic 토큰엔 금지. <code className="bg-fill-subtle text-content-secondary px-1.5 py-0.5 rounded text-[11px]">bg-primary-subtle</code> 같은 named 토큰 사용
                  </li>
                  <li>
                    <code className="bg-red-100 text-red-700 px-1.5 py-0.5 rounded text-[11px]">gap-0.5</code>,{" "}
                    <code className="bg-red-100 text-red-700 px-1.5 py-0.5 rounded text-[11px]">gap-1.5</code> 같은{" "}
                    <strong>half-step 간격</strong> — 4px 그리드 벗어남. s-token 사용
                  </li>
                </ul>
              </div>
            </div>
          </Section>

          {/* G3. Tailwind 매핑표 */}
          <Section
            tab="guide"
            id="tailwind-map"
            title="Tailwind 매핑표"
            desc="Figma 토큰 ↔ shadcn 표준 ↔ 우리 Tailwind 클래스. 한눈에 보고 골라 쓰는 치트시트."
          >
            <div>
              <SubLabel>Background</SubLabel>
              <div className="rounded-lg border-border05 border-subtle bg-canvas-primary overflow-hidden">
                <table className="w-full text-[12px]">
                  <thead>
                    <tr className="border-b border-divider-normal bg-fill-subtle">
                      <th className="text-left py-2 px-3 font-semibold text-content-tertiary w-52">Tailwind 클래스</th>
                      <th className="text-left py-2 px-3 font-semibold text-content-tertiary w-44">CSS 변수</th>
                      <th className="text-left py-2 px-3 font-semibold text-content-tertiary w-32">Figma 토큰</th>
                      <th className="text-left py-2 px-3 font-semibold text-content-tertiary">언제 쓰나</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { cls: "bg-canvas-primary",    cssVar: "--bg-primary",    figma: "bg_primary",    when: "카드·모달 흰 배경" },
                      { cls: "bg-canvas-secondary",  cssVar: "--bg-secondary",  figma: "bg_secondary",  when: "오프화이트 영역 (드물게)" },
                      { cls: "bg-canvas-secondary",   cssVar: "--bg-tertiary",   figma: "bg_tertiary",   when: "페이지 기본 배경 (모든 페이지)" },
                      { cls: "bg-canvas-quaternary", cssVar: "--bg-subtle",     figma: "bg_subtle",     when: "섹션 구분·테이블 짝수행" },
                      { cls: "bg-primary",           cssVar: "--primary",       figma: "(shadcn 표준)",  when: "메인 액션 버튼 (브랜드 블루)" },
                      { cls: "bg-primary-subtle",    cssVar: "--primary-subtle", figma: "(파생)",        when: "사이드바·트리 선택 배경" },
                      { cls: "bg-fill-subtle",       cssVar: "--fill-subtle",   figma: "(파생)",        when: "테이블 헤더·작은 컴포넌트 hover" },
                    ].map((r, i) => (
                      <tr key={i} className="border-t border-divider-subtle">
                        <td className="py-2 px-3"><code className="text-[11px] bg-primary-subtle text-primary px-1.5 py-0.5 rounded">{r.cls}</code></td>
                        <td className="py-2 px-3"><code className="text-[10px] font-mono text-content-disabled">{r.cssVar}</code></td>
                        <td className="py-2 px-3 text-content-tertiary">{r.figma}</td>
                        <td className="py-2 px-3 text-content-secondary">{r.when}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div>
              <SubLabel>Text · Border</SubLabel>
              <div className="rounded-lg border-border05 border-subtle bg-canvas-primary overflow-hidden">
                <table className="w-full text-[12px]">
                  <thead>
                    <tr className="border-b border-divider-normal bg-fill-subtle">
                      <th className="text-left py-2 px-3 font-semibold text-content-tertiary w-52">Tailwind 클래스</th>
                      <th className="text-left py-2 px-3 font-semibold text-content-tertiary w-44">CSS 변수</th>
                      <th className="text-left py-2 px-3 font-semibold text-content-tertiary w-32">Figma 토큰</th>
                      <th className="text-left py-2 px-3 font-semibold text-content-tertiary">언제 쓰나</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { cls: "text-content-primary",    cssVar: "--text-primary",    figma: "text_primary",    when: "제목·강조 (#191F28)" },
                      { cls: "text-content-secondary",  cssVar: "--text-secondary",  figma: "text_secondary",  when: "본문 (cool-neutral-900)" },
                      { cls: "text-content-tertiary",   cssVar: "--text-tertiary",   figma: "text_tertiary",   when: "서브 텍스트 (cool-neutral-700)" },
                      { cls: "text-content-assistive",  cssVar: "--text-assistive",  figma: "text_assistive",  when: "placeholder·힌트 (#8B95A1)" },
                      { cls: "text-primary",            cssVar: "--primary",         figma: "(shadcn 표준)",    when: "링크·브랜드 텍스트" },
                      { cls: "text-inverse-primary",    cssVar: "--common-100",      figma: "text_inverse_primary", when: "브랜드 버튼 위 흰 글자" },
                      { cls: "border-subtle",           cssVar: "--border-subtle",   figma: "border_subtle",   when: "카드 보더 (cool-neutral-200)" },
                      { cls: "border-border",           cssVar: "--border",          figma: "border_primary",  when: "shadcn 표준 보더" },
                      { cls: "border-divider-subtle",   cssVar: "--divider-subtle",  figma: "(파생)",           when: "테이블 셀 행 라인 (alpha-blue 4%)" },
                    ].map((r, i) => (
                      <tr key={i} className="border-t border-divider-subtle">
                        <td className="py-2 px-3"><code className="text-[11px] bg-primary-subtle text-primary px-1.5 py-0.5 rounded">{r.cls}</code></td>
                        <td className="py-2 px-3"><code className="text-[10px] font-mono text-content-disabled">{r.cssVar}</code></td>
                        <td className="py-2 px-3 text-content-tertiary">{r.figma}</td>
                        <td className="py-2 px-3 text-content-secondary">{r.when}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </Section>

          {/* G4. 브랜드 커스터마이징 */}
          <Section
            tab="guide"
            id="brand"
            title="브랜드 커스터마이징"
            desc="B2B 다중 테넌트 — --primary 한 줄만 바꾸면 모든 컴포넌트 자동 추종. 한 build로 여러 브랜드 지원."
          >
            <div>
              <SubLabel>1단계 — globals.css에 브랜드별 오버라이드 추가</SubLabel>
              <div className="rounded-lg border-border05 border-subtle bg-canvas-primary p-s16 overflow-x-auto">
                <pre className="text-[12px] text-content-secondary font-mono leading-relaxed">{`/* :root 블록 끝부분에 추가 */
[data-brand="green"] {
  --primary: var(--green-500);     /* #03b26c */
}
[data-brand="orange"] {
  --primary: oklch(0.65 0.20 45);  /* 임의 hex/oklch도 가능 */
}`}</pre>
              </div>
            </div>

            <div>
              <SubLabel>2단계 — html 또는 페이지 wrapper에 data-brand 적용</SubLabel>
              <div className="grid grid-cols-2 gap-s16">
                <div className="rounded-lg border-border05 border-subtle bg-canvas-primary p-s16 overflow-x-auto">
                  <p className="text-[11px] font-semibold text-content-tertiary mb-s8">정적 (테넌트 단위)</p>
                  <pre className="text-[12px] text-content-secondary font-mono leading-relaxed">{`// app/layout.tsx
<html lang="ko" data-brand={tenant.brand}>
  {/* "default" | "green" | "orange" */}
</html>`}</pre>
                </div>
                <div className="rounded-lg border-border05 border-subtle bg-canvas-primary p-s16 overflow-x-auto">
                  <p className="text-[11px] font-semibold text-content-tertiary mb-s8">동적 (런타임 변경)</p>
                  <pre className="text-[12px] text-content-secondary font-mono leading-relaxed">{`useEffect(() => {
  document.documentElement
    .dataset.brand = currentTenant.brand
}, [currentTenant])`}</pre>
                </div>
              </div>
            </div>

            <div>
              <SubLabel>자동 추종 컴포넌트 — 코드 수정 불필요</SubLabel>
              <div className="rounded-lg border-border05 border-subtle bg-canvas-primary p-s16">
                <p className="text-[12px] text-content-tertiary mb-s12">
                  <code className="bg-primary-subtle text-primary px-1.5 py-0.5 rounded text-[11px]">--primary</code> 변경 시 다음이 모두 자동 추종 (CSS 변수 추상화):
                </p>
                <div className="grid grid-cols-3 gap-x-s16 gap-y-s8">
                  {[
                    "Button (variant=primary)",
                    "Badge (variant=default)",
                    "사이드바 selected/ring",
                    "링크 (text-primary)",
                    "체크박스/라디오 ON",
                    "focus ring",
                    "필터 검색 버튼",
                    "캘린더 선택 날짜",
                    "테이블 selected 행",
                  ].map(c => (
                    <div key={c} className="flex items-center gap-s8 text-[12px] text-content-secondary">
                      <Check className="h-3.5 w-3.5 text-primary shrink-0" />
                      {c}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <SubLabel note="reference에서 정적 색이라 브랜드와 무관">예외 — 브랜드와 무관한 토큰</SubLabel>
              <div className="rounded-lg border-border05 border-subtle bg-canvas-primary p-s16">
                <ul className="text-[12px] text-content-secondary space-y-2 leading-relaxed">
                  <li>
                    <code className="bg-blue-tint text-blue-tint px-1.5 py-0.5 rounded text-[11px]">bg-blue-tint</code>,{" "}
                    <code className="bg-blue-tint text-blue-tint px-1.5 py-0.5 rounded text-[11px]">text-blue-tint</code>{" "}
                    — info 배지용 파랑 (브랜드가 그린이어도 info=파랑)
                  </li>
                  <li>
                    <code className="bg-green-tint text-green-tint px-1.5 py-0.5 rounded text-[11px]">bg-success</code>,{" "}
                    <code className="bg-amber-tint text-amber-tint px-1.5 py-0.5 rounded text-[11px]">bg-warning</code>,{" "}
                    <code className="bg-red-tint text-red-tint px-1.5 py-0.5 rounded text-[11px]">bg-destructive</code>{" "}
                    — 시맨틱 상태색
                  </li>
                </ul>
              </div>
            </div>
          </Section>

          {/* 05-N. 내비게이션 */}
          <Section
            tab="components"
            id="navigation"
            title="내비게이션"
            desc="앱 사이드바 + 상단 헤더 구조 목업. 실제 컴포넌트는 app-sidebar.tsx / header.tsx 참고."
          >
            {/* 사이드바 */}
            <div>
              <SubLabel note="app-sidebar.tsx — collapsible icon 모드">사이드바</SubLabel>
              <ShadcnRef components={["sidebar", "collapsible"]} sourceFile="src/components/app-sidebar.tsx" />
              <div className="flex gap-4 items-start">
                {/* 목업 — collapsible 구조 */}
                <div
                  className="rounded-lg border-border05 border-subtle bg-canvas-secondary overflow-hidden shrink-0"
                  style={{ width: 160 }}
                >
                  {/* 로고 영역 */}
                  <div className="px-3 py-3 border-b border-subtle bg-canvas-primary flex items-center gap-2">
                    <div className="h-6 w-6 rounded-md bg-primary shrink-0" />
                    <span className="text-[13px] font-semibold text-content-primary truncate">보닥 플래너</span>
                  </div>
                  {/* 배정 고객 관리 — 확장됨 */}
                  <div className="px-2 pt-3 pb-1">
                    {/* 그룹 트리거 */}
                    <div className="flex items-center gap-1.5 rounded-md px-2 py-1.5 mb-0.5 text-content-tertiary">
                      <div className="h-3 w-3 rounded-sm bg-primary shrink-0" />
                      <span className="text-[12px] truncate flex-1">배정 고객 관리</span>
                      <svg width="10" height="10" viewBox="0 0 10 10" className="shrink-0 text-content-disabled" fill="none"><path d="M2.5 4L5 6.5L7.5 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </div>
                    {/* 서브메뉴 — 확장 상태 */}
                    <div className="ml-4 flex flex-col gap-0.5">
                      {[
                        { label: "상담 진행 고객", active: true },
                        { label: "계약 예정 고객", active: false },
                        { label: "상담 종료 고객", active: false },
                      ].map(item => (
                        <div
                          key={item.label}
                          className={`flex items-center rounded-md px-2 py-1.5 ${
                            item.active
                              ? "bg-primary-subtle text-primary font-semibold"
                              : "text-content-tertiary"
                          }`}
                        >
                          <span className="text-[11px] truncate">{item.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  {/* DB 배정 관리 — 접힘 */}
                  <div className="px-2 pb-1">
                    <div className="flex items-center gap-1.5 rounded-md px-2 py-1.5 mb-0.5 text-content-tertiary">
                      <div className="h-3 w-3 rounded-sm bg-fill-normal shrink-0" />
                      <span className="text-[12px] truncate flex-1">DB 배정 관리</span>
                      <svg width="10" height="10" viewBox="0 0 10 10" className="shrink-0 text-content-disabled" fill="none"><path d="M4 2.5L6.5 5L4 7.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </div>
                  </div>
                  {/* 배정 설정 관리 — 접힘 */}
                  <div className="px-2 pb-1">
                    <div className="flex items-center gap-1.5 rounded-md px-2 py-1.5 mb-0.5 text-content-tertiary">
                      <div className="h-3 w-3 rounded-sm bg-fill-normal shrink-0" />
                      <span className="text-[12px] truncate flex-1">배정 설정 관리</span>
                      <svg width="10" height="10" viewBox="0 0 10 10" className="shrink-0 text-content-disabled" fill="none"><path d="M4 2.5L6.5 5L4 7.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </div>
                  </div>
                  {/* 하단 */}
                  <div className="px-2 pt-1 pb-3 mt-1 border-t border-subtle">
                    {["마이페이지", "설정"].map(label => (
                      <div key={label} className="flex items-center gap-2 rounded-md px-2 py-1.5 text-content-quaternary">
                        <span className="text-[12px]">{label}</span>
                      </div>
                    ))}
                  </div>
                </div>
                {/* 토큰 설명 */}
                <div className="flex-1 min-w-0">
                  <div className="rounded-lg border-border05 border-subtle bg-canvas-primary overflow-hidden">
                    <table className="w-full text-[12px]">
                      <thead>
                        <tr className="border-b border-divider-normal bg-fill-subtle">
                          <th className="text-left py-2 px-3 font-semibold text-content-assistive">상태</th>
                          <th className="text-left py-2 px-3 font-semibold text-content-assistive">클래스</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          { state: "활성 서브메뉴",           cls: "bg-primary-subtle text-primary font-semibold  (= blue-50 #e8f3ff)" },
                          { state: "비활성 서브메뉴",          cls: "text-content-quaternary hover:bg-alpha-black-05" },
                          { state: "그룹 트리거 (활성 자식)",  cls: "text-content-quaternary — 아이콘만 활성 표시" },
                          { state: "hover 오버레이",           cls: "bg-alpha-black-05 (5% 불투명 다크 오버레이)" },
                          { state: "컨테이너",                 cls: "w-[160px] bg-canvas-secondary border-r border-subtle" },
                        ].map(r => (
                          <tr key={r.state} className="border-t border-divider-subtle">
                            <td className="py-2.5 px-3 text-content-primary font-medium whitespace-nowrap">{r.state}</td>
                            <td className="py-2.5 px-3">
                              <code className="text-[10px] bg-primary-subtle text-primary px-1.5 py-0.5 rounded">{r.cls}</code>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>

            {/* 헤더 */}
            <div>
              <SubLabel note="header.tsx — h-12 / bg-canvas-secondary / border-b border-divider-normal">헤더</SubLabel>
              <ShadcnRef components={["sidebar", "button", "avatar"]} sourceFile="src/components/header.tsx" />
              <div className="flex flex-col gap-4">
                {/* 목업 — 실제 header.tsx와 동기화 (h-12, bg-canvas-secondary, border-divider-normal) */}
                <div className="rounded-lg border-border05 border-subtle overflow-hidden">
                  <div className="h-12 flex items-center justify-between border-b border-divider-normal bg-canvas-secondary">
                    {/* 좌: 토글 + 보닥 플래너 + 구분선 + KB라이프 로고 */}
                    <div className="flex items-center">
                      {/* 사이드바 아이콘 컬럼 너비(4rem) 안에 토글 */}
                      <div className="flex w-16 shrink-0 items-center justify-center">
                        <button className="h-8 w-8 rounded-md flex items-center justify-center text-content-quaternary hover:bg-canvas-quaternary transition-colors">
                          <Menu className="h-4 w-4" strokeWidth={2} />
                        </button>
                      </div>
                      <span className="font-size-16 font-weight-bold font_letter_spacing-050 text-sidebar-foreground mr-2">보닥 플래너</span>
                      <div className="h-4 w-px bg-border shrink-0 mr-2" />
                      <span className="text-[10px] text-content-disabled font-medium">[KB라이프 SVG · h:16px]</span>
                    </div>
                    {/* 우: 세션 + 연장 + 구분선 + 프로필 */}
                    <div className="flex items-center gap-2 pr-4">
                      <span className="font-medium text-xs tabular-nums tracking-tighter text-content-assistive">세션 10:00</span>
                      <Button variant="outline" size="xs" className="text-xs">연장</Button>
                      <div className="h-4 w-px bg-border mx-0.5 shrink-0" />
                      <div className="h-7 w-7 rounded-full bg-canvas-quaternary flex items-center justify-center cursor-pointer">
                        <User className="h-3.5 w-3.5 text-content-assistive" />
                      </div>
                      <div className="h-7 w-7 rounded-full bg-primary-subtle border border-primary flex items-center justify-center ml-1">
                        <User className="h-3.5 w-3.5 text-primary" />
                      </div>
                    </div>
                  </div>
                  {/* 내용 플레이스홀더 */}
                  <div className="h-16 flex items-center justify-center bg-canvas-secondary">
                    <p className="text-body5-normal text-content-assistive">페이지 콘텐츠</p>
                  </div>
                </div>
                {/* 토큰 */}
                <div className="rounded-lg border-border05 border-subtle bg-canvas-primary overflow-hidden">
                  <table className="w-full text-[12px]">
                    <thead>
                      <tr className="border-b border-divider-normal bg-fill-subtle">
                        <th className="text-left py-2 px-3 font-semibold text-content-assistive">속성</th>
                        <th className="text-left py-2 px-3 font-semibold text-content-assistive">값</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { attr: "높이",        val: "h-12 (48px)" },
                        { attr: "배경",        val: "bg-canvas-secondary" },
                        { attr: "하단 선",     val: "border-b border-divider-normal" },
                        { attr: "좌측 영역",   val: "토글(w-16) + 보닥 플래너 + 구분선 + KB라이프 SVG" },
                        { attr: "우측 영역",   val: "세션 + 연장 Button + 구분선 + Avatar(h-7)" },
                        { attr: "shadcn 컴포넌트", val: "useSidebar / Button / Avatar / AvatarFallback" },
                      ].map(r => (
                        <tr key={r.attr} className="border-t border-divider-subtle">
                          <td className="py-2.5 px-3 text-content-primary font-medium">{r.attr}</td>
                          <td className="py-2.5 px-3">
                            <code className="text-[10px] bg-primary-subtle text-primary px-1.5 py-0.5 rounded">{r.val}</code>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </Section>

          {/* 06. 카드 */}
          <Section tab="components" id="cards" title="카드">

            <div>
              <SubLabel>기본 카드</SubLabel>
              <div className="bg-canvas-primary rounded-lg border-border05 border-subtle">
                <div className="px-6 pt-5 pb-3">
                  <p className="text-body3-bold text-content-primary">카드 타이틀</p>
                  <p className="text-body5-normal text-content-assistive mt-0.5">bg-canvas-primary · rounded-lg · border-subtle</p>
                </div>
                <div className="mx-6 h-px bg-divider-subtle" />
                <div className="px-6 py-4">
                  <p className="text-body4-normal text-content-secondary">
                    내부 구분선:{" "}
                    <code className="text-[11px] bg-primary-subtle text-primary px-1.5 py-0.5 rounded">mx-6 h-px bg-divider-subtle</code>
                    {" "}— 좌우 mx-6 인셋 필수
                  </p>
                </div>
              </div>
            </div>

            <div>
              <SubLabel>KPI 타일 카드</SubLabel>
              <div className="bg-canvas-primary rounded-lg pt-4 pb-3 border-border05 border-subtle">
                <div className="flex items-stretch">
                  {[
                    { label: "전체", value: "100", unit: "명" },
                    { label: "승인대기", value: "50", unit: "명" },
                    { label: "정상", value: "10", unit: "명" },
                    { label: "일시제한", value: "10", unit: "명" },
                  ].map((stat, i) => (
                    <div key={stat.label} className="flex-1 px-6 relative">
                      {i > 0 && <div className="absolute left-0 top-1/2 -translate-y-1/2 h-12 w-px bg-divider-normal" />}
                      <p className="text-[12px] font-medium text-content-assistive mb-1.5 tracking-tight leading-none whitespace-nowrap">{stat.label}</p>
                      <div className="flex items-baseline gap-0.5">
                        <span className="text-h3-bold tabular-nums text-content-primary">{stat.value}</span>
                        <span className="text-h3-bold tabular-nums text-content-primary">{stat.unit}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <p className="text-[11px] text-content-assistive mt-1.5">
                수직 구분선:{" "}
                <code className="text-[11px] bg-primary-subtle text-primary px-1.5 py-0.5 rounded">absolute h-12 w-px bg-divider-normal</code>
              </p>
            </div>
          </Section>

          {/* 07. 버튼 */}
          <Section tab="components" id="buttons" title="버튼">

            <div>
              <SubLabel>변형 × 크기 매트릭스</SubLabel>
              <div className="rounded-lg border-border05 border-subtle bg-canvas-primary overflow-hidden">
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
              <SubLabel>아이콘 + 텍스트 조합</SubLabel>
              <div className="flex flex-wrap gap-3 items-end p-4 bg-canvas-primary rounded-lg border-border05 border-subtle">
                {BUTTON_VARIANTS.map(v => (
                  <Button key={v.label} variant={v.variant}>
                    <Search />
                    버튼
                  </Button>
                ))}
              </div>
              <p className="text-[11px] text-content-assistive mt-1.5">
                아이콘은 버튼 텍스트 앞에 배치. data-[icon=inline-start] 자동 좌측 패딩 조정.
              </p>
            </div>

            <div>
              <SubLabel>아이콘 버튼 사이즈</SubLabel>
              <div className="flex items-end gap-4">
                {ICON_SIZES.map(s => (
                  <div key={s.size} className="flex flex-col items-center gap-2">
                    <Button variant="outline" size={s.size} className="border-subtle">
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
              <SubLabel>shadcn 마이그레이션</SubLabel>
              <div className="rounded-lg border-border05 border-subtle bg-canvas-primary overflow-hidden">
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
                        { v: "primary",     bg: "bg-primary",              text: "text-inverse-primary",  hover: "bg-primary-hover"            },
                        { v: "secondary",   bg: "bg-primary-subtle",       text: "text-primary",          hover: "bg-primary-subtle-hover"     },
                        { v: "outline",     bg: "border-border",           text: "text-content-primary",  hover: "bg-canvas-quaternary"        },
                        { v: "ghost",       bg: "—",                       text: "text-content-primary",  hover: "bg-canvas-quaternary"        },
                        { v: "neutral",     bg: "bg-canvas-quaternary",    text: "text-content-primary",  hover: "bg-fill-hover"               },
                        { v: "destructive", bg: "bg-destructive-subtle",   text: "text-destructive",      hover: "bg-destructive-subtle-hover" },
                      ].map(r => (
                        <tr key={r.v} className="border-t border-divider-subtle">
                          <td className="py-2 px-3 text-content-tertiary font-medium">{r.v}</td>
                          <td className="py-2 px-3">
                            <code className="text-[10px] bg-primary-subtle text-primary px-1 py-0.5 rounded">{r.bg}</code>
                          </td>
                          <td className="py-2 px-3">
                            <code className="text-[10px] bg-primary-subtle text-primary px-1 py-0.5 rounded">{r.text}</code>
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
                  <span>focus →{" "}<code className="text-[10px] bg-primary-subtle text-primary px-1 py-0.5 rounded">border-ring ring-ring-glow</code></span>
                  <span>disabled →{" "}<code className="text-[10px] bg-primary-subtle text-primary px-1 py-0.5 rounded">opacity-50 pointer-events-none</code></span>
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
                  label: "상태",
                  defaultValue: "all",
                  options: [
                    { value: "all", label: "전체" },
                    { value: "active", label: "진행중" },
                    { value: "done", label: "완료" },
                  ],
                }]}
              />
            </div>

            <div>
              <SubLabel>개별 컨트롤 패턴</SubLabel>
              <div className="grid grid-cols-3 gap-4">
                <ControlSample label="Select — h-9 border-subtle bg-fill-filter">
                  <Select defaultValue="all">
                    <SelectTrigger className="border-subtle bg-fill-filter gap-1.5 text-content-primary">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-md border-subtle text-body4-normal">
                      <SelectItem value="all">상태 전체</SelectItem>
                      <SelectItem value="active">진행중</SelectItem>
                    </SelectContent>
                  </Select>
                </ControlSample>
                <ControlSample label="Input — variant='filter'">
                  <div className="relative flex items-center">
                    <Search className="pointer-events-none absolute left-3 h-4 w-4 text-content-disabled" />
                    <Input variant="filter" className="pl-9 placeholder:text-content-assistive" placeholder="고객명 검색" />
                  </div>
                </ControlSample>
                <ControlSample label="필터 초기화 (변경 시 노출)">
                  <button className="h-8 px-1 text-[12px] font-medium text-primary underline underline-offset-2 decoration-primary hover:opacity-70 active:scale-[0.97] transition-[transform,opacity] duration-100">
                    필터 초기화
                  </button>
                </ControlSample>
              </div>
              <p className="text-[11px] text-content-assistive mt-2">
                컨트롤 공통:{" "}
                <code className="text-[11px] bg-primary-subtle text-primary px-1 py-0.5 rounded">bg-fill-filter border-subtle shadow-none rounded-md h-9</code>
                {" "}· 초기화는 아이콘 버튼 금지 (텍스트 언더라인 버튼)
              </p>
            </div>

            <div>
              <SubLabel>Input / Select 마이그레이션</SubLabel>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-[11px] font-semibold text-content-primary mb-2">Input</p>
                  <MigrationTable rows={[
                    { from: "border-input (1px, border-border)",       to: 'variant="filter" → border-subtle',     reason: "필터용 연한 보더" },
                    { from: "bg-transparent",                      to: 'variant="filter" → bg-fill-filter',   reason: "페이지 bg-canvas-secondary 위 대비" },
                    { from: "text-content-assistive (placeholder)", to: "placeholder:text-content-assistive",          reason: "assistive = 우리 시스템 placeholder 토큰" },
                  ]} />
                </div>
                <div>
                  <p className="text-[11px] font-semibold text-content-primary mb-2">Select</p>
                  <MigrationTable rows={[
                    { from: "bg-primary (shadcn 서브틀 hover)",     to: "hover:bg-blue-tint + border-info + text-primary", reason: "brand 컬러 명시적 hover — named atomic 참조 (alpha modifier 금지)" },
                    { from: "bg-popover border-border (Content)",  to: "border-subtle className 추가",        reason: "필터용 보더를 subtle로 오버라이드" },
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
                      <div className="rounded-md border border-subtle bg-canvas-primary">
                        <div className="px-3 py-2 flex items-center justify-between border-b border-divider-subtle">
                          <p className="text-[11px] font-semibold text-content-primary">카드 타이틀</p>
                          <div className="h-6 w-20 rounded bg-fill-filter border border-subtle" />
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
                        <div className="rounded-md border border-subtle bg-canvas-primary px-3 py-2 flex gap-2">
                          <div className="h-6 w-16 rounded bg-fill-filter border border-subtle" />
                          <div className="h-6 w-20 rounded bg-fill-filter border border-subtle" />
                        </div>
                        <div className="rounded-md border border-subtle bg-canvas-primary h-12 flex items-center justify-center">
                          <p className="text-[11px] text-content-assistive">테이블</p>
                        </div>
                      </div>
                    ),
                  },
                ].map(p => (
                  <div key={p.title} className="rounded-lg border-border05 border-subtle bg-canvas-primary p-3">
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
            <div className="rounded-lg border-border05 border-subtle bg-canvas-primary overflow-hidden">
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
                    <TableRow key={i} className="cursor-pointer border-divider-subtle">
                      <TableCell className="text-center num-cell">{i}</TableCell>
                      <TableCell className="text-left text-content-primary">이민혁</TableCell>
                      <TableCell className="text-left num-cell">010-1111-1111</TableCell>
                      <TableCell className="text-left">본사 &gt; 사업단 1 &gt; 지점 1</TableCell>
                      <TableCell className="text-left num-cell">2026.01.01</TableCell>
                      <TableCell className="text-left">
                        <Badge variant="tint-success">정상</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <div className="rounded-lg border-border05 border-subtle bg-canvas-primary overflow-hidden">
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
                    { attr: "행 hover",        val: "hover:bg-alpha-black-02", note: "alpha 2% — 매우 미세, 텍스트 안 진해짐" },
                    { attr: "선택 행",         val: "data-[state=selected]:bg-blue-tint", note: "blue-50" },
                    { attr: "선택 행 hover",   val: "data-[state=selected]:hover:bg-primary-subtle-hover", note: "blue-75 — 선택+hover 시 한 단계 진하게" },
                  ].map(r => (
                    <tr key={r.attr} className="border-t border-divider-subtle">
                      <td className="py-2.5 px-3 font-medium text-content-primary">{r.attr}</td>
                      <td className="py-2.5 px-3"><code className="text-[11px] bg-primary-subtle text-primary px-1.5 py-0.5 rounded">{r.val}</code></td>
                      <td className="py-2.5 px-3 text-content-assistive">{r.note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Section>

          {/* 10. 배지 */}
          <Section tab="components" id="badges" title="배지">
            <div>
              <SubLabel>태그 배지 — 상태·분류 (tint 스타일)</SubLabel>
              <div className="flex flex-wrap gap-2 mb-3">
                <Badge variant="tint-success">진행중</Badge>
                <Badge variant="tint-warning">대기</Badge>
                <Badge variant="tint-danger">상담 거절</Badge>
                <Badge variant="tint-blue">진행 예정</Badge>
                <Badge variant="tint-muted">계약 완료 / 종료</Badge>
              </div>
              <div className="flex flex-col gap-1">
                {[
                  { v: "tint-success", desc: "green-50 bg / green-450 text — 활성 진행 (db-status: 진행중)" },
                  { v: "tint-warning", desc: "amber-50 bg / amber-700 text — 주의·대기 (현재 사용처 없음)" },
                  { v: "tint-danger",  desc: "red-50 bg / red-600 text — 명확한 부정 (completed: 상담 거절)" },
                  { v: "tint-blue",    desc: "blue-50 bg / blue-700 text — 정보·신규 (db-status: 진행 예정)" },
                  { v: "tint-muted",   desc: "bg-canvas-quaternary / text-content-quaternary — 비활성·종결 (completed: 계약 완료, db-status: 종료)" },
                ].map(b => (
                  <div key={b.v} className="flex items-center gap-2">
                    <code className="text-[10px] text-primary w-24 shrink-0">{b.v}</code>
                    <span className="text-[10px] text-content-assistive">{b.desc}</span>
                  </div>
                ))}
              </div>
              <p className="text-[11px] text-content-assistive mt-2">
                <span className="text-content-primary font-medium">pill-* variants 제거</span> — tint-* (= tag) 스타일로 통일. 칸반 태그도 tint-* 사용.
              </p>
            </div>

            <div>
              <SubLabel>기본 변형 (shadcn 표준)</SubLabel>
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
              <SubLabel>shadcn 마이그레이션</SubLabel>
              <MigrationTable rows={[
                { from: "bg-canvas-primary text-inverse-primary (default variant)", to: "bg-primary text-inverse-primary",                     reason: "primary SWAP — brand badge = accent" },
                { from: "—",                                                        to: "tint-* variants 추가",                                  reason: "종결/분류용 배경 fill (badge-tint-* 전용 토큰)" },
                { from: "—",                                                        to: "bg-badge-tint-success-bg / text-badge-tint-success-fg", reason: "시맨틱 배지 색상 — globals.css에 전용 변수로 분리" },
                { from: "bg-primary text-inverse-primary (shadcn secondary)",       to: "bg-canvas-secondary text-secondary-foreground",          reason: "shadcn secondary = 우리 accent와 다른 값" },
              ]} />
            </div>
          </Section>

          {/* 11. 페이지네이션 */}
          <Section tab="components" id="pagination" title="페이지네이션">
            <div className="rounded-lg border-border05 border-subtle bg-canvas-primary">
              <PaginationDemo />
            </div>
            <div className="rounded-lg border-border05 border-subtle bg-canvas-primary overflow-hidden">
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
                      <td className="py-2.5 px-3"><code className="text-[11px] bg-primary-subtle text-primary px-1.5 py-0.5 rounded">{r.usage}</code></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Section>

          {/* 12. 차트 */}
          <Section tab="code" id="charts" title="차트 팔레트">
            <div className="rounded-lg border-border05 border-subtle bg-canvas-primary overflow-hidden">
              <div className="flex gap-4 items-end px-6 py-5">
                {CHART_COLORS.map((c, i) => (
                  <div key={c.name} className="flex flex-col items-center gap-2 flex-1">
                    <div
                      className="w-full rounded-md"
                      style={{ height: `${60 - i * 6}px`, backgroundColor: `var(--${c.name})` }}
                    />
                    <div className="text-center">
                      <code className="text-[11px] font-medium text-primary block">{c.name}</code>
                      <p className="text-[10px] text-content-assistive">{c.note}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="px-6 py-3 border-t border-divider-subtle bg-fill-subtle">
                <p className="text-[11px] text-content-assistive">
                  chart-1 = blue-500 (#3182f6) · chart-2~5 = violet-500/550/600/650 ·
                  Area 차트 3선: chart-1 / chart-3 / chart-5 순서
                </p>
              </div>
            </div>
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
                  <div className="bg-canvas-secondary rounded-md border border-subtle p-2 flex gap-2 h-28">
                    <div className="w-16 bg-fill-subtle rounded border border-subtle flex items-center justify-center shrink-0">
                      <p className="text-[9px] text-content-assistive font-medium">Tree</p>
                    </div>
                    <div className="flex-1 flex flex-col gap-1.5">
                      <div className="h-7 bg-canvas-primary rounded border border-subtle flex items-center px-2">
                        <p className="text-[9px] text-content-assistive">필터 (mb-4)</p>
                      </div>
                      <div className="flex-1 bg-canvas-primary rounded border border-subtle flex items-center px-2">
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
                  <div className="bg-canvas-secondary rounded-md border border-subtle p-2 flex gap-2 h-28">
                    <div className="w-16 bg-fill-subtle rounded border border-subtle flex items-center justify-center shrink-0">
                      <p className="text-[9px] text-content-assistive font-medium">Tree</p>
                    </div>
                    <div className="flex-1 flex flex-col gap-1.5">
                      <div className="flex-1 bg-canvas-primary rounded border border-subtle flex items-center px-2">
                        <p className="text-[9px] text-content-assistive">카드 1 (KPI/필터 내장)</p>
                      </div>
                      <div className="flex-1 bg-canvas-primary rounded border border-subtle flex items-center px-2">
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
                  <div className="bg-canvas-secondary rounded-md border border-subtle p-2 h-20">
                    <div className="h-full bg-canvas-primary rounded border border-subtle flex items-center px-2">
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
                  <div className="rounded-lg border-border05 border-subtle bg-canvas-primary p-3 overflow-x-auto">
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
                        ? "border-subtle bg-fill-subtle"
                        : "border-subtle bg-canvas-primary"
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

            <div className="rounded-lg border-border05 border-subtle bg-fill-subtle p-4">
              <p className="text-[12px] font-semibold text-content-primary mb-1">새 컴포넌트 추가 후 필수 작업</p>
              <code className="text-[12px] text-content-secondary font-mono">npx shadcn@latest add [component]</code>
              <div className="mt-3 flex flex-col gap-1">
                {[
                  "bg-canvas-primary → bg-primary (액션 버튼 색상)",
                  "bg-primary → bg-muted (서브틀 hover)",
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
