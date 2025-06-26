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

const OnboardingTenthPage = memo(({ onNext, onPrev }: OnboardingProps) => {
  return (
    <div className={styles.container}>
      <OnboardingNav
        onNext={onNext}
        onPrev={onPrev}
        gap="38"
        content={
          <Text
            color={Colors.white}
            fontWeight="bold"
            fontSize="lg"
            text={`나만의 꿀팁, 주의사항을\n빠짐없이 공유할 수 있어요!`}
          />
        }
      />

      <Spacer height="8" />
      <AnimatedChevron />
      <Spacer height="12" />

      <div className={styles.tenthImage}>
        <Image
          src={`/images/onboarding/tenth.png`}
          alt="예시 루틴카드 이미지"
          fill
          objectFit="contain"
        />
      </div>
    </div>
  );
});

OnboardingTenthPage.displayName = "OnboardingTenthPage";
export default OnboardingTenthPage;
