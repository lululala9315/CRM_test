"use client"

import * as React from "react"
import Link from "next/link"
import { ChevronDown } from "lucide-react"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar"

// Material Symbols 아이콘 렌더러 — FILL=1 (filled), opsz=20
function MsIcon({ name, className }: { name: string; className?: string }) {
  return (
    <span
      className={cn("material-symbols-outlined select-none shrink-0", className)}
      style={{ fontVariationSettings: "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 20", fontSize: "18px", lineHeight: 1 }}
      aria-hidden="true"
    >
      {name}
    </span>
  )
}

const menuItems = [
  {
    title: "배정 고객 관리",
    icon: "group",
    items: [
      { name: "상담 진행 고객", url: "/" },
      { name: "계약 예정 고객", url: "/pending" },
      { name: "상담 종료 고객", url: "/completed" }
    ]
  },
  {
    title: "DB 배정 관리",
    icon: "database",
    items: [
      { name: "배정 완료 DB", url: "/db/assigned" },
      { name: "미배정 DB", url: "/db/unassigned" },
      { name: "DB 분배 현황", url: "/db/status" }
    ]
  },
  {
    title: "배정 설정 관리",
    icon: "target",
    items: [
      { name: "재배정 타입 설정", url: "/settings/reassign" },
      { name: "자동 회수 설정", url: "/settings/recall" },
      { name: "자동 배정 설정", url: "/settings/auto" }
    ]
  },
  {
    title: "직원/설계사 관리",
    icon: "id_card",
    items: [
      { name: "운영/관리자", url: "/management/admin" },
      { name: "설계사", url: "/management/planner" }
    ]
  },
  {
    title: "조직 및 관리 체계",
    icon: "flowchart",
    items: [
      { name: "직책·권한 설정", url: "/organization/roles" },
      { name: "조직 구조 설정", url: "/organization/structure" }
    ]
  },
]

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()
  const router = useRouter()
  const { state, toggleSidebar } = useSidebar()

  return (
    <>
      <Sidebar collapsible="icon" className="border-r border-divider-normal shadow-none" {...props}>

        <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1">
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  tooltip="홈 대시보드"
                  className="h-10 text-content-quaternary hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                >
                  <Link href="/dashboard">
                    <MsIcon name="home" />
                    <span className="text-nav text-[13px] font-semibold whitespace-nowrap truncate transition-opacity duration-200 group-data-[collapsible=icon]:opacity-0">홈 대시보드</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {menuItems.map((menu) => {
                const hasActiveChild = menu.items?.some(item => pathname === item.url);

                return (
                  <Collapsible
                    key={menu.title}
                    defaultOpen={hasActiveChild || menu.title === "배정 고객 관리"}
                    className="group/collapsible"
                  >
                    <SidebarMenuItem>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton
                          tooltip={menu.title}
                          isActive={false}
                          className={cn(
                            "h-10 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                            hasActiveChild
                              ? "text-content-secondary group-data-[collapsible=icon]:bg-foreground/8 group-data-[collapsible=icon]:text-content-primary group-data-[collapsible=icon]:hover:bg-foreground/8"
                              : "text-content-quaternary"
                          )}
                          onClick={() => {
                            // 접힌 상태에서 클릭 시: 사이드바 펼치기 + 첫 번째 서브메뉴로 이동
                            if (state === "collapsed" && menu.items?.[0]) {
                              toggleSidebar()
                              router.push(menu.items[0].url)
                            }
                          }}
                        >
                          <MsIcon name={menu.icon} />
                          <span className="text-nav text-[13px] font-semibold whitespace-nowrap truncate transition-opacity duration-200 group-data-[collapsible=icon]:opacity-0">{menu.title}</span>
                          {menu.items && menu.items.length > 0 && (
                            <ChevronDown
                              className="ml-auto h-3 w-3 shrink-0 text-sidebar-foreground/40 transition-[transform,opacity] duration-200 ease-out group-data-[state=open]/collapsible:rotate-180 group-data-[collapsible=icon]:opacity-0"
                              strokeWidth={2}
                            />
                          )}
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      {menu.items && menu.items.length > 0 && (
                        <CollapsibleContent>
                          <SidebarMenuSub className="border-none pl-0 ml-0 mr-0 bg-transparent flex flex-col gap-0.5 mt-0.5">
                            {menu.items.map((subItem) => {
                              const isActive = pathname === subItem.url;
                              return (
                                <SidebarMenuSubItem key={subItem.name}>
                                  <SidebarMenuSubButton
                                    asChild
                                    isActive={isActive}
                                    className={cn(
                                      "h-9 pl-9 gap-2.5",
                                      isActive
                                        ? "bg-foreground/8 text-content-primary hover:bg-foreground/8"
                                        : "hover:bg-sidebar-accent"
                                    )}
                                  >
                                    <Link href={subItem.url}>
                                      <span className={cn(
                                        "transition-colors duration-75",
                                        isActive ? "text-nav text-[13px] font-semibold text-content-primary" : "text-nav text-[13px] font-semibold text-content-quaternary"
                                      )}>
                                        {subItem.name}
                                      </span>
                                    </Link>
                                  </SidebarMenuSubButton>
                                </SidebarMenuSubItem>
                              );
                            })}
                          </SidebarMenuSub>
                        </CollapsibleContent>
                      )}
                    </SidebarMenuItem>

                  </Collapsible>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* 디자인 시스템 — 하단 고정 */}
        <SidebarGroup className="mt-auto pb-2">
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  tooltip="디자인 시스템"
                  isActive={pathname === "/design-system"}
                  className={cn(
                    "h-10 text-content-quaternary hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                    pathname === "/design-system" && "bg-primary/10 text-primary hover:bg-primary/10 hover:text-primary"
                  )}
                >
                  <Link href="/design-system">
                    <MsIcon name="palette" />
                    <span className="text-nav text-[13px] font-semibold whitespace-nowrap truncate transition-opacity duration-200 group-data-[collapsible=icon]:opacity-0">디자인 시스템</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

      </SidebarContent>

        <SidebarRail />
      </Sidebar>
    </>
  )
}
