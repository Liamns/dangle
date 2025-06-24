"use client";
import { memo } from "react";
import styles from "./Onboarding.module.scss";
import { OnboardingProps } from "./Onboarding";
import cn from "classnames";
import Image from "next/image";
import AnimatedChevron from "./AnimatedChevron";
import { Spacer } from "@/shared/components/layout";
import OnboardingNav from "./OnboardingNav";
import { Text } from "@/shared/components/texts";
import { Colors } from "@/shared/consts/colors";

const OnboardingSixthPage = memo(({ onNext, onPrev }: OnboardingProps) => {
  return (
    <div className={cn(styles.container)}>
      <div className={styles.bgContainer}>
        <Image
          src={`/images/onboarding/sixth-bg.png`}
          alt="예시 메인 페이지"
          fill
          objectFit="contain"
        />
      </div>

      <Spacer height="90" />
      <AnimatedChevron reverse />
      <Spacer height="26" />
      <OnboardingNav
        onNext={onNext}
        onPrev={onPrev}
        gap="59"
        content={
          <Text
            color={Colors.white}
            fontWeight="bold"
            fontSize="lg"
            text={`'프로필 카드'\n확인하고 수정해요!`}
          />
        }
      />
    </div>
  );
});

OnboardingSixthPage.displayName = "OnboardingSixthPage";
export default OnboardingSixthPage;
