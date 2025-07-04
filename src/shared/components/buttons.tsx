import { ReactNode } from "react";
import styles from "../styles/buttons.module.scss";
import { Colors } from "../consts/colors";
import {
  fontSizeMap,
  FontSizeType,
  fontWeightMap,
  FontWeightType,
} from "../types/text";
import cn from "classnames";

interface ButtonProps {
  children: ReactNode;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  width?: string;
  height?: string;
  color?: string;
  textColor?: string;
  fontSize?: FontSizeType;
  fontWeight?: FontWeightType;
  mt?: string;
  mb?: string;
  ml?: string;
  mr?: string;
  valid?: boolean | null;
  validColor?: string;
  invalidColor?: string;
}

export const Button = ({
  children,
  onClick,
  width,
  height,
  color,
  textColor,
  fontSize,
  fontWeight,
  mt,
  mb,
  ml,
  mr,
  valid = null,
  validColor = Colors.brown,
  invalidColor = Colors.invalid,
  className = "", // 추가: 사용자 정의 클래스
  style = {}, // 추가: 사용자 정의 스타일
  ...rest // 추가: 나머지 button 속성들 (type, disabled, form 등)
}: ButtonProps &
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    className?: string;
    style?: React.CSSProperties;
  }) => {
  const buttonColor =
    valid === null ? color : valid ? validColor : invalidColor;
  const mappedFontSize =
    fontSize !== undefined ? fontSizeMap[fontSize] : undefined;
  const mappedFontWeight =
    fontWeight !== undefined ? fontWeightMap[fontWeight] : undefined;

  return (
    <button
      className={cn(styles.button, className, {
        [styles.invalid]: valid === false,
      })}
      style={
        {
          "--btn-width": width,
          "--btn-height": height,
          "--btn-color": buttonColor,
          "--btn-text-color": textColor,
          "--btn-font-size": mappedFontSize,
          "--btn-font-weight": mappedFontWeight,
          "--btn-mt": mt,
          "--btn-mr": mr,
          "--btn-mb": mb,
          "--btn-ml": ml,
          ...style, // 사용자 정의 스타일 병합
        } as React.CSSProperties
      }
      onClick={onClick}
      {...rest} // 모든 기본 button 속성 전달
    >
      {children}
    </button>
  );
};

export const ArrowButton = ({
  children,
  width,
  color,
  mr,
  mt,
  ml,
  mb,
  onClick,
}: Pick<
  ButtonProps,
  "children" | "width" | "color" | "mr" | "mt" | "ml" | "mb" | "onClick"
>) => {
  return (
    <button
      className={styles.arrowButton}
      style={
        {
          "--arrow-size": width,
          "--arrow-color": color,
          "--arrow-mt": mt,
          "--arrow-mr": mr,
          "--arrow-mb": mb,
          "--arrow-ml": ml,
        } as React.CSSProperties
      }
      onClick={onClick}
    >
      {children}
    </button>
  );
};
