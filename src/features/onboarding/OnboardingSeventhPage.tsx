"use client";
import { memo } from "react";
import styles from "./Onboarding.module.scss";
import { OnboardingProps } from "./Onboarding";
import cn from "classnames";
import Image from "next/image";
import { Spacer } from "@/shared/components/layout";
import AnimatedChevron from "./AnimatedChevron";
import OnboardingNav from "./OnboardingNav";
import { Text } from "@/shared/components/texts";
import { Colors } from "@/shared/consts/colors";

const OnboardingSeventhPage = memo(({ onNext, onPrev }: OnboardingProps) => {
  return (
    <div className={cn(styles.container)}>
      <div className={styles.bgContainer}>
        <Image
          src={`/images/onboarding/seventh-bg.png`}
          alt="예시 메인 페이지"
          fill
          objectFit="contain"
        />
      </div>

      <OnboardingNav
        onNext={onNext}
        onPrev={onPrev}
        gap="68"
        content={
          <Text
            color={Colors.white}
            fontWeight="bold"
            fontSize="lg"
            text={`일정을 등록하고\n공유해보세요!`}
          />
        }
      />
      <Spacer height="18" />
      <AnimatedChevron />
      <Spacer height="200" />
    </div>
  );
});

OnboardingSeventhPage.displayName = "OnboardingSeventhPage";
export default OnboardingSeventhPage;
