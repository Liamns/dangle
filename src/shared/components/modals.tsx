"use client";
import { ReactNode, useEffect, useState, useRef } from "react";
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
  draggable?: boolean;
  minHeight?: number;
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
  draggable = false,
  minHeight = 0,
}) => {
  const [currentHeight, setCurrentHeight] = useState<number | null>(null);
  const startYRef = useRef(0);
  const startHRef = useRef(0);
  const [lastHeight, setLastHeight] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const topMargin = 32;

  useEffect(() => {
    if (!height) {
      const el = document.querySelector(
        `.${styles.fixedBottom}`
      ) as HTMLElement;
      if (el) {
        const renderedHeight = el.getBoundingClientRect().height;
        setCurrentHeight(renderedHeight);
        startHRef.current = renderedHeight;
      }
    }
  }, [height]);

  // 모달 높이 측정 (마운트 및 크기 변경 시)
  useEffect(() => {
    const el = document.querySelector(`.${styles.fixedBottom}`) as HTMLElement;
    if (el) {
      setLastHeight(el.getBoundingClientRect().height);
    }
  }, [currentHeight]);

  // 드래그 중 스크롤 방지 로직 추가
  useEffect(() => {
    const preventScroll = (e: Event) => {
      e.preventDefault();
    };

    const modalElement = document.querySelector(`.${styles.fixedBottom}`);
    if (modalElement) {
      modalElement.addEventListener(
        "touchmove",
        preventScroll as EventListener,
        {
          passive: false,
        }
      );
      modalElement.addEventListener(
        "mousemove",
        preventScroll as EventListener
      );
    }

    return () => {
      if (modalElement) {
        modalElement.removeEventListener(
          "touchmove",
          preventScroll as EventListener
        );
        modalElement.removeEventListener(
          "mousemove",
          preventScroll as EventListener
        );
      }
    };
  }, []);

  // 드래그 시작 핸들러
  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    if (!draggable) return;
    e.stopPropagation(); // 이벤트 전파 방지
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
    startYRef.current = clientY;
    startHRef.current = currentHeight || 0;
    window.addEventListener("mousemove", onDrag);
    window.addEventListener("mouseup", onDragEnd);
    window.addEventListener("touchmove", onDrag);
    window.addEventListener("touchend", onDragEnd);
  };

  // 드래그 중 (min/max 범위 내에서 즉시 업데이트)
  const onDrag = (e: MouseEvent | TouchEvent) => {
    const clientY =
      "touches" in e
        ? (e as TouchEvent).touches[0].clientY
        : (e as MouseEvent).clientY;
    const delta = startYRef.current - clientY;
    const maxHeight = window.innerHeight - topMargin;
    const newHeight = Math.min(
      Math.max(minHeight, (startHRef.current || 0) + delta),
      maxHeight
    );
    setCurrentHeight(newHeight);
  };

  // 드래그 종료 및 스냅 처리 로직 수정
  const onDragEnd = () => {
    window.removeEventListener("mousemove", onDrag);
    window.removeEventListener("mouseup", onDragEnd);
    window.removeEventListener("touchmove", onDrag);
    window.removeEventListener("touchend", onDragEnd);

    const finalHeight = currentHeight || 0;
    const maxHeight = window.innerHeight - topMargin;

    // 위로 드래그 시 최대 높이로 스냅
    if (finalHeight > startHRef.current && finalHeight >= maxHeight * 0.8) {
      setCurrentHeight(maxHeight);
      setIsExpanded(true);
    }
    // 아래로 드래그 시 최소 높이로 스냅
    else if (finalHeight < startHRef.current && finalHeight <= minHeight + 20) {
      setCurrentHeight(minHeight);
      setIsExpanded(false);
    }
    // 중간 높이에서는 이전 높이로 복원
    else {
      setCurrentHeight(startHRef.current);
      setIsExpanded(false);
    }
  };

  return (
    <>
      <div
        style={{
          height: `${
            draggable && currentHeight !== null ? currentHeight : 0
          }px`,
        }}
        className={styles.modalSpacer}
      />

      <div
        className={styles.fixedBottom}
        style={
          draggable && currentHeight !== null
            ? ({
                width,
                height: `${currentHeight}px`,
                "--modal-px": px,
                "--modal-py": py,
                "--modal-direction": direction,
                "--modal-justify": justify,
                "--modal-align": align,
              } as React.CSSProperties)
            : ({
                "--modal-width": width,
                "--modal-height": height,
                "--modal-px": px,
                "--modal-py": py,
                "--modal-direction": direction,
                "--modal-justify": justify,
                "--modal-align": align,
              } as React.CSSProperties)
        }
      >
        {draggable && (
          <div
            className={styles.dragHandle}
            onMouseDown={handleDragStart}
            onTouchStart={handleDragStart}
          />
        )}
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
  style?: React.CSSProperties;
}

export default function Modal({
  isOpen,
  onClose,
  variant = "center",
  children,
  style = {},
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
      <div
        className={modalClass}
        onClick={(e) => e.stopPropagation()}
        style={style}
      >
        {children}
        {variant === "bottom" && <Footer />}
      </div>
    </div>,
    document.body
  );
}
