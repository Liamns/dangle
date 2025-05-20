"use client";

import React, {
  createContext,
  useState,
  useContext,
  useRef,
  useEffect,
  useCallback,
} from "react";
import { createPortal } from "react-dom";
import styles from "./tooltip.module.scss";

// Tooltip 컨텍스트 인터페이스
interface TooltipContextType {
  activeTooltipId: string | null;
  showTooltip: (id: string) => void;
  hideTooltip: () => void;
}

// Tooltip 컨텍스트 생성
const TooltipContext = createContext<TooltipContextType | null>(null);

// Custom hook to use tooltip context
export const useTooltip = () => {
  const context = useContext(TooltipContext);
  if (!context) {
    throw new Error("useTooltip must be used within a TooltipProvider");
  }
  return context;
};

// TooltipProvider props interface
interface TooltipProviderProps {
  children: React.ReactNode;
}

// TooltipProvider component
export const TooltipProvider: React.FC<TooltipProviderProps> = ({
  children,
}) => {
  const [activeTooltipId, setActiveTooltipId] = useState<string | null>(null);

  const showTooltip = useCallback((id: string) => {
    setActiveTooltipId(id);
  }, []);

  const hideTooltip = useCallback(() => {
    setActiveTooltipId(null);
  }, []);

  return (
    <TooltipContext.Provider
      value={{ activeTooltipId, showTooltip, hideTooltip }}
    >
      {children}
    </TooltipContext.Provider>
  );
};

// Tooltip placement options
export type TooltipPlacement =
  | "top"
  | "bottom"
  | "left"
  | "right"
  | "top-left"
  | "top-right"
  | "bottom-left"
  | "bottom-right";

// Tooltip props interface
interface TooltipProps {
  children: React.ReactNode;
  disabled?: boolean;
}

// Tooltip component
export const Tooltip: React.FC<TooltipProps> = ({ children, disabled }) => {
  const tooltipId = useRef(
    `tooltip-${Math.random().toString(36).substr(2, 9)}`
  );
  const { activeTooltipId, showTooltip, hideTooltip } = useTooltip();
  const targetRef = useRef<HTMLDivElement>(null);
  const isOpen = activeTooltipId === tooltipId.current;

  const handleToggle = () => {
    if (disabled) return;

    if (isOpen) {
      hideTooltip();
    } else {
      showTooltip(tooltipId.current);
    }
  };

  const handleClickOutside = useCallback(
    (event: MouseEvent) => {
      if (
        targetRef.current &&
        !targetRef.current.contains(event.target as Node) &&
        isOpen
      ) {
        hideTooltip();
      }
    },
    [hideTooltip, isOpen]
  );

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [handleClickOutside]);

  // React.Children.map을 사용하여 자식 요소 처리
  const childrenArray = React.Children.toArray(children);

  // TooltipContent 컴포넌트와 trigger 요소 분리
  const triggerElement = childrenArray.find(
    (child) => React.isValidElement(child) && child.type !== TooltipContent
  );

  const tooltipContent = childrenArray.find(
    (child) => React.isValidElement(child) && child.type === TooltipContent
  );

  if (!React.isValidElement(triggerElement)) {
    throw new Error("Tooltip must have a trigger element");
  }

  return (
    <>
      <div ref={targetRef} onClick={handleToggle}>
        {triggerElement}
      </div>
      {isOpen &&
        React.isValidElement(tooltipContent) &&
        React.cloneElement(tooltipContent as React.ReactElement<any>, {
          targetRef,
          tooltipId: tooltipId.current,
        })}
    </>
  );
};

// TooltipContent props interface
interface TooltipContentProps {
  children: React.ReactNode;
  placement?: TooltipPlacement;
  offset?: number;
  showBackdrop?: boolean;
  backdropColor?: string;
  hasArrow?: boolean;
  maxWidth?: number | string;
  onClose?: () => void;
  className?: string;
  targetRef?: React.RefObject<HTMLDivElement>;
  tooltipId?: string;
}

