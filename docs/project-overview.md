# 보닥 플래너 for KB라이프 — 프로젝트 & 디자인 시스템 개요

> 보험설계사 CRM · B2B SaaS · 라이트 모드 전용
> 신규 합류 개발자 + 디자이너 협업용 한 장 요약

---

## 1. 프로젝트 한 줄

데이터 밀도 높은 대시보드와 한국 핀테크 감성을 결합한 보험설계사 CRM. 한 빌드로 여러 테넌트(브랜드)에 대응 가능한 B2B SaaS 구조.

### 주요 화면

- 상담 진행 칸반보드 / 계약 예정 / 상담 종료
- 배정 완료 DB / 미배정 DB / DB 분배 현황
- 운영자·설계사 관리 / 조직 구조 / 직책·권한
- 자동 배정 / 자동 회수 / 마이페이지 설정

### 레이아웃

```
layout.tsx
├── AppSidebar (네비게이션, collapsible)
└── main
    ├── Header (고정 상단)
    └── PageHeader + Content
        ├── 패턴 A: BusinessTree(좌) + 필터+테이블(우)
        ├── 패턴 B: BusinessTree(좌) + 카드들(우, 칸반 등)
        └── 패턴 C: 전체 너비 테이블 (BusinessTree 없음)
```

---

## 2. 기술 스택

| 영역 | 선택 | 비고 |
|---|---|---|
| 프레임워크 | **Next.js 16** (App Router) | 학습 데이터와 다를 수 있어 `node_modules/next/dist/docs/01-app/` 참조 권장 |
| 런타임 | **React 19** | |
| 언어 | **TypeScript** | |
| 스타일링 | **Tailwind CSS v4** | `tailwind.config.js` 없음 — `globals.css`의 `@theme inline` + `@utility`로 토큰 관리 |
| UI 컴포넌트 | **shadcn/ui** (`style: radix-vega`) | Radix UI primitives 직접 사용 |
| 폰트 | **Pretendard** | `node_modules/pretendard`에서 로컬 로드 |
| 드래그앤드롭 | **@dnd-kit** | 칸반 보드 |

### 개발 명령어

```bash
npm run dev -- -p 3001   # 항상 3001 포트 (http://localhost:3001)
npm run build            # 프로덕션 빌드
npm run lint             # ESLint
npx shadcn@latest add [component]  # shadcn 컴포넌트 추가
```

---

## 3. shadcn/ui 채택 — "Semantic Sync" 전략

이 프로젝트는 **shadcn/ui (style: radix-vega)** 를 UI 컴포넌트 베이스로 채택했습니다. 단순히 가져다 쓰는 것이 아니라, **shadcn 표준 토큰 의미를 보존**하면서 **Figma 디자인 토큰을 별도 prefix로 노출**하는 'Semantic Sync' 구조로 운영합니다.

```
shadcn 표준          Figma 1:1 노출
───────────          ──────────────
bg-primary           bg-canvas-primary
text-primary         text-content-primary
border-border        border-subtle
```

### 신규 shadcn 컴포넌트 추가가 거의 무손실

`npx shadcn@latest add [컴포넌트]` 후 검증 3단계만 거치면 끝:

1. **`font-bold` → `font-semibold`** (Pretendard 컨벤션)
2. **`rounded-xl` → `rounded-lg`** (Vega 스타일 상한)
3. **`dark:` prefix 제거** (라이트 전용)

검증 명령어:
```bash
grep "dark:\|font-bold\|rounded-xl" <new-file>   # 0건이어야 함
```

---

## 4. 디자인 토큰 — 3-Layer 구조

`globals.css` 한 파일에서 모두 관리:

```
Layer 1 · Atomic     --blue-500, --cool-neutral-990, --red-50 ...   ← 직접 참조 금지
Layer 2 · Semantic   --primary, --bg-primary, --text-primary, --border-subtle ...
Layer 3 · Bridge     @theme inline + @utility → Tailwind 클래스로 노출
```

**왜 `@theme inline`과 `@utility`를 섞어 쓰나?**

