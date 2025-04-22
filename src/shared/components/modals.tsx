"use client";
import { ReactNode, useEffect, useState } from "react";
import styles from "../styles/modal.module.scss";
import { createPortal } from "react-dom";
import Footer from "@/app/login/footer";
import { alignType, directionType, justifyType } from "../types/layout";

interface BottomModalProps {
  children: ReactNode;
  width?: string;
  height?: string;
  px?: string;
  py?: string;
  justify?: justifyType;
  align?: alignType;
  direction?: directionType;
}

export const BottomModal: React.FC<BottomModalProps> = ({
  children,
  width,
  height,
  px,
  py,
  direction,
  justify,
  align,
}) => {
  const [modalHeight, setModalHeight] = useState(0);

  // 모달 높이를 측정하여 상태로 저장
  useEffect(() => {
    const modalElement = document.querySelector(`.${styles.fixedBottom}`);
    if (modalElement) {
      const height = modalElement.getBoundingClientRect().height;
      setModalHeight(height);
    }
  }, []);

  return (
    <>
      {/* 모달 높이만큼의 여백을 제공하는 div */}
      <div
        style={{ height: `${modalHeight}px` }}
        className={styles.modalSpacer}
      ></div>

      <div
        className={styles.fixedBottom}
        style={
          {
            "--modal-width": width,
            "--modal-height": height,
            "--modal-px": px,
            "--modal-py": py,
            "--modal-direction": direction,
            "--modal-justify": justify,
            "--modal-align": align,
          } as React.CSSProperties
        }
      >
        {children}
      </div>
    </>
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
  const [isClosing, setIsClosing] = useState(false);

  // Handle closing animation
  const handleClose = () => {
    setIsClosing(true);
    // Wait for animation to complete before actually closing
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 300); // Match the animation duration (0.3s)
  };

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

  if (!isOpen && !isClosing) return null;

  // Determine animation classes
  const backdropClass = `${styles.backdrop} ${
    isClosing ? styles.backdropClosing : ""
  }`;
  const modalClass = `${styles.modal} ${styles[variant]} ${
    isClosing
      ? variant === "bottom"
        ? styles.bottomClosing
        : styles.modalClosing
      : ""
  }`;

  return createPortal(
    <div
      className={backdropClass}
      onClick={isClosing ? undefined : handleClose}
    >
      <div className={modalClass} onClick={(e) => e.stopPropagation()}>
        {children}
        {variant === "bottom" && <Footer />}
      </div>
    </div>,
    document.body
  );
}
