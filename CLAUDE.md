# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## ⚠️ Next.js 버전 주의

**Next.js 16.2.2 + React 19** — 기존 학습 데이터와 다를 수 있음. 코드 작성 전 반드시 확인:

```
node_modules/next/dist/docs/01-app/        ← App Router 관련
node_modules/next/dist/docs/03-architecture/
```

## 개발 명령어

```bash
npm run dev      # 개발 서버 (http://localhost:3000)
npm run build    # 프로덕션 빌드
npm run lint     # ESLint
```

shadcn 컴포넌트 추가:
```bash
npx shadcn@latest add [component]
```

설치된 shadcn 컴포넌트: button, input, select, table, checkbox, badge, tabs, card, scroll-area, sidebar, collapsible, avatar, dropdown-menu, tooltip, skeleton, sheet, separator, breadcrumb

## 프로젝트 개요

**보험설계사 CRM** — 보닥 플래너 for KB라이프. **라이트 모드 전용** (다크모드 제거됨).

**디자인 레퍼런스**: Amplitude (데이터 중심 B2B SaaS, 정보 밀도 높은 대시보드) + 토스증권 (한국 핀테크 감성, 여백, semibold 타이포, primary blue #3182F6, 카드 기반)

## 기술 스택

- **Next.js 16** App Router, **React 19**, **TypeScript**
- **Tailwind CSS v4** — `tailwind.config.js` 없음, `globals.css`의 `@theme inline`으로 토큰 관리
- **shadcn/ui** (`style: radix-vega`) — Radix UI primitives 직접 사용 (`radix-ui` 패키지)
- **Pretendard** — `node_modules/pretendard`에서 로컬 폰트로 로드 (`layout.tsx`)
- **@dnd-kit** — 칸반 보드 드래그앤드롭

## 디자인 시스템

### 다크모드 제거

`globals.css`에서 `.dark {}` 블록 및 `@custom-variant dark` 완전 제거. 모든 UI 컴포넌트에서 `dark:` prefix 클래스 제거됨. **`dark:` 클래스 절대 추가하지 말 것.**

### 색상 (globals.css `:root`)

Toss Invest 라이트 팔레트:
- `--primary`: `oklch(0.588 0.228 254.1)` — #3182F6 시그니처 블루
- `--foreground`: `oklch(0.155 0.018 250.0)` — #191F28 기본 텍스트
- `--muted`: `oklch(0.960 0.005 260.0)` — #F2F4F6 배경
- `--muted-foreground`: `oklch(0.620 0.020 255.0)` — #8B95A1 보조 텍스트
- `--border`: `oklch(0.916 0.006 258.0)` — #E5E8EB 보더

### 카드 스타일

그림자 없음, 보더만 사용. **`rounded-lg` (Vega 스타일, `rounded-xl` 금지)**:
```tsx
<div className="bg-card rounded-lg border border-border/40">
```

KPI 타일 (StatsSection / AssignedDbTable 참고):
```tsx
<div className="bg-[#f8f9fa] rounded-lg p-6 hover:bg-[#f1f3f5] border border-transparent hover:border-slate-200/50">
```

### 카드 내부 구분선

카드 안에 `h-px` 구분선 사용 시 **반드시 `mx-6` 좌우 패딩 적용**. `border-b` 전체 너비 라인 금지:
```tsx
<div className="mx-6 h-px bg-border/30" />
```

### 버튼 패턴

shadcn size variant를 그대로 사용. **`h-*`, `px-*`, `text-[12px]` 수동 오버라이드 금지.** `rounded-md`는 필터 버튼에 명시 추가.

| 용도 | 코드 |
|---|---|
| 필터 검색 (보조 액션) | `<Button className="bg-primary/10 text-primary hover:bg-primary/20">` |
| 주요 액션 (저장, 재배정 등) | `<Button className="bg-primary text-primary-foreground hover:bg-primary/90">` |
| 초기화 아이콘 버튼 | `<Button variant="outline" size="icon" className="border-border/60">` |
| 연장 등 소형 버튼 | `<Button variant="outline" size="xs">` |

모든 필터 컨트롤(Select/Input/Button) 높이: shadcn 기본 `h-9` 통일. 버튼은 `size="default"` (h-9).

### 필터 컴포넌트 패턴

Select는 화이트+라인, Input은 muted fill, 순서는 Select → Input → 검색 → 초기화:

```tsx
{/* 담당설계사 Select — 화이트+라인, rounded-md */}
<Select>
  <SelectTrigger className="min-w-[130px] rounded-md border-border/60 shadow-none bg-background gap-2">
    <SelectValue />
  </SelectTrigger>
</Select>

{/* 고객명 Input — muted fill, rounded-md */}
<div className="relative flex items-center">
  <Search className="pointer-events-none absolute left-3 h-4 w-4 text-muted-foreground/40" />
  <Input className="w-[200px] rounded-md border-transparent pl-9 shadow-none bg-muted/60 placeholder:text-muted-foreground/40" />
</div>

{/* 검색 버튼 — blue tint, rounded-md */}
<Button className="bg-primary/10 text-primary hover:bg-primary/20 shadow-none rounded-md">검색</Button>

{/* 초기화 */}
<Button variant="outline" size="icon" className="border-border/60 shadow-none rounded-md">
  <RotateCcw className="h-4 w-4 text-muted-foreground/60" />
</Button>
```

**라운드 계층 규칙 (Vega 스타일)**:
- 카드: `rounded-lg`
- 필터 컨트롤 (Select / Input / Button, h-9): `rounded-md`
- 소형 컨트롤 (h-8, h-6): `rounded-md`

### 필터 위치 규칙

- **카드 1개 페이지** (계약 예정 고객, 배정 완료 DB): 필터를 카드 헤더 안에 배치
- **카드 2개 페이지** (상담 진행 고객): 필터를 해당 카드(칸반) 헤더 안에 배치
- 필터와 콘텐츠 사이 구분선 없음

### 타이포그래피

**`font-bold` 절대 금지 — 항상 `font-semibold` 사용.**

- 페이지 타이틀: `text-[28px] font-semibold tracking-tight`
- 카드 타이틀: `text-[20px] font-semibold tracking-tight`
- 테이블 헤더: `text-[12px] font-semibold text-muted-foreground/70`
- 테이블 셀: `text-[13px] text-foreground/80 py-3.5`

### Badge 커스텀 variant (칸반용)

`tag-red` / `tag-dark` / `tag-green` / `tag-blue` / `tag-muted` — 틴트 배지 (`badge.tsx` 참고)

## 레이아웃 구조

```
layout.tsx
├── AppSidebar (collapsible icon, 플로팅 토글 버튼)
└── main
    ├── Header (고정 상단 네비)
    └── {children}
```

### 페이지 공통 패턴

```tsx
<div className="h-full overflow-y-auto overflow-x-hidden bg-muted/40 scrollbar-hide">
  <div className="px-6 pt-10 pb-6">
    <h1 className="text-[28px] font-semibold text-foreground tracking-tight leading-tight">페이지명</h1>
    <p className="text-[12px] text-muted-foreground mt-0.5">부제목</p>
  </div>
  <div className="flex gap-3 px-6 pb-5 items-start">
    <BusinessTree visible={SHOW_ORG_TREE} />
    <div className="flex-1 min-w-0 flex flex-col gap-3">
      {/* 카드들 */}
    </div>
  </div>
</div>
```

## 컴포넌트 구조

### 공유

- `BusinessTree` — 사업단→지점→팀 3단계 조직도. `visible` prop으로 노출 제어.

### 페이지별 (`src/components/dashboard/`)

| 파일 | 용도 |
|---|---|
| `stats-section.tsx` | 통화현황 KPI 카드 |
| `kanban-filter.tsx` | 칸반 필터 (ConsultingSection 카드 헤더 내부) |
| `consulting-section.tsx` | 상담현황 카드 — 필터 헤더 + KanbanBoard |
| `kanban-board.tsx` | @dnd-kit 드래그 칸반 보드 |
| `pending-filter.tsx` | 계약 예정 고객 필터 (PendingTable 카드 헤더 내부) |
| `pending-table.tsx` | 계약 예정 고객 카드 — 필터 헤더 + 테이블 + 페이지네이션 |
| `assigned-db-filter.tsx` | 배정 완료 DB 필터 카드 (별도 카드, 지역 체크박스 포함) |
| `assigned-db-table.tsx` | 배정 완료 DB — 통계 타일 + 체크박스 테이블 + 선택 재배정 |

### 설정 페이지 (`src/components/settings/`)

설정 페이지는 BusinessTree 없음, 전체 너비 카드 레이아웃 사용.

| 파일 | 용도 |
|---|---|
| `reassign-type-settings.tsx` | 재배정 타입 설정 — 목록 뷰 |
| `reassign-type-edit.tsx` | 재배정 타입 설정 — 편집 뷰 (컬럼 헤더 + 행 편집) |
| `auto-assign-settings.tsx` | 자동 배정 설정 — 사용함/사용안함 라디오 |
| `recall-settings.tsx` | 자동 회수 설정 — 사용함/사용안함 + 시간 입력 |

### 라우트

```
/               → 상담 진행 고객  (조직도 + 통화현황카드 + 상담현황카드)
/pending        → 계약 예정 고객  (조직도 + 테이블카드)
/db/assigned    → 배정 완료 DB   (조직도 + 필터카드 + 통계+테이블카드)
/settings/reassign      → 재배정 타입 설정 목록
/settings/reassign/edit → 재배정 타입 설정 편집
/settings/auto          → 자동 배정 설정
/settings/recall        → 자동 회수 설정
```

## 수정 시 주의사항

**Input / SelectTrigger** — `bg-transparent` 금지. 각각 용도에 맞게:
- Select: `bg-background` (화이트)
- Input (필터): `bg-muted/60 border-transparent` (회색 fill)

**SelectContent** — `dark` 클래스 제거됨, `rounded-md`:
```tsx
<SelectContent className="rounded-md border-border/60">
```

**Button 사이즈** — shadcn size variant만 사용, `h-*` 수동 오버라이드 금지:
- `size="default"` → h-9 (필터 검색/액션 버튼)
- `size="sm"` → h-8
- `size="xs"` → h-6 (헤더 연장 버튼)
- `size="icon"` → h-9 w-9 (초기화 버튼)

**Checkbox 체크 상태**:
```tsx
className="h-4 w-4 rounded-[4px] border-border/60 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
```

**scrollbar-hide** — `globals.css`에 정의된 커스텀 유틸리티.

**그림자** — 모든 필터 컨트롤에 `shadow-none` 적용.

**Input 텍스트 크기 고정** — focus 시 폰트 크기가 변하는 문제 방지. 13px 명시 시 `!text-[13px] md:!text-[13px]` 사용 (Tailwind important modifier 필요).

## 디자인 작업 워크플로우 ("디자이너야")

디자인 개선/분석 요청 또는 "디자이너야" 호출 시 아래 4개 스킬을 모두 Skill 툴로 동시 호출:

1. `make-interfaces-feel-better` — UI 폴리시, 광학 정렬, 마이크로 인터랙션
2. `emil-design-eng` — Emil Kowalski UI 디테일 철학
3. `web-design-guidelines` — Vercel 웹 디자인 가이드라인
4. `ui-ux-pro-max` — UX/UI 종합 가이드

각 스킬 관점에서 개선점 도출 후 CRM 업무 맥락(보험설계사, 관리자)을 고려해 코드 반영.
