"use client"

/**
 * 역할: 조직도 트리 패널 — 사업단/지점/팀 3단계 계층 탐색
 * 주요 기능: 역할 기반 노출 제어, 각 레벨 접기/펼치기, 펼쳐보기 팝업(캐스케이드 선택기)
 * 참고: visible prop으로 사용자 권한에 따라 렌더 여부 결정 (상위에서 제어)
 */

import { ChevronDown, ChevronUp, Maximize2 } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"

// --- Types ---
interface TeamNode {
  id: string
  title: string
}

interface BranchNode {
  id: string
  title: string
  defaultOpen?: boolean
  children: TeamNode[]
}

interface BusinessUnitNode {
  id: string
  title: string
  defaultOpen?: boolean
  branches: BranchNode[]
}

// --- Mock Data ---
const treeData: BusinessUnitNode[] = [
  {
    id: "unit-munjeong",
    title: "문정사업단",
    defaultOpen: true,
    branches: [
      {
        id: "a-branch",
        title: "A지점",
        defaultOpen: true,
        children: [
          { id: "a-team", title: "A팀" },
          { id: "b-team", title: "B팀" },
          { id: "c-team", title: "C팀" },
          { id: "d-team", title: "D팀" },
          { id: "e-team", title: "E팀" },
          { id: "f-team", title: "F팀" },
          { id: "g-team", title: "G팀" },
          { id: "h-team", title: "H팀" },
        ]
      },
      {
        id: "b-branch",
        title: "B지점",
        children: [
          { id: "b1-team", title: "1팀" },
          { id: "b2-team", title: "2팀" },
          { id: "b3-team", title: "3팀" },
        ]
      },
      {
        id: "e-branch",
        title: "C지점",
        children: [
          { id: "e1-team", title: "기획팀" },
          { id: "e2-team", title: "운영팀" },
          { id: "e3-team", title: "지원팀" },
          { id: "e4-team", title: "관리팀" },
          { id: "e5-team", title: "전략팀" },
        ]
      },
    ]
  },
  {
    id: "unit-gangnam",
    title: "강남사업단",
    defaultOpen: false,
    branches: [
      {
        id: "c-branch",
        title: "A지점",
        children: [
          { id: "c1-team", title: "영업1팀" },
          { id: "c2-team", title: "영업2팀" },
        ]
      },
      {
        id: "d-branch",
        title: "B지점",
        children: [
          { id: "d1-team", title: "강남팀" },
          { id: "d2-team", title: "서초팀" },
          { id: "d3-team", title: "송파팀" },
        ]
      },
    ]
  },
  {
    id: "unit-seocho",
    title: "서초사업단",
    defaultOpen: false,
    branches: [
      {
        id: "f-branch",
        title: "A지점",
        children: [
          { id: "f1-team", title: "VIP팀" },
          { id: "f2-team", title: "법인팀" },
          { id: "f3-team", title: "리테일팀" },
        ]
      },
    ]
  },
]

// --- 유틸: 선택된 팀의 경로 찾기 ---
function findTeamPath(teamId: string): { unitId: string; unitTitle: string; branchId: string; branchTitle: string; teamTitle: string } | null {
  for (const unit of treeData) {
    for (const branch of unit.branches) {
      for (const team of branch.children) {
        if (team.id === teamId) {
          return {
            unitId: unit.id,
            unitTitle: unit.title,
            branchId: branch.id,
            branchTitle: branch.title,
            teamTitle: team.title,
          }
        }
      }
    }
  }
  return null
}

// --- TeamItem ---
function TeamItem({
  team,
  isActive,
  onSelect,
}: {
  team: TeamNode
  isActive: boolean
  onSelect: (id: string) => void
}) {
  return (
    <li>
      <button
        onClick={() => onSelect(team.id)}
        className={cn(
          "w-full flex items-center pl-9 pr-2.5 py-1.5 rounded-md text-[12px] transition-[background-color,color] duration-150",
          isActive
            ? "bg-canvas-quaternary text-content-primary font-semibold hover:bg-canvas-quaternary"
            : "font-medium text-content-quaternary hover:bg-canvas-tertiary hover:text-content-secondary"
        )}
      >
        <span className="truncate">{team.title}</span>
      </button>
    </li>
  )
}

