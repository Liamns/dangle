"use client";
import { memo } from "react";
import styles from "./Onboarding.module.scss";
import { InnerBox, Spacer } from "@/shared/components/layout";
import ChevronSvg from "@/shared/svgs/chevron.svg";
import cn from "classnames";

interface OnboardingNavProps {
  onPrev: () => void; // 이전 페이지로 이동하는 함수
  onNext: () => void; // 다음 페이지로 이동하는 함수
  showPrev?: boolean; // 이전 버튼 표시 여부
  onFinal?: () => void; // 마지막 페이지에서 호출되는 함수
  content: React.ReactNode; // 현재 페이지의 콘텐츠
  gap?: string; // 버튼 사이의 간격 (기본값: "11px")
}

const OnboardingNav = memo(
  ({
    onPrev,
    onNext,
    showPrev = true,
    onFinal,
    content,
    gap = "11",
  }: OnboardingNavProps) => {
    return (
      <InnerBox direction="row">
        <div
          className={cn(styles.prevButton, { [styles.hideButton]: !showPrev })}
          onClick={showPrev ? onPrev : () => {}}
        >
          <ChevronSvg className={styles.innerChevron} />
        </div>
        <Spacer width={gap} />
        {content}
        <Spacer width={gap} />
        <div className={styles.nextButton} onClick={onFinal || onNext}>
          <ChevronSvg className={styles.innerChevron} />
        </div>
      </InnerBox>
    );
  }
);
OnboardingNav.displayName = "OnboardingNav";
export default OnboardingNav;
