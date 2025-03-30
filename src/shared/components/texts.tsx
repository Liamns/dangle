import styles from "../styles/text.module.css";

type FontSizeType = "sm" | "md" | "lg" | "title" | "logo";
type FontWeightType = "normal" | "bold" | "light";
type FontFamilyType = "inter" | "jalnan";

// 사이즈 매핑 객체
const fontSizeMap: Record<FontSizeType, string> = {
  sm: "12px",
  md: "14px",
  lg: "16px",
  title: "20px",
  logo: "56px",
};

// 굵기 매핑 객체
const fontWeightMap: Record<FontWeightType, string> = {
  normal: "400",
  bold: "700",
  light: "200",
};

interface TextProps {
  text: string;
  fontSize?: FontSizeType;
  fontWeight?: FontWeightType;
  color?: string;
  fontFamily?: FontFamilyType;
}

export const Text: React.FC<TextProps> = ({
  text,
  fontSize = "sm",
  fontWeight = "normal",
  fontFamily = "inter",
  color = "black",
}) => {
  const mappedFontSize = fontSizeMap[fontSize];
  const mappedFontWeight = fontWeightMap[fontWeight];
  const mappedFontFamily = `var(--${fontFamily})`;

  return (
    <span
      className={styles.text}
      style={
        {
          "--text-font-size": mappedFontSize,
          "--text-font-weight": mappedFontWeight,
          "--text-color": color,
          "--text-font-family": mappedFontFamily,
        } as React.CSSProperties
      }
    >
      {text}
    </span>
  );
};
