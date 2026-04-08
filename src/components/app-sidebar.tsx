"use client"

import * as React from "react"
import {
  Home,
  Users,
  Database,
  Settings2,
  UserCog,
  Network,
  Settings,
  ChevronDown,
  ChevronUp,
} from "lucide-react"

import { usePathname } from "next/navigation"
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
} from "@/components/ui/sidebar"

const menuItems = [
  {
    title: "배정 고객 관리",
    icon: Users,
    items: [
      { name: "상담 진행 고객", url: "/" },
      { name: "계약 예정 고객", url: "/pending" },
      { name: "상담 종료 고객", url: "/completed" }
    ]
  },
  {
    title: "DB 배정 관리",
    icon: Database,
    items: [
      { name: "배정 완료 DB", url: "/db/assigned" },
      { name: "미배정 DB", url: "/db/unassigned" },
      { name: "DB 분배 현황", url: "/db/status" }
    ]
  },
  {
    title: "배정 설정 관리",
    icon: Settings2,
    items: [
      { name: "재배정 타입 설정", url: "/settings/reassign" },
      { name: "자동 회수 설정", url: "/settings/recall" },
      { name: "자동 배정 설정", url: "/settings/auto" }
    ]
  },
  {
    title: "직원/설계사 관리",
    icon: UserCog,
    items: [
      { name: "운영/관리자", url: "/management/admin" },
      { name: "설계사", url: "/management/planner" }
    ]
  },
  {
    title: "조직 및 관리 체계",
    icon: Network,
    items: [
      { name: "직책·권한 설정", url: "/organization/roles" },
      { name: "조직 구조 설정", url: "/organization/structure" }
    ]
  },
  {
    title: "환경 설정",
    icon: Settings,
    items: [
      { name: "마이 GA 사용 설정", url: "/settings/myga" }
    ]
  }
]

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()

  return (
    <>
      <Sidebar collapsible="icon" className="bg-white [&>div[data-sidebar=sidebar]]:bg-white border-r border-border/60 shadow-none" {...props}>

        <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1">
              <SidebarMenuItem>
                <SidebarMenuButton
                  tooltip="홈 대시보드"
                  isActive={pathname === "/dashboard"}
                  className="h-10 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                >
                  <Home className="h-4 w-4 shrink-0" strokeWidth={1.75} />
                  <span className="font-medium whitespace-nowrap truncate transition-opacity duration-200 group-data-[collapsible=icon]:opacity-0 tracking-tight">홈 대시보드</span>
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
                          className="h-10 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                        >
                          <menu.icon className="h-4 w-4 shrink-0" strokeWidth={1.75} />
                          <span className="font-medium whitespace-nowrap truncate transition-opacity duration-200 group-data-[collapsible=icon]:opacity-0 tracking-tight">{menu.title}</span>
                          {menu.items && menu.items.length > 0 && (
                            <div className="ml-auto opacity-70 transition-all duration-200 group-data-[collapsible=icon]:opacity-0">
                              <ChevronDown className="h-3 w-3 shrink-0 block group-data-[state=open]/collapsible:hidden" strokeWidth={1.75} />
                              <ChevronUp className="h-3 w-3 shrink-0 hidden group-data-[state=open]/collapsible:block" strokeWidth={1.75} />
                            </div>
                          )}
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      {menu.items && menu.items.length > 0 && (
                        <CollapsibleContent>
                          <SidebarMenuSub className="border-none pl-0 mr-0 bg-transparent flex flex-col gap-1 mt-1">
                            {menu.items.map((subItem) => {
                              const isActive = pathname === subItem.url;
                              return (
                                <SidebarMenuSubItem key={subItem.name}>
                                  <SidebarMenuSubButton
                                    asChild
                                    isActive={isActive}
                                    className={cn(
                                      "h-9 pl-3 gap-2.5",
                                      isActive
                                        ? "bg-primary/10 text-primary hover:bg-primary/10 hover:text-primary data-active:bg-primary/10 data-active:text-primary"
                                        : "hover:bg-muted/50"
                                    )}
                                  >
                                    <a href={subItem.url}>
                                      <span className={cn(
                                        "tracking-tight transition-colors text-[13px]",
                                        isActive ? "font-semibold text-primary" : "font-medium text-sidebar-foreground/90"
                                      )}>
                                        {subItem.name}
                                      </span>
                                    </a>
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
      </SidebarContent>


        <SidebarRail />
      </Sidebar>
    </>
  )
}
