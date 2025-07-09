"use client";
import { memo } from "react";
import styles from "./Onboarding.module.scss";
import { OnboardingProps } from "./Onboarding";
import cn from "classnames";
import Image from "next/image";
import OnboardingNav from "./OnboardingNav";
import { Text } from "@/shared/components/texts";
import { Colors } from "@/shared/consts/colors";
import { Spacer } from "@/shared/components/layout";
import AnimatedChevron from "./AnimatedChevron";

const OnboardingEighthPage = memo(({ onNext, onPrev }: OnboardingProps) => {
  return (
    <div className={cn(styles.container, styles.start)}>
      <div className={styles.bgContainer}>
        <Image
          src={`/images/onboarding/eighth-bg.png`}
          alt="예시 메인 페이지"
          fill
        />
      </div>

      <Spacer height="45" />
      <OnboardingNav
        onNext={onNext}
        onPrev={onPrev}
        gap="17"
        content={
          <Text
            color={Colors.white}
            fontWeight="bold"
            fontSize="lg"
            text={`나만의 루틴카드 생성이 가능해요!`}
          />
        }
      />
    </div>
  );
});

OnboardingEighthPage.displayName = "OnboardingEighthPage";
export default OnboardingEighthPage;
