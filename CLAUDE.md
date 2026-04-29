# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

> [!NOTE]
> ## 🎨 디자인 시스템 — Semantic Sync (Figma 1:1 + shadcn 표준 호환)
>
> 이 프로젝트는 **shadcn 표준 의미를 그대로 사용** + Figma 토큰을 별도 prefix로 노출한다. 신규 shadcn 컴포넌트는 수정 없이 작동.
>
> | 클래스 | 의미 | 출처 |
> |---|---|---|
> | `bg-primary` / `text-primary` | 브랜드 블루 (#3182F6) | shadcn 표준 |
> | `bg-canvas-primary` | 흰 카드 배경 | Figma `bg_primary` |
> | `text-content-primary` | 진한 글자 (#191F28) | Figma `text_primary` |
> | `border-line-subtle` | 카드 보더 | Figma `border_subtle` |
> | `bg-action` / `text-action` | 브랜드 블루 semantic alias | Figma `accent` |
> | `bg-button-accent-primary` | 메인 액션 버튼 배경 | Figma 컴포넌트 토큰 |
> | `text-inverse-primary` | 흰 글자 (브랜드 위) | Figma `text_inverse_primary` |
>
> **B2B 다중 브랜드**: `--primary` CSS 변수 한 줄만 바꾸면 모든 컴포넌트 자동 추종.
> ```css
> [data-brand="green"] { --primary: var(--green-500); }
> ```

## ⚠️ Next.js 버전 주의

**Next.js 16.2.2 + React 19** — 기존 학습 데이터와 다를 수 있음. 코드 작성 전 반드시 확인:

```
node_modules/next/dist/docs/01-app/        ← App Router 관련
node_modules/next/dist/docs/03-architecture/
```

## 개발 명령어

```bash
npm run dev -- -p 3001   # 개발 서버 (http://localhost:3001) — 항상 3001 포트
npm run build            # 프로덕션 빌드
npm run lint             # ESLint
```

shadcn 컴포넌트 추가:
```bash
npx shadcn@latest add [component]
```

설치된 shadcn 컴포넌트 (26개, 사용 중인 것만):
avatar, badge, breadcrumb, button, calendar, chart, checkbox, collapsible, command, dialog, input, input-group, pagination, popover, radio-group, scroll-area, select, separator, sheet, sidebar, skeleton, table, tabs, textarea, toggle, tooltip

> 미사용 shadcn 컴포넌트는 정리 단계에서 제거됨 (accordion, alert, alert-dialog, aspect-ratio, button-group, card, carousel, combobox, context-menu, drawer, dropdown-menu, label, navigation-menu, resizable, slider, sonner, switch, toggle-group). 필요 시 `npx shadcn@latest add [name]` 으로 재추가.

## 프로젝트 개요

**보험설계사 CRM** — 보닥 플래너 for KB라이프. **라이트 모드 전용** (다크모드 제거됨).

**디자인 레퍼런스**: Amplitude (데이터 중심 B2B SaaS, 정보 밀도 높은 대시보드) + 토스증권 (한국 핀테크 감성, 여백, semibold 타이포, brand blue #3182F6, 카드 기반)

## 기술 스택

- **Next.js 16** App Router, **React 19**, **TypeScript**
- **Tailwind CSS v4** — `tailwind.config.js` 없음, `globals.css`의 `@theme inline` + `@utility`로 토큰 관리
- **shadcn/ui** (`style: radix-vega`) — Radix UI primitives 직접 사용 (`radix-ui` 패키지)
- **Pretendard** — `node_modules/pretendard`에서 로컬 폰트로 로드 (`layout.tsx`)
- **@dnd-kit** — 칸반 보드 드래그앤드롭

# 🎨 디자인 시스템 — Semantic Sync

## 다크모드 제거

`globals.css`에서 `.dark {}` 블록 및 `@custom-variant dark` 완전 제거. 모든 UI 컴포넌트에서 `dark:` prefix 클래스 제거됨. **`dark:` 클래스 절대 추가하지 말 것.**

## 토큰 시스템 — 3 Layer

`globals.css` 구조:

```
Layer 1 (Atomic):    --blue-500, --cool-neutral-990, --red-500, ...
Layer 2 (Semantic):
  - shadcn 표준: --primary, --primary-foreground, --accent, --muted, ...
  - Figma 1:1: --bg-primary, --text-primary, --border-subtle, ...
  - Figma 컴포넌트: --button-accent-primary, --action, --inverse-primary, ...
Layer 3 (Bridge):    @theme inline로 Tailwind 클래스 노출
```

**핵심 원칙**: shadcn `--primary` = brand blue (표준 그대로). Figma 토큰은 별도 prefix로 노출 (`bg-canvas-*`, `text-content-*`, `border-line-*` 등) → 이름 충돌 없음.

**⚠️ alpha modifier 원칙**: semantic 토큰에 `/숫자` alpha modifier 금지. 반드시 named atomic 토큰을 참조해야 한다.
- ❌ `bg-primary/10` → ✅ `bg-primary-subtle` (= `var(--blue-100)`)
- ❌ `hover:bg-primary/5` → ✅ `hover:bg-blue-tint` (= `var(--blue-50)`)
- ❌ `ring-ring/50` → ✅ `ring-ring-glow` (= `var(--blue-350)`)
- alpha가 필요한 경우 `--alpha-white-*`, `--alpha-blue-*` 같은 **명명된 원자 토큰**으로 정의해야 한다.

## 색상 토큰

### 1. 배경색

| 클래스 | 값 | 용도 |
|---|---|---|
| `bg-primary` | brand blue | shadcn primary 액션 (Button primary 등) |
| `bg-canvas-primary` | 흰 (#FFFFFF) | Figma `bg_primary`, 카드/모달 배경 |
| `bg-canvas-secondary` | cool-neutral-50 | Figma `bg_secondary` |
| `bg-canvas-tertiary` | cool-neutral-100 | Figma `bg_tertiary`, 페이지 배경 |
| `bg-canvas-quaternary` | cool-neutral-150 | Figma `bg_quaternary`, 섹션·홀수행 |
| `bg-muted` | cool-neutral-150 | shadcn 표준 hover/드롭다운 |
| `bg-action` | brand blue | Figma `accent` semantic |
| `bg-button-accent-primary` | brand blue | Figma 버튼 컴포넌트 토큰 |
| `bg-button-accent-secondary` | brand blue 10% | Figma 버튼 보조 |
| `bg-button-surface-neutral` | cool-neutral-50 | Figma 버튼 중립 |

### 2. 텍스트색

| 클래스 | 값 | 용도 |
|---|---|---|
| `text-primary` | brand blue | shadcn primary 글자, 링크 |
| `text-primary-foreground` | 흰 | brand blue 위 텍스트 (Button primary) |
| `text-content-primary` | #191F28 | Figma `text_primary`, 진한 본문 |
| `text-content-secondary` | cool-neutral-900 | Figma `text_secondary` |
| `text-content-tertiary` | cool-neutral-700 | Figma `text_tertiary` |
| `text-content-quaternary` | cool-neutral-600 | Figma `text_quaternary` |
| `text-content-assistive` | #8B95A1 | Figma `text_assistive`, 플레이스홀더 |
| `text-content-disabled` | cool-neutral-400 | Figma `text_disabled` |
| `text-action` | brand blue | Figma `text_accent` |
| `text-inverse-primary` | 흰 | Figma `text_inverse_primary` |
| `text-inverse-secondary` | 흰 70% | Figma `text_inverse_secondary` |
| `text-inverse-tertiary` | 흰 50% | Figma `text_inverse_tertiary` |
| `text-foreground` | text-content-primary과 동일 | shadcn 호환 |

### 3. 보더

| 클래스 | 값 | 용도 |
|---|---|---|
| `border-primary` | brand blue | shadcn primary 보더 |
| `border-line-subtle` | cool-neutral-200 | Figma `border_subtle`, 카드 보더 |
| `border-line-primary` | cool-neutral-300 | Figma `border_primary` |
| `border-line-strong` | cool-neutral-400 | Figma `border_strong` |
| `border-action` | brand blue | Figma `border_accent` |
| `border-border` | shadcn 표준, border-line-primary와 동일 | shadcn 호환 |

### 4. 사용 금지

```tsx
❌ bg-brand / text-brand          // reference에 없는 토큰
❌ bg-surface-* / text-label-*    // 옛 prefix
❌ border-line-* (옛 의미)         // 옛 prefix (현재는 신규 의미로 사용 OK — 위 표 참고)
❌ var(--ds-*) / var(--atom-*)    // 옛 변수명
❌ font-bold                      // → font-semibold
❌ rounded-xl                     // → rounded-lg
❌ dark: prefix                   // 다크모드 미지원
❌ bg-accent / text-accent / border-accent (옛 의미)  // 현재는 shadcn 표준 hover 의미 (서브틀 그레이)
```

## B2B 다중 브랜드 — 브랜드별 컬러 커스터마이징

CRM은 한 build로 여러 테넌트(브랜드) 대응이 가능. 브랜드별로 변경되는 색상은 **`--primary` 한 변수**.

### 적용 방법

**1단계 — `globals.css`에 브랜드별 오버라이드 추가**:
```css
/* :root 블록 안 또는 끝부분 */
[data-brand="green"] {
  --primary: var(--green-500);
}
[data-brand="orange"] {
  --primary: oklch(0.65 0.20 45);  /* 임의 hex/oklch도 가능 */
}
```

**2단계 — `<html>` 또는 `<body>` 또는 페이지 wrapper에 `data-brand` 속성 적용**:
```tsx
// app/layout.tsx
<html lang="ko" data-brand={tenant.brand}>  // "default" | "green" | "orange"
```

또는 런타임 동적 변경:
```tsx
useEffect(() => {
  document.documentElement.dataset.brand = currentTenant.brand
}, [currentTenant])
```

### 영향 받는 컴포넌트 (자동 추종)

`--primary` 변경 시 다음이 모두 자동으로 새 브랜드 색을 사용:
- `<Button variant="primary">` (액션 버튼)
- `<Badge variant="default">`
- 사이드바 selected/ring
- 링크 (`text-primary`)
- 체크박스/라디오 ON 상태
- focus ring
- 필터 검색 버튼
- 캘린더 선택 날짜
- 토글/스위치 ON

**컴포넌트 코드는 수정 불필요** — `bg-primary`/`text-primary`/`border-primary` 사용처가 모두 CSS 변수를 통해 추상화돼 있음.

### 예외 — 브랜드와 무관한 토큰

다음 토큰들은 reference에서 정적 색이라 브랜드와 무관:
- `bg-blue-tint`/`text-blue-tint` 등 — info 배지용 파랑 (브랜드가 그린이어도 info=파랑)
- `bg-success`/`bg-warning`/`bg-destructive` — 시맨틱 상태색

## Reference 추가 토큰 (Border / Radius / Spacing / Shadow)

레퍼런스 디자인 시스템의 nominal 토큰을 그대로 노출:

> ⚠️ **현재 v1 상태**: 토큰만 globals.css에 정의됨. 컴포넌트는 아직 Tailwind 기본 스케일(`p-2`, `gap-4`, `rounded-md`)과 직접 픽셀(`text-[28px]`) 위주로 사용 중.
> 신규 작업/리팩터 시 reference 토큰으로 점진 도입 권장. 강제 마이그레이션 X (Tailwind 기본도 4px 그리드라 시각 차이 없음).

### Border Width
```tsx
border-border05    // 0.5px (특수 케이스만)
border-border10    // 1px (기본값, Tailwind border와 동일)
```

### Radius (`r4` ~ `r9999`)
```tsx
rounded-r4    // 4px — 버튼
rounded-r6    // 6px
rounded-r8    // 8px — 버튼
rounded-r10   // 10px
rounded-r12   // 12px — 버튼, 태그/배지
rounded-r16   // 16px — 리스트, 버튼
rounded-r20   // 20px — 모달
rounded-r24   // 24px — 카드, 리스트
rounded-r9999 // 9999px — pill
```

기존 `rounded-md` / `rounded-lg`도 계속 사용 가능 (shadcn 호환).

### Spacing (`s2` ~ `s64`)
```tsx
p-s4  gap-s8  m-s16  px-s24  py-s12  ...
// 사용 가능: s2, s4, s6, s8, s10, s12, s16, s20, s24, s28, s30, s32, s38, s40, s44, s48, s52, s56, s58, s64
```

기존 Tailwind 기본 스케일(`p-2`, `gap-4` 등)도 그대로 사용 가능 — 4px 그리드 동일.

### Shadow
```tsx
shadow-sd03   // 0 2 20 rgba(0,0,0,0.3)
shadow-sd25   // 0 4 20 rgba(0,0,0,0.25)
```

## 타이포그래피 — Reference Composite 토큰

**`font-bold` 절대 금지 — 항상 `font-semibold` 사용.**

### 신규 (reference 1:1) — 사용 권장 (점진 도입)

> ⚠️ **현재 v1 상태**: globals.css에 정의됨. 컴포넌트는 아직 LEGACY `text-heading-xl/lg/md` 또는 직접 픽셀(`text-[28px] font-semibold`) 위주로 사용 중.
> 신규 작업 시 아래 composite 토큰 사용 권장.

```tsx
text-h1-bold                              // 36/46 semibold
text-h2-bold / text-h2                    // 34/40 semi/medium
text-h3-bold / text-h3                    // 24/36 semi/medium
text-h4                                   // 22/32 semibold
text-h5-bold / text-h5-medium / text-h5   // 20/30
text-body1-bold / text-body1              // 18/28
text-body2-bold / text-body2-medium / text-body2-normal  // 16/24
text-body3-bold / text-body3-medium / text-body3-normal  // 14/22
text-body4-bold / text-body4-medium / text-body4-normal  // 13/18-20
text-body5-bold / text-body5-medium / text-body5-normal  // 12/16-20
text-caption / text-caption-bold / text-caption-underline // 10/16
```

각 토큰은 font-size + line-height + font-weight + letter-spacing(-0.5px 기본) 모두 한 클래스에 묶여있음. `_underline` 서픽스는 `text-decoration: underline` 포함.

### LEGACY (호환 유지, 점진 교체 권장)

`text-heading-xl/lg/md`, `text-body-md/sm`, `text-label-md/sm/xs`, `text-nav`, `text-caption`, `text-kpi`, `text-num-md/sm` — 기존 코드에서 동작. 새 작업은 위의 reference composite 토큰 사용.

### 자주 쓰는 패턴

- 페이지 타이틀: `text-[28px] font-semibold text-primary tracking-tight leading-tight` (reference에 28px 없어 직접 지정)
- 카드 타이틀: `text-[20px] font-semibold text-primary tracking-tight`
- 테이블 헤더: `text-[12px] font-medium text-assistive`
- 테이블 셀: `text-[13px] text-primary`
- KPI 숫자: `text-[24px] font-semibold tracking-tight text-primary leading-none tabular-nums`

### Typography composite 토큰 (`text-*`) vs 직접 픽셀 지정

**권장**: 본문/설명 텍스트처럼 **표준 라인하이트가 적합**한 곳은 text-* 사용
- 본문 16px: `text-body2-normal` (16/24/400)
- 본문 14px: `text-body3-normal` (14/22/400)
- 캡션 12px: `text-body5-medium` (12/16/500)

**직접 픽셀 사용**: 페이지 타이틀, KPI 숫자처럼 **커스텀 line-height/tracking** 필요한 곳
- text_h3_bold(24/36)과 KPI(24/leading-none) 충돌 → 직접 지정이 적절
- 페이지 타이틀 28px → reference에 없어서 직접 지정

→ 두 방식 혼용은 의도된 trade-off. 강제 통일 X.

# 🚨 신규 shadcn 컴포넌트 추가

`npx shadcn@latest add [component]` 실행 후 **추가 작업 거의 불필요**. 토큰 의미가 shadcn 표준과 일치하므로 그대로 작동.

## 필수 검증 (3단계)

1. **`dark:` prefix 제거** — 라이트 모드 전용
2. **`font-bold` → `font-semibold`** — 굵기 통일
3. **`rounded-xl` → `rounded-lg`** — Vega 스타일 (`rounded-r20`/`rounded-r24`는 OK)

## 선택적 작업

- 컴포넌트가 Figma 컴포넌트 토큰(`button_accent_primary` 등)에 매핑되면 alias 클래스 사용 권장
- 카드/배경에서 흰색 의도면 `bg-canvas-primary` 사용 (shadcn `bg-card` 그대로도 OK)
- 진한 글자 의도면 `text-content-primary` 사용 (shadcn `text-foreground` 그대로도 OK)

## ✅ 검증 체크리스트

```bash
grep "dark:\|font-bold\|rounded-xl" <new-file>   # 0건이어야 함
```

## design-system 페이지 토큰 시각화 규칙

`/design-system` 페이지에서 색상 토큰을 swatch로 보여줄 때 **prefix와 시각화가 일치**해야 함:

```tsx
// ✅ bg-* 토큰: 면 채움
{ name: "bg-primary", kind: "bg" }
// → <div className="bg-primary border border-subtle" />

// ✅ text-* 토큰: 그 색의 글자 샘플
{ name: "text-primary", kind: "text" }
// → <span style={{ color: "var(--text-primary)" }}>Aa</span>

// ✅ border-* 토큰: 실제 보더로 둘러싸기
{ name: "border-subtle", kind: "border" }
// → <div style={{ border: "2px solid var(--border-subtle)" }} />

// ❌ 절대 금지 — prefix 미스매치
{ name: "border-subtle", cls: "bg-border-subtle" }  // 정의 안 됨, 작동 안 함
```

`TokenRow` 컴포넌트가 `kind` prop에 따라 자동으로 적절한 시각화 렌더링.

# 레이아웃 / 컴포넌트 패턴

## 카드 스타일

그림자 없음, 보더만 사용. **`rounded-lg` (Vega 스타일, `rounded-xl` 금지)**:

```tsx
<div className="bg-primary rounded-lg border border-subtle">
```

## KPI StatsSection 카드

`ConsultingSection` 및 `AssignedDbTable`에서 사용하는 KPI 타일 패턴:

```tsx
<div className="bg-primary rounded-lg py-5 border border-subtle">
  <div className="flex items-stretch">
    {stats.map((stat, i) => (
      <div key={stat.label} className="flex-1 px-6 relative">
        {i > 0 && <div className="absolute left-0 top-1/2 -translate-y-1/2 h-12 w-px bg-divider-normal" />}
        <p className="text-[12px] font-medium text-assistive mb-2.5 tracking-tight leading-none whitespace-nowrap">
          {stat.label}
        </p>
        <div className="flex items-baseline gap-0.5">
          <span className="text-[24px] font-semibold tracking-tight text-foreground leading-none tabular-nums">
            {stat.value}
          </span>
          <span className="text-[24px] font-semibold tracking-tight text-foreground leading-none">
            {stat.unit}
          </span>
        </div>
      </div>
    ))}
  </div>
</div>
```

## 카드 내부 구분선

카드 안에 `h-px` 구분선 사용 시 **반드시 `mx-6` 좌우 패딩 적용**. `border-b` 전체 너비 라인 금지:

```tsx
<div className="mx-6 h-px bg-divider-subtle" />
```

## 버튼 패턴

shadcn `Button` size variant를 그대로 사용. **`h-*`, `px-*` 수동 오버라이드 금지.**

| 용도 | 코드 |
|---|---|
| 메인 액션 (저장, 재배정 등) | `<Button>` (variant="primary" — `bg-primary text-primary-foreground` 내장) |
| 필터 검색 (보조 액션) | `<Button variant="secondary">` |
| 연장 등 소형 버튼 | `<Button variant="outline" size="xs">` |
| 어두운 강조 버튼 | `bg-foreground text-inverse-primary hover:bg-foreground-hover` (예: 멤버 상세 페이지) |

모든 필터 컨트롤(Select/Input/Button) 높이: shadcn 기본 `h-9` 통일. 버튼은 `size="default"` (h-9).

## 필터 컴포넌트 패턴

필터 컨트롤은 **`bg-fill-filter` (= 흰색)** + **`border-subtle`** 통일. `bg-muted/60` 사용 금지 — 페이지 배경(`bg-tertiary`)과 대비가 거의 없어 필 영역이 안 보임.

순서: Select → Input → 검색 → 필터 초기화

```tsx
{/* Input — filter variant 사용 */}
<Input variant="filter" className="w-[200px] pl-9" />

{/* Select */}
<SelectTrigger className="bg-fill-filter border-subtle">...</SelectTrigger>

{/* 검색 버튼 */}
<Button variant="secondary" className="shadow-none rounded-md">검색</Button>

{/* 필터 초기화 — 필터 변경 시에만 노출, 텍스트 언더라인 버튼 */}
{hasFilter && (
  <button
    onClick={handleReset}
    className="h-8 px-1 text-[12px] font-medium text-primary underline underline-offset-2 decoration-primary hover:opacity-70 active:scale-[0.97] transition-[transform,opacity] duration-100"
  >
    필터 초기화
  </button>
)}
```

**필터 초기화 버튼 규칙**:
- 아이콘 버튼(`RotateCcw`) 사용 금지 → 텍스트 언더라인 버튼으로 통일
- 모든 필터가 기본값일 때 숨김, 하나라도 변경되면 노출

**라운드 계층 규칙 (Vega 스타일)**:
- 카드: `rounded-lg`
- 필터 컨트롤 (Select / Input / Button, h-9): `rounded-md`
- 소형 컨트롤 (h-8, h-6): `rounded-md`

## 필터 위치 규칙

페이지별로 두 가지 패턴이 공존:

**패턴 A — 필터가 카드 헤더 내부** (단순 SearchFilter):
- `/` — KanbanFilter가 ConsultingSection 카드 헤더 안
- `/pending` — SearchFilter가 PendingTable 카드 헤더 안

**패턴 B — 필터 카드가 별도 분리** (`mb-4` 간격):
- `/completed`, `/db/assigned`, `/db/unassigned` — 필터 컴포넌트를 `<div className="mb-4">` 로 감싸고 테이블 위에 배치

```tsx
<div className="flex-1 min-w-0">
  <div className="mb-4"><CompletedFilter /></div>
  <CompletedTable />
</div>
```

## Badge 커스텀 variant (칸반용)

`tag-red` / `tag-dark` / `tag-green` / `tag-blue` / `tag-muted` — 틴트 배지 (`badge.tsx` 참고)

# 레이아웃 구조

```
layout.tsx
├── AppSidebar (collapsible icon, 플로팅 토글 버튼, 홈 대시보드 isActive 없음)
└── main
    ├── Header (고정 상단 네비)
    └── {children}
```

## 페이지 공통 패턴

모든 페이지 공통 외곽 래퍼:

```tsx
<div className="h-full overflow-y-auto overflow-x-hidden bg-tertiary scrollbar-hide flex flex-col min-h-full">
  {/* 타이틀 영역 */}
  <div className="px-6 pt-10 pb-6">
    <h1 className="text-[28px] font-semibold text-primary tracking-tight leading-tight [text-wrap:balance]">페이지명</h1>
    <p className="text-[14px] text-assistive mt-2">부제목</p>
  </div>
  {/* 콘텐츠 */}
  ...
  <Footer />
</div>
```

> 페이지에 따라 `bg-quaternary`를 outer wrapper에 쓰는 곳도 있음 (홈 대시보드 `/dashboard` 등 — 차트가 많아 약간 더 진한 배경 필요한 경우).

**패턴 1 — BusinessTree + 필터 별도 + 테이블** (`/completed`, `/db/assigned`, `/db/unassigned`):
```tsx
<div className="flex gap-3 px-6 pb-15 items-start">
  <BusinessTree />
  <div className="flex-1 min-w-0">
    <div className="mb-4"><XxxFilter /></div>
    <XxxTable />
  </div>
</div>
```

**패턴 2 — BusinessTree + 카드들** (`/`, `/pending`):
```tsx
<div className="flex gap-3 px-6 pb-15 items-start">
  <BusinessTree />
  <div className="flex-1 min-w-0 flex flex-col gap-4">
    {/* 카드들 */}
  </div>
</div>
```

**패턴 3 — BusinessTree 없음, 전체 너비** (`/db/status`, 설정 페이지):
```tsx
<div className="px-6 pb-15">
  <XxxTable />
</div>
```

**간격 규칙**:
- 카드 간 간격: `gap-4` (16px)
- 필터 카드 ↔ 테이블: `mb-4` (16px)
- 툴바(건수/페이지사이즈) ↔ 테이블 카드: `gap-1` (4px)

## 테이블 컴포넌트 규칙 (`src/components/ui/table.tsx` 기반)

`table.tsx`에서 전역 관리하는 값들 — 개별 파일에서 오버라이드 금지:

| 속성 | 값 | 비고 |
|---|---|---|
| TableHead 높이 | `h-10` (40px) | |
| TableHead 배경 | `bg-canvas-primary` | |
| TableCell 높이 | `h-[44px]` | 터치 타겟 최소값 준수 |
| TableCell 패딩 | `px-3 py-2.5` | |
| Table 컨테이너 | `pb-1` | 카드 하단 여백, 잘림 방지 |
| 마지막 행 보더 | `border-0` | TableBody `[&_tr:last-child]:border-0` |

**No. 컬럼**: 항상 `text-center` (헤더 + 셀 동일).

**테이블 카드 구조**:
```tsx
<div className="flex flex-col gap-1">
  <div className="flex items-center justify-between py-1">...</div>      {/* 툴바 */}
  <div className="bg-canvas-primary rounded-lg overflow-hidden border border-subtle">
    <div className="overflow-x-auto"><Table>...</Table></div>
  </div>
  <PageNumbers ... />                                                    {/* 페이지네이션 */}
</div>
```

## Footer 컴포넌트

모든 페이지 최하단에 공통 적용:
```tsx
import { Footer } from "@/components/footer"
<Footer />  // 페이지 래퍼 최하단
```

# 컴포넌트 구조

## `src/components/` (루트) — 전역 공유

| 파일 | 용도 | 사용처 |
|---|---|---|
| `app-sidebar.tsx` | 좌측 사이드바 (네비) | layout.tsx |
| `header.tsx` | 상단 헤더 | layout.tsx |
| `footer.tsx` | 페이지 하단 푸터 | 모든 페이지 (15곳) |
| `business-tree.tsx` | 사업단→지점→팀 3단계 조직도 | 9개 페이지 (대시보드, 고객 관리 등) |
| `breadcrumb-context.tsx` | 브레드크럼 상태 관리 | layout, sticky-breadcrumb |
| `sticky-breadcrumb.tsx` | 스크롤 시 고정 브레드크럼 | layout |
| `title-observer.tsx` | 페이지 타이틀 추적 | 모든 페이지 (17곳) |

## `src/components/dashboard/` — 고객/DB 관련 (18개)

| 파일 | 용도 |
|---|---|
| `stats-section.tsx` | 통화현황 KPI 5개 타일 |
| `kanban-filter.tsx` | 칸반 필터 |
| `consulting-section.tsx` | 상담현황 카드 |
| `kanban-board.tsx` | @dnd-kit 드래그 칸반 보드 |
| `pending-filter.tsx` | 계약 예정 고객 필터 |
| `pending-table.tsx` | 계약 예정 고객 테이블 |
| `completed-filter.tsx` | 상담 종료 고객 필터 |
| `completed-table.tsx` | 상담 종료 고객 테이블 |
| `assigned-db-filter.tsx` | 배정 완료 DB 필터 |
| `assigned-db-table.tsx` | 배정 완료 DB 테이블 |
| `assigned-db-stats.tsx` | 배정 완료 DB KPI |
| `unassigned-db-filter.tsx` | 미배정 DB 필터 |
| `unassigned-db-table.tsx` | 미배정 DB 테이블 |
| `db-status-table.tsx` | DB 분배 현황 테이블 |
| `search-filter.tsx` | 공용 SearchFilter (dashboard 내부 공유) |
| `planner-combobox.tsx` | 설계사 선택 Combobox |
| `region-multi-select.tsx` | 지역 multi-select |
| `call-condition-select.tsx` | 통화조건 multi-select |

## `src/components/management/` — 운영/관리자 (5개)

| 파일 | 용도 |
|---|---|
| `admin-filter.tsx` | 운영자 필터 |
| `admin-table.tsx` | 운영자 목록 테이블 |
| `planner-filter.tsx` | 설계사 필터 |
| `planner-table.tsx` | 설계사 목록 테이블 |
| `member-detail.tsx` | 멤버 상세 페이지 |

## `src/components/organization/` — 조직 (3개)

| 파일 | 용도 |
|---|---|
| `roles-filter.tsx` | 직책·권한 필터 |
| `roles-table.tsx` | 직책·권한 목록 |
| `structure-tree.tsx` | 조직 구조 트리 |

## 설정 페이지 (`src/components/settings/`)

| 파일 | 용도 |
|---|---|
| `reassign-type-settings.tsx` | 재배정 타입 설정 — 목록 |
| `reassign-type-edit.tsx` | 재배정 타입 설정 — 편집 |
| `auto-assign-settings.tsx` | 자동 배정 설정 |
| `recall-settings.tsx` | 자동 회수 설정 |
| `mypage-settings.tsx` | 마이페이지 설정 |

## 라우트

```
/               → 상담 진행 고객  (BusinessTree + KPI + 칸반보드)
/pending        → 계약 예정 고객  (BusinessTree + 테이블)
/completed      → 상담 종료 고객  (BusinessTree + 필터[별도] + 테이블)
/db/assigned    → 배정 완료 DB   (BusinessTree + 필터[별도] + KPI + 테이블)
/db/unassigned  → 미배정 DB      (BusinessTree + 필터[별도] + 테이블)
/db/status      → DB 분배 현황   (BusinessTree 없음, 전체 너비 테이블)
/settings/reassign      → 재배정 타입 설정 목록
/settings/reassign/edit → 재배정 타입 설정 편집
/settings/auto          → 자동 배정 설정
/settings/recall        → 자동 회수 설정
/management/admin       → 운영/관리자 목록
/management/planner     → 설계사 목록
/organization/roles     → 직책·권한 설정
/organization/structure → 조직 구조 설정
/design-system          → 디자인 시스템 가이드 페이지
```

# 수정 시 주의사항

**필터 컨트롤 fill** — 페이지 배경(`bg-tertiary`)과 대비를 위해 흰색 사용:
- Input variant="filter" (`bg-fill-filter border-subtle`)
- Select / multi-select 버튼: `bg-fill-filter border-subtle`

**SelectContent**:
```tsx
<SelectContent className="rounded-md border-subtle">
```

**Button 사이즈** — shadcn size variant만 사용:
- `size="default"` → h-9
- `size="sm"` → h-8
- `size="xs"` → h-6
- `size="icon"` → h-9 w-9

**Checkbox 체크 상태**:
```tsx
className="h-4 w-4 rounded-sm border-subtle data-[state=checked]:bg-primary data-[state=checked]:border-primary"
```

**scrollbar-hide** — `globals.css`에 정의된 커스텀 유틸리티.

**그림자** — 모든 필터 컨트롤에 `shadow-none` 적용.

**Input 텍스트 크기 고정** — focus 시 폰트 크기가 변하는 문제 방지. 13px 명시 시 `!text-[13px] md:!text-[13px]` 사용.

**`dark:` 클래스** — 절대 추가하지 말 것.

**홈 대시보드 사이드바 항목** — `isActive` prop 없음. `/` 경로는 "상담 진행 고객" 서브메뉴가 active 처리.

# 디자인 작업 워크플로우 ("디자이너야")

디자인 개선/분석 요청 또는 "디자이너야" 호출 시 아래 4개 스킬을 모두 Skill 툴로 동시 호출:

1. `make-interfaces-feel-better` — UI 폴리시, 광학 정렬, 마이크로 인터랙션
2. `emil-design-eng` — Emil Kowalski UI 디테일 철학
3. `web-design-guidelines` — Vercel 웹 디자인 가이드라인
4. `ui-ux-pro-max` — UX/UI 종합 가이드

각 스킬 관점에서 개선점 도출 후 CRM 업무 맥락(보험설계사, 관리자)을 고려해 코드 반영.
