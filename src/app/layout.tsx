import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { SidebarProvider } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppSidebar } from "@/components/app-sidebar";
import { Header } from "@/components/header";
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
      <body className="h-screen flex flex-col overflow-hidden bg-background text-foreground font-sans">
        <TooltipProvider delayDuration={0}>
          {/*
            SidebarProvider 기본값: flex(row), min-h-svh
            style로 직접 override → flex-col + minHeight 제거
            이렇게 해야 Header가 전체 너비를 차지하고
            사이드바가 헤더 아래에 위치함
          */}
          <SidebarProvider
            style={{ flexDirection: "column", minHeight: 0, flex: 1 } as React.CSSProperties}
          >
            {/* 헤더 — 전체 너비 */}
            <Header />

            {/* 사이드바 + 콘텐츠 — 헤더 아래 */}
            <div className="flex flex-1 min-h-0 overflow-hidden">
              <AppSidebar />
              <main className="flex-1 min-h-0 overflow-hidden bg-slate-50">
                {children}
              </main>
            </div>
          </SidebarProvider>
        </TooltipProvider>
      </body>
    </html>
  );
}
