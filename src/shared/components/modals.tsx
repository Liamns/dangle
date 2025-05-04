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
  const [contentHeight, setContentHeight] = useState(0); // 콘텐츠 높이를 저장할 상태
  const [initialContentHeight, setInitialContentHeight] = useState(0); // 초기 콘텐츠 높이를 저장 (변하지 않음)
  const contentRef = useRef<HTMLDivElement>(null); // 콘텐츠 요소에 대한 ref
  const dragDirectionRef = useRef<"up" | "down" | null>(null); // 드래그 방향 추적
  const dragDistanceRef = useRef(0); // 드래그 거리 추적
  const topMargin = 32;
  const expandThreshold = 0.3; // 최대 높이의 30%를 넘으면 확장
  const collapseThreshold = 0.7; // 최대 높이의 70% 미만이면 축소
  const dragDownThreshold = 20; // 아래로 드래그 시 이 픽셀 값 이상 드래그하면 축소 상태로 전환

  // 초기 렌더링 시 및 내용 변경 시 콘텐츠 높이 측정 - 한 번만 실행되도록 수정
  useEffect(() => {
    const measureContentHeight = () => {
      if (contentRef.current) {
        // 콘텐츠 높이 + 패딩 + 핸들 영역 계산 (핸들이 있는 경우 여분 공간 추가)
        const paddingTop =
          parseInt(getComputedStyle(contentRef.current).paddingTop, 10) || 0;
        const paddingBottom =
          parseInt(getComputedStyle(contentRef.current).paddingBottom, 10) || 0;
        const handleHeight = draggable ? 24 : 0; // 드래그 핸들이 있는 경우 추가 높이

        // 콘텐츠 자체 높이 + 패딩 + 핸들 영역
        const totalHeight = contentRef.current.scrollHeight + handleHeight;

        // 콘텐츠 높이 설정
        setContentHeight(totalHeight);

        // 초기 콘텐츠 높이는 한 번만 설정 (이후 변경되지 않음)
        if (initialContentHeight === 0) {
          setInitialContentHeight(totalHeight);

          // 최초 렌더링 시 콘텐츠 높이를 기본 높이로 설정
          if (!currentHeight && draggable) {
            setCurrentHeight(totalHeight);
          }
        }
      }
    };

    measureContentHeight();

    // 초기 높이를 측정한 후에는 리사이즈 이벤트에만 반응
    window.addEventListener("resize", measureContentHeight);
    return () => window.removeEventListener("resize", measureContentHeight);
  }, [children, draggable, initialContentHeight]);

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

  // 최대 높이로 확장
  const expandModal = () => {
    const maxHeight = window.innerHeight - topMargin;
    setCurrentHeight(maxHeight);
    setIsExpanded(true);
  };

  // 최소 높이로 축소 (초기 콘텐츠 높이 사용)
  const collapseModal = () => {
    // 저장된 초기 콘텐츠 높이를 사용 (변하지 않음)
    // minHeight가 명시적으로 지정된 경우 그 값을 우선함
    const autoMinHeight = Math.max(
      initialContentHeight || contentHeight,
      minHeight
    );
    setCurrentHeight(autoMinHeight);
    setIsExpanded(false);
  };

  // 핸들 클릭 시 토글 기능 추가
  const handleClick = () => {
    if (isExpanded) {
      collapseModal();
    } else {
      expandModal();
    }
  };

  // 드래그 시작 핸들러 - 드래그 방향과 거리 초기화
  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    if (!draggable) return;
    e.stopPropagation(); // 이벤트 전파 방지
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
    startYRef.current = clientY;
    startHRef.current = currentHeight || 0;
    dragDirectionRef.current = null; // 드래그 방향 초기화
    dragDistanceRef.current = 0; // 드래그 거리 초기화
    window.addEventListener("mousemove", onDrag);
    window.addEventListener("mouseup", onDragEnd);
    window.addEventListener("touchmove", onDrag);
    window.addEventListener("touchend", onDragEnd);
  };

  // 드래그 중 - 방향과 거리 추적 (직관적인 사용성을 위해 개선)
  const onDrag = (e: MouseEvent | TouchEvent) => {
    const clientY =
      "touches" in e
        ? (e as TouchEvent).touches[0].clientY
        : (e as MouseEvent).clientY;
    const delta = startYRef.current - clientY;

    // 드래그 방향 결정 (양수면 위로, 음수면 아래로)
    // 방향이 명확하게 바뀌었을 때만 방향을 업데이트
    if (
      delta > 5 &&
      (dragDirectionRef.current !== "up" || dragDirectionRef.current === null)
    ) {
      dragDirectionRef.current = "up";
    } else if (
      delta < -5 &&
      (dragDirectionRef.current !== "down" || dragDirectionRef.current === null)
    ) {
      dragDirectionRef.current = "down";
    }

    // 드래그 절대 거리 추적
    dragDistanceRef.current = Math.abs(delta);

    const maxHeight = window.innerHeight - topMargin;
    // 콘텐츠 높이를 최소 높이로 사용 (초기 높이 사용)
    const autoMinHeight = Math.max(
      initialContentHeight || contentHeight,
      minHeight
    );

    const newHeight = Math.min(
      Math.max(autoMinHeight, (startHRef.current || 0) + delta),
      maxHeight
    );
    setCurrentHeight(newHeight);
  };

  // 드래그 종료 - 단순화된 로직으로 수정
  const onDragEnd = () => {
    window.removeEventListener("mousemove", onDrag);
    window.removeEventListener("mouseup", onDragEnd);
    window.removeEventListener("touchmove", onDrag);
    window.removeEventListener("touchend", onDragEnd);

    // 짧은 드래그는 무시 (10px 미만의 드래그는 의도적인 드래그로 간주하지 않음)
    if (dragDistanceRef.current < 10) {
      // 현재 상태 유지
      if (isExpanded) {
        expandModal();
      } else {
        collapseModal();
      }
      return;
    }

    // 단순화된 로직: 드래그 방향으로 전환
    if (dragDirectionRef.current === "up") {
      // 위로 드래그하면 확장
      expandModal();
    } else if (dragDirectionRef.current === "down") {
      // 아래로 드래그하면 축소
      // 특히 isExpanded가 true이고 아래로 dragDownThreshold 이상 드래그했을 때 확실히 축소
      if (isExpanded && dragDistanceRef.current > dragDownThreshold) {
        collapseModal();
      } else if (!isExpanded) {
        // 이미 축소 상태면 축소 유지
        collapseModal();
      } else {
        // 드래그가 충분하지 않으면 상태 유지
        expandModal();
      }
    } else {
      // 방향이 결정되지 않은 경우 (거의 발생하지 않음)
      if (isExpanded) {
        expandModal();
      } else {
        collapseModal();
      }
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
            onClick={handleClick}
          />
        )}
        <div ref={contentRef} className={styles.bottomSheetContent}>
          {children}
        </div>
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
