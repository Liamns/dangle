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
import { useProfile } from "@/features/profile/hooks/useProfiles";
import LoadingOverlay from "@/shared/components/LoadingOverlay";

export default function CompleteInputProfile() {
  const router = useRouter();
  const [front, setFront] = useState(true);
  const [resetRadar, setResetRadar] = useState(false);
  const registeringProfile = useProfileStore((s) => s.registeringProfile);
  const updateCurrentProfile = useProfileStore((s) => s.updateCurrentProfile);
  const name = useProfileStore(
    (state) => state.registeringProfile?.petname ?? ""
  );
  const {
    registerProfile,
    isProcessing,
    registerError,
    profiles,
    revalidateProfile,
  } = useProfile();

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

  const handleSubmit = async () => {
    const { tags, ...core } = registeringProfile;
    await registerProfile({ profileData: core });
    await revalidateProfile();

    if (profiles !== undefined) {
      console.log(profiles[profiles.length - 1]);
      updateCurrentProfile(profiles[profiles.length - 1]);
      router.replace("/home");
    }
  };

  return (
    <>
      {isProcessing && <LoadingOverlay isLoading />}
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
                handleSubmit();
              }
            }}
          >
            {front ? "다음" : "댕글 시작하기"}
          </Button>
        </BottomModal>
      </InnerWrapper>
    </>
  );
}
