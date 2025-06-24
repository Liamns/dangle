"use client";
import { memo } from "react";
import styles from "./Onboarding.module.scss";
import { OnboardingProps } from "./Onboarding";

const OnboardingNinthPage = memo(({ onNext, onPrev }: OnboardingProps) => {
  return <div className={styles.container}></div>;
});

OnboardingNinthPage.displayName = "OnboardingNinthPage";
export default OnboardingNinthPage;
