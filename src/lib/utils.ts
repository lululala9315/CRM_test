import { clsx, type ClassValue } from "clsx"
import { extendTailwindMerge } from "tailwind-merge"

// text-body* / text-h* 등 composite 타이포 토큰이 text-color 클래스와
// 충돌하지 않도록 별도 그룹으로 등록
const twMerge = extendTailwindMerge<"typography">({
  extend: {
    classGroups: {
      typography: [
        {
          text: [
            // Heading
            "h1-bold", "h2-bold", "h2", "h3-bold", "h3", "h4",
            "h5-bold-underline", "h5-bold", "h5-medium", "h5",
            // Body 1–5
            "body1-bold", "body1",
            "body2-bold", "body2-bold-underline", "body2-medium", "body2-normal", "body2-reading",
            "body3-bold", "body3-bold-underline", "body3-medium", "body3-underline", "body3-normal", "body3-reading",
            "body4-bold", "body4-medium", "body4-underline", "body4-normal", "body4-reading",
            "body5-bold", "body5-medium", "body5-underline", "body5-normal", "body5-reading",
            // Caption
            "caption-bold", "caption", "caption-underline",
            // Legacy
            "nav", "kpi", "num-md", "num-sm",
            "heading-xl", "heading-lg", "heading-md",
            "body-md", "body-sm",
            "label-md", "label-sm", "label-xs",
          ],
        },
      ],
    },
  },
})

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
