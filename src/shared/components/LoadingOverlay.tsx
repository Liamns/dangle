"use client";
import React from "react";
import { createPortal } from "react-dom";
import { ScaleLoader } from "react-spinners";
import { Colors } from "../consts/colors";

interface LoadingOverlayProps {
  isLoading: boolean;
  color?: string;
  message?: string;
}

/**
 * position: fixed와 React Portal을 사용한 전체 화면 로딩 오버레이 컴포넌트
 * 컴포넌트 트리 구조와 관계없이 항상 body의 최상단에 렌더링됩니다.
 */
const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  isLoading,
  color = Colors.primary,
  message = "로딩 중...",
}) => {
  // 클라이언트 사이드에서만 렌더링되도록 처리
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  if (!isLoading || !isMounted) return null;

  // Portal을 사용하여 body에 직접 렌더링
  return createPortal(
    <div className="fixed-loading-overlay">
      <div className="loading-spinner-container">
        <ScaleLoader
          color={color}
          loading={true}
          height={50}
          width={6}
          radius={2}
          margin={2}
        />
        {message && <p className="loading-text">{message}</p>}
      </div>

      <style jsx>{`
        .fixed-loading-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(3px);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 9999;
        }

        .loading-spinner-container {
          background-color: transparent;
          border-radius: 12px;
          padding: 2rem;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .loading-text {
          margin-top: 1rem;
          color: var(--primary);
          font-size: 16px;
          font-weight: 700;
          font-family: var(--inter);
        }
      `}</style>
    </div>,
    document.body
  );
};

export default LoadingOverlay;