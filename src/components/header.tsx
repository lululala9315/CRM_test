import { SidebarTrigger } from "@/components/ui/sidebar"
import { User } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Header() {
  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b bg-background px-4">
      {/* Left section: Title */}
      <div className="flex items-center gap-4">
        {/* 모바일 등에서 사이드바를 열기위한 트리거 */}
        <SidebarTrigger className="h-8 w-8 text-muted-foreground mr-2 md:hidden" />
        <div className="flex items-baseline gap-2">
          <span className="font-bold text-lg tracking-tight">보닥 플래너</span>
          <span className="text-sm font-medium text-muted-foreground">for KB라이프</span>
        </div>
      </div>

      {/* Right section: Time, Extend Session, User */}
      <div className="flex items-center gap-4">
        <span className="font-bold text-sm">10:00</span>
        <Button variant="default" size="sm" className="h-7 px-3 bg-black text-white hover:bg-slate-800 text-xs font-semibold rounded-[4px]">
          연장
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8 text-black">
          <User className="h-5 w-5 fill-current" />
        </Button>
      </div>
    </header>
  )
}
