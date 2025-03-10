import { ReactNode } from "react";
import styles from "../styles/buttons.module.css";

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
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
}) => {
  return (
    <button
      className={styles.button}
      style={
        {
          "--width": width,
          "--height": height,
          "--color": color,
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
