"use client";
import { Button } from "../../../shared/components/buttons";
import {
  InnerBox,
  InnerWrapper,
  Spacer,
} from "../../../shared/components/layout";
import { BottomModal } from "../../../shared/components/modals";
import { Text } from "../../../shared/components/texts";
import { Colors } from "../../../shared/consts/colors";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useProfileStore } from "@/entities/profile/store";
import { getPublicImageUrl } from "../../../shared/lib/supabase";
import {
  determinePersonalityType,
  transformPersonalityToRadarData,
} from "@/entities/profile/model";
import { personalityTypeMap, petType } from "../../../shared/types/pet";
import styles from "./page.module.scss";
import ProfileCompletionCard from "./components/ProfileCompletionCard";

export default function CompleteInputProfile() {
  const router = useRouter();
  const [front, setFront] = useState(true);
  const [resetRadar, setResetRadar] = useState(false);
  const registeringProfile = useProfileStore((s) => s.registeringProfile);
  const name = useProfileStore(
    (state) => state.registeringProfile?.petname ?? ""
  );
  const setCurrentProfile = useProfileStore((state) => state.setCurrentProfile);

  // Guard: ensure all registration steps completed, else redirect to the first missing step
  useEffect(() => {
    if (!registeringProfile) return router.replace("/profile/select-sp");
    if (registeringProfile.petSpec == null)
      return router.replace("/profile/select-sp");
    if (!registeringProfile.username)
      return router.replace("/profile/input/username");
    if (!registeringProfile.petname)
      return router.replace("/profile/input/pet-name");
    if (!registeringProfile.petAge)
      // petAge를 문자열로 체크
      return router.replace("/profile/input/pet-age");
    if (!registeringProfile.petWeight)
      return router.replace("/profile/input/pet-weight");
    if (!registeringProfile.petGender)
      return router.replace("/profile/input/pet-gender");
    if (
      !registeringProfile.vaccinations ||
      Object.keys(registeringProfile.vaccinations).length === 0
    )
      return router.replace("/profile/input/pet-vaccines");
    if (determinePersonalityType(registeringProfile) === null)
      return router.replace("/profile/input/pet-personality");
  }, [registeringProfile, router]);

  // Restart radar chart animation when flipping to the back side
  useEffect(() => {
    if (!front) {
      setResetRadar((prev) => !prev);
    }
  }, [front]);

  const petSpec = registeringProfile?.petSpec ?? 0;

  const personality = determinePersonalityType(registeringProfile);
  if (personality === null) {
    if (typeof window !== "undefined") {
      window.alert("성격 유형을 찾을 수 없습니다.");
    }
    router.push("/profile/input/pet-personality");
    return null;
  }

  const tag = personalityTypeMap[personality].tag;
  const url = getPublicImageUrl(
    `profile/personality/${petType[petSpec]}/${tag}.gif`
  );
  const data = transformPersonalityToRadarData(
    registeringProfile?.personalityScores
  );

  return (
    <InnerWrapper className={styles.scrollable}>
      <ProfileCompletionCard
        front={front}
        name={name}
        petSpec={petSpec}
        personality={personality}
        imageUrl={url}
        radarData={data}
        resetKey={resetRadar}
      />

      <Spacer height="24" />

      <BottomModal>
        <InnerBox>
          <Text text="기본 프로필 완성!" fontSize="lg" fontWeight="bold" />
          <Spacer height="6" />
          <Text text={`더 많은 정보를 등록하고 공유해보세요`} />
        </InnerBox>

        <Spacer height="22" />

        <Button
          color={Colors.brown}
          fontWeight="bold"
          onClick={() => {
            if (front) {
              setFront(false);
            } else {
              alert("서버에 프로필 등록");
              setCurrentProfile(registeringProfile);
              router.replace("/home");
            }
          }}
        >
          {front ? "다음" : "댕글 시작하기"}
        </Button>
      </BottomModal>
    </InnerWrapper>
  );
}