// --- BranchItem ---
function BranchItem({
  branch,
  isOpen,
  selectedTeam,
  onToggle,
  onSelectTeam,
}: {
  branch: BranchNode
  isOpen: boolean
  selectedTeam: string
  onToggle: (id: string) => void
  onSelectTeam: (id: string) => void
}) {
  return (
    <li>
      <button
        onClick={() => onToggle(branch.id)}
        className="w-full flex items-center justify-between pl-5 pr-2.5 py-1.5 rounded-md text-[12px] font-medium text-content-quaternary hover:bg-canvas-tertiary hover:text-primary-dim transition-colors"
      >
        <span className="truncate">{branch.title}</span>
        {isOpen
          ? <ChevronUp className="h-3 w-3 text-content-disabled shrink-0" />
          : <ChevronDown className="h-3 w-3 text-content-disabled shrink-0" />
        }
      </button>

      {isOpen && (
        <ul className="mb-0.5">
          {branch.children.map(team => (
            <TeamItem
              key={team.id}
              team={team}
              isActive={selectedTeam === team.id}
              onSelect={onSelectTeam}
            />
          ))}
        </ul>
      )}
    </li>
  )
}

// --- BusinessUnitItem ---
function BusinessUnitItem({
  unit,
  isOpen,
  openBranches,
  selectedTeam,
  onToggleUnit,
  onToggleBranch,
  onSelectTeam,
}: {
  unit: BusinessUnitNode
  isOpen: boolean
  openBranches: Set<string>
  selectedTeam: string
  onToggleUnit: (id: string) => void
  onToggleBranch: (id: string) => void
  onSelectTeam: (id: string) => void
}) {
  return (
    <li className="mb-0.5">
      <button
        onClick={() => onToggleUnit(unit.id)}
        className="w-full flex items-center justify-between px-2.5 py-2 rounded-md text-[13px] font-semibold text-primary-dim hover:bg-canvas-tertiary hover:text-content-primary transition-colors"
      >
        <span className="truncate">{unit.title}</span>
        {isOpen
          ? <ChevronUp className="h-3.5 w-3.5 text-content-disabled shrink-0" />
          : <ChevronDown className="h-3.5 w-3.5 text-content-disabled shrink-0" />
        }
      </button>

      {isOpen && (
        <ul className="mb-1">
          {unit.branches.map(branch => (
            <BranchItem
              key={branch.id}
              branch={branch}
              isOpen={openBranches.has(branch.id)}
              selectedTeam={selectedTeam}
              onToggle={onToggleBranch}
              onSelectTeam={onSelectTeam}
            />
          ))}
        </ul>
      )}
    </li>
  )
}

