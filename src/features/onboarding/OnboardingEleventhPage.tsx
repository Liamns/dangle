"use client";
import { memo } from "react";
import styles from "./Onboarding.module.scss";
import { OnboardingProps } from "./Onboarding";
import OnboardingNav from "./OnboardingNav";
import { Text } from "@/shared/components/texts";
import { Colors } from "@/shared/consts/colors";
import { Spacer } from "@/shared/components/layout";
import AnimatedChevron from "./AnimatedChevron";
import Image from "next/image";

const OnboardingEleventhPage = memo(({ onNext, onPrev }: OnboardingProps) => {
  return (
    <div className={styles.container}>
      <OnboardingNav
        onNext={onNext}
        onPrev={onPrev}
        gap="17"
        content={
          <Text
            color={Colors.white}
            fontWeight="bold"
            fontSize="lg"
            text={`내가 즐겨찾기한\n일정과 루틴을 바로 공유해보세요!`}
          />
        }
      />

      <Spacer height="14" />
      <AnimatedChevron />
      <Spacer height="14" />

      <div className={styles.eleventhImage}>
        <Image
          src={`/images/onboarding/eleventh.png`}
          alt="예시 즐겨찾기 이미지"
          fill
        />
      </div>
    </div>
  );
});

OnboardingEleventhPage.displayName = "OnboardingEleventhPage";
export default OnboardingEleventhPage;
