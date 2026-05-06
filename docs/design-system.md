# 보닥 플래너 for KB라이프 — 디자인 시스템

> 보험설계사 CRM · 라이트 모드 전용  
> Next.js 16 · React 19 · Tailwind v4 · shadcn/ui (radix-vega) · Pretendard

---

## 개요 — Semantic Sync 토큰 전략

이 프로젝트는 **shadcn 표준 색상 의미를 그대로 유지**하면서, Figma 디자인 토큰을 별도 prefix(`bg-canvas-*`, `text-content-*`, `border-*`)로 나란히 노출합니다.

```
shadcn 표준      Figma 1:1 노출
───────────      ──────────────
bg-primary       bg-canvas-primary
text-primary     text-content-primary
border-border    border-subtle
```

shadcn 컴포넌트는 수정 없이 사용. Figma 스펙 컴포넌트는 canvas/content/border 클래스를 직접 참조.

---

## 1. 토큰 3-레이어 구조

```
globals.css
├── Layer 1 (Atomic palette)   --blue-500, --cool-neutral-990, --red-50 ...  ← 직접 참조 금지
├── Layer 2 (Semantic CSS 변수) --bg-primary, --text-primary, --border-subtle, --primary ...
└── Layer 3 (Bridge)           @theme inline  → Tailwind bg-*/text-*/border-* + alpha 지원
                                @utility       → 단일 속성 유틸리티 (alpha 불필요한 토큰)
```

