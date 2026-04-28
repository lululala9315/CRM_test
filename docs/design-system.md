# 보닥 플래너 for KB라이프 — 디자인 시스템

> 보험설계사 CRM · 라이트 모드 전용 
> Next.js 16 · React 19 · Tailwind v4 · shadcn/ui (radix-vega) · Pretendard

---

## ⚠️ 신규 개발자 필독 — shadcn 의미 SWAP

이 프로젝트는 **shadcn 표준 색상 의미를 Figma reference에 맞게 덮어썼습니다.** shadcn 경험이 있을수록 헷갈리니 반드시 인지:

| 클래스 | shadcn 표준 | **이 프로젝트** |
|---|---|---|
| `bg-primary` | 브랜드 블루 | **흰 카드 배경** |
| `text-primary` | 브랜드 블루 글자 | **가장 진한 글자** |
| `bg-accent` | 서브틀 hover bg | **브랜드 블루 (#3182F6)** |
| `text-accent-foreground` | 서브틀 위 진한 글자 | **흰 글자 (브랜드 위)** |
| `bg-muted` | (그대로) | 서브틀 hover bg |

**즉 "primary = 가장 강조되는 표면/글자"**, 브랜드 색은 **`accent`** (Figma `accent` 토큰과 일치).

---

## 1. 색상 토큰 3-레이어 구조

`globals.css`에 정의된 3단계 토큰 시스템.

```
Layer 1 (Atomic):    --blue-500, --cool-neutral-990, --red-500, ...   ← 직접 참조 금지
Layer 2 (Semantic):  --bg-primary, --text-primary, --border-subtle, --accent
Layer 3 (Bridge):    @theme inline + @utility로 Tailwind 클래스 노출
```

### Layer 2 핵심 변수 (전체 목록)

| 카테고리 | 변수명 | Tailwind 클래스 |
|---|---|---|
| Background | `--bg-primary` (흰 카드) / `--bg-secondary` / `--bg-tertiary` (페이지 bg) / `--bg-subtle` | `bg-primary` / `bg-secondary` / `bg-tertiary` / `bg-quaternary` |
| Text | `--text-primary` (진한) / `--text-secondary` / ... / `--text-disabled` | `text-primary` / `text-secondary` / ... / `text-disabled` |
| Border | `--border-subtle` (옅은) / `--border-primary` / `--border-strong` | `border-subtle` / `border-primary` / `border-strong` |
| **Brand (단일 토큰)** | **`--accent`** (브랜드 블루 #3182F6) | `bg-accent` / `text-accent` / `border-accent` |
| Divider (alpha) | `--divider-subtle` / `--divider-normal` / `--divider-strong` | `bg-divider-*` |
| Fill | `--fill-subtle/normal/strong/hover/filter` | `bg-fill-*` |
| Tint (배지) | `@utility bg-{color}-tint` / `text-{color}-tint` | `bg-blue-tint` / `text-green-tint` 등 |

### prefix 매칭 규칙 (필수)

변수명의 카테고리 prefix와 Tailwind 클래스 prefix가 **반드시 일치**해야 함:
- `--text-primary` → `text-primary` ✅ (글자색)
- `--text-primary` → `bg-text-primary` ❌ (정의 안 됨)
- 색상값을 swatch로 임시 표시할 때만 `bg-[var(--text-primary)]` arbitrary value 사용

### 왜 `@utility`도 쓰나?

Tailwind v4의 `--color-*` 한 변수는 `bg-X` / `text-X` / `border-X` 모두 같은 값을 강제함. 그런데 reference는 같은 `primary` 이름이지만 카테고리별로 값이 다름:
- `bg_primary` = 흰색
- `text_primary` = 가장 진한 글자
- `border_primary` = 중간 회색

→ `--color-primary` / `--color-secondary` / `--color-muted`를 `@theme`에서 의도적으로 제거하고, 각 속성을 `@utility`로 별도 정의.

### shadcn Bridge 주요 매핑

```css
:root {
  --primary:              var(--bg-primary);    /* WHITE (reference bg_primary) */
  --primary-foreground:   var(--text-primary);  /* dark text on white */
  --accent:               var(--blue-500);      /* BRAND BLUE (reference accent) */
  --accent-foreground:    var(--common-100);    /* white text on brand */
  --muted:                var(--bg-subtle);     /* subtle hover bg */
  --muted-foreground:     var(--text-assistive);
}
```

### 절대 금지

- `dark:` prefix — 라이트 모드 전용
- 컴포넌트에 raw hex 직접 작성
- `font-bold` → `font-semibold` 사용
- `var(--ds-*)` / `var(--atom-*)` — 옛 변수명 (제거됨)
- `bg-surface-*` / `text-label-*` / `border-line-*` — 옛 prefix 시스템 (제거됨)
- `bg-brand` / `text-brand` — reference에 없는 토큰

---

## 2. B2B 다중 브랜드 — 브랜드별 컬러 커스터마이징

브랜드별로 변경되는 색상은 **`--accent` 한 변수**.

### 적용 방법

**1단계 — globals.css에 브랜드 오버라이드 추가**:
```css
[data-brand="green"]  { --accent: var(--green-500); }
[data-brand="orange"] { --accent: oklch(0.65 0.20 45); }
```

**2단계 — html/body/wrapper에 data-brand 속성 적용**:
```tsx
<html lang="ko" data-brand={tenant.brand}>
```

### 자동 추종 컴포넌트

`--accent` 변경 시 모두 자동:
- `<Button variant="default">` (액션 버튼)
- `<Badge variant="default">`
- 사이드바 selected/ring
- 링크 색 (`text-accent`)
- 체크박스/라디오 ON 상태
- focus ring
- 캘린더 선택 날짜
- 토글 ON

**컴포넌트 코드 수정 불필요** — 200+ `bg-accent`/`text-accent` 사용처가 모두 CSS 변수로 추상화돼 있음.

### 예외 (브랜드와 무관)

- `bg-blue-tint` (info 배지) — 브랜드가 그린이어도 info=파랑
- `bg-success` / `bg-warning` / `bg-destructive` — 시맨틱 상태색

---

## 3. 타이포그래피

**폰트**: Pretendard (로컬 로드, `layout.tsx`)
**`font-bold` 절대 금지 — 항상 `font-semibold` 사용.**

### Reference Composite 토큰 (사용 권장 — 점진 도입)

> ⚠️ **현재 v1 상태**: `globals.css`에 정의됨. 컴포넌트는 아직 LEGACY (`text-heading-xl` 등) 또는 직접 픽셀(`text-[28px]`)로 작성됨.
> 신규 작업/리팩터 시 아래 composite 토큰 사용 권장.

`globals.css`에 30+ composite 클래스 정의. 각 클래스가 font-size + line-height + font-weight + letter-spacing(-0.5px 기본) 모두 묶어둠.

```tsx
text-h1-bold                            // 36/46 semibold
text-h2-bold  / text-h2                 // 34/40 semi/medium
text-h3-bold  / text-h3                 // 24/36 semi/medium
text-h4                                 // 22/32 semibold
text-h5-bold  / text-h5-medium / text-h5  // 20/30
text-body1-bold / text-body1            // 18/28
text-body2-bold / text-body2-medium / text-body2-normal  // 16/24
text-body3-bold / text-body3-medium / text-body3-normal  // 14/22
text-body4-bold / text-body4-medium / text-body4-normal  // 13/18-20
text-body5-bold / text-body5-medium / text-body5-normal  // 12/16-20
text-caption / text-caption-bold / text-caption-underline // 10/16
```

### LEGACY 클래스 (호환 유지)

`text-heading-xl/lg/md`, `text-body-md/sm`, `text-label-md/sm/xs`, `text-nav`, `text-caption`, `text-kpi`, `text-num-md/sm` — 기존 코드에서 동작. 새 작업은 위의 reference composite 토큰 사용.

### 자주 쓰는 패턴 (직접 픽셀 지정)

페이지 타이틀, KPI처럼 **커스텀 line-height 필요**한 곳은 직접 지정:

| 용도 | 클래스 |
|---|---|
| 페이지 타이틀 | `text-[28px] font-semibold text-primary tracking-tight leading-tight [text-wrap:balance]` |
| 카드 타이틀 | `text-[20px] font-semibold text-primary tracking-tight` |
| 테이블 헤더 | `text-[12px] font-medium text-assistive` |
| 테이블 셀 | `text-[13px] text-primary` |
| KPI 숫자 | `text-[24px] font-semibold tracking-tight text-primary leading-none tabular-nums` |
| 페이지 부제목 | `text-[14px] text-assistive mt-2` |

**숫자 셀 유틸** (`num-cell` — globals.css):
휴대폰번호·날짜·금액·ID 등 숫자 밀도 높은 컬럼.
```tsx
<TableCell className="text-left num-cell">{row.phone}</TableCell>
```

### text-foreground vs text-primary

- **user 코드**: `text-primary` 사용 권장 (reference 표준)
- **shadcn ui/ 내부**: `text-foreground` 그대로 둠 (shadcn 표준 호환)
- 둘은 같은 값(`var(--text-primary)`) 가리킴

---

## 4. Reference 추가 토큰 (Border / Radius / Spacing / Shadow)

레퍼런스의 nominal 토큰을 그대로 노출.

### Border Width

```tsx
border-border05    // 0.5px (특수)
border-border10    // 1px (기본 = Tailwind border와 동일)
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

기존 `rounded-md` / `rounded-lg`도 사용 가능 (shadcn 호환).

**라운드 계층 규칙 (Vega 스타일)**:
| 레벨 | 값 | 대상 |
|---|---|---|
| 카드 | `rounded-lg` | 모든 카드 컨테이너 |
| 컨트롤 (h-9) | `rounded-md` | Select, Input, 필터 버튼 |
| 소형 컨트롤 (h-8/h-6) | `rounded-md` | 소형 버튼 |
| 배지 | `rounded-full` | pill/tint 배지 |

**`rounded-xl` 금지.** 단 reference `rounded-r20`(20px) / `rounded-r24`(24px)는 OK.

### Spacing (`s2` ~ `s64`)

```tsx
p-s4  gap-s8  m-s16  px-s24  ...
// s2, s4, s6, s8, s10, s12, s16, s20, s24, s28, s30, s32, s38, s40, s44, s48, s52, s56, s58, s64
```

기존 Tailwind 기본 스케일(`p-2`, `gap-4`)도 사용 가능 — 4px 그리드 동일.

### Shadow

```tsx
shadow-sd03   // 0 2 20 rgba(0,0,0,0.3)
shadow-sd25   // 0 4 20 rgba(0,0,0,0.25)
```

---

## 5. 카드

그림자 없음. 보더만 사용.

```tsx
<div className="bg-primary rounded-lg border border-subtle">
```

**내부 구분선**: `border-b` 전체 너비 금지. `mx-6` 좌우 패딩 필수:

```tsx
<div className="mx-6 h-px bg-divider-subtle" />
```

**KPI 타일 카드** (`ConsultingSection`, `AssignedDbTable` 패턴):

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
          <span className="text-[24px] font-semibold tracking-tight text-primary leading-none tabular-nums">
            {stat.value}
          </span>
          <span className="text-[24px] font-semibold tracking-tight text-primary leading-none">
            {stat.unit}
          </span>
        </div>
      </div>
    ))}
  </div>
</div>
```

---

## 6. 버튼

shadcn `Button` size variant만 사용. **`h-*`, `px-*` 수동 오버라이드 금지.**

| size | height | 용도 |
|---|---|---|
| `xs` | h-6 | 테이블 인라인 (승인/거절) |
| `sm` | h-8 | 페이지네이션 버튼 |
| `default` | h-9 | 주요 액션 (저장, 재배정) |
| `icon` | h-9 w-9 | 아이콘 전용 |

| 용도 | 코드 |
|---|---|
| 메인 액션 | `<Button>` (variant="default" — `bg-accent text-accent-foreground` 내장) |
| 필터 검색 | `<Button variant="secondary">` 또는 `bg-accent/10 text-accent hover:bg-accent/20` |
| 연장 등 소형 | `<Button variant="outline" size="xs">` |
| 어두운 강조 | `bg-foreground text-inverse-primary hover:bg-foreground/85` |

---

## 7. 필터

**필터 컨트롤 fill**: **`bg-fill-filter` (= 흰색)** + **`border-subtle`** 통일.
`bg-muted/60` 사용 금지 — 페이지 배경(`bg-tertiary`)과 대비 없음.

**구성 순서**: Select → Input → 검색 → 필터 초기화

```tsx
{/* Input — filter variant */}
<Input variant="filter" className="w-[200px] pl-9" />

{/* Select */}
<SelectTrigger className="bg-fill-filter border-subtle">...</SelectTrigger>

{/* 검색 버튼 */}
<Button className="bg-accent/10 text-accent hover:bg-accent/20 shadow-none rounded-md">검색</Button>

{/* 필터 초기화 — 필터 변경 시에만 노출 */}
{hasFilter && (
  <button
    onClick={handleReset}
    className="h-8 px-1 text-[12px] font-medium text-accent underline underline-offset-2 decoration-accent hover:opacity-70 active:scale-[0.97] transition-[transform,opacity] duration-100"
  >
    필터 초기화
  </button>
)}
```

**필터 초기화 규칙**:
- 아이콘 버튼(`RotateCcw`) 사용 금지 → 텍스트 언더라인 버튼
- 모든 필터가 기본값일 때 숨김, 하나라도 변경되면 노출

**SelectContent**:
```tsx
<SelectContent className="rounded-md border-subtle text-[13px]">
```

---

## 8. 필터 위치 규칙

페이지별로 두 패턴 공존:

**패턴 A — 필터 카드 별도 분리** (`mb-4` 간격):
- `/completed`, `/db/assigned`, `/db/unassigned`, `/management/*`, `/organization/*`

```tsx
<div className="mb-4"><XxxFilter /></div>
<XxxTable />
```

**패턴 B — 필터가 카드 헤더 내부**:
- `/` (홈 — ConsultingSection 헤더 내부)
- `/pending` (PendingTable 카드 헤더 내부)

---

## 9. 테이블

### 구조 (툴바 + 카드 + 페이지네이션)

```tsx
<div className="sticky top-3 z-[5] flex flex-col gap-0.5">

  {/* 툴바 */}
  <div className="bg-tertiary flex items-center justify-between py-1">
    <span className="text-[13px] font-medium text-assistive tabular-nums">
      전체 {MOCK_ROWS.length}건
    </span>
    <PageSizeSelect value={pageSize} onValueChange={(v) => { setPageSize(v); setCurrentPage(1) }} />
  </div>

  {/* 테이블 카드 */}
  <div className="bg-primary rounded-lg overflow-hidden border border-subtle">
    <div className="overflow-auto max-h-[calc(100svh-10rem)]">
      <Table>
        <TableHeader className="sticky top-0 z-10">...</TableHeader>
        <TableBody>{displayedRows.map((row) => ( ... ))}</TableBody>
      </Table>
    </div>
  </div>

  {/* 페이지네이션 */}
  <PageNumbers totalPages={totalPages} currentPage={currentPage} onPageChange={setCurrentPage} className="mt-1" />
</div>
```

**간격 규칙**:
- 툴바 ↔ 테이블 카드: `gap-0.5` (2px)
- 테이블 카드 ↔ 페이지네이션: `mt-1` (4px)

**Sticky 동작 원리**:
- `overflow-x-auto`는 자식 sticky 차단 → `overflow-auto max-h-[calc(100svh-10rem)]` 사용
- 테이블 헤더: `sticky top-0 z-10` (테이블 내부 스크롤)
- 툴바+테이블+페이지네이션 전체: `sticky top-3 z-[5]` (페이지 스크롤)

### 헤더 스펙 (`table.tsx` 전역 — 개별 파일 오버라이드 금지)

| 속성 | 값 |
|---|---|
| TableHead 높이 | `h-10` (40px) |
| TableHead 배경 | `bg-primary` (sticky 시 아래 행 가림) |
| TableCell 높이 | `h-[44px]` (터치 타겟 최소값) |
| TableCell 패딩 | `px-3 py-2.5` |
| 마지막 행 보더 | `border-0` (TableBody 전역) |

**No. 컬럼**: 헤더+셀 모두 `text-center`, 나머지 컬럼 `text-left` 기본.

**헤더 클래스 패턴**:
```tsx
<TableHead className="text-left font-semibold text-assistive text-[12px] h-10 min-w-24">
  컬럼명
</TableHead>
```

### 행 인터랙션

```tsx
<TableRow
  className="cursor-pointer border-divider-subtle hover:bg-fill-subtle transition-colors duration-120"
  onClick={() => console.log("open detail", row.no)}
>
  {/* 체크박스·액션 셀은 반드시 stopPropagation */}
  <TableCell onClick={(e) => e.stopPropagation()}>
    <Checkbox ... />
  </TableCell>
</TableRow>
```

체크박스 선택 행: `data-[state=selected]:bg-accent/5`

### 페이지네이션 로직

```tsx
const pageSizeNum = parseInt(pageSize)
const totalPages = Math.ceil(MOCK_ROWS.length / pageSizeNum)
const displayedRows = MOCK_ROWS.slice((currentPage - 1) * pageSizeNum, currentPage * pageSizeNum)

// 페이지 크기 변경 시 1페이지로 초기화
<PageSizeSelect onValueChange={(v) => { setPageSize(v); setCurrentPage(1) }} />
```

`PageNumbers` 컴포넌트가 7슬롯 알고리즘 내장 (레이아웃 쉬프트 방지).

### 체크박스 전체선택 (현재 페이지 기준)

```tsx
const allSelected = displayedRows.length > 0 && displayedRows.every(r => selectedIds.includes(r.no))

const toggleAll = () => setSelectedIds(allSelected
  ? selectedIds.filter(id => !displayedRows.find(r => r.no === id))
  : [...new Set([...selectedIds, ...displayedRows.map(r => r.no)])]
)
```

---

## 10. 배지 (`badge.tsx` 커스텀 variant)

**tint-* (종결·분류 상태 — fill 배지)**

```tsx
<Badge variant="tint-success">계약 완료</Badge>
<Badge variant="tint-warning">상담 거절</Badge>
<Badge variant="tint-muted">종료</Badge>
<Badge variant="tint-blue">진행 예정</Badge>
```

| variant | bg | text |
|---|---|---|
| `tint-success` | green-50 | green-450 |
| `tint-warning` | amber-50 | amber-700 |
| `tint-danger` | red-50 | red-600 |
| `tint-muted` | quaternary | quaternary |
| `tint-blue` | blue-tint (bg) | blue-tint (text) |

**칸반용 tag-* (컴팩트 태그)**

```tsx
<Badge variant="tag-red">긴급</Badge>
<Badge variant="tag-green">완료</Badge>
<Badge variant="tag-dark">예약</Badge>
<Badge variant="tag-blue">상담중</Badge>
<Badge variant="tag-muted">보류</Badge>
```

---

## 11. 레이아웃 구조

```
layout.tsx
├── AppSidebar (collapsible icon, 플로팅 토글)
└── main
    ├── Header (고정 상단)
    └── {children}
```

**페이지 외곽 래퍼**:

```tsx
<div className="h-full overflow-y-auto overflow-x-hidden bg-tertiary scrollbar-hide flex flex-col min-h-full">
  <div className="px-6 pt-10 pb-6">
    <h1 className="text-[28px] font-semibold text-primary tracking-tight leading-tight [text-wrap:balance]">페이지명</h1>
    <p className="text-[14px] text-assistive mt-2">부제목</p>
  </div>
  <TitleObserver />
  {/* 콘텐츠 */}
  <Footer />
</div>
```

> `/dashboard` 등 차트가 많은 페이지는 outer wrapper에 `bg-quaternary`(약간 진한 배경) 사용 가능.

**콘텐츠 레이아웃 패턴**:

**패턴 1 — BusinessTree + 필터 별도 + 테이블** (`/completed`, `/db/*`, `/management/*`, `/organization/*`):
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

**패턴 3 — BusinessTree 없음** (`/db/status`, 설정 페이지):
```tsx
<div className="px-6 pb-15">
  <XxxTable />
</div>
```

**간격 규칙**:
- 카드 간: `gap-4` (16px)
- 필터 카드 ↔ 테이블: `mb-4` (16px)
- BusinessTree ↔ 콘텐츠: `gap-3` (12px)

---

## 12. 공통 컴포넌트

| 컴포넌트 | 위치 | 설명 |
|---|---|---|
| `BusinessTree` | `components/business-tree.tsx` | 사업단→지점→팀 3단계 조직도 (9개 페이지 사용). `sticky top-3` 고정 |
| `Footer` | `components/footer.tsx` | 저작권+이용약관. 모든 페이지 최하단. `mt-auto shrink-0` |
| `TitleObserver` | `components/title-observer.tsx` | 페이지 타이틀 IntersectionObserver |
| `SearchFilter` | `components/dashboard/search-filter.tsx` | 공용 필터: PlannerCombobox + Input + ExtraSelect + 초기화 |
| `PageNumbers` / `PageSizeSelect` | `components/ui/pagination.tsx` | 공용 페이지네이션 (7슬롯 알고리즘 내장) |

---

## 13. 신규 shadcn 컴포넌트 추가 시 필수 작업

`npx shadcn@latest add [component]` 실행 후 **반드시 아래 5단계**:

### 1. 색상 토큰 치환

| shadcn 기본 → 우리 시스템 |
|---|
| `bg-primary text-primary-foreground` (액션 버튼) → **`bg-accent text-accent-foreground`** |
| `bg-primary/X` (브랜드 알파) → **`bg-accent/X`** |
| `text-primary` (브랜드 글자) → **`text-accent`** |
| `border-primary` (브랜드 보더) → **`border-accent`** |
| `ring-primary` → **`ring-accent`** |
| `bg-accent text-accent-foreground` (서브틀 hover, shadcn 의미) → **`bg-muted text-muted-foreground`** |
| `data-[state=checked]:bg-primary` (체크박스/라디오 ON) → **`data-[state=checked]:bg-accent`** |

### 2. Radius 정리

- 카드/큰 컨테이너: `rounded-lg`
- 필터 컨트롤(h-9): `rounded-md`
- 소형(h-8/h-6): `rounded-md`
- `rounded-xl` 금지 (단 `rounded-r20`/`rounded-r24` 사용 가능)

### 3. 폰트 굵기

`font-bold` 발견 시 즉시 `font-semibold`로 교체.

### 4. 보더

- 카드: `border border-subtle`
- input/select: `border-input` (shadcn 표준)

### 5. dark: prefix 제거

`dark:bg-*` 등 다크모드 클래스 모두 제거.

### ✅ 작업 후 검증

```bash
grep -E "bg-primary|text-primary-foreground|bg-accent " <new-file>  # shadcn 의미로 쓰인 곳
grep "font-bold" <new-file>     # 0건
grep "dark:" <new-file>         # 0건
grep "rounded-xl" <new-file>    # 0건 (rounded-r20/r24는 OK)
npx tsc --noEmit                # 빌드 검증
```

페이지에서 실제 렌더 확인 — 액션 버튼이 브랜드 블루로 표시되는지, hover 부드러운지.

---

## 14. design-system 페이지 토큰 시각화 규칙

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

`TokenRow` 컴포넌트의 `kind` prop이 자동으로 적절한 시각화 처리.

---

## 15. PR 체크리스트

- [ ] `dark:` prefix 없음
- [ ] `font-bold` 없음 → `font-semibold`
- [ ] `rounded-xl` 없음 → 카드 `rounded-lg`, 컨트롤 `rounded-md`
- [ ] 옛 prefix 없음: `bg-surface-*` / `text-label-*` / `border-line-*` / `var(--ds-*)` / `var(--atom-*)`
- [ ] `bg-brand` / `text-brand` 사용 안 함 (reference에 없음 → `bg-accent` 사용)
- [ ] 버튼 `h-*` / `px-*` 수동 오버라이드 없음 (size variant만 사용)
- [ ] 필터 컨트롤 fill: `bg-fill-filter border-subtle` (`bg-muted/60` 금지)
- [ ] 필터 초기화: 텍스트 언더라인 버튼 (`RotateCcw` 아이콘 버튼 금지)
- [ ] 테이블 `No.` 컬럼만 `text-center`, 나머지 `text-left`
- [ ] 테이블 헤더 `font-semibold` (font-medium 금지)
- [ ] 숫자/날짜/전화번호 셀에 `num-cell` 적용
- [ ] 테이블 sticky 블록: `sticky top-3 z-[5] flex flex-col gap-0.5`
- [ ] 테이블 내부 스크롤: `overflow-auto max-h-[calc(100svh-10rem)]` (`overflow-x-auto` 금지)
- [ ] 테이블 헤더 sticky: `<TableHeader className="sticky top-0 z-10">`
- [ ] 페이지 크기 변경 시 currentPage 1로 초기화
- [ ] `PageNumbers` / `PageSizeSelect` 사용 (7슬롯 알고리즘 내장)
- [ ] 체크박스 전체선택: `displayedRows` 기준 (MOCK_ROWS 전체 기준 금지)
- [ ] `<Footer />` 모든 페이지 최하단에 배치

---

## 16. 파일 레퍼런스

| 역할 | 파일 |
|---|---|
| 디자인 토큰 | `src/app/globals.css` |
| 테이블 기본 컴포넌트 | `src/components/ui/table.tsx` |
| 페이지네이션 | `src/components/ui/pagination.tsx` |
| 배지 variant | `src/components/ui/badge.tsx` |
| 버튼 variant | `src/components/ui/button.tsx` |
| 라디오 variant | `src/components/ui/radio-group.tsx` |
| 공통 필터 | `src/components/dashboard/search-filter.tsx` |
| 조직도 | `src/components/business-tree.tsx` |
| 테이블 레퍼런스 (sticky + KPI) | `src/components/management/admin-table.tsx` |
| 테이블 레퍼런스 (체크박스 + 필터) | `src/components/dashboard/unassigned-db-table.tsx` |
| 배지 tint 레퍼런스 | `src/components/dashboard/completed-table.tsx` |
| 디자인 시스템 가이드 페이지 | `src/app/design-system/page.tsx` |
