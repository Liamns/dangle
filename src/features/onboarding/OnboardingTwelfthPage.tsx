"use client";
import { memo } from "react";
import styles from "./Onboarding.module.scss";
import { OnboardingProps } from "./Onboarding";
import OnboardingNav from "./OnboardingNav";
import { Text } from "@/shared/components/texts";
import { Colors } from "@/shared/consts/colors";
import { Card, Spacer } from "@/shared/components/layout";
import AnimatedChevron from "./AnimatedChevron";
import Image from "next/image";

const OnboardingTwelfthPage = memo(
  ({ onNext, onPrev, onFinal }: OnboardingProps) => {
    return (
      <div className={styles.container}>
        {/* <OnboardingNav
          onNext={onFinal ? onFinal : onNext}
          onPrev={onPrev}
          gap="58"
          content={
            <Text
              color={Colors.white}
              fontWeight="bold"
              fontSize="lg"
              text={`슬기로운 반려생활을\n시작해 볼까요?`}
            />
          }
        /> */}
        <Text
          color={Colors.white}
          fontWeight="bold"
          fontSize="lg"
          text={`슬기로운 반려생활을\n시작해 볼까요?`}
        />

        <Spacer height="15" />
        <AnimatedChevron />
        <Spacer height="15" />

        <Card
          width="280"
          height="446"
          px="22"
          py="22"
          justify="center"
          align="center"
        >
          <Text
            text="편리한 반려생활을 위한"
            color={Colors.brown}
            fontWeight="bold"
            fontSize="md"
          />
          <Spacer height="32" />
          <div className={styles.twelfthImage}>
            <Image
              src="/images/onboarding/twelfth.png"
              alt="반려생활 시작하기"
              fill
              priority
            />
          </div>
          <Spacer height="16" />
          <Text
            text="댕글"
            fontFamily="jalnan"
            fontSize="logo"
            color={Colors.brown}
          />
          <Spacer height="23" />
          <div
            className={styles.startButton}
            onClick={onFinal ? onFinal : onNext}
          >
            <Text text="시작하기" color={Colors.brown} fontWeight="bold" />
          </div>
        </Card>
      </div>
    );
  }
);

OnboardingTwelfthPage.displayName = "OnboardingTwelfthPage";
export default OnboardingTwelfthPage;