Tailwind v4의 `@theme inline --color-X`는 `bg-X / text-X / border-X` 세 속성이 동일 값을 공유합니다. 하지만 `--bg-primary`(#FFF)와 `--text-primary`(#191F28)처럼 같은 이름이라도 속성별로 다른 Layer 2 값이 필요한 경우 `@utility`로 분리 정의합니다.

---

## 5. 색상 토큰 매핑 (Figma ↔ Tailwind)

### 5-A. 배경

| Figma | Tailwind | HEX | 용도 |
|---|---|---|---|
| `bg_primary` | `bg-canvas-primary` | `#FFFFFF` | 카드·모달 배경 |
| `bg_secondary` | `bg-canvas-secondary` | `#F9FAFB` | 살짝 오프화이트 |
| `bg_tertiary` | `bg-canvas-tertiary` | `#F6F7F9` | **페이지 기본 배경** |
| `bg_subtle` | `bg-canvas-quaternary` | `#ECEEF1` | 섹션·테이블 짝수행 |
| (shadcn) | `bg-primary` | `#3182F6` | **브랜드 블루** — 메인 액션 버튼 |
| — | `bg-primary-subtle` | `#E8F3FF` | 선택/활성 틴트 |

### 5-B. 텍스트

| Figma | Tailwind | HEX | 용도 |
|---|---|---|---|
| `text_primary` | `text-content-primary` | `#191F28` | 제목, 진한 본문 |
| `text_secondary` | `text-content-secondary` | `#333D4B` | 본문 |
| `text_quaternary` | `text-content-quaternary` | `#6B7684` | 보조 정보 |
| `text_assistive` | `text-content-assistive` | `#8B95A1` | 플레이스홀더, 테이블 헤더 |
| `text_disabled` | `text-content-disabled` | `#B0B8C1` | 비활성 |
| (shadcn) | `text-primary` | `#3182F6` | 링크, 강조 수치 |
| — | `text-inverse-primary` | `#FFFFFF` | 짙은 배경 위 흰 글자 |

### 5-C. 보더

| Figma | Tailwind | HEX | 용도 |
|---|---|---|---|
| `border_subtle` | `border-subtle` | `#E5E8EB` | **카드 보더 (가장 多)** |
| `border_primary` | `border-border` | `#D1D6DB` | shadcn 표준, Input/Select |
| `border_strong` | `border-strong` | `#B0B8C1` | 강조 구분선 |
| (shadcn) | `border-primary` | `#3182F6` | 브랜드 블루 보더, focus |

### 5-D. 상태 / 틴트 배지

| Tailwind | HEX | 용도 |
|---|---|---|
| `bg-success / text-success-foreground` | `#03B26C` | 성공 |
| `bg-destructive / text-destructive` | `#F04452` | 에러·삭제 |
| `bg-warning / text-warning-foreground` | amber | 경고 |
| `bg-blue-tint / text-blue-tint` | `#E8F3FF` / `#1B64DA` | Info 배지 |
| `bg-green-tint / text-green-tint` | `#F0FAF6` / `#15C47E` | 성공 배지 |
| `bg-red-tint / text-red-tint` | `#FFEEEE` / `#E42939` | 에러 배지 |

> **상태색은 브랜드와 무관하게 고정** — 그린 브랜드 테넌트에서도 Info=파랑 유지.

---

## 6. Typography (Pretendard, semibold 600 기본)

composite 토큰이 size + line-height + weight + letter-spacing(-0.5px)를 한 클래스에 묶음.

| 클래스 | 사양 | 용도 |
|---|---|---|
| `text-h2-bold` | 28/40/600 | 페이지 타이틀 (`<PageHeader>`가 자동 적용) |
| `text-h3-bold` | 24/36/600 | KPI 숫자, 큰 섹션 제목 |
| `text-h5-bold` | 20/30/600 | 카드 타이틀 |
| `text-body3-bold` / `medium` / `normal` | 14/22/600·500·400 | 본문 — 카드 헤더, 일반 텍스트 |
| `text-body4-bold` / `medium` / `normal` | 13/20·18/600·500·400 | 테이블 셀 (`<TableCell>` 자동) |
| `text-body5-bold` / `medium` / `normal` | 12/20·16/600·500·400 | 테이블 헤더, 툴바 카운트 |
| `text-caption` | 10/16/400 | Caption |

**원칙**: `font-bold`(700) 금지 — 일반은 `font-semibold`(600). atomic 토큰 `font-weight-bold`만 700 허용.

11px / 15px / 16px 등 composite 없는 사이즈는 atomic 조합:
```tsx
font-size-18 font-weight-bold font_letter_spacing-050
```

---

## 7. B2B 다중 브랜드 — `--primary` 한 변수

한 빌드로 여러 테넌트 대응. **`--primary` 한 변수**를 바꾸면 모든 액션 요소가 자동 추종.

### 적용 방법

**Step 1 — `globals.css`에 브랜드 오버라이드 추가**

```css
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

### 자동 추종 요소 (컴포넌트 코드 수정 0건)

`<Button variant="default">` · `<Badge variant="default">` · 사이드바 selected · 링크 (`text-primary`) · 체크박스/라디오 ON · focus ring · 캘린더 선택 · 토글/스위치 ON

### 브랜드와 무관 (의도적 고정)

- `bg-blue-tint / text-blue-tint` — Info 의미 (브랜드 무관)
- `bg-success / bg-warning / bg-destructive` — 시맨틱 상태색
- `bg-canvas-* / text-content-* / border-*` — 중립 레이아웃

---

## 8. 자주 깨지는 규칙 — Do / Don't

### Do (권장)

```tsx
font-semibold           // weight 600 기본
rounded-lg              // 8px (Vega 상한)
bg-canvas-primary       // 흰 카드 배경
bg-canvas-tertiary      // 페이지 배경
text-content-primary    // 진한 본문
border-subtle           // 카드 보더
bg-primary-subtle       // 선택/활성 틴트
<Button>저장</Button>   // shadcn 기본 — 추가 override 불필요
```

### Don't (금지)

| 금지 | 대체 |
|---|---|
| `font-bold` | `font-semibold` |
| `rounded-xl` | `rounded-lg` |
| `dark:` prefix | (제거) |
| `bg-primary/10` (alpha modifier) | `bg-primary-subtle` |
| `hover:bg-primary/5` | `hover:bg-blue-tint` |
| `ring-ring/50` | `ring-ring-glow` |
| `border-line-subtle` | `border-subtle` |
| `border-action` | `border-primary` |
| `bg-action` / `bg-button-accent-*` | `bg-primary` |
| `text-assistive` (단축 alias) | `text-content-assistive` |
| `bg-secondary` (단축 alias) | `bg-canvas-secondary` |
| `var(--ds-*)` (구 변수) | Layer 2 변수 |
| `bg-brand` / `text-brand` | `bg-primary` / `text-primary` |

---

## 9. 신규 합류자 체크리스트

설치부터 첫 PR까지:

```bash
# 1. 의존성 설치
npm install

# 2. 개발 서버 (3001 포트 고정)
npm run dev -- -p 3001

# 3. 디자인 시스템 시각화 페이지 확인
# http://localhost:3001/design-system
```

작업 시작 전 읽기:

1. **`CLAUDE.md`** — 프로젝트 룰 + 토큰 가이드 + 컴포넌트 패턴
2. **`docs/design-system.md`** — Figma ↔ 코드 매핑 풀버전
3. **`src/app/globals.css`** — 토큰 정의 원본
4. **`/design-system` 페이지** — 토큰 swatch 시각 확인

PR 전 검증:

```bash
grep -r "dark:\|font-bold\|rounded-xl" src/   # 0건이어야 함
npm run lint
npm run build
```

---

## 10. 컴포넌트 구조 한눈에

```
src/components/
├── (루트)            전역 공유 — app-sidebar, header, footer, business-tree, page-header ...
├── dashboard/        고객·DB 관련 (18개) — 칸반, KPI, 필터, 테이블
├── management/       운영/관리자 (5개) — 운영자/설계사 목록, 멤버 상세
├── organization/     조직 (3개) — 직책·권한, 조직 트리
├── settings/         설정 페이지 — 재배정/자동배정/회수/마이페이지
└── ui/               shadcn 컴포넌트 (26개)
```

설치된 shadcn 컴포넌트(사용 중인 것만 26개): avatar, badge, breadcrumb, button, calendar, chart, checkbox, collapsible, command, dialog, input, input-group, pagination, popover, radio-group, scroll-area, select, separator, sheet, sidebar, skeleton, table, tabs, textarea, toggle, tooltip

---

## 11. 라우트 맵

```
/                       → 상담 진행 고객 (BusinessTree + KPI + 칸반보드)
/pending                → 계약 예정 고객 (BusinessTree + 테이블)
/completed              → 상담 종료 고객
/db/assigned            → 배정 완료 DB
/db/unassigned          → 미배정 DB
/db/status              → DB 분배 현황 (전체 너비)
/management/admin       → 운영/관리자
/management/planner     → 설계사
/organization/roles     → 직책·권한 설정
/organization/structure → 조직 구조 설정
/settings/reassign      → 재배정 타입 설정
/settings/auto          → 자동 배정 설정
/settings/recall        → 자동 회수 설정
/design-system          → 디자인 시스템 가이드 (개발자/디자이너 합의용)
```

---

*마지막 갱신: 2026-04-29*
*상세 디자인 토큰: `docs/design-system.md`*
*상세 컴포넌트 룰: `CLAUDE.md`*
