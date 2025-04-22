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
  padding?: string;
  justify?: justifyType;
  align?: alignType;
  direction?: directionType;
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
  // Comment out the useEffect that adds padding to allow Card to overlap with BottomModal

  useEffect(() => {
    // 모달 요소 찾기
    const modalElement = document.querySelector(`.${styles.fixedBottom}`);
    if (modalElement) {
      // 모달 높이 계산
      const modalHeight = modalElement.getBoundingClientRect().height;

      // 메인 컨텐츠의 부모 요소를 찾아 하단 패딩 추가
      const parentElement = modalElement.parentElement;
      if (parentElement) {
        // 기존 패딩 저장
        const originalPaddingBottom =
          window.getComputedStyle(parentElement).paddingBottom;

        // 새로운 패딩 설정
        parentElement.style.paddingBottom = `${modalHeight}px`;

        // 컴포넌트 언마운트 시 원래 패딩으로 복원
        return () => {
          parentElement.style.paddingBottom = originalPaddingBottom;
        };
      }
    }
  }, []);

  return (
    <div
      className={styles.fixedBottom}
      style={
        {
          "--modal-width": width,
          "--modal-height": height,
          "--modal-padding": padding,
          "--modal-direction": direction,
          "--modal-justify": justify,
          "--modal-align": align,
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
