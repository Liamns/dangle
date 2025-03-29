"use client";
import { ReactNode, useEffect } from "react";
import styles from "../styles/modal.module.scss";
import { createPortal } from "react-dom";
import Footer from "@/app/login/footer";

interface BottomModalProps {
  children: ReactNode;
  width?: string;
  height?: string;
  padding?: string;
  justify?: "center" | "space-between" | "start" | "space-evenly" | "end";
  align?: "center" | "start" | "end";
  direction?: "row" | "column";
  isOpen?: boolean;
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
      className={styles.fixedBottom}
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

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  variant?: "center" | "bottom";
  children: React.ReactNode;
}

export default function Modal({
  isOpen,
  onClose,
  variant = "center",
  children,
}: ModalProps) {
  // 모달이 열리면 document.body에 scroll 잠금 처리 가능 (옵션)
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return createPortal(
    <div className={styles.backdrop} onClick={onClose}>
      <div
        className={`${styles.modal} ${styles[variant]}`}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
        {variant === "bottom" && <Footer />}
      </div>
    </div>,
    document.body
  );
}