// TooltipContent component
export const TooltipContent: React.FC<TooltipContentProps> = ({
  children,
  placement = "bottom",
  offset = 8,
  showBackdrop = false,
  backdropColor = "rgba(0, 0, 0, 0.5)",
  hasArrow = true,
  maxWidth = 200,
  onClose,
  className = "",
  targetRef,
  tooltipId,
}) => {
  const { hideTooltip } = useTooltip();
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [arrowPosition, setArrowPosition] = useState({ top: 0, left: 0 });
  const [mounted, setMounted] = useState(false);

  // Portal target for tooltip
  const [portalTarget, setPortalTarget] = useState<HTMLElement | null>(null);

  useEffect(() => {
    setPortalTarget(document.body);
    setMounted(true);
  }, []);

  const calculatePosition = useCallback(() => {
    if (!targetRef?.current || !tooltipRef.current || !mounted) return;

    const targetRect = targetRef.current.getBoundingClientRect();
    const tooltipRect = tooltipRef.current.getBoundingClientRect();

    let top = 0;
    let left = 0;
    const arrowSize = 8; // Arrow size in pixels

    // Calculate position based on placement
    switch (placement) {
      case "top":
        top = targetRect.top - tooltipRect.height - offset;
        left = targetRect.left + (targetRect.width - tooltipRect.width) / 2;
        setArrowPosition({
          top: tooltipRect.height,
          left: tooltipRect.width / 2 - arrowSize,
        });
        break;
      case "bottom":
        top = targetRect.bottom + offset;
        left = targetRect.left + (targetRect.width - tooltipRect.width) / 2;
        setArrowPosition({
          top: -arrowSize * 2,
          left: tooltipRect.width / 2 - arrowSize,
        });
        break;
      case "left":
        top = targetRect.top + (targetRect.height - tooltipRect.height) / 2;
        left = targetRect.left - tooltipRect.width - offset;
        setArrowPosition({
          top: tooltipRect.height / 2 - arrowSize,
          left: tooltipRect.width,
        });
        break;
      case "right":
        top = targetRect.top + (targetRect.height - tooltipRect.height) / 2;
        left = targetRect.right + offset;
        setArrowPosition({
          top: tooltipRect.height / 2 - arrowSize,
          left: -arrowSize * 2,
        });
        break;
      case "top-left":
        top = targetRect.top - tooltipRect.height - offset;
        left = targetRect.left;
        setArrowPosition({
          top: tooltipRect.height,
          left: arrowSize * 2,
        });
        break;
      case "top-right":
        top = targetRect.top - tooltipRect.height - offset;
        left = targetRect.right - tooltipRect.width;
        setArrowPosition({
          top: tooltipRect.height,
          left: tooltipRect.width - arrowSize * 3,
        });
        break;
      case "bottom-left":
        top = targetRect.bottom + offset;
        left = targetRect.left;
        setArrowPosition({
          top: -arrowSize * 2,
          left: arrowSize * 2,
        });
        break;
      case "bottom-right":
        top = targetRect.bottom + offset;
        left = targetRect.right - tooltipRect.width;
        setArrowPosition({
          top: -arrowSize * 2,
          left: tooltipRect.width - arrowSize * 3,
        });
        break;
      default:
        break;
    }

    // Ensure tooltip stays within viewport
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    if (left < 0) left = 0;
    if (left + tooltipRect.width > viewportWidth) {
      left = viewportWidth - tooltipRect.width;
    }

    if (top < 0) top = 0;
    if (top + tooltipRect.height > viewportHeight) {
      top = viewportHeight - tooltipRect.height;
    }

    setPosition({ top, left });
  }, [mounted, offset, placement, targetRef]);

  useEffect(() => {
    calculatePosition();

    const handleResize = () => {
      calculatePosition();
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("scroll", handleResize);

    // Recalculate position after a short delay to ensure tooltip has rendered
    const timer = setTimeout(calculatePosition, 50);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleResize);
      clearTimeout(timer);
    };
  }, [calculatePosition]);

  const handleBackdropClick = useCallback(() => {
    if (onClose) {
      onClose();
    }
    hideTooltip();
  }, [hideTooltip, onClose]);

  if (!mounted || !portalTarget) return null;

  return createPortal(
    <>
      {showBackdrop && (
        <div
          className={styles.backdrop}
          style={{ backgroundColor: backdropColor }}
          onClick={handleBackdropClick}
        />
      )}
      <div
        ref={tooltipRef}
        className={`${styles.tooltip} ${className}`}
        style={{
          top: `${position.top}px`,
          left: `${position.left}px`,
          maxWidth: typeof maxWidth === "number" ? `${maxWidth}px` : maxWidth,
        }}
        role="tooltip"
        aria-describedby={tooltipId}
      >
        {hasArrow && (
          <div
            className={`${styles.arrow} ${styles[`arrow-${placement}`]}`}
            style={{
              top: `${arrowPosition.top}px`,
              left: `${arrowPosition.left}px`,
            }}
          />
        )}
        <div className={styles.tooltipContent}>{children}</div>
      </div>
    </>,
    portalTarget
  );
};
