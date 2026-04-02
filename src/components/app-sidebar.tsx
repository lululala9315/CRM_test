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
  ChevronRight,
  PanelLeftClose,
  PanelLeftOpen
} from "lucide-react"

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
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
  useSidebar,
  SidebarFooter
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"

const menuItems = [
  {
    title: "배정 고객 관리",
    icon: Users,
    items: ["상담 진행 고객", "계약 예정 고객", "상담 종료 고객"]
  },
  {
    title: "DB 배정 관리",
    icon: Database,
    items: ["배정 완료 DB", "미배정 DB", "DB 분배 현황"]
  },
  {
    title: "배정 설정 관리",
    icon: Settings2,
    items: ["재배정 타입 설정", "자동 회수 설정", "자동 배정 설정"]
  },
  {
    title: "직원/설계사 관리",
    icon: UserCog,
    items: ["운영/관리자", "설계사"]
  },
  {
    title: "조직 및 관리 체계",
    icon: Network,
    items: ["직책·권한 설정", "조직 구조 설정"]
  },
  {
    title: "환경 설정",
    icon: Settings,
    items: ["마이 GA 사용 설정"]
  }
]

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { toggleSidebar, state } = useSidebar()

  return (
    <>
      {/* 무조건 흰색 배경 적용을 위해 bg-white 추가 (다크모드 제외 시) */}
      <Sidebar collapsible="icon" className="bg-white [&>div[data-sidebar=sidebar]]:bg-white border-r" {...props}>
        <SidebarHeader className="h-14 flex items-center justify-between px-4 pb-0 pt-4 flex-row border-b-0">
         <div className="flex items-center gap-2 font-bold text-lg tracking-tight truncate w-full">
          {state === "expanded" && <span>메뉴</span>}
          {state === "collapsed" && <span className="text-primary font-black">M</span>}
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="홈 대시보드" className="font-semibold">
                  <Home />
                  <span>홈 대시보드</span>
                  <ChevronRight className="ml-auto h-4 w-4" />
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((menu) => (
                <Collapsible key={menu.title} defaultOpen={false} className="group/collapsible">
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton tooltip={menu.title}>
                        <menu.icon />
                        <span className="font-medium">{menu.title}</span>
                        <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {menu.items.map((subItem) => (
                          <SidebarMenuSubItem key={subItem}>
                            <SidebarMenuSubButton asChild>
                              <a href="#">
                                <span className="text-muted-foreground before:content-['└'] before:mr-2 before:text-muted-foreground/50">{subItem}</span>
                              </a>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t p-2">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={toggleSidebar}
          className="w-full flex justify-start gap-2"
        >
          {state === "expanded" ? (
             <><PanelLeftClose className="h-4 w-4" /> <span>사이드바 접기</span></>
          ) : (
             <PanelLeftOpen className="h-4 w-4 ml-1" />
          )}
        </Button>
      </SidebarFooter>
      </Sidebar>
    </>
  )
}
