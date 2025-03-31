export type FontSizeType = "sm" | "md" | "lg" | "title" | "logo";
export type FontWeightType = "normal" | "bold" | "light";
export type FontFamilyType = "inter" | "jalnan";

// 사이즈 매핑 객체
export const fontSizeMap: Record<FontSizeType, string> = {
  sm: "12px",
  md: "14px",
  lg: "16px",
  title: "20px",
  logo: "56px",
};

// 굵기 매핑 객체
export const fontWeightMap: Record<FontWeightType, string> = {
  normal: "400",
  bold: "700",
  light: "200",
};
