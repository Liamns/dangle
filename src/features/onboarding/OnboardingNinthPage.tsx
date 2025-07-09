"use client";
import { memo } from "react";
import styles from "./Onboarding.module.scss";
import { OnboardingProps } from "./Onboarding";
import OnboardingNav from "./OnboardingNav";
import { Text } from "@/shared/components/texts";
import { Colors } from "@/shared/consts/colors";
import Image from "next/image";
import AnimatedChevron from "./AnimatedChevron";
import { Spacer } from "@/shared/components/layout";

const OnboardingNinthPage = memo(({ onNext, onPrev }: OnboardingProps) => {
  return (
    <div className={styles.container}>
      <OnboardingNav
        onNext={onNext}
        onPrev={onPrev}
        gap="24"
        content={
          <Text
            color={Colors.white}
            fontWeight="bold"
            fontSize="lg"
            text={`카테고리별로 설정할 수 있어요!`}
          />
        }
      />

      <Spacer height="8" />
      <AnimatedChevron />
      <Spacer height="16" />

      <div className={styles.ninthImage}>
        <Image
          src={`/images/onboarding/ninth.png`}
          alt="예시 루틴 생성카드 이미지"
          fill
        />
      </div>
    </div>
  );
});

OnboardingNinthPage.displayName = "OnboardingNinthPage";
export default OnboardingNinthPage;
