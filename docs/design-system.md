# 보닥 플래너 for KB라이프 — 디자인 시스템

> 보험설계사 CRM · 라이트 모드 전용  
> Next.js 16 · React 19 · Tailwind v4 · shadcn/ui (radix-vega) · Pretendard

---

## 개요 — Semantic Sync 토큰 전략

이 프로젝트는 **shadcn 표준 색상 의미를 그대로 유지**하면서, Figma 디자인 토큰을 별도 prefix(`bg-canvas-*`, `text-content-*`, `border-line-*`)로 나란히 노출합니다.

```
shadcn 표준      Figma 1:1 노출
───────────      ──────────────
bg-primary       bg-canvas-primary
text-primary     text-content-primary
border-border    border-line-subtle
```

shadcn 컴포넌트는 수정 없이 사용. Figma 스펙 컴포넌트는 canvas/content/line 클래스를 직접 참조.

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
| `bg_secondary` | `bg-secondary` | `var(--bg-secondary)` | `cool-neutral-50` ≈ `#FAFAFA` | 살짝 오프화이트 영역 |
| `bg_tertiary` | `bg-canvas-tertiary` | `var(--bg-tertiary)` | `cool-neutral-100` ≈ `#F5F5F8` | 페이지 기본 배경 |
| `bg_subtle` | `bg-canvas-quaternary` | `var(--bg-subtle)` | `cool-neutral-150` ≈ `#F0F0F3` | 섹션 배경, 테이블 짝수행 |
| `bg_subtle` | `bg-quaternary` | `var(--bg-subtle)` | `cool-neutral-150` ≈ `#F0F0F3` | bg-canvas-quaternary와 동일값, @utility 경로 |
| (shadcn) | `bg-primary` | `var(--primary)` | `#3182F6` | **브랜드 블루** — 메인 액션 버튼 배경 |
| (shadcn) | `bg-accent` | `var(--accent)` | `cool-neutral-150` | 서브틀 hover bg (shadcn 표준) |
| (shadcn) | `bg-background` | `var(--background)` | `= bg-tertiary` | 페이지 배경 (shadcn 표준) |

> **실무 선택 기준**: 흰 카드 → `bg-canvas-primary`, 페이지 배경 → `bg-canvas-tertiary` 또는 `bg-background`

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
| (Figma) | `text-secondary` | `var(--text-secondary)` | `cool-neutral-900` | text-content-secondary와 동일값, @utility 경로 |
| (Figma) | `text-quaternary` | `var(--text-quaternary)` | `cool-neutral-700` | text-content-quaternary와 동일값 |
| (Figma) | `text-assistive` | `var(--text-assistive)` | `cool-neutral-600` | text-content-assistive와 동일값 |
| (Figma) | `text-disabled` | `var(--text-disabled)` | `cool-neutral-400` | text-content-disabled와 동일값 |
| (특수) | `text-inverse-primary` | `var(--common-100)` | `#FFFFFF` | 짙은 배경 위 흰 텍스트 (버튼 라벨 등) |

> **실무 선택 기준**: 제목 → `text-content-primary`, 본문 → `text-content-secondary`, 플레이스홀더 → `text-content-assistive`

### 2-C. 보더 (Border / Line)

| Figma 토큰 | Tailwind 클래스 | CSS 변수 | 색 값 | 용도 |
|---|---|---|---|---|
| `border_subtle` | `border-line-subtle` | `var(--border-subtle)` | `cool-neutral-200` ≈ `#E3E3E8` | 카드 외곽선, 테이블 로우 구분 |
| `border_subtle` | `border-subtle` | `var(--border-subtle)` | `cool-neutral-200` | border-line-subtle과 동일값, @utility 경로 |
| `border_primary` | `border-primary` | `var(--border-primary)` | `cool-neutral-300` ≈ `#D0D0D6` | Input/Select 기본 보더 |
| (shadcn) | `border-border` | `var(--border)` | `= border-primary` | shadcn 표준 보더 (`border` shorthand) |
| (shadcn) | `border-input` | `var(--input)` | `= border-primary` | shadcn Input 컴포넌트 보더 |

