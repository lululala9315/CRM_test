import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
        <h1 className="text-4xl font-bold mb-8 font-sans">
          Amplitude 스타일 컴포넌트 테스트
        </h1>
      </div>

      <div className="flex gap-4 p-8 bg-card rounded-lg border shadow-sm">
        <Button variant="default">기본 (Default)</Button>
        <Button variant="secondary">보조 (Secondary)</Button>
        <Button variant="outline">아웃라인 (Outline)</Button>
        <Button variant="ghost">고스트 (Ghost)</Button>
        <Button variant="destructive">파괴 (Destructive)</Button>
      </div>

      <p className="mt-8 text-muted-foreground text-center">
        이 텍스트와 위의 버튼들은 모두 사용자가 제공한 
        <br/>
        preset(b2BoWWqUl) 스타일과 Pretendard 폰트가 적용된 상태입니다.
      </p>
    </main>
  );
}
