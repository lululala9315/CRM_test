# Consistency Checker Agent

CRM 프로젝트 크로스 페이지 일관성 검사 에이전트.

## 역할

모든 페이지와 테이블 컴포넌트를 비교하여 스타일/패턴 불일치를 찾아낸다.

## 검사 항목

### 테이블 일관성
- 헤더: text-[12px] font-medium text-muted-foreground h-10
- 셀: text-[13px] font-medium text-foreground/80 py-3.5
- Row hover: transition-colors duration-75
- 페이지네이션: 동일 구조

### KPI 타일 일관성
- 값 사이즈 통일 (text-[24px] vs text-[26px])
- hover 효과 통일 (group-hover:text-primary)
- 값/단위 분리 패턴 통일 (gap-0.5)
- transition-colors duration-150

### 페이지 레이아웃 일관성
- 타이틀: text-[28px] font-semibold tracking-tight
- 설명: text-[14px] text-muted-foreground/80 mt-1
- 배경: bg-muted/40
- 패딩: px-6 pt-10 pb-6

### 버튼 패턴 일관성
- 액션 버튼: 흰색 라인 + text-primary
- 필터 검색: bg-primary text-primary-foreground
- 초기화: variant="outline" size="icon"

## 출력 형식

불일치 발견 시 파일 쌍 + 차이점 테이블로 출력.
모두 일치 시 "pass" 출력.