**왜 `@theme inline`과 `@utility`를 혼용하나?**  
Tailwind v4의 `@theme inline --color-X`는 `bg-X / text-X / border-X` 세 속성이 동일 값을 공유합니다. 하지만 `--bg-primary`(#FFF)와 `--text-primary`(#191F28)처럼 같은 이름이라도 속성별로 다른 Layer 2 값이 필요한 경우 `@utility`로 분리 정의합니다.

---

## 2. Figma ↔ 코드 매핑표

### 2-A. 배경색 (Background)

| Figma 토큰 | Tailwind 클래스 | CSS 변수 | 색 값 | 용도 |
|---|---|---|---|---|
| `bg_primary` | `bg-canvas-primary` | `var(--bg-primary)` | `#FFFFFF` | 카드·모달·흰 패널 배경 |
| `bg_secondary` | `bg-canvas-secondary` | `var(--bg-secondary)` | `cool-neutral-50` ≈ `#FAFAFA` | 살짝 오프화이트 영역 |
| `bg_secondary` (페이지) | `bg-canvas-secondary` | `var(--bg-secondary)` | `cool-neutral-50` ≈ `#FAFAFA` | **페이지 기본 배경** |
| `bg_tertiary` | `bg-canvas-tertiary` | `var(--bg-tertiary)` | `cool-neutral-100` ≈ `#F5F5F8` | hover 효과·강조 영역 |
| `bg_subtle` | `bg-canvas-quaternary` | `var(--bg-subtle)` | `cool-neutral-150` ≈ `#F0F0F3` | 섹션 배경, 테이블 짝수행 |
| (shadcn) | `bg-primary` | `var(--primary)` | `#3182F6` | **브랜드 블루** — 메인 액션 버튼 배경 |
| (shadcn) | `bg-accent` | `var(--accent)` | `cool-neutral-150` | 서브틀 hover bg (shadcn 표준) |
| (shadcn) | `bg-background` | `var(--background)` | `= bg-canvas-secondary` | 페이지 배경 (shadcn 표준) |

> **실무 선택 기준**: 흰 카드 → `bg-canvas-primary`, 페이지 배경 → `bg-canvas-secondary` 또는 `bg-background`

### 2-B. 텍스트색 (Content)

| Figma 토큰 | Tailwind 클래스 | CSS 변수 | 색 값 | 용도 |
|---|---|---|---|---|
| `text_primary` | `text-content-primary` | `var(--text-primary)` | `cool-neutral-990` ≈ `#191F28` | 최우선 텍스트 (제목, 강조) |
| `text_secondary` | `text-content-secondary` | `var(--text-secondary)` | `cool-neutral-900` ≈ `#3D4A5C` | 본문 텍스트 |
| `text_tertiary` | `text-content-tertiary` | `var(--text-tertiary)` | `cool-neutral-800` | 서브 텍스트 |
| `text_quaternary` | `text-content-quaternary` | `var(--text-quaternary)` | `cool-neutral-700` | 보조 정보 |
| `text_assistive` | `text-content-assistive` | `var(--text-assistive)` | `cool-neutral-600` ≈ `#8B95A1` | 플레이스홀더, 설명, 테이블 헤더 |
| `text_disabled` | `text-content-disabled` | `var(--text-disabled)` | `cool-neutral-400` | 비활성 UI |
| (shadcn) | `text-primary` | `var(--primary)` | `#3182F6` | **브랜드 블루 텍스트** (shadcn 표준) |
| (shadcn) | `text-foreground` | `var(--foreground)` | `= text-content-primary` | 기본 글자색 (shadcn 표준) |
| (특수) | `text-inverse-primary` | `var(--common-100)` | `#FFFFFF` | 짙은 배경 위 흰 텍스트 (버튼 라벨 등) |

> **실무 선택 기준**: 제목 → `text-content-primary`, 본문 → `text-content-secondary`, 플레이스홀더 → `text-content-assistive`
>
> ⚠️ **삭제된 단축 alias** — `text-assistive`, `text-disabled`, `text-secondary`, `text-quaternary` (@utility 경로) 는 모두 삭제됨. `text-content-*` 형식 사용.

### 2-C. 보더 (Border / Line)

| Figma 토큰 | Tailwind 클래스 | CSS 변수 | 색 값 | 용도 |
|---|---|---|---|---|
| `border_subtle` | `border-subtle` | `var(--border-subtle)` | `cool-neutral-200` ≈ `#E3E3E8` | 카드 외곽선, 테이블 로우 구분 (가장 많이 사용) |
| `border_primary` | `border-border` | `var(--border)` | `cool-neutral-300` ≈ `#D0D0D6` | shadcn 표준 보더, Input/Select 기본 |
| `border_strong` | `border-strong` | `var(--border-strong)` | `cool-neutral-400` | 강조 구분선 |
| (shadcn) | `border-input` | `var(--input)` | `= border-border` | shadcn Input 컴포넌트 보더 |
| (shadcn) | `border-primary` | `var(--primary)` | `#3182F6` | 브랜드 블루 보더 (선택, focus) |

> **실무 선택 기준**: 카드 테두리 → `border border-subtle`, Input → `border-input` (shadcn 표준)
>
> ⚠️ **삭제된 클래스** — `border-line-subtle`, `border-line-primary`, `border-line-strong`, `border-action` 모두 삭제됨.

### 2-D. 브랜드 / 액션 색 (Primary)

| 클래스 | CSS 변수 | 색 값 | 용도 |
|---|---|---|---|
| `bg-primary` | `var(--primary)` | `#3182F6` | 메인 액션 버튼 배경 |
| `text-primary-foreground` | `var(--primary-foreground)` | `#FFFFFF` | 버튼 위 흰 라벨 |
| `bg-primary-subtle` | `var(--primary-subtle)` | `blue-50` ≈ `#E8F3FF` | 서브틀 액션·선택 배경 |
| `bg-primary-subtle-hover` | `var(--primary-subtle-hover)` | `blue-75` ≈ `#D8EAFF` | 선택 항목 hover 상태 |
| `bg-primary-hover` | `var(--primary-hover)` | `blue-550` | primary 버튼 hover bg |
| `text-primary` | `var(--primary)` | `#3182F6` | 브랜드 색 텍스트, 링크, 강조 수치 |
| `ring-primary` | `var(--primary)` | `#3182F6` | Focus ring |

> ⚠️ **alpha modifier 금지** — semantic 토큰에 `/숫자` 사용 금지. 항상 named atomic 토큰을 참조한다.
> - ❌ `bg-primary/10` → ✅ `bg-primary-subtle` (= `var(--blue-50)`)
> - ❌ `hover:bg-primary/5` → ✅ `hover:bg-blue-tint`
> - ❌ `ring-ring/50` → ✅ `ring-ring-glow` (= `var(--blue-350)`)

### 2-E. 상태색 (Semantic Status)

| 클래스 | CSS 변수 | 색 값 | 용도 |
|---|---|---|---|
| `bg-success` | `var(--success)` | `green-500` | 성공 배경 (배지 등) |
| `text-success-foreground` | `var(--success-foreground)` | `green-400` | 성공 텍스트 on 성공 배경 |
| `bg-warning` | `var(--warning)` | `orange-500` | 경고 배경 |
| `text-warning-foreground` | `var(--warning-foreground)` | `orange-390` | 경고 텍스트 on 경고 배경 |
| `bg-destructive` | `var(--destructive)` | `red-500` ≈ `#FF4D4F` | 에러/삭제 액션 배경 |
| `text-destructive` | `var(--destructive)` | `red-500` | 에러 텍스트 (인라인) |

### 2-F. Divider (구분선, alpha 기반)

| 클래스 | CSS 변수 | 색 값 | 용도 |
|---|---|---|---|
| `bg-divider-subtle` | `var(--divider-subtle)` | `alpha-blue-04` (4% 알파) | 카드 내 구분선 (가장 약) |
| `bg-divider-normal` | `var(--divider-normal)` | `alpha-blue-08` (8% 알파) | 일반 구분선 |
| `bg-divider-strong` | `var(--divider-strong)` | `alpha-blue-16` (16% 알파) | 강 구분선 |

사용 패턴:
```tsx
{/* 카드 내 세로 구분선 (KPI 타일 간) */}
<div className="absolute left-0 top-1/2 -translate-y-1/2 h-12 w-px bg-divider-normal" />
{/* 수평 구분선 (카드 내부) */}
<div className="mx-6 h-px bg-divider-subtle" />
```

### 2-G. Fill (배경 fill)

| 클래스 | CSS 변수 | 색 값 | 용도 |
|---|---|---|---|
| `bg-fill-subtle` | `var(--fill-subtle)` | `cool-neutral-100` | 가장 약한 fill |
| `bg-fill-normal` | `var(--fill-normal)` | `cool-neutral-150` | 테이블 hover, 드롭다운 item |
| `bg-fill-hover` | `var(--fill-hover)` | `cool-neutral-250` | 눌림/hover 강조 fill |
| `bg-fill-filter` | `var(--fill-filter)` | `#FFFFFF` | 필터 컨트롤 배경 (흰색, 페이지 배경과 대비) |

### 2-H. Tint 배지 (정적, 브랜드와 무관)

| 배경 클래스 | 텍스트 클래스 | 색 값 | 용도 |
|---|---|---|---|
| `bg-blue-tint` | `text-blue-tint` | `blue-50` / `blue-700` | 정보(Info) 배지 |
| `bg-green-tint` | `text-green-tint` | `green-50` / `green-450` | 성공·긍정 배지 |
| `bg-red-tint` | `text-red-tint` | `red-50` / `red-600` | 에러·위험 배지 |
| `bg-orange-tint` | — | `orange-50` | 주의 배지 (텍스트는 직접 지정) |
| `bg-amber-tint` | `text-amber-tint` | `amber-50` / `amber-700` | 경고 배지 |
| `bg-neutral-tint` | `text-neutral-tint` | `cool-neutral-150` / `cool-neutral-600` | 중립 배지 |

---

## 3. 사용 가이드

### "흰 카드 배경이 필요하다"
```tsx
<div className="bg-canvas-primary rounded-lg border border-subtle">
```

### "페이지 배경이 필요하다"  → `bg-canvas-secondary`
```tsx
<div className="bg-canvas-secondary">  {/* = bg-background */}
```

### "제목 텍스트"
```tsx
<h1 className="text-[28px] font-semibold text-content-primary tracking-tight leading-tight">
```

### "본문 텍스트"
```tsx
<p className="text-body3-normal text-content-secondary">  {/* 14/22/400 */}
```

### "플레이스홀더·보조 설명"
```tsx
<span className="text-content-assistive">  {/* #8B95A1 */}
```

### "메인 액션 버튼"
```tsx
<Button>저장</Button>  {/* variant="default" → bg-primary text-primary-foreground 내장 */}
```

### "서브틀 액션 버튼 (필터 검색)"
```tsx
<Button variant="secondary">검색</Button>  {/* 내부적으로 bg-primary-subtle text-primary hover:bg-primary-subtle-hover */}
```

### "카드 내 수평 구분선"
```tsx
<div className="mx-6 h-px bg-divider-subtle" />
```

### "필터 컨트롤 배경"
```tsx
<SelectTrigger className="bg-fill-filter border-subtle">
<Input variant="filter" className="bg-fill-filter border-subtle" />
```

### "상태 배지"
```tsx
{/* 정보 */}
<Badge className="bg-blue-tint text-blue-tint">신규</Badge>
{/* 성공 */}
<Badge className="bg-green-tint text-green-tint">계약완료</Badge>
{/* 경고 */}
<Badge className="bg-red-tint text-red-tint">회수</Badge>
```

### "테이블 헤더"
```tsx
<TableHead className="bg-canvas-primary text-content-assistive text-[12px] font-medium">
```

---

## 4. shadcn 호환 원칙

Semantic Sync 이후 shadcn 표준 토큰과 우리 토큰이 **충돌하지 않습니다.** 신규 shadcn 컴포넌트 추가 시 기존 SWAP 시절의 대규모 토큰 치환이 **더 이상 불필요**합니다.

### 확인 3단계만 거치면 충분

**1. `font-bold` → `font-semibold` 교체**  
shadcn 기본 코드가 종종 `font-bold`를 사용. 이 프로젝트 컨벤션은 `font-semibold`.

**2. `rounded-xl` → `rounded-lg` 교체**  
Vega 스타일 radius 상한선. `rounded-xl`(12px 이상)은 `rounded-lg`로 통일.

**3. `dark:` prefix 제거**  
라이트 전용 프로젝트. shadcn 기본 코드의 `dark:*` 클래스 모두 제거.

### 버튼 컨벤션

shadcn `Button variant="default"`는 `bg-primary text-primary-foreground`로 렌더링. 추가 override 불필요.

```tsx
<Button>메인 액션</Button>                  {/* 브랜드 블루 버튼 */}
<Button variant="outline">취소</Button>     {/* 보더 버튼 */}
<Button variant="ghost">닫기</Button>       {/* 투명 버튼 */}
```

---

## 5. B2B 다중 브랜드

단일 빌드로 여러 테넌트 대응. **`--primary` 한 변수**를 바꾸면 모든 액션 요소가 자동 추종합니다.

### 적용 방법

**Step 1 — `globals.css`에 브랜드 오버라이드 추가**

```css
/* globals.css 하단 */
[data-brand="green"] {
  --primary: var(--green-500);
}
[data-brand="orange"] {
  --primary: oklch(0.65 0.20 45);
}
```

**Step 2 — `<html>` 또는 루트 wrapper에 `data-brand` 속성**

```tsx
// app/layout.tsx
<html lang="ko" data-brand={tenant.brand}>
```

또는 런타임 동적 변경:

```tsx
useEffect(() => {
  document.documentElement.dataset.brand = currentTenant.brand
}, [currentTenant])
```

### 자동 추종 요소

`--primary` 변경 시 컴포넌트 코드 수정 없이 자동 적용:

- `<Button variant="default">` 배경·hover
- `<Badge variant="default">`
- 체크박스·라디오 ON 상태 (`data-[state=checked]:bg-primary`)
- Focus ring (`ring-primary`)
- 사이드바 선택 표시
- 링크 텍스트 (`text-primary`)
- 필터 검색 버튼 (`bg-primary/10`)
- 캘린더 선택 날짜

### 브랜드와 무관한 토큰

| 토큰 | 이유 |
|---|---|
| `bg-blue-tint / text-blue-tint` | Info 의미 — 브랜드 무관 (초록 브랜드여도 Info는 파랑) |
| `bg-success / bg-warning / bg-destructive` | 시맨틱 상태색 — 브랜드와 독립 |
| `bg-canvas-* / text-content-* / border-*` | 중립 레이아웃 색 |

---

## 6. 사용 금지 토큰

### 삭제된 구 토큰

아래 클래스는 삭제됨. 소스에서 발견 시 즉시 교체.

| 삭제된 클래스 | 대체 |
|---|---|
| `bg-brand / text-brand` | → `bg-primary / text-primary` |
| `bg-surface-* / text-label-*` | → `bg-canvas-* / text-content-*` |
| `bg-secondary` (@utility) | → `bg-canvas-secondary` |
| `bg-quaternary` (@utility) | → `bg-canvas-quaternary` |
| `bg-tertiary` (@utility) | → `bg-canvas-tertiary` |
| `text-assistive` (@utility) | → `text-content-assistive` |
| `text-disabled` (@utility) | → `text-content-disabled` |
| `text-secondary` (@utility) | → `text-content-secondary` |
| `text-quaternary` (@utility) | → `text-content-quaternary` |
| `border-line-subtle` | → `border-subtle` |
| `border-line-primary` | → `border-border` |
| `border-line-strong` | → `border-strong` |
| `border-action` | → `border-primary` |
| `bg-action` / `bg-button-accent-*` | → `bg-primary` |
| `border-selected` | → `border-primary` |
| `border-accent` | → `border-primary` |

### 일반 금지 사항

```tsx
❌ font-bold           → font-semibold
❌ rounded-xl          → rounded-lg
❌ dark: prefix        → 라이트 전용 프로젝트
❌ var(--ds-*)         → 구 변수명 체계
❌ Layer 1 직접 참조    → var(--blue-500) 직접 사용 금지, Layer 2를 통해 참조
```

---

## 7. 타이포그래피 참조

자세한 타이포그래피 토큰은 `CLAUDE.md > 타이포그래피` 섹션 참고.

자주 쓰는 패턴 요약:

| 용도 | 클래스 | 비고 |
|---|---|---|
| 페이지 타이틀 (28px) | `<PageHeader title="..." subtitle="..." />` | text-h2-bold 자동 적용 |
| 카드 헤더 (14px) | `text-body3-bold text-content-primary` | 14/22/600 |
| 본문 14px | `text-body3-normal text-content-secondary` | 14/22/400 |
| 보조 설명 13px | `text-body4-normal text-content-secondary` | 13/18/400 |
| 테이블 헤더 | `<TableHead>` (text-body5-bold leading-none 내장) | 자동 |
| 테이블 셀 | `<TableCell>` (text-body4-normal 내장) | 자동 |
| 툴바 카운트 | `text-body5-medium text-content-assistive tabular-nums` | 12px (PageSizeSelect와 통일) |
| KPI 숫자 | `text-h3-bold tabular-nums text-content-primary` | 카드 wrapper: `pt-4 pb-3` |
| 페이지네이션 번호 | (`<PageNumbers>` 내장) | text-body5-medium |
| Caption | `text-caption` | 10/16/400 |

### Atomic 토큰 — CSS 속성명 그대로

```tsx
font-size-{N}            // font-size 직접 지정
font-weight-{name}       // font-weight (normal/medium/semibold/bold)
font_letter_spacing-{N}  // letter-spacing
line-height-{N}          // line-height
```

---

## 8. 토큰 정책

### 활성 토큰
- `--spacing-s2 ~ s64` (s-토큰) — **재도입** (2026-04-30). 사용 시 `gap-s4`, `px-s24` 등. half-step(`gap-0.5`) 금지
- `--blue-25` (#f4f9ff) — blue-50과 흰색 사이, info 박스 soft 배경
- `--cool-neutral-75` (#f6f7f9) — 헤더/사이드바/콘텐츠 배경 (`bg-canvas-tertiary`)
- `font-weight-bold` (700) — atomic typography
- `text-h2-bold` (28/40/600) — 페이지 타이틀 (PageHeader 사용)
- `border-divider-subtle/normal` — alpha border (테이블 셀 라인 등)
- `bg-blue-tint-soft` — info 박스 가장 연한 배경

### 폐기된 토큰

| 토큰 카테고리 | 폐기 사유 | 대체 |
|---|---|---|
| `--radius-r4 ~ r9999` (r-토큰) | 사용처 미미 (button.tsx 1곳만) | `rounded-sm/md/lg/full` (Tailwind 표준) |
| `--shadow-sd03 / sd25` | shadow-xs/sm/md/lg/xl로 대체됨 | `shadow-xs/sm/md/lg/xl` |

---

## 9. 핵심 컴포넌트

| 컴포넌트 | 용도 |
|---|---|
| `<PageHeader title="" subtitle="" actions=?>` | 모든 페이지 타이틀 영역 (text-h2-bold + 가림막 sticky) |
| `<KpiGroup items={[...]}>` | KPI 타일 그룹 — 라벨 + 숫자 + 변화율 배지 (sparkline 미사용) |
| `<KpiCard ...>` | 단일 KPI 타일 |
| `<RadioOption value label description?>` | 옵션 카드 — 좌측 bar 없이 라디오 + 라벨 색 변화로 강조 |

---

*마지막 갱신: 2026-04-30 (Spacing s-토큰 재도입, blue-25 / cool-neutral-75 추가, KpiGroup·PageHeader 컴포넌트 도입, RadioOption 디자인 정돈)*
