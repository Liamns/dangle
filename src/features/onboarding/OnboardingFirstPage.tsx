"use client";
import { memo } from "react";
import styles from "./Onboarding.module.scss";
import { OnboardingProps } from "./Onboarding";
import { Center, InnerBox, Spacer } from "@/shared/components/layout";
import { Text } from "@/shared/components/texts";
import { Colors } from "@/shared/consts/colors";
import AnimatedChevron from "./AnimatedChevron";
import OnboardingNav from "./OnboardingNav";
import Image from "next/image";

const OnboardingFirstPage = memo(({ onNext, onPrev }: OnboardingProps) => {
  return (
    <div className={styles.container}>
      <Text
        text={`나의 반려동물\n프로필을 선택해 주세요!`}
        color={Colors.white}
        fontWeight="bold"
        fontSize="lg"
      />
      <Spacer height="22" />
      <AnimatedChevron />
      <Spacer height="53" />
      <OnboardingNav
        onNext={onNext}
        onPrev={onPrev}
        showPrev={false}
        content={
          <div className={styles.firstImage}>
            <Image
              src={`/images/onboarding/first.png`}
              alt="프로필 예시 이미지"
              fill
            />
          </div>
        }
      />
    </div>
  );
});

OnboardingFirstPage.displayName = "OnboardingFirstPage";
export default OnboardingFirstPage;
