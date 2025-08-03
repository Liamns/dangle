"use client";
import { ArrowButton, Button } from "../../../shared/components/buttons";
import {
  Center,
  InnerBox,
  InnerWrapper,
  Spacer,
} from "../../../shared/components/layout";
import { BottomModal } from "../../../shared/components/modals";
import { Text } from "../../../shared/components/texts";
import { Colors } from "../../../shared/consts/colors";
import Image from "next/image";
import { useEffect, useState } from "react";
import styles from "./page.module.scss";
import Dog from "@/shared/svgs/dog.svg";
import Cat from "@/shared/svgs/cat.svg";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import { EMPTY_PROFILE, useProfileStore } from "@/entities/profile/store";
import { useUserStore } from "@/entities/user/store";
import { COMMON_MESSAGE } from "@/shared/consts/messages";

export default function SelectSpecies() {
  const router = useRouter();
  const updateRegisteringProfile = useProfileStore(
    (state) => state.updateRegisteringProfile
  );
  const currentProfile = useProfileStore((state) => state.registeringProfile);
  const currentUser = useUserStore((state) => state.currentUser);
  const hasHydrated = useUserStore((state) => state._hasHydrated);
  const searchParams = useSearchParams();
  const isPlus = searchParams.get("isPlus") === "true";

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

  useEffect(() => {
    if (hasHydrated) {
      if (!currentUser || !currentUser.id) {
        alert(COMMON_MESSAGE.WRONG_ACCESS);
        router.replace("/login");
        return;
      } else {
        updateRegisteringProfile({
          userId: currentUser.id,
        });
        if (currentProfile.petSpec) {
          setSpecies(currentProfile.petSpec);
        }
      }
    }
  }, [currentUser, hasHydrated]);

  // 개선된 애니메이션 variants 정의
  const variants = {
    // 왼쪽에서 들어오는 애니메이션
    enterFromLeft: {
      x: "-100%",
      opacity: 1,
      transition: {
        x: { type: "spring", stiffness: 300, damping: 30 },
      },
    },
    // 오른쪽에서 들어오는 애니메이션
    enterFromRight: {
      x: "100%",
      opacity: 1,
      transition: {
        x: { type: "spring", stiffness: 300, damping: 30 },
      },
    },
    // 화면 중앙에 있는 상태
    center: {
      x: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
      },
    },
    // 왼쪽으로 나가는 애니메이션
    exitToLeft: {
      x: "-100%",
      opacity: 1,
      transition: {
        x: { type: "spring", stiffness: 300, damping: 30 },
      },
    },
    // 오른쪽으로 나가는 애니메이션
    exitToRight: {
      x: "100%",
      opacity: 1,
      transition: {
        x: { type: "spring", stiffness: 300, damping: 30 },
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

      <InnerBox direction="row" px="30">
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
          <AnimatePresence initial={false} custom={direction} mode="popLayout">
            <motion.div
              key={species}
              className={styles.animalCard}
              custom={direction}
              initial={
                direction === "right" ? "enterFromRight" : "enterFromLeft"
              }
              animate="center"
              exit={direction === "right" ? "exitToLeft" : "exitToRight"}
              variants={variants}
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
          onClick={() => {
            updateRegisteringProfile({ ...EMPTY_PROFILE, tags: undefined });
            updateRegisteringProfile({ petSpec: species });
            router.push(`/profile/input/${isPlus ? "pet-name" : "username"}`);
          }}
        >
          프로필카드 만들기 시작
        </Button>
      </BottomModal>
    </InnerWrapper>
  );
}
