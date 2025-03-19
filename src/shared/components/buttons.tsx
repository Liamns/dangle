import { ReactNode } from "react";
import styles from "../styles/buttons.module.scss";
import { Colors } from "../consts/colors";

interface ButtonProps {
  children: ReactNode;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  width?: string;
  height?: string;
  color?: string;
  textColor?: string;
  fontSize?: string;
  fontWeight?: string;
  mt?: string;
  mb?: string;
  ml?: string;
  mr?: string;
  valid?: boolean | null;
  validColor?: string;
  invalidColor?: string;
}

export const Button: React.FC<ButtonProps> = ({
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
}) => {
  const buttonColor =
    valid === null ? color : valid ? validColor : invalidColor;

  return (
    <button
      className={styles.button}
      style={
        {
          "--width": width,
          "--height": height,
          "--color": buttonColor,
          "--text-color": textColor,
          "--font-size": fontSize,
          "--font-weight": fontWeight,
          "--mt": mt,
          "--mr": mr,
          "--mb": mb,
          "--ml": ml,
        } as React.CSSProperties
      }
      onClick={onClick}
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
}: Pick<
  ButtonProps,
  "children" | "width" | "color" | "mr" | "mt" | "ml" | "mb"
>) => {
  return (
    <button
      className={styles.arrowButton}
      style={
        {
          "--size": width,
          "--color": color,
          "--mt": mt,
          "--mr": mr,
          "--mb": mb,
          "--ml": ml,
        } as React.CSSProperties
      }
    >
      {children}
    </button>
  );
};
