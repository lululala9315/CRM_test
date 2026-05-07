"use client"

/**
 * 역할: 조직 구조 설정 — 계층 트리 + 선택 조직 정보 패널
 * 주요 기능: 조직 트리 탐색/선택, 하위 조직 추가(+), 펼침/접힘, 조직 정보 확인
 */

import { useState } from "react"
import { GripVertical, Plus, ChevronUp, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

// --- 타입 ---
type OrgNode = {
  id: string
  name: string
  active: boolean
  createdAt: string
  updatedAt: string | null
  /** 직접 소속 인원수 */
  memberCount?: number
  children?: OrgNode[]
}

// --- 목업 데이터 ---
const ORG_TREE: OrgNode = {
  id: "root",
  name: "흥국화재",
  active: true,
  createdAt: "2026.01.01",
  updatedAt: null,
  memberCount: 0,
  children: [
    {
      id: "div1",
      name: "문정 사업단",
      active: true,
      createdAt: "2026.01.01",
      updatedAt: null,
      memberCount: 2,
      children: [
        {
          id: "branch1a",
          name: "A지점",
          active: true,
          createdAt: "2026.01.01",
          updatedAt: null,
          memberCount: 4,
          children: [
            {
              id: "team1a",
              name: "A팀",
              active: true,
              createdAt: "2026.01.12",
              updatedAt: null,
              memberCount: 12,
              children: [
                { id: "team1b", name: "B팀", active: true, createdAt: "2026.01.12", updatedAt: null, memberCount: 8 },
                { id: "team1c", name: "C팀", active: true, createdAt: "2026.01.12", updatedAt: null, memberCount: 6 },
                {
                  id: "new1",
                  name: "조직명 입력해 주세요.",
                  active: true,
                  createdAt: "2026.01.12",
                  updatedAt: null,
                  memberCount: 0,
                  children: [
                    { id: "new1a", name: "조직명 입력해 주세요.", active: true, createdAt: "2026.01.12", updatedAt: null, memberCount: 0 },
                  ],
                },
              ],
            },
          ],
        },
        {
          id: "branch1b",
          name: "B지점",
          active: true,
          createdAt: "2026.01.01",
          updatedAt: null,
          memberCount: 3,
          children: [
            { id: "team2a", name: "1팀", active: true, createdAt: "2026.01.01", updatedAt: null, memberCount: 9 },
            { id: "team2b", name: "2팀", active: true, createdAt: "2026.01.01", updatedAt: null, memberCount: 7 },
          ],
        },
      ],
    },
    {
      id: "div2",
      name: "강남 사업단",
      active: true,
      createdAt: "2026.01.01",
      updatedAt: null,
      memberCount: 1,
      children: [
        { id: "team3a", name: "A팀", active: true, createdAt: "2026.01.01", updatedAt: null, memberCount: 11 },
        { id: "team3b", name: "B팀", active: true, createdAt: "2026.01.01", updatedAt: null, memberCount: 5 },
      ],
    },
    {
      id: "div3",
      name: "서초 지점",
      active: true,
      createdAt: "2026.01.01",
      updatedAt: null,
      memberCount: 1,
      children: [
        { id: "team4a", name: "A팀", active: true, createdAt: "2026.01.01", updatedAt: null, memberCount: 10 },
        { id: "team4b", name: "B팀", active: true, createdAt: "2026.01.01", updatedAt: null, memberCount: 8 },
      ],
    },
    { id: "team5", name: "선릉 1팀", active: true,  createdAt: "2026.01.01", updatedAt: null, memberCount: 14 },
    { id: "team6", name: "선릉 2팀", active: false, createdAt: "2026.01.01", updatedAt: null, memberCount: 0 },
  ],
}

// 초기 상태: A팀 선택, 문정 계열 + branch1b 펼침, 강남/서초 접힘
const DEFAULT_SELECTED = "team1a"
const DEFAULT_EXPANDED = new Set(["root", "div1", "branch1a", "team1a", "branch1b"])

function findNode(tree: OrgNode, id: string): OrgNode | null {
  if (tree.id === id) return tree
  for (const child of tree.children ?? []) {
    const result = findNode(child, id)
    if (result) return result
  }
  return null
}

// --- 트리 행 (재귀) ---
function OrgTreeRows({
  node,
  depth,
  selectedId,
  expandedIds,
  onSelect,
  onToggle,
}: {
  node: OrgNode
  depth: number
  selectedId: string
  expandedIds: Set<string>
  onSelect: (id: string) => void
  onToggle: (id: string) => void
}) {
  const isSelected = selectedId === node.id
  const isExpanded = expandedIds.has(node.id)
  const hasChildren = (node.children?.length ?? 0) > 0
  const isRoot = depth === 0
  const isPlaceholder = node.name.startsWith("조직명")

  return (
    <>
      <div
        role="treeitem"
        aria-selected={isSelected}
        aria-expanded={hasChildren ? isExpanded : undefined}
        className={cn(
          "flex items-center gap-s4 h-11 pr-s6 cursor-pointer select-none transition-colors duration-75 border-b border-divider-subtle last:border-b-0 group",
          isSelected ? "bg-primary-subtle" : "hover:bg-alpha-black-02"
        )}
        style={{ paddingLeft: `${isRoot ? 14 : 6 + depth * 20}px` }}
        onClick={() => onSelect(node.id)}
      >
        {/* 드래그 핸들 */}
        {!isRoot ? (
          <GripVertical
            className={cn(
              "h-4 w-4 shrink-0 cursor-grab active:cursor-grabbing transition-opacity",
              isSelected
                ? "text-content-tertiary opacity-100"
                : "text-content-disabled opacity-0 group-hover:opacity-100"
            )}
          />
        ) : (
          <div className="w-1 shrink-0" />
        )}

        {/* 조직명 */}
        <span
          className={cn(
            "flex-1 text-body4-normal min-w-0 truncate",
            isRoot && "font-semibold",
            isPlaceholder && !isSelected && "text-content-disabled italic",
            isSelected
              ? "text-primary font-medium"
              : !node.active
              ? "text-content-disabled"
              : "text-content-primary"
          )}
        >
          {node.name}
        </span>

        {/* 사용 여부 */}
        <span
          className={cn(
            "text-body5-normal shrink-0 w-[52px] text-right mr-s2",
            isSelected
              ? "text-primary"
              : node.active
              ? "text-content-assistive"
              : "text-content-disabled"
          )}
        >
          {node.active ? "사용함" : "사용안함"}
        </span>

        {/* 하위 추가 버튼 */}
        <button
          title="하위 조직 추가"
          aria-label={`${node.name} 하위 조직 추가`}
          className={cn(
            "h-7 w-7 flex items-center justify-center rounded-md transition-[opacity,background-color] shrink-0",
            isSelected
              ? "text-primary opacity-100 hover:bg-primary-subtle-hover"
              : "text-content-tertiary opacity-0 group-hover:opacity-100 hover:bg-canvas-quaternary"
          )}
          onClick={(e) => e.stopPropagation()}
        >
          <Plus className="h-3.5 w-3.5" />
        </button>

        {/* 펼침 / 접힘 */}
        {hasChildren ? (
          <button
            aria-label={`${node.name} ${isExpanded ? "접기" : "펼치기"}`}
            className={cn(
              "h-7 w-7 flex items-center justify-center rounded-md transition-colors shrink-0",
              isSelected
                ? "text-primary hover:bg-primary-subtle-hover"
                : "text-content-disabled hover:bg-canvas-quaternary hover:text-content-tertiary"
            )}
            onClick={(e) => {
              e.stopPropagation()
              onToggle(node.id)
            }}
          >
            {isExpanded ? (
              <ChevronUp className="h-3.5 w-3.5" />
            ) : (
              <ChevronDown className="h-3.5 w-3.5" />
            )}
          </button>
        ) : (
          <div className="w-7 shrink-0" />
        )}
      </div>

      {/* 자식 노드 재귀 */}
      {isExpanded &&
        node.children?.map((child) => (
          <OrgTreeRows
            key={child.id}
            node={child}
            depth={depth + 1}
            selectedId={selectedId}
            expandedIds={expandedIds}
            onSelect={onSelect}
            onToggle={onToggle}
          />
        ))}
    </>
  )
}

// --- 메인 컴포넌트 ---
export function OrgStructureTree() {
  const [selectedId, setSelectedId] = useState(DEFAULT_SELECTED)
  const [expandedIds, setExpandedIds] = useState<Set<string>>(DEFAULT_EXPANDED)

  const selectedNode = findNode(ORG_TREE, selectedId)

  const handleToggle = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const INFO_ROWS = selectedNode
    ? [
        { label: "조직명",    value: selectedNode.name },
        { label: "사용 여부", value: selectedNode.active ? "사용함" : "사용안함" },
        { label: "생성일",    value: selectedNode.createdAt },
        { label: "수정일",    value: selectedNode.updatedAt },
      ]
    : []

  return (
    <div className="flex gap-s24 items-start">

      {/* ── 왼쪽: 조직 구조 트리 ── */}
      <div className="flex-[3] min-w-0">
        <h3 className="text-body3-bold text-content-primary mb-s12 tracking-tight">
          조직 구조
        </h3>
        <div
          role="tree"
          aria-label="조직 구조"
          className="bg-canvas-primary rounded-lg border-border05 border-subtle overflow-hidden"
        >
          <OrgTreeRows
            node={ORG_TREE}
            depth={0}
            selectedId={selectedId}
            expandedIds={expandedIds}
            onSelect={setSelectedId}
            onToggle={handleToggle}
          />
        </div>
      </div>

      {/* ── 오른쪽: 조직 정보 ── */}
      <div className="w-[340px] shrink-0">
        <h3 className="text-body3-bold text-content-primary mb-s12 tracking-tight">
          조직 정보
        </h3>

        {selectedNode ? (
          <>
            <div className="bg-canvas-primary rounded-lg border-border05 border-subtle overflow-hidden">
              {INFO_ROWS.map(({ label, value }, i) => (
                <div
                  key={label}
                  className={cn(
                    "flex items-stretch",
                    i < INFO_ROWS.length - 1 && "border-b border-divider-subtle"
                  )}
                >
                  {/* 레이블 */}
                  <div className="w-[88px] px-s16 py-s14 bg-fill-subtle border-r border-divider-subtle shrink-0 flex items-center">
                    <span className="text-body4-medium text-content-assistive">
                      {label}
                    </span>
                  </div>
                  {/* 값 */}
                  <div className="flex-1 px-s16 py-s14 flex items-center">
                    {value ? (
                      <span className="text-body4-normal text-content-secondary">{value}</span>
                    ) : (
                      <span className="text-body4-normal text-content-disabled">-</span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end mt-s12">
              <Button>수정</Button>
            </div>
          </>
        ) : (
          <div className="bg-canvas-primary rounded-lg border-border05 border-subtle h-40 flex items-center justify-center">
            <p className="text-body4-normal text-content-disabled">조직을 선택해 주세요</p>
          </div>
        )}
      </div>
    </div>
  )
}
