"use client";
import { memo } from "react";
import styles from "./Onboarding.module.scss";
import { OnboardingProps } from "./Onboarding";

const OnboardingTenthPage = memo(({ onNext, onPrev }: OnboardingProps) => {
  return <div className={styles.container}></div>;
});

OnboardingTenthPage.displayName = "OnboardingTenthPage";
export default OnboardingTenthPage;
