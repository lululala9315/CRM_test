"use client"

/**
 * 역할: 홈 대시보드 — Amplitude + 토스증권 스타일 KPI/차트 뷰
 * 주요 기능: KPI 타일 행 · 통화율 AreaChart · 리드타임/미대응 BarChart
 * 참고: shadcn ChartContainer + ChartTooltipContent 사용, muted 톤 팔레트
 */

import { useState } from "react"
import { CalendarDays, ArrowUpRight, ArrowDownRight } from "lucide-react"
import { format, startOfMonth, endOfMonth, subMonths } from "date-fns"
import { ko } from "date-fns/locale/ko"
import { type DateRange } from "react-day-picker"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { BusinessTree } from "@/components/business-tree"
import { Footer } from "@/components/footer"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import {
  BarChart, Bar, Cell,
  AreaChart, Area,
  XAxis, YAxis, CartesianGrid,
  LabelList,
} from "recharts"

// ─── 색상 상수 — 블루→퍼플 단일 팔레트 ─────────────────────────────────────
const C = {
  b1: "#3182F6",  // blue
  b2: "#4F75F0",  // blue-purple
  b3: "#6B68EB",  // mid
  b4: "#855BE6",  // purple
  b5: "#9B4FE0",  // deep purple
}
const muted = "#8B95A1"
const grid  = "#F2F4F6"

// ─── ChartConfig ─────────────────────────────────────────────────────────────

const callRateConfig = {
  시도율: { label: "시도율", color: C.b1 },
  성공율: { label: "성공율", color: C.b3 },
  유효율: { label: "유효율", color: C.b5 },
} satisfies ChartConfig

const leadTimeConfig = {
  value: { label: "건수" },
} satisfies ChartConfig

const noResponseConfig = {
  value: { label: "건수" },
} satisfies ChartConfig

// ─── 목업 데이터 ───────────────────────────────────────────────────────────────

const kpiMetrics = [
  { label: "총 배정 수",     value: "2,000", unit: "건", delta: "+120건", up: true,  good: true  },
  { label: "통화 시도율",    value: "20.0",  unit: "%",  delta: "+2.3%",  up: true,  good: true  },
  { label: "통화 성공율",    value: "19.1",  unit: "%",  delta: "-1.1%",  up: false, good: false },
  { label: "유효 통화율",    value: "18.3",  unit: "%",  delta: "+0.8%",  up: true,  good: true  },
  { label: "평균 통화 시간", value: "30:00", unit: "분", delta: "-2:30",  up: false, good: true  },
]

const callRateTrend = [
  { week: "1/1",  시도율: 16.8, 성공율: 15.2, 유효율: 13.4 },
  { week: "1/8",  시도율: 18.2, 성공율: 16.8, 유효율: 14.9 },
  { week: "1/15", 시도율: 17.5, 성공율: 17.1, 유효율: 15.8 },
  { week: "1/22", 시도율: 19.4, 성공율: 17.9, 유효율: 16.7 },
  { week: "1/29", 시도율: 20.1, 성공율: 18.6, 유효율: 17.5 },
  { week: "2/5",  시도율: 19.2, 성공율: 19.0, 유효율: 18.1 },
  { week: "2/12", 시도율: 21.0, 성공율: 19.7, 유효율: 18.9 },
  { week: "2/19", 시도율: 20.0, 성공율: 20.0, 유효율: 20.1 },
]

const leadTimeDist = [
  { name: "1일 이내", value: 85, color: C.b1 },
  { name: "2일",      value: 52, color: C.b2 },
  { name: "3일",      value: 38, color: C.b3 },
  { name: "4일 이상", value: 25, color: C.b4 },
]

const noResponseData = [
  { name: "~1일",   value: 10, color: C.b1 },
  { name: "2~4일",  value: 28, color: C.b2 },
  { name: "5~7일",  value: 21, color: C.b3 },
  { name: "8~10일", value: 14, color: C.b4 },
  { name: "10일~",  value:  7, color: C.b5 },
]

