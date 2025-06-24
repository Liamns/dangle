"use client";
import { memo, useCallback, useRef, useState } from "react";
import styles from "./Onboarding.module.scss";
import OnboardingFirstPage from "./OnboardingFirstPage";
import OnboardingSecondPage from "./OnboardingSecondPage";
import OnboardingThirdPage from "./OnboardingThirdPage";
import OnboardingFourthPage from "./OnboardingFourthPage";
import OnboardingFifthPage from "./OnboardingFifthPage";
import OnboardingSixthPage from "./OnboardingSixthPage";
import OnboardingSeventhPage from "./OnboardingSeventhPage";
import OnboardingEighthPage from "./OnboardingEighthPage";
import OnboardingNinthPage from "./OnboardingNinthPage";
import OnboardingTenthPage from "./OnboardingTenthPage";
import OnboardingEleventhPage from "./OnboardingEleventhPage";

export interface OnboardingProps {
  onNext: () => void; // 다음 페이지로 이동하는 함수
  onPrev: () => void; // 이전 페이지로 이동하는 함수
}

const Onboarding = memo(() => {
  const [currentPage, setCurrentPage] = useState(0);
  // 페이지 이동 함수
  const goToPage = useCallback((index: number) => {
    // 범위 체크
    if (index < 0 || index >= 11) return;

    // 페이지 상태 업데이트
    setCurrentPage(index);

    // 슬라이더 이동
    if (wrapperRef.current) {
      wrapperRef.current.style.transform = `translateX(-${index * 100}%)`;
    }
  }, []);

  // 다음 페이지로 이동
  const handleNext = useCallback(() => {
    goToPage(currentPage + 1);
  }, [currentPage, goToPage]);

  // 이전 페이지로 이동
  const handlePrev = useCallback(() => {
    goToPage(currentPage - 1);
  }, [currentPage, goToPage]);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const pages: React.ReactNode[] = [
    <OnboardingFirstPage onNext={handleNext} onPrev={handlePrev} />,
    <OnboardingSecondPage onNext={handleNext} onPrev={handlePrev} />,
    <OnboardingThirdPage onNext={handleNext} onPrev={handlePrev} />,
    <OnboardingFourthPage onNext={handleNext} onPrev={handlePrev} />,
    <OnboardingFifthPage onNext={handleNext} onPrev={handlePrev} />,
    <OnboardingSixthPage onNext={handleNext} onPrev={handlePrev} />,
    <OnboardingSeventhPage onNext={handleNext} onPrev={handlePrev} />,
    <OnboardingEighthPage onNext={handleNext} onPrev={handlePrev} />,
    <OnboardingNinthPage onNext={handleNext} onPrev={handlePrev} />,
    <OnboardingTenthPage onNext={handleNext} onPrev={handlePrev} />,
    <OnboardingEleventhPage onNext={handleNext} onPrev={handlePrev} />,
  ];

  return (
    <div className={styles.wrapper}>
      <div
        className={styles.sliderWrapper}
        ref={wrapperRef}
        style={{ transform: `translateX(-${currentPage * 100}%)` }}
      >
        {pages.map((page, index) => (
          <div key={index} className={styles.slide}>
            {page}
          </div>
        ))}
      </div>
    </div>
  );
});

Onboarding.displayName = "Onboarding";
export default Onboarding;
