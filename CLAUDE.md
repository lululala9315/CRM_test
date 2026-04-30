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
> | `text-content-assistive` | 힌트·플레이스홀더 (#8B95A1) | Figma `text_assistive` |
> | `border-subtle` | 카드 보더 (cool-neutral-200) | Figma `border_subtle` |
> | `bg-canvas-tertiary` | 페이지 배경 (cool-neutral-100) | Figma `bg_tertiary` |
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

**핵심 원칙**: shadcn `--primary` = brand blue (표준 그대로). Figma 토큰은 별도 prefix로 노출 (`bg-canvas-*`, `text-content-*`, `border-*` 등) → 이름 충돌 없음.

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
| `bg-primary-subtle` | blue-50 | 테이블 선택 행 · 사이드바 active 배경 |
| `bg-primary-subtle-hover` | blue-75 | 사이드바 active 행 hover 상태 |
| `bg-blue-tint` | blue-50 | info 배지 배경 (= primary-subtle과 동일값) |
| `bg-blue-tint-soft` | blue-25 (#f4f9ff) | **가장 연한 info 박스 배경** (안내 노트 등) |

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
| `border-subtle` | cool-neutral-200 | Figma `border_subtle`, 카드 보더 (가장 많이 사용) |
| `border-border` | cool-neutral-300 | shadcn 표준, Figma `border_primary` |
| `border-strong` | cool-neutral-400 | Figma `border_strong`, 강조 구분선 |
| `border-info` | blue-100 | 안내 박스 보더 (`bg-blue-tint-soft` 위에서) |
| `border-divider-subtle` | alpha-blue 4% | **테이블 셀 가로 보더** (행 라인) |
| `border-divider-normal` | alpha-blue 8% | 강조 구분선 보더 |

### 4. 사용 금지

```tsx
❌ bg-brand / text-brand              // reference에 없는 토큰
❌ bg-surface-* / text-label-*        // 옛 prefix
❌ border-line-subtle/primary/strong  // 삭제된 옛 prefix → border-subtle/border/border-strong 사용
❌ border-action                      // 삭제됨 → border-primary 사용
❌ bg-action / bg-button-accent-*     // globals.css에 없음 → bg-primary 사용
❌ var(--ds-*) / var(--atom-*)        // 옛 변수명
❌ font-bold                          // → font-semibold
❌ rounded-xl                         // → rounded-lg
❌ dark: prefix                       // 다크모드 미지원
❌ bg-accent / text-accent / border-accent (옛 의미)  // 현재는 shadcn 표준 hover 의미 (서브틀 그레이)

// ❌ 삭제된 단축 alias (모두 content/canvas prefix로 통일)
❌ text-assistive    // → text-content-assistive
❌ text-disabled     // → text-content-disabled
❌ text-secondary    // → text-content-secondary
❌ text-quaternary   // → text-content-quaternary
❌ bg-secondary      // → bg-canvas-secondary
❌ bg-quaternary     // → bg-canvas-quaternary
❌ bg-tertiary       // → bg-canvas-tertiary (페이지 배경)
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

## Spacing / Radius / Shadow / Border

> 🔄 **s-토큰 재도입** (2026-04-30). half-step(`gap-0.5`, `gap-1.5` 등) 금지 — spacing은 항상 **s-토큰** 사용.
> Radius/Shadow는 Tailwind 표준 그대로 (s-/r- 토큰 폐기 결정 그대로).

### Spacing — s-토큰 우선
```tsx
gap-s2 / p-s2     // 2px  — 미세 (배지 안 등)
gap-s4 / p-s4     // 4px  — 아이콘↔텍스트 간격
gap-s6 / p-s6     // 6px  — 작은 컴포넌트 패딩
gap-s8 / p-s8     // 8px  — 타이트한 인라인
gap-s10           // 10px
gap-s12 / p-s12   // 12px — 배지 padding · 카드 ↔ 카드
gap-s14 / p-s14   // 14px
gap-s16 / p-s16   // 16px — 카드 간 gap · 필터↔테이블 mb
gap-s20           // 20px — 카드 내부 세로 패딩
gap-s24 / px-s24  // 24px — 페이지·카드 수평 패딩
gap-s32           // 32px — 섹션 간 gap
pt-s40            // 40px — 페이지 타이틀 상단
gap-s48           // 48px
gap-s60           // 60px
gap-s64           // 64px
```

prefix(`p` / `m` / `gap` / `px` / `pt` 등) + s-토큰 자유 조합.

**예외:** `pb-15` (60px, 콘텐츠 하단) 같은 기존 코드는 점진 마이그레이션. 새 코드는 항상 s-토큰.

❌ `gap-0.5`, `gap-1.5`, `gap-2.5` 등 **half-step 금지** (4px 그리드 벗어남).

### Radius — Tailwind 표준만 사용
```tsx
rounded-sm    // 2px — 체크박스
rounded       // 4px — Tailwind default
rounded-md    // 6px — 필터 컨트롤, 작은 버튼 (xs/icon-sm)
rounded-lg    // 8px — 카드, 일반 버튼, 컨테이너 (가장 많이 사용)
rounded-full  // 9999px — pill, avatar, dot
```
**`rounded-xl` (12px+) 금지** — Vega 스타일 상한선.

### Border Width
```tsx
border-border05    // 0.5px (특수 케이스만)
border       // 1px (기본값)
```

### Shadow
```tsx
shadow-xs   // 1px — 미세한 깊이감
shadow-sm   // 3px — 카드, 필터 컨트롤
shadow-md   // 8px — 드롭다운, 팝오버
shadow-lg   // 16px — 모달, 오버레이
shadow-xl   // 32px — DragOverlay, 플로팅 요소
```
대부분의 컴포넌트는 `shadow-none` 사용 (카드는 border만, 필터 컨트롤도 shadow-none).


## 타이포그래피

**`font-bold`는 atomic 토큰(`font-weight-bold`)으로만 허용. 일반적으로 `font-semibold` 사용.**

### Composite 토큰 (Semantic) — 14개

`font-size + line-height + font-weight + letter-spacing(-0.5px)` 한 클래스에 묶임.

```tsx
text-h2-bold    // 28/40/600 — 페이지 타이틀 (PageHeader 컴포넌트가 사용)
text-h3-bold    // 24/36/600 — KPI 숫자, 섹션 큰 제목
text-h4         // 22/32/600 — 모달 제목
text-h5-bold    // 20/30/600 — 카드 타이틀

text-body3-bold   / text-body3-medium   / text-body3-normal    // 14/22 — 600/500/400
text-body4-bold   / text-body4-medium   / text-body4-normal    // 13/20-18 — 600/500/400
text-body5-bold   / text-body5-medium   / text-body5-normal    // 12/20-16 — 600/500/400

text-caption    // 10/16/400
```

### Atomic 토큰 — CSS 속성명 그대로 (디자이너↔개발자 공통어)

```tsx
font-size-{N}            // font-size 직접 지정 (10/12/13/14/16/18/20/22/24/28/34/36)
font-weight-{name}       // font-weight (normal/medium/semibold/bold)
font_letter_spacing-{N}  // letter-spacing (0/050=-0.5px/100=-1px)
line-height-{N}          // line-height (120/130/140/160)
```

### 자주 쓰는 패턴 — 항상 토큰 우선

| 용도 | 클래스 | 비고 |
|---|---|---|
| 페이지 타이틀 | `<PageHeader title="..." subtitle="..." />` | 자동으로 text-h2-bold 적용 |
| 카드 헤더 | `text-body3-bold text-content-primary` | 14/22/600 |
| 본문 | `text-body3-normal text-content-secondary` | 14/22/400 |
| 테이블 셀 | (`<TableCell>` 내장) `text-body4-normal` | 13/18/400, 자동 적용 |
| 테이블 헤더 | (`<TableHead>` 내장) `text-body5-bold leading-none` | 12/20/600, 자동 적용 |
| 툴바 카운트 (전체 N건) | `text-body5-medium text-content-assistive tabular-nums` | 12px — 모든 테이블 통일 |
| KPI 숫자 | `text-h3-bold tabular-nums text-content-primary` | 24/36/600. 카드 wrapper: `pt-4 pb-3` |
| KPI label | `text-[12px] font-medium text-content-assistive mb-1.5 tracking-tight leading-none whitespace-nowrap` | leading-none 의도라 직접 픽셀 유지 |
| Caption (10px) | `text-caption` | 10/16/400 |

**11px / 15px / 16px / 18px 등** composite 없는 사이즈는 atomic 조합 사용:
```tsx
font-size-18 font-weight-bold font_letter_spacing-050  // 보닥 플래너 로고 패턴
```

composite 토큰과 직접 픽셀 지정 혼용은 의도된 trade-off — 디자인 의도가 의미 있는 곳은 composite, 1회성·미세 조정은 직접 픽셀.

# 🚨 신규 shadcn 컴포넌트 추가

`npx shadcn@latest add [component]` 실행 후 **추가 작업 거의 불필요**. 토큰 의미가 shadcn 표준과 일치하므로 그대로 작동.

## 필수 검증 (3단계)

1. **`dark:` prefix 제거** — 라이트 모드 전용
2. **`font-bold` → `font-semibold`** — atomic 토큰(`font-weight-bold`)으로만 700 허용
3. **`rounded-xl` → `rounded-lg`** — Vega 스타일 (12px+ 라운드 금지)

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
<div className="bg-canvas-primary rounded-lg border border-subtle">
```

## KPI StatsSection 카드

`StatsSection`, `AssignedDbTable`, `AdminTable`, `PlannerTable`, `dashboard/page.tsx` 등에서 사용하는 KPI 타일 패턴:

```tsx
<div className="bg-canvas-primary rounded-lg pt-4 pb-3 border border-subtle">
  <div className="flex items-stretch">
    {stats.map((stat, i) => (
      <div key={stat.label} className="flex-1 px-6 relative">
        {i > 0 && <div className="absolute left-0 top-1/2 -translate-y-1/2 h-12 w-px bg-divider-normal" />}
        <p className="text-[12px] font-medium text-content-assistive mb-1.5 tracking-tight leading-none whitespace-nowrap">
          {stat.label}
        </p>
        <div className="flex items-baseline gap-0.5">
          <span className="text-h3-bold tabular-nums text-content-primary">{stat.value}</span>
          <span className="text-h3-bold tabular-nums text-content-primary">{stat.unit}</span>
        </div>
      </div>
    ))}
  </div>
</div>
```

**핵심 비율:**
- 카드 wrapper: `pt-4 pb-3` (위 16px / 아래 12px) — 비대칭 (KPI 숫자 lh 36px 균형)
- label: `mb-1.5` (6px), `leading-none` 강제 (라벨 박스 = 글자 높이)
- value/unit: `text-h3-bold` (24/36/600/-0.5px), `tabular-nums`
- 세로 구분선: `absolute h-12 w-px bg-divider-normal`

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

필터 컨트롤은 **`bg-fill-filter` (= 흰색)** + **`border-subtle`** 통일. `bg-muted/60` 사용 금지 — 페이지 배경(`bg-canvas-tertiary`)과 대비가 거의 없어 필 영역이 안 보임.

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

모든 페이지 공통 외곽 래퍼 + `<PageHeader>` 컴포넌트 사용:

```tsx
import { PageHeader } from "@/components/page-header"

<div className="h-full overflow-y-auto overflow-x-hidden bg-canvas-tertiary scrollbar-hide flex flex-col min-h-full">
  <PageHeader title="페이지명" subtitle="부제목" />
  {/* 콘텐츠 */}
  ...
  <Footer />
</div>
```

`<PageHeader>` props:
- `title` (string, 필수) — 페이지 제목, `text-h2-bold` 토큰 적용
- `subtitle` (string, optional) — 부제, `text-[14px] text-content-assistive`
- `bordered` (boolean, optional) — 하단 border-b 추가 (상세 페이지 등)
- `actions` (ReactNode, optional) — 우측 액션 버튼 영역

> ⚠️ **모든 페이지 배경 통일**: `bg-canvas-tertiary` (#f6f7f9). 홈 대시보드도 동일.

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

**필터 컨트롤 fill** — 페이지 배경(`bg-canvas-tertiary`)과 대비를 위해 흰색 사용:
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