// ─── 카드 헤더 (Amplitude 패턴: title/subtitle + legend, border-b 구분) ─────

function CardHeader({
  title, subtitle, legend,
}: {
  title: string
  subtitle?: string
  legend?: { label: string; color: string }[]
}) {
  return (
    <div className="px-5 py-4 border-b border-line-subtle flex items-center justify-between">
      <div>
        <h3 className="text-[14px] font-semibold text-content-primary tracking-tight">{title}</h3>
        {subtitle && (
          <p className="text-[12px] text-content-assistive mt-0.5 leading-none">{subtitle}</p>
        )}
      </div>
      {legend && (
        <div className="flex items-center gap-4">
          {legend.map(l => (
            <div key={l.label} className="flex items-center gap-1.5">
              <div className="h-[2.5px] w-4 rounded-full" style={{ background: l.color }} />
              <span className="text-[11px] font-semibold text-content-assistive">{l.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── 공통 축 스타일 ───────────────────────────────────────────────────────────
const axisStyle = { fontSize: 11, fill: muted, fontWeight: 500 }

// ─── 메인 ─────────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const today = new Date(2026, 3, 22)  // 목업 기준 오늘

  const [dateRange,   setDateRange]   = useState<DateRange | undefined>({
    from: new Date(2026, 0, 1),
    to:   new Date(2026, 0, 31),
  })
  const [activeRange, setActiveRange] = useState<"month" | "prev" | "3month" | null>("month")

  const QUICK_RANGES: { key: "month" | "prev" | "3month"; label: string; range: DateRange }[] = [
    { key: "month",  label: "이번 달",   range: { from: startOfMonth(today), to: today } },
    { key: "prev",   label: "저번 달",   range: { from: startOfMonth(subMonths(today, 1)), to: endOfMonth(subMonths(today, 1)) } },
    { key: "3month", label: "최근 3개월", range: { from: startOfMonth(subMonths(today, 2)), to: today } },
  ]

  const handleQuickRange = (key: typeof QUICK_RANGES[number]["key"]) => {
    const found = QUICK_RANGES.find(r => r.key === key)
    if (found) { setDateRange(found.range); setActiveRange(key) }
  }

  const leadTimeTotal   = leadTimeDist.reduce((s, d) => s + d.value, 0)
  const noResponseTotal = noResponseData.reduce((s, d) => s + d.value, 0)

  return (
    <div className="h-full overflow-y-auto overflow-x-hidden bg-canvas-quaternary scrollbar-hide flex flex-col min-h-full">

      {/* 타이틀 */}
      <div className="px-6 pt-10 pb-6">
        <h1 className="text-[28px] font-semibold text-content-primary tracking-tight leading-tight [text-wrap:balance]">
          홈 대시보드
        </h1>
        <p className="text-[14px] text-content-assistive mt-2">
          조직별 배정·통화 성과를 기간 기준으로 확인합니다
        </p>
      </div>

      {/* 콘텐츠 */}
      <div className="flex gap-3 px-6 pb-15 items-start">
        <BusinessTree />

        <div className="flex-1 min-w-0 flex flex-col gap-4">

          {/* ── 기간 필터 ────────────────────────────────────────────────────── */}
          <div className="flex items-center gap-2">
            {/* DateRange Picker */}
            <Popover>
              <PopoverTrigger asChild>
                <button className={cn(
                  "h-8 flex items-center gap-2 rounded-md border px-3 text-[13px] font-medium transition-opacity hover:opacity-80",
                  "bg-white border-line-subtle text-content-primary shadow-xs"
                )}>
                  <CalendarDays className="h-3.5 w-3.5 text-content-assistive shrink-0" />
                  {dateRange?.from ? (
                    dateRange.to
                      ? `${format(dateRange.from, "yyyy.MM.dd")} ~ ${format(dateRange.to, "yyyy.MM.dd")}`
                      : format(dateRange.from, "yyyy.MM.dd")
                  ) : (
                    <span className="text-content-disabled">날짜 선택</span>
                  )}
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="range"
                  selected={dateRange}
                  onSelect={(range) => { setDateRange(range); setActiveRange(null) }}
                  numberOfMonths={2}
                  locale={ko}
                />
              </PopoverContent>
            </Popover>

            {/* 빠른 기간 선택 — shadcn Tabs, DS 적용, 우측 배치 */}
            <Tabs
              value={activeRange ?? ""}
              onValueChange={(v) => handleQuickRange(v as typeof QUICK_RANGES[number]["key"])}
              className="ml-auto"
            >
              <TabsList className="h-8! bg-fill-hover gap-0 p-[3px]">
                {QUICK_RANGES.map(({ key, label }) => (
                  <TabsTrigger
                    key={key}
                    value={key}
                    className="h-full px-3 text-[12px] font-semibold"
                  >
                    {label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>

          {/* ── KPI — StatsSection 동일 패턴 ────────────────────────────── */}
          <div className="bg-canvas-primary rounded-lg py-5 border border-line-subtle">
            <div className="flex items-stretch">
              {kpiMetrics.map((kpi, i) => (
                <div key={kpi.label} className="flex-1 px-6 relative">
                  {i > 0 && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 h-12 w-px bg-divider-normal" />
                  )}
                  <p className="text-[12px] font-medium text-content-assistive mb-2.5 tracking-tight leading-none whitespace-nowrap">
                    {kpi.label}
                  </p>
                  <div className="flex items-baseline gap-0.5">
                    <span className="text-[24px] font-semibold tracking-tight leading-none tabular-nums text-content-primary">{kpi.value}</span>
                    <span className="text-[24px] font-semibold tracking-tight leading-none tabular-nums text-content-primary">{kpi.unit}</span>
                  </div>
                  <div className={cn(
                    "mt-1.5 inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[11px] font-semibold",
                    kpi.good ? "bg-green-tint text-green-tint" : "bg-red-tint text-red-tint"
                  )}>
                    {kpi.up ? <ArrowUpRight className="h-3 w-3 shrink-0" /> : <ArrowDownRight className="h-3 w-3 shrink-0" />}
                    {kpi.delta}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── 차트 2열 그리드 ─────────────────────────────────────────────── */}
          <div className="grid grid-cols-5 gap-4 items-start">

            {/* 통화율 주간 추이 AreaChart — 3/5 */}
            <div className="col-span-3 bg-card rounded-lg border border-line-subtle overflow-hidden">
              <CardHeader
                title="통화율 주간 추이"
                subtitle="1월 1일 ~ 2월 19일 · 8주"
                legend={[
                  { label: "시도율", color: C.b1 },
                  { label: "성공율", color: C.b3 },
                  { label: "유효율", color: C.b5 },
                ]}
              />
              <div className="px-5 pt-5 pb-3">
                <ChartContainer config={callRateConfig} className="h-[196px] w-full">
                  <AreaChart
                    data={callRateTrend}
                    margin={{ top: 8, right: 4, bottom: 0, left: -16 }}
                  >
                    <defs>
                      <linearGradient id="gp" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%"  stopColor={C.b1} stopOpacity={0.14} />
                        <stop offset="95%" stopColor={C.b1} stopOpacity={0.01} />
                      </linearGradient>
                      <linearGradient id="gg" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%"  stopColor={C.b3} stopOpacity={0.12} />
                        <stop offset="95%" stopColor={C.b3} stopOpacity={0.01} />
                      </linearGradient>
                      <linearGradient id="gi" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%"  stopColor={C.b5} stopOpacity={0.12} />
                        <stop offset="95%" stopColor={C.b5} stopOpacity={0.01} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid vertical={false} stroke={grid} />
                    <XAxis dataKey="week" tick={axisStyle} axisLine={false} tickLine={false} />
                    <YAxis
                      tick={axisStyle} axisLine={false} tickLine={false}
                      unit="%" domain={[12, 23]} tickCount={5}
                    />
                    <ChartTooltip content={<ChartTooltipContent indicator="line" />} />
                    <Area type="natural" dataKey="시도율"
                      stroke={C.b1} strokeWidth={2} fill="url(#gp)" dot={false}
                      activeDot={{ r: 4, strokeWidth: 2, stroke: "#fff", fill: C.b1 }} />
                    <Area type="natural" dataKey="성공율"
                      stroke={C.b3} strokeWidth={2} fill="url(#gg)" dot={false}
                      activeDot={{ r: 4, strokeWidth: 2, stroke: "#fff", fill: C.b3 }} />
                    <Area type="natural" dataKey="유효율"
                      stroke={C.b5} strokeWidth={2} fill="url(#gi)" dot={false}
                      activeDot={{ r: 4, strokeWidth: 2, stroke: "#fff", fill: C.b5 }} />
                  </AreaChart>
                </ChartContainer>
              </div>
            </div>

            {/* 리드 타임 분포 horizontal BarChart — 2/5 */}
            <div className="col-span-2 bg-card rounded-lg border border-line-subtle overflow-hidden">
              <CardHeader
                title="리드 타임 분포"
                subtitle={`총 ${leadTimeTotal}건 · 평균 반응 23시간`}
              />
              <div className="px-5 pt-5 pb-3">
                <ChartContainer config={leadTimeConfig} className="h-[196px] w-full">
                  <BarChart
                    data={leadTimeDist} layout="vertical"
                    margin={{ top: 2, right: 48, bottom: 2, left: 0 }}
                    barCategoryGap="30%"
                  >
                    <CartesianGrid horizontal={false} stroke={grid} />
                    <XAxis type="number" tick={axisStyle} axisLine={false} tickLine={false} />
                    <YAxis
                      type="category" dataKey="name" width={62}
                      tick={axisStyle} axisLine={false} tickLine={false}
                    />
                    <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                    <Bar dataKey="value" radius={[0, 4, 4, 0]} maxBarSize={20}>
                      {leadTimeDist.map((d, i) => (
                        <Cell key={i} fill={d.color} fillOpacity={0.85} />
                      ))}
                      <LabelList
                        dataKey="value" position="right"
                        style={{ fontSize: 11, fontWeight: 600, fill: muted }}
                        formatter={(v: any) => `${v}건`}
                      />
                    </Bar>
                  </BarChart>
                </ChartContainer>
              </div>
            </div>
          </div>

          {/* ── 미대응 현황 full-width ─────────────────────────────────────── */}
          <div className="bg-card rounded-lg border border-line-subtle overflow-hidden">
            <CardHeader
              title="미대응 현황"
              subtitle={`총 ${noResponseTotal}건 · 10일 초과 7건 긴급`}
            />
            <div className="px-5 pt-5 pb-3">
              <ChartContainer config={noResponseConfig} className="h-[160px] w-full">
                <BarChart
                  data={noResponseData}
                  margin={{ top: 22, right: 8, bottom: 0, left: -20 }}
                  barCategoryGap="36%"
                >
                  <CartesianGrid vertical={false} stroke={grid} />
                  <XAxis dataKey="name" tick={axisStyle} axisLine={false} tickLine={false} />
                  <YAxis tick={axisStyle} axisLine={false} tickLine={false} />
                  <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]} maxBarSize={52}>
                    {noResponseData.map((d, i) => (
                      <Cell key={i} fill={d.color} fillOpacity={0.85} />
                    ))}
                    <LabelList
                      dataKey="value" position="top"
                      style={{ fontSize: 11, fontWeight: 600, fill: muted }}
                      formatter={(v: any) => `${v}`}
                    />
                  </Bar>
                </BarChart>
              </ChartContainer>
            </div>
          </div>

        </div>
      </div>

      <Footer />
    </div>
  )
}
