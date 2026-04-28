import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { SidebarProvider } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppSidebar } from "@/components/app-sidebar";
import { Header } from "@/components/header";
import { BreadcrumbProvider } from "@/components/breadcrumb-context";
import { StickyBreadcrumb } from "@/components/sticky-breadcrumb";
import { cn } from "@/lib/utils";

const pretendard = localFont({
  src: "../../node_modules/pretendard/dist/web/variable/woff2/PretendardVariable.woff2",
  display: "swap",
  weight: "45 920",
  variable: "--font-pretendard",
});

export const metadata: Metadata = {
  title: "상담 관리 대시보드",
  description: "Advanced Lead & Consulting Management",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={cn("h-full antialiased", pretendard.variable)}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&icon_names=database,flowchart,group,home,id_card,palette,target"
        />
      </head>
      <body className="h-screen flex flex-col overflow-hidden bg-canvas-tertiary text-content-primary font-sans">
        <TooltipProvider delayDuration={0}>
          {/*
            SidebarProvider 기본값: flex(row), min-h-svh
            style로 직접 override → flex-col + minHeight 제거
            이렇게 해야 Header가 전체 너비를 차지하고
            사이드바가 헤더 아래에 위치함
          */}
          <BreadcrumbProvider>
        <SidebarProvider
            style={{ flexDirection: "column", minHeight: 0, flex: 1 } as React.CSSProperties}
          >
            {/* 헤더 — 전체 너비 */}
            <Header />

            {/* 사이드바 + 콘텐츠 — 헤더 아래 */}
            <div className="flex flex-1 min-h-0 overflow-hidden">
              <AppSidebar />
              {/*
                StickyBreadcrumb을 main 안에 배치 — 사이드바가 fixed z-10이라
                header 아래 full-width로 두면 sidebar에 가림
              */}
              <main className="flex-1 min-w-0 min-h-0 overflow-hidden bg-canvas-tertiary flex flex-col">
                <StickyBreadcrumb />
                <div className="flex-1 min-h-0 overflow-hidden">
                  {children}
                </div>
              </main>
            </div>
          </SidebarProvider>
        </BreadcrumbProvider>
        </TooltipProvider>
      </body>
    </html>
  );
}
