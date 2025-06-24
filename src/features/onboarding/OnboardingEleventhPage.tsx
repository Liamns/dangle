"use client";
import { memo } from "react";
import styles from "./Onboarding.module.scss";
import { OnboardingProps } from "./Onboarding";

const OnboardingEleventhPage = memo(({ onNext, onPrev }: OnboardingProps) => {
  return <div className={styles.container}></div>;
});

OnboardingEleventhPage.displayName = "OnboardingEleventhPage";
export default OnboardingEleventhPage;
