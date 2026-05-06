import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { SidebarProvider } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppSidebar } from "@/components/app-sidebar";
import { Header } from "@/components/header";
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
      <body className="h-screen flex flex-col overflow-hidden bg-canvas-secondary text-content-primary font-sans">
        <TooltipProvider delayDuration={0}>
          <SidebarProvider
            style={{ flexDirection: "column", minHeight: 0, flex: 1 } as React.CSSProperties}
          >
            <Header />

            <div className="flex flex-1 min-h-0 overflow-hidden">
              <AppSidebar />
              <main className="flex-1 min-w-0 min-h-0 overflow-hidden bg-canvas-secondary flex flex-col">
                <StickyBreadcrumb />
                <div className="flex-1 min-h-0 overflow-y-auto bg-canvas-secondary">
                  {children}
                </div>
              </main>
            </div>
          </SidebarProvider>
        </TooltipProvider>
      </body>
    </html>
  );
}
