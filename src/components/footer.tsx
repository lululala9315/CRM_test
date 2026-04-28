/**
 * 역할: 콘텐츠 하단 푸터 — 저작권 + 서비스 이용약관/개인정보처리방침
 */

export function Footer() {
  return (
    <footer className="mt-auto shrink-0">
      <div className="h-px bg-divider-normal" />
      <div className="flex items-center justify-between px-6 py-4 text-[11px] text-content-disabled">
        <span>Copyright© Aijinet. All rights reserved</span>
        <div className="flex items-center gap-1">
          <span className="hover:text-content-assistive transition-colors duration-75 cursor-default">서비스 이용약관</span>
          <span>|</span>
          <span className="hover:text-content-assistive transition-colors duration-75 cursor-default">개인정보처리방침</span>
        </div>
      </div>
    </footer>
  )
}
