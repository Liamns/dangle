import { ReactNode } from "react";
import styles from "../styles/modal.module.css";

interface BottomModalProps {
  children: ReactNode;
  width?: string;
  height?: string;
  padding?: string;
  justify?: "center" | "space-between" | "start" | "space-evenly" | "end";
  align?: "center" | "start" | "end";
  direction?: "row" | "column";
}

export const BottomModal: React.FC<BottomModalProps> = ({
  children,
  width,
  height,
  padding,
  direction,
  justify,
  align,
}) => {
  return (
    <div
      className={styles.bottom}
      style={
        {
          "--width": width,
          "--height": height,
          "--padding": padding,
          "--direction": direction,
          "--justify": justify,
          "--align": align,
        } as React.CSSProperties
      }
    >
      {children}
    </div>
  );
};
