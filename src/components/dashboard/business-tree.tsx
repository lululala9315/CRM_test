"use client"

/**
 * 역할: 조직도 트리 패널 — 사업단/지점/팀 3단계 계층 탐색
 * 주요 기능: 역할 기반 노출 제어, 각 레벨 접기/펼치기
 * 참고: visible prop으로 사용자 권한에 따라 렌더 여부 결정 (상위에서 제어)
 */

import { ChevronDown, ChevronUp } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"

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
    ]
  },
  {
    id: "unit-gangnam",
    title: "강남사업단",
    defaultOpen: false,
    branches: [
      {
        id: "c-branch",
        title: "C지점",
        children: [
          { id: "c1-team", title: "영업1팀" },
          { id: "c2-team", title: "영업2팀" },
        ]
      },
      {
        id: "d-branch",
        title: "D지점",
        children: [
          { id: "d1-team", title: "강남팀" },
          { id: "d2-team", title: "서초팀" },
          { id: "d3-team", title: "송파팀" },
        ]
      },
    ]
  },
]

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
          "w-full flex items-center pl-9 pr-2.5 py-1.5 rounded-lg text-[12px] transition-all duration-150",
          isActive
            ? "bg-muted text-foreground font-semibold"
            : "font-medium text-foreground/45 hover:bg-muted/50 hover:text-foreground/70"
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
        className="w-full flex items-center justify-between pl-5 pr-2.5 py-1.5 rounded-lg text-[12px] font-medium text-foreground/55 hover:bg-muted/50 hover:text-foreground/80 transition-colors"
      >
        <span className="truncate">{branch.title}</span>
        {isOpen
          ? <ChevronUp className="h-3 w-3 text-muted-foreground/40 shrink-0" />
          : <ChevronDown className="h-3 w-3 text-muted-foreground/40 shrink-0" />
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
        className="w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-[13px] font-semibold text-foreground/80 hover:bg-muted/60 hover:text-foreground transition-colors"
      >
        <span className="truncate">{unit.title}</span>
        {isOpen
          ? <ChevronUp className="h-3.5 w-3.5 text-muted-foreground/50 shrink-0" />
          : <ChevronDown className="h-3.5 w-3.5 text-muted-foreground/50 shrink-0" />
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
    <aside className="w-44 shrink-0 flex flex-col rounded-lg bg-card border border-border/40 overflow-hidden">
      <nav className="flex-1 overflow-y-auto py-3 scrollbar-hide">
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
    </aside>
  )
}
