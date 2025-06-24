"use client";
import { memo } from "react";
import styles from "./Onboarding.module.scss";
import { OnboardingProps } from "./Onboarding";
import { Text } from "@/shared/components/texts";
import { Colors } from "@/shared/consts/colors";
import { Spacer } from "@/shared/components/layout";
import AnimatedChevron from "./AnimatedChevron";
import OnboardingNav from "./OnboardingNav";
import Image from "next/image";

const OnboardingSecondPage = memo(({ onNext, onPrev }: OnboardingProps) => {
  return (
    <div className={styles.container}>
      <Text
        text={`선택한 내용에 따라\n반려동물 MBTI를 확인할 수 있어요`}
        color={Colors.white}
        fontWeight="bold"
        fontSize="lg"
      />
      <Spacer height="22" />
      <AnimatedChevron />
      <Spacer height="25" />
      <OnboardingNav
        onNext={onNext}
        onPrev={onPrev}
        content={
          <div className={styles.secondImage}>
            <Image
              src={`/images/onboarding/second.png`}
              alt="성격 예시 이미지"
              fill
            />
          </div>
        }
      />
    </div>
  );
});

OnboardingSecondPage.displayName = "OnboardingSecondPage";
export default OnboardingSecondPage;
