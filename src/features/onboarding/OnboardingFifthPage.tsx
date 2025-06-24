"use client";
import { memo } from "react";
import styles from "./Onboarding.module.scss";
import { OnboardingProps } from "./Onboarding";
import Image from "next/image";
import { InnerBox, Spacer } from "@/shared/components/layout";
import AnimatedChevron from "./AnimatedChevron";
import OnboardingNav from "./OnboardingNav";
import { Text } from "@/shared/components/texts";
import { Colors } from "@/shared/consts/colors";
import cn from "classnames";

const OnboardingFifthPage = memo(({ onNext, onPrev }: OnboardingProps) => {
  return (
    <div className={cn(styles.container)}>
      <div className={styles.bgContainer}>
        <Image
          src={`/images/onboarding/fifth-bg.png`}
          alt="예시 메인 페이지"
          fill
          objectFit="contain"
        />
      </div>
      <AnimatedChevron reverse />
      <Spacer height="13" />
      <OnboardingNav
        onNext={onNext}
        onPrev={onPrev}
        gap="37"
        content={
          <Text
            color={Colors.white}
            fontWeight="bold"
            fontSize="lg"
            text={`기념일 위젯을 생성해서\n나만의 기념일을 기록해요!`}
          />
        }
      />
      <Spacer height="38" />
      <div className={styles.fifthImage}>
        <Image
          src={`/images/onboarding/fifth.png`}
          alt="예시 기념일 목록"
          fill
        />
      </div>
    </div>
  );
});

OnboardingFifthPage.displayName = "OnboardingFifthPage";
export default OnboardingFifthPage;