// --- CascadeDialog: 3단 캐스케이드 선택기 ---
function CascadeDialog({
  open,
  onOpenChange,
  selectedTeam,
  onSelectTeam,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  selectedTeam: string
  onSelectTeam: (id: string) => void
}) {
  /* 현재 선택된 팀의 경로를 기준으로 컬럼 하이라이트 */
  const currentPath = findTeamPath(selectedTeam)

  /* 팝업 내부 hover/click 상태 — 사업단, 지점 선택 추적 */
  const [activeUnit, setActiveUnit] = useState<string>(currentPath?.unitId ?? treeData[0]?.id ?? "")
  const [activeBranch, setActiveBranch] = useState<string>(currentPath?.branchId ?? "")

  /* 사업단이 바뀌면 첫 번째 지점 자동 선택 */
  const handleUnitClick = (unitId: string) => {
    setActiveUnit(unitId)
    const unit = treeData.find(u => u.id === unitId)
    setActiveBranch(unit?.branches[0]?.id ?? "")
  }

  /* 팀 선택 시 반영 후 팝업 닫기 */
  const handleTeamSelect = (teamId: string) => {
    onSelectTeam(teamId)
    onOpenChange(false)
  }

  const selectedUnit = treeData.find(u => u.id === activeUnit)
  const selectedBranch = selectedUnit?.branches.find(b => b.id === activeBranch)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[560px] p-0 gap-0 overflow-hidden" showCloseButton>
        <DialogHeader className="px-5 pt-5 pb-3">
          <DialogTitle className="text-[15px] font-semibold text-content-primary tracking-tight">
            조직도 선택
          </DialogTitle>
          {currentPath && (
            <p className="text-body5-normal text-content-assistive mt-0.5">
              현재: {currentPath.unitTitle} &gt; {currentPath.branchTitle} &gt; {currentPath.teamTitle}
            </p>
          )}
        </DialogHeader>

        {/* 3단 캐스케이드 컬럼 */}
        <div className="flex border-t border-divider-normal h-[320px]">
          {/* 1단: 사업단 */}
          <ScrollArea className="w-[160px] border-r border-divider-normal">
            <div className="p-2">
              <p className="px-2.5 py-1.5 text-[11px] font-semibold text-content-assistive tracking-tight">사업단</p>
              {treeData.map(unit => (
                <button
                  key={unit.id}
                  onClick={() => handleUnitClick(unit.id)}
                  className={cn(
                    "w-full text-left px-2.5 py-2 rounded-md text-[13px] transition-colors",
                    activeUnit === unit.id
                      ? "bg-primary-subtle text-primary font-semibold"
                      : "text-content-tertiary font-medium hover:bg-canvas-tertiary hover:text-content-primary"
                  )}
                >
                  {unit.title}
                </button>
              ))}
            </div>
          </ScrollArea>

          {/* 2단: 지점 */}
          <ScrollArea className="w-[160px] border-r border-divider-normal">
            <div className="p-2">
              <p className="px-2.5 py-1.5 text-[11px] font-semibold text-content-assistive tracking-tight">지점</p>
              {selectedUnit?.branches.map(branch => (
                <button
                  key={branch.id}
                  onClick={() => setActiveBranch(branch.id)}
                  className={cn(
                    "w-full text-left px-2.5 py-2 rounded-md text-[13px] transition-colors",
                    activeBranch === branch.id
                      ? "bg-primary-subtle text-primary font-semibold"
                      : "text-content-tertiary font-medium hover:bg-canvas-tertiary hover:text-content-primary"
                  )}
                >
                  {branch.title}
                </button>
              ))}
            </div>
          </ScrollArea>

          {/* 3단: 팀 */}
          <ScrollArea className="flex-1">
            <div className="p-2">
              <p className="px-2.5 py-1.5 text-[11px] font-semibold text-content-assistive tracking-tight">팀</p>
              {selectedBranch?.children.map(team => (
                <button
                  key={team.id}
                  onClick={() => handleTeamSelect(team.id)}
                  className={cn(
                    "w-full text-left px-2.5 py-2 rounded-md text-[13px] transition-colors",
                    selectedTeam === team.id
                      ? "bg-primary-subtle text-primary font-semibold"
                      : "text-content-tertiary font-medium hover:bg-canvas-tertiary hover:text-content-primary"
                  )}
                >
                  {team.title}
                </button>
              ))}
            </div>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// --- BusinessTree ---
interface BusinessTreeProps {
  visible?: boolean
}

export function BusinessTree({ visible = true }: BusinessTreeProps) {
  const [openUnits, setOpenUnits] = useState<Set<string>>(
    () => new Set(treeData.filter(u => u.defaultOpen).map(u => u.id))
  )
  const [openBranches, setOpenBranches] = useState<Set<string>>(
    () => new Set(
      treeData.flatMap(u => u.branches.filter(b => b.defaultOpen).map(b => b.id))
    )
  )
  const [selectedTeam, setSelectedTeam] = useState<string>("b-team")
  const [cascadeOpen, setCascadeOpen] = useState(false)

  const toggleUnit = (id: string) => {
    setOpenUnits(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const toggleBranch = (id: string) => {
    setOpenBranches(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  if (!visible) return null

  return (
    <>
      <div className="w-[180px] shrink-0 bg-canvas-primary rounded-lg border border-subtle flex flex-col self-start sticky top-3">
        {/* 헤더 — 타이틀 + 펼쳐보기 버튼 */}
        <div className="px-4 pt-4 pb-2 flex items-center justify-between">
          <span className="text-[12px] font-semibold text-content-assistive tracking-tight">
            조직도
          </span>
          <button
            onClick={() => setCascadeOpen(true)}
            className="flex items-center gap-1 text-[11px] font-medium text-content-disabled hover:text-primary transition-colors"
            title="조직도 펼쳐보기"
          >
            <Maximize2 className="h-3 w-3" />
          </button>
        </div>

        {/* 트리 본문 */}
        <nav className="flex-1 overflow-y-auto scrollbar-hide pb-3">
          <ul className="px-2">
            {treeData.map(unit => (
              <BusinessUnitItem
                key={unit.id}
                unit={unit}
                isOpen={openUnits.has(unit.id)}
                openBranches={openBranches}
                selectedTeam={selectedTeam}
                onToggleUnit={toggleUnit}
                onToggleBranch={toggleBranch}
                onSelectTeam={setSelectedTeam}
              />
            ))}
          </ul>
        </nav>
      </div>

      {/* 캐스케이드 팝업 */}
      <CascadeDialog
        open={cascadeOpen}
        onOpenChange={setCascadeOpen}
        selectedTeam={selectedTeam}
        onSelectTeam={setSelectedTeam}
      />
    </>
  )
}