> **실무 선택 기준**: 카드 테두리 → `border border-line-subtle`, Input → `border-input` (shadcn 표준)

### 2-D. 브랜드 / 액션 색 (Primary)

| 클래스 | CSS 변수 | 색 값 | 용도 |
|---|---|---|---|
| `bg-primary` | `var(--primary)` | `#3182F6` | 메인 액션 버튼 배경 |
| `text-primary-foreground` | `var(--primary-foreground)` | `#FFFFFF` | 버튼 위 흰 라벨 |
| `bg-primary/10` | (alpha) | `#3182F6 @ 10%` | 서브틀 액션 버튼, 필터 검색 버튼 |
| `text-primary` | `var(--primary)` | `#3182F6` | 브랜드 색 텍스트, 링크, 강조 수치 |
| `ring-primary` | `var(--primary)` | `#3182F6` | Focus ring |

> `bg-primary / text-primary`는 Tailwind v4 `@theme inline --color-primary`로 노출. alpha modifier (`bg-primary/10`, `text-primary/50`) 자동 지원.

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
<div className="bg-canvas-primary rounded-lg border border-line-subtle">
```

### "페이지 배경이 필요하다"
```tsx
<div className="bg-canvas-tertiary">  {/* = bg-background */}
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
<Button className="bg-primary/10 text-primary hover:bg-primary/20 shadow-none">검색</Button>
```

### "카드 내 수평 구분선"
```tsx
<div className="mx-6 h-px bg-divider-subtle" />
```

### "필터 컨트롤 배경"
```tsx
<SelectTrigger className="bg-fill-filter border-line-subtle">
<Input variant="filter" className="bg-fill-filter border-line-subtle" />
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
| `bg-canvas-* / text-content-* / border-line-*` | 중립 레이아웃 색 |

---

## 6. 사용 금지 토큰

### 삭제된 구 토큰 (SWAP 시대 잔재)

아래 클래스는 5c-pre 정리에서 삭제됨. 소스에서 발견 시 즉시 교체.

| 삭제된 클래스 | 대체 |
|---|---|
| `bg-brand / text-brand` | → `bg-primary / text-primary` |
| `bg-surface-* / text-label-*` | → `bg-canvas-* / text-content-*` |
| `bg-canvas-secondary` | → `bg-secondary` 또는 `bg-canvas-tertiary` |
| `bg-muted` (SWAP 의미) | → `bg-fill-normal` 또는 `bg-canvas-quaternary` |
| `text-tertiary` (@utility) | → `text-content-tertiary` |
| `border-strong` | → `border-line-subtle` 또는 직접 지정 |
| `border-selected` | → `border-primary` (brand blue) |
| `border-accent` | → `border-primary` (Semantic Sync 이후) |
| `bg-divider-strong` | → `bg-divider-normal` + opacity 조정 |
| `bg-fill-strong` | → `bg-fill-hover` |
| `text-orange-tint` | → `text-amber-tint` 또는 직접 지정 |

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

| 용도 | 클래스 |
|---|---|
| 페이지 타이틀 (28px) | `text-[28px] font-semibold text-content-primary tracking-tight leading-tight` |
| 카드 타이틀 (20px) | `text-[20px] font-semibold text-content-primary tracking-tight` |
| 본문 16px | `text-body2-normal` (16/24/400) |
| 본문 14px | `text-body3-normal` (14/22/400) |
| 테이블 헤더 | `text-[12px] font-medium text-content-assistive` |
| 테이블 셀 | `text-[13px] text-content-primary` |
| KPI 숫자 | `text-[24px] font-semibold tracking-tight text-content-primary leading-none tabular-nums` |

---

*마지막 갱신: 5d (Semantic Sync 완전 이행 후)*
