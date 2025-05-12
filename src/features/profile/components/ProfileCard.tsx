"use client";
import { Card, Center, InnerBox, Spacer } from "@/shared/components/layout";
import { Text } from "@/shared/components/texts";
import { Colors } from "@/shared/consts/colors";
import Image from "next/image";
import { motion } from "framer-motion";
import styles from "./ProfileCard.module.scss";
import Dog from "@/shared/svgs/dog.svg";
import Cat from "@/shared/svgs/cat.svg";
import { useProfileStore } from "@/entities/profile/store";
import {
  determinePersonalityType,
  ProfileModel,
} from "@/entities/profile/model";
import { getPublicImageUrl } from "@/shared/lib/supabase";
import { personalityTypeMap, petType } from "@/shared/types/pet";
import { useRouter } from "next/navigation";
import Male from "@/shared/svgs/male.svg";
import Female from "@/shared/svgs/female.svg";
import { useEffect } from "react";

interface ProfileCardProps {
  isFlipped: boolean;
  onFlip: (isFlipped: boolean) => void;
}

export default function ProfileCard({ isFlipped, onFlip }: ProfileCardProps) {
  const router = useRouter();

  const currentProfile = useProfileStore(
    (state) => state.currentProfile
  ) as ProfileModel | null;

  const personalityType = currentProfile?.personalityScores
    ? "Example Type"
    : null; // Replace with actual logic
  const personalityImageUrl = null; // Replace with actual logic
  const radarChartData = null; // Replace with actual logic
  const activeVaccinations = Object.keys(
    currentProfile?.vaccinations || {}
  ).filter(
    (key) =>
      currentProfile?.vaccinations[
        key as keyof typeof currentProfile.vaccinations
      ]
  );
  const petName = currentProfile?.petname;
  const petAge = currentProfile?.petAge;
  const petWeight = currentProfile?.petWeight;
  const petGender = currentProfile?.petGender;
  const petSpec = currentProfile?.petSpec;
  const personality = determinePersonalityType(currentProfile);

  useEffect(() => {
    if (
      !petName ||
      !petAge ||
      !petWeight ||
      petSpec === null ||
      petSpec === undefined ||
      !petGender ||
      personality === null ||
      activeVaccinations.length === 0
    ) {
      if (typeof window !== "undefined") {
        alert("프로필 정보가 부족합니다. 모든 정보를 입력해주세요.");
      }
      router.replace("/home");
    }
  }, [
    petName,
    petAge,
    petWeight,
    petSpec,
    petGender,
    personality,
    activeVaccinations,
    router,
  ]);

  // 프로필이 없으면 빈 상태 표시
  if (!currentProfile) {
    return (
      <Card>
        <InnerBox
          justify="center"
          align="center"
          style={{ minHeight: "200px" }}
        >
          <Text text="프로필 정보가 없습니다" color={Colors.grey} />
        </InnerBox>
      </Card>
    );
  }

  // 카드 뒤집기 함수
  const handleFlip = () => {
    onFlip(!isFlipped);
  };

  // 카드 뒤집기 애니메이션을 위한 variants
  const flipCardVariants = {
    front: {
      rotateY: 0,
      transition: { duration: 0.8, ease: "easeInOut" },
    },
    back: {
      rotateY: 180,
      transition: { duration: 0.8, ease: "easeInOut" },
    },
  };

  const tag = personality ? personalityTypeMap[personality]?.tag : "default";
  const url =
    petSpec !== null && petSpec !== undefined
      ? getPublicImageUrl(`profile/personality/${petType[petSpec]}/${tag}.gif`)
      : getPublicImageUrl("profile/personality/default.gif");

  return (
    <div className={styles.cardFlipContainer}>
      <motion.div
        animate={isFlipped ? "back" : "front"}
        variants={flipCardVariants}
        className={styles.flipCard}
        onClick={handleFlip}
      >
        {/* 앞면 카드 */}
        <div className={`${styles.cardFace} ${styles.cardFront}`}>
          <Card>
            {/* 프로필 이미지 */}
            <div className={styles.gifContainer}>
              <Image src={url} alt="반려동물 성격별 이미지" fill />
            </div>
            <Spacer height="20" />

            {/* 이름 및 성별 */}
            <InnerBox direction="row">
              <div className={styles.nameContainer}>
                <Text
                  text={petName || "이름 없음"}
                  color={Colors.brown}
                  fontWeight="bold"
                  fontSize="lg"
                />
                <Spacer width="6" />
                {petGender ? (
                  <Male color={Colors.male} width={16} height={16} />
                ) : (
                  <Female color={Colors.female} width={16} height={16} />
                )}
              </div>
              <div className={styles.editButton}>
                <Text
                  text="입력하기"
                  color={Colors.brown}
                  fontSize="tiny"
                  fontWeight="bold"
                />
              </div>
            </InnerBox>

            {/* 나이 */}
          </Card>
        </div>

        {/* 뒷면 카드 */}
        <div className={`${styles.cardFace} ${styles.cardBack}`}>
          <Card>
            <InnerBox>
              <InnerBox direction="row">
                <Text
                  text={`${petSpec === 0 ? "댕댕이" : "야옹이"} 프로필`}
                  color={Colors.brown}
                  fontWeight="bold"
                  fontSize="title"
                />
                <Spacer width="6" />
                {petSpec === 0 ? (
                  <Dog style={{ color: Colors.brown }} />
                ) : (
                  <Cat style={{ color: Colors.brown }} />
                )}
              </InnerBox>

              <Spacer height="20" />

              {/* 반려동물 기본 정보 */}
              <InnerBox direction="column" align="start">
                <Text text="기본 정보" fontWeight="bold" color={Colors.brown} />
                <Spacer height="10" />
                <Text text={`이름: ${petName}`} />
                <Text
                  text={`나이: ${petAge?.age}살 ${
                    petAge?.isMonth ? "(개월)" : "(년)"
                  }`}
                />
                <Text text={`체중: ${petWeight}kg`} />
                <Text text={`성별: ${petGender?.gender ? "남아" : "여아"}`} />
                <Text text={`중성화: ${petGender?.isNeutered ? "O" : "X"}`} />
              </InnerBox>

              <Spacer height="20" />

              {/* 예방접종 정보 */}
              <InnerBox direction="column" align="start">
                <Text text="예방접종" fontWeight="bold" color={Colors.brown} />
                <Spacer height="10" />
                {activeVaccinations.map((vaccine) => (
                  <Text key={vaccine} text={vaccine} />
                ))}
              </InnerBox>
            </InnerBox>
          </Card>
        </div>
      </motion.div>
    </div>
  );
}
