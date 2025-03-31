import styles from "../styles/text.module.css";
import {
  FontFamilyType,
  fontSizeMap,
  FontSizeType,
  fontWeightMap,
  FontWeightType,
} from "../types/text";

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
