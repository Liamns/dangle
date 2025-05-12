"use client";
import { ReactNode, useEffect, useState, useRef, useCallback } from "react";
import styles from "../styles/modal.module.scss";
import { createPortal } from "react-dom";
import Footer from "@/app/login/footer";
import { alignType, directionType, justifyType } from "../types/layout";

/**
 * 드래그 방향 타입 정의
 */
type DragDirection = "up" | "down" | null;

/**
 * BottomModal 컴포넌트의 Props 인터페이스
 */
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

/**
 * 바텀 모달 컴포넌트
 * 드래그 가능한 바텀 시트 기능을 제공합니다.
 */
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
  // minHeight 값이 필요한지 확인
  if (draggable && minHeight <= 0) {
    console.warn(
      "BottomModal: draggable이 true일 때는 반드시 minHeight를 지정해야 합니다."
    );
  }

  // 상태 관리
  const [currentHeight, setCurrentHeight] = useState<number | null>(null);
  const [lastHeight, setLastHeight] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const [contentHeight, setContentHeight] = useState(0);
  const [initialContentHeight, setInitialContentHeight] = useState(0);
  const [isInitialized, setIsInitialized] = useState(false);

  // Ref 관리
  const contentRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const startYRef = useRef(0);
  const startHRef = useRef(0);
  const dragDirectionRef = useRef<DragDirection>(null);
  const dragDistanceRef = useRef(0);
  const targetHeightRef = useRef<number | null>(null);

  // 상수 정의
  const topMargin = 32;
  const expandThreshold = 0.3;
  const collapseThreshold = 0.7;
  const dragDownThreshold = 20;
  const minDragDistance = 10;
  const dragDirectionThreshold = 5;

  /**
   * 콘텐츠 높이 계산 함수
   */
  const measureContentHeight = useCallback(() => {
    if (!contentRef.current) return;

    // 핸들 높이 계산
    const handleHeight = draggable ? 24 : 0;

    // 콘텐츠 자체 높이 + 핸들 영역
    const totalHeight = contentRef.current.scrollHeight + handleHeight;

    // 콘텐츠 높이 설정
    setContentHeight(totalHeight);

    // 초기 콘텐츠 높이는 한 번만 설정
    if (initialContentHeight === 0) {
      setInitialContentHeight(totalHeight);

      // 최초 렌더링 시 높이 설정
      if (!currentHeight) {
        let initialHeight;

        if (draggable) {
          // draggable=true일 때는 항상 minHeight 사용
          initialHeight = minHeight;
        } else {
          // draggable=false일 때는 기존 로직 유지
          initialHeight =
            minHeight > 0 ? Math.min(totalHeight, minHeight) : totalHeight;
        }

        // 타겟 높이 설정
        targetHeightRef.current = initialHeight;
        setCurrentHeight(initialHeight);

        // transition 효과 활성화 지연
        setTimeout(() => setIsInitialized(true), 100);
      }
    }
  }, [
    contentHeight,
    currentHeight,
    draggable,
    initialContentHeight,
    minHeight,
  ]);

  /**
   * DOM 렌더링 후 높이 조정 함수
   */
  const adjustHeight = useCallback(() => {
    if (!modalRef.current || !targetHeightRef.current) return;

    const renderedHeight = modalRef.current.getBoundingClientRect().height;

    // 렌더링된 높이가 목표 높이와 다르면 조정
    if (renderedHeight !== targetHeightRef.current) {
      setCurrentHeight(targetHeightRef.current);
    }
  }, []);

  /**
   * 최소 높이 계산 함수
   */
  const calculateMinHeight = useCallback(() => {
    if (draggable) {
      // draggable=true일 때는 항상 전달된 minHeight 사용
      return minHeight;
    } else {
      // draggable=false일 때는 기존 로직 유지
      return Math.min(
        initialContentHeight || contentHeight,
        minHeight || Infinity
      );
    }
  }, [contentHeight, draggable, initialContentHeight, minHeight]);

  /**
   * 최대 높이로 확장
   */
  const expandModal = useCallback(() => {
    const maxHeight = window.innerHeight - topMargin;
    targetHeightRef.current = maxHeight;
    setCurrentHeight(maxHeight);
    setIsExpanded(true);
  }, [topMargin]);

  /**
   * 최소 높이로 축소
   */
  const collapseModal = useCallback(() => {
    const autoMinHeight = calculateMinHeight();
    targetHeightRef.current = autoMinHeight;
    setCurrentHeight(autoMinHeight);
    setIsExpanded(false);
  }, [calculateMinHeight]);

  /**
   * 핸들 클릭 처리
   */
  const handleClick = useCallback(() => {
    if (isExpanded) {
      collapseModal();
    } else {
      expandModal();
    }
  }, [collapseModal, expandModal, isExpanded]);

  /**
   * 드래그 시작 처리
   */
  const handleDragStart = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      if (!draggable) return;

      e.stopPropagation();
      const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
      startYRef.current = clientY;
      startHRef.current = currentHeight || 0;
      dragDirectionRef.current = null;
      dragDistanceRef.current = 0;

      window.addEventListener("mousemove", onDrag);
      window.addEventListener("mouseup", onDragEnd);
      window.addEventListener("touchmove", onDrag);
      window.addEventListener("touchend", onDragEnd);
    },
    [currentHeight, draggable]
  );

  /**
   * 드래그 중 처리
   */
  const onDrag = useCallback(
    (e: MouseEvent | TouchEvent) => {
      const clientY =
        "touches" in e
          ? (e as TouchEvent).touches[0].clientY
          : (e as MouseEvent).clientY;
      const delta = startYRef.current - clientY;

      // 드래그 방향 결정
      if (
        delta > dragDirectionThreshold &&
        (dragDirectionRef.current !== "up" || dragDirectionRef.current === null)
      ) {
        dragDirectionRef.current = "up";
      } else if (
        delta < -dragDirectionThreshold &&
        (dragDirectionRef.current !== "down" ||
          dragDirectionRef.current === null)
      ) {
        dragDirectionRef.current = "down";
      }

      // 드래그 거리 추적
      dragDistanceRef.current = Math.abs(delta);

      const maxHeight = window.innerHeight - topMargin;
      const autoMinHeight = calculateMinHeight();

      // 새 높이 계산 및 적용
      const newHeight = Math.min(
        Math.max(autoMinHeight, (startHRef.current || 0) + delta),
        maxHeight
      );

      targetHeightRef.current = newHeight;
      setCurrentHeight(newHeight);
    },
    [calculateMinHeight, topMargin]
  );

  /**
   * 드래그 종료 처리
   */
  const onDragEnd = useCallback(() => {
    // 이벤트 리스너 제거
    window.removeEventListener("mousemove", onDrag);
    window.removeEventListener("mouseup", onDragEnd);
    window.removeEventListener("touchmove", onDrag);
    window.removeEventListener("touchend", onDragEnd);

    // 짧은 드래그 무시
    if (dragDistanceRef.current < minDragDistance) {
      isExpanded ? expandModal() : collapseModal();
      return;
    }

    // 드래그 방향에 따른 처리
    if (dragDirectionRef.current === "up") {
      expandModal();
    } else if (dragDirectionRef.current === "down") {
      if (isExpanded && dragDistanceRef.current > dragDownThreshold) {
        collapseModal();
      } else if (!isExpanded) {
        collapseModal();
      } else {
        expandModal();
      }
    } else {
      isExpanded ? expandModal() : collapseModal();
    }
  }, [collapseModal, expandModal, isExpanded, minDragDistance, onDrag]);

  // 초기 및 리사이즈 시 높이 측정
  useEffect(() => {
    measureContentHeight();

    window.addEventListener("resize", measureContentHeight);
    return () => window.removeEventListener("resize", measureContentHeight);
  }, [
    children,
    draggable,
    initialContentHeight,
    measureContentHeight,
    minHeight,
  ]);

  // DOM 렌더링 후 높이 조정
  useEffect(() => {
    if (!draggable || height) return;

    adjustHeight();

    const timer = setTimeout(adjustHeight, 100);
    return () => clearTimeout(timer);
  }, [adjustHeight, draggable, height]);

  // 모달 높이 변경 추적
  useEffect(() => {
    const el = document.querySelector(`.${styles.fixedBottom}`) as HTMLElement;
    if (el) {
      setLastHeight(el.getBoundingClientRect().height);
    }
  }, [currentHeight]);

  // 스크롤 방지
  useEffect(() => {
    const preventScroll = (e: Event) => {
      // 이벤트의 타겟 요소 확인
      const target = e.target as HTMLElement;

      // 드래그 핸들 영역이면 이벤트 방지
      if (target.closest(`.${styles.dragHandle}`)) {
        e.preventDefault();
        return;
      }

      // 내부 콘텐츠 영역인지 확인
      const isContentArea = target.closest(`.${styles.bottomSheetContent}`);

      // 내부 콘텐츠 영역이면 스크롤 허용 (이벤트 전파)
      if (isContentArea) {
        // 스크롤 허용 (preventDefault 호출하지 않음)
        return;
      }

      // 그 외 영역(모달 자체 등)에서는 스크롤 방지
      e.preventDefault();
    };

    const modalElement = document.querySelector(`.${styles.fixedBottom}`);
    if (modalElement) {
      modalElement.addEventListener(
        "touchmove",
        preventScroll as EventListener,
        { passive: false }
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

  // 스타일 계산
  const getModalStyle = () => {
    if (draggable && currentHeight !== null) {
      return {
        width,
        height: `${currentHeight}px`,
        "--modal-px": px,
        "--modal-py": py,
        "--modal-direction": direction,
        "--modal-justify": justify,
        "--modal-align": align,
      } as React.CSSProperties;
    }

    return {
      "--modal-width": width,
      "--modal-height": height,
      "--modal-px": px,
      "--modal-py": py,
      "--modal-direction": direction,
      "--modal-justify": justify,
      "--modal-align": align,
    } as React.CSSProperties;
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
        ref={modalRef}
        className={`${styles.fixedBottom} ${
          isInitialized ? styles.initialized : ""
        }`}
        style={getModalStyle()}
      >
        {draggable && (
          <div
            className={styles.dragHandle}
            onMouseDown={handleDragStart}
            onTouchStart={handleDragStart}
            onClick={handleClick}
          />
        )}
        <div
          ref={contentRef}
          className={styles.bottomSheetContent}
          style={{ flex: draggable ? 1 : undefined }}
        >
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
  // 내부 상태로 isOpen 값을 복사하여 관리
  const [internalIsOpen, setInternalIsOpen] = useState(isOpen);
  const [isClosing, setIsClosing] = useState(false);
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // 외부에서 전달된 isOpen 값이 변경될 때 내부 상태 동기화
  useEffect(() => {
    if (isOpen && !internalIsOpen && !isClosing) {
      // 모달 열기: 바로 열기
      setInternalIsOpen(true);
    } else if (!isOpen && internalIsOpen && !isClosing) {
      // 모달 닫기: 애니메이션 후 닫기
      handleClose();
    }
  }, [isOpen, internalIsOpen, isClosing]);

  // 애니메이션과 함께 모달 닫기
  const handleClose = useCallback(() => {
    if (isClosing) return; // 이미 닫는 중이면 무시

    setIsClosing(true);

    // 기존 타이머가 있으면 제거
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
    }

    // 애니메이션 후 실제로 닫기
    closeTimeoutRef.current = setTimeout(() => {
      setIsClosing(false);
      setInternalIsOpen(false);
      onClose(); // 부모 컴포넌트에 알림
      closeTimeoutRef.current = null;
    }, 300); // 애니메이션 지속 시간과 일치
  }, [isClosing, onClose]);

  // 컴포넌트 언마운트 시 타이머 정리
  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
      }
    };
  }, []);

  // 모달이 열리면 document.body에 scroll 잠금 처리 가능 (옵션)
  useEffect(() => {
    if (internalIsOpen || isClosing) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [internalIsOpen, isClosing]);

  // 모달이 실제로 닫혀있고 애니메이션도 진행 중이 아닐 경우 null 반환
  if (!internalIsOpen && !isClosing) return null;

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
