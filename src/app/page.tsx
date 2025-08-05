"use client";
import Image from "next/image";
import styles from "./page.module.scss";
import { BottomModal } from "../shared/components/modals";
import { Button } from "../shared/components/buttons";
import { Colors } from "../shared/consts/colors";
import { InnerWrapper, Spacer } from "../shared/components/layout";
import Link from "next/link";
import { Text } from "../shared/components/texts";
import { useState } from "react";
import Onboarding from "@/features/onboarding/Onboarding";

export default function Home() {
  const [onboarding, setOnboarding] = useState<boolean>(false);
  return (
    <InnerWrapper>
      {onboarding ? (
        <Onboarding onComplete={() => setOnboarding(false)} />
      ) : (
        <>
          <div className={styles.titleImg}>
            <Image
              src="/images/onboarding/title.gif"
              alt="댕글온보딩타이틀"
              fill
              style={{ objectFit: "contain" }}
              unoptimized
              priority
            />
            <div className={styles.belowTitle}>
              <Image
                src="/images/onboarding/below-title.png"
                alt="댕글온보딩이미지"
                fill
                style={{ objectFit: "contain" }}
              />
            </div>
          </div>
          <div className={styles.welcome}>
            <Text
              text="댕글"
              fontSize="title"
              fontFamily="jalnan"
              fontWeight="bold"
              color={Colors.brown}
            />
            <span>에 오신걸 환영해요!</span>
          </div>
          <BottomModal justify="center" align="center">
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
              }}
            >
              <Link
                href="/login"
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <div className={styles.loginBtn}>
                  <Text
                    text="로그인 하기"
                    color={Colors.white}
                    fontWeight="bold"
                    fontSize="lg"
                  />
                </div>
              </Link>
              <Spacer height="20" />
              <div
                className={styles.onboardingBtn}
                onClick={() => setOnboarding(true)}
              >
                <Text
                  text="댕글"
                  color={Colors.brown}
                  fontFamily="jalnan"
                  fontWeight="bold"
                  fontSize="md"
                />
                <Text text={`\u00a0둘러보기`} fontWeight="bold" fontSize="lg" />
                <div className={styles.bracket}>
                  <Image
                    src="/images/bracket.png"
                    alt="둘러보기버튼"
                    fill
                    sizes="100%"
                    style={{ objectFit: "cover" }}
                  />
                </div>
              </div>
            </div>
          </BottomModal>
        </>
      )}
    </InnerWrapper>
  );
}
