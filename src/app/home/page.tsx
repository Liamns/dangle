"use client";
import { useRef, useEffect, useState, useCallback } from "react";
import AnnivWidget from "@/features/anniversary/components/anniv-widget";
import BottomNavBar from "../../shared/components/bottom-nav-bar";
import { InnerBox, InnerWrapper, Spacer } from "../../shared/components/layout";
import HomeProfile from "@/features/profile/components/HomeProfile";
import ScheduleBottomModal from "@/features/schedule/components/ScheduleBottomModal";

/**
 * 홈 페이지 컴포넌트
 * 메인 화면으로 프로필, 기념일 및 스케줄 정보를 표시합니다.
 */
export default function Home() {
  const innerBoxRef = useRef<HTMLDivElement>(null);
  const [innerBoxHeight, setInnerBoxHeight] = useState(0);

  /**
   * InnerBox 아래 공간의 높이를 계산하는 함수
   * 하단에 16px 여백을 추가하여 모달이 콘텐츠와 적절한 간격을 유지합니다.
   */
  const calculateInnerBoxHeight = useCallback(() => {
    if (!innerBoxRef.current) return;

    const rect = innerBoxRef.current.getBoundingClientRect();
    // InnerBox 하단 위치
    const bottomPosition = rect.bottom;
    // 화면 높이 - InnerBox 하단 위치 = 아래 남은 공간 (16px 여백 추가)
    const heightBelowInnerBox = window.innerHeight - bottomPosition - 16;

    setInnerBoxHeight(heightBelowInnerBox);
  }, []);

  // 높이 계산 및 이벤트 리스너 설정
  useEffect(() => {
    // 초기 계산
    calculateInnerBoxHeight();

    // 창 크기 변경 시 재계산
    window.addEventListener("resize", calculateInnerBoxHeight);

    // 모든 콘텐츠 로드 후 다시 계산 (이미지 등 지연 로드 요소 고려)
    const timer = setTimeout(calculateInnerBoxHeight, 500);

    // 클린업 함수
    return () => {
      window.removeEventListener("resize", calculateInnerBoxHeight);
      clearTimeout(timer);
    };
  }, [calculateInnerBoxHeight]);

  return (
    <InnerWrapper>
      <InnerBox ref={innerBoxRef}>
        <Spacer height="32" />
        <AnnivWidget />
        <HomeProfile />
      </InnerBox>

      {/* 높이 계산이 완료된 후에만 ScheduleBottomModal 렌더링 */}
      {innerBoxHeight > 0 && (
        <ScheduleBottomModal initialHeight={innerBoxHeight} />
      )}

      <BottomNavBar />
    </InnerWrapper>
  );
}
