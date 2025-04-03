"use client";
import { ArrowButton, Button } from "@/shared/components/buttons";
import {
  Center,
  InnerBox,
  InnerWrapper,
  Spacer,
} from "@/shared/components/layout";
import { BottomModal } from "@/shared/components/modals";
import { Text } from "@/shared/components/texts";
import { Colors } from "@/shared/consts/colors";
import Image from "next/image";
import { useState } from "react";
import styles from "./page.module.scss";
import Dog from "@/shared/svgs/dog.svg";
import Cat from "@/shared/svgs/cat.svg";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function SelectSpecies() {
  const router = useRouter();
  const totalSpecies = 2;
  const [species, setSpecies] = useState<number>(0);
  const [direction, setDirection] = useState<"left" | "right">("right");
  const [isAnimating, setIsAnimating] = useState(false);

  const clickPrev = () => {
    if (isAnimating) return;

    setDirection("left");
    setIsAnimating(true);

    setTimeout(() => {
      setSpecies((prev) => (prev - 1 + totalSpecies) % totalSpecies);
      setIsAnimating(false);
    }, 300);
  };

  const clickNext = () => {
    if (isAnimating) return;

    setDirection("right");
    setIsAnimating(true);

    setTimeout(() => {
      setSpecies((prev) => (prev + 1) % totalSpecies);
      setIsAnimating(false);
    }, 300);
  };

  // 애니메이션 variants 정의
  const variants = {
    // 왼쪽에서 들어오는 애니메이션
    enterFromLeft: {
      x: "-100%",
      opacity: 0.5,
    },
    // 오른쪽에서 들어오는 애니메이션
    enterFromRight: {
      x: "100%",
      opacity: 0.5,
    },
    // 화면 중앙에 있는 상태
    center: {
      x: 0,
      opacity: 1,
      zIndex: 2,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
        delay: 0,
      },
    },
    // 왼쪽으로 나가는 애니메이션
    exitToLeft: {
      x: "-100%",
      opacity: 0.5,
      zIndex: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
        delay: 0.05,
      },
    },
    // 오른쪽으로 나가는 애니메이션
    exitToRight: {
      x: "100%",
      opacity: 0.5,
      zIndex: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
        delay: 0.05,
      },
    },
  };

  return (
    <InnerWrapper>
      <Spacer height="48" />

      <Center>
        <Image
          src="/images/register/select-sp/icon.png"
          width={40}
          height={40}
          alt="동물선택 페이지 아이콘"
        />
      </Center>
      <InnerBox>
        <Text
          text="나만의"
          fontSize="lg"
          fontWeight="bold"
          color={Colors.brown}
        />
        <Text
          text="댕글"
          fontSize="logo"
          fontWeight="bold"
          fontFamily="jalnan"
          color={Colors.brown}
        />
      </InnerBox>

      <Spacer height="36" />

      <InnerBox direction="row" px="30" style={{ flex: 1 }}>
        <ArrowButton ml="0" onClick={clickPrev}>
          <Image
            src="/images/white-bracket.png"
            alt="이전으로"
            width={5}
            height={8}
            style={{ objectFit: "cover" }}
            sizes="100%"
          />
        </ArrowButton>

        <Spacer width="12" />

        <div className={styles.slideContainer}>
          <AnimatePresence initial={false}>
            <motion.div
              key={species}
              className={styles.animalCard}
              initial={
                direction === "right" ? "enterFromRight" : "enterFromLeft"
              }
              animate="center"
              exit={direction === "right" ? "exitToLeft" : "exitToRight"}
              variants={variants}
              style={{
                position: "absolute",
                width: "100%",
                height: "100%",
              }}
            >
              <div className={styles.animalCardTitle}>
                <Text
                  text={`${species === 0 ? "댕댕이" : "야옹이"} 프로필`}
                  fontSize="lg"
                  fontWeight="bold"
                  color={Colors.brown}
                />
                <Spacer width="6" />
                {species === 0 ? (
                  <Dog style={{ color: Colors.brown }} />
                ) : (
                  <Cat style={{ color: Colors.brown }} />
                )}
              </div>
              <div className={styles.animalCardBody}>
                <Image
                  src={`/images/register/select-sp/${
                    species === 0 ? "dog" : "cat"
                  }.png`}
                  alt={`${species === 0 ? "댕댕이" : "야옹이"}`}
                  style={{ objectFit: "contain" }}
                  fill
                  sizes="100%"
                  unoptimized
                />
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <Spacer width="12" />

        <ArrowButton ml="0" onClick={clickNext}>
          <Image
            src="/images/white-bracket.png"
            alt="다음으로"
            width={5}
            height={8}
            style={{ objectFit: "cover", transform: "rotate(180deg)" }}
            sizes="100%"
          />
        </ArrowButton>
      </InnerBox>

      <BottomModal>
        <InnerBox>
          <InnerBox direction="row" justify="center">
            <div className={styles.iconText}>
              <Dog
                style={{ color: species === 0 ? Colors.brown : Colors.primary }}
              />
              <Text
                text={`\u00a0강아지`}
                fontSize="md"
                color={species === 0 ? Colors.brown : Colors.primary}
              />
            </div>
            <Spacer width="10" />
            <div className={styles.iconText}>
              <Cat
                style={{ color: species === 1 ? Colors.brown : Colors.primary }}
              />
              <Text
                text={`\u00a0고양이`}
                fontSize="md"
                color={species === 1 ? Colors.brown : Colors.primary}
              />
            </div>
          </InnerBox>

          <Spacer height="8" />

          <InnerBox direction="row">
            <Text text="원하시는 카드를" fontSize="lg" fontWeight="bold" />
            <Text
              text={`\u00a0선택해 주세요!`}
              fontSize="lg"
              fontWeight="normal"
            />
          </InnerBox>
        </InnerBox>

        <Spacer height="12" />

        <Button
          color={Colors.brown}
          fontWeight="bold"
          onClick={() => router.push("/profile/input/username")}
        >
          프로필카드 만들기 시작
        </Button>
      </BottomModal>
    </InnerWrapper>
  );
}
