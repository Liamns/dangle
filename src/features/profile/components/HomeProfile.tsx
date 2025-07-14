"use client";
import Image from "next/image";
import Link from "next/link";
import styles from "./HomeProfile.module.scss";
import { useProfileStore } from "@/entities/profile/store";
import { InnerBox } from "@/shared/components/layout";
import { Colors } from "@/shared/consts/colors";
import { Text } from "@/shared/components/texts";
import Male from "@/shared/svgs/male.svg";
import Female from "@/shared/svgs/female.svg";
import { PetGenderFormData, PetSpecFormData } from "@/entities/profile/schema";
import { useEffect, useState } from "react";
import AddProfileModal from "./AddProfileModal";
import { useProfile } from "../hooks/useProfiles";
import LoadingOverlay from "@/shared/components/LoadingOverlay";
import { useRouter } from "next/navigation";
import { PROFILE_ERROR_MESSAGE } from "../consts";
import { COMMON_MESSAGE } from "@/shared/consts/messages";
import { ProfileModel } from "@/entities/profile/model";

export default function HomeProfile() {
  const router = useRouter();
  const { isProcessing, fetchError } = useProfile();

  // 모든 데이터를 Zustand 스토어에서 가져옵니다.
  const {
    profiles,
    currentProfile,
    setCurrentProfile,
    _hasHydrated: hasHydrated,
  } = useProfileStore();

  // ====================================================================

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  useEffect(() => {
    // 데이터 로딩이 끝났고, 수화가 완료되었을 때 프로필이 없으면 페이지 이동
    if (!isProcessing && hasHydrated && profiles.length === 0) {
      alert(PROFILE_ERROR_MESSAGE.EMPTY_PROFILE);
      router.replace("/profile/select-sp");
    }
  }, [isProcessing, hasHydrated, profiles, router]);

  if (fetchError) {
    console.error(`HomeProfile 로딩 에러 : ${fetchError}`);
    // 필요하다면 에러 UI를 여기에 표시할 수 있습니다.
  }

  const hasMultipleProfiles = profiles.length > 1;

  const handleClickArrow = (isPrev: boolean) => {
    // 이제 profiles와 currentProfile 모두 같은 소스(Zustand)에서 오므로 안전합니다.
    if (!currentProfile) {
      alert(COMMON_MESSAGE.WRONG_ACCESS);
      return;
    }
    try {
      const currentIndex = profiles.findIndex(
        (item) => item.id === currentProfile.id
      );

      if (isPrev) {
        const nextIndex =
          currentIndex === 0 ? profiles.length - 1 : currentIndex - 1;
        setCurrentProfile(profiles[nextIndex]);
      } else {
        const nextIndex =
          currentIndex === profiles.length - 1 ? 0 : currentIndex + 1;
        setCurrentProfile(profiles[nextIndex]);
      }
    } catch (e: any) {
      console.error(e);
    }
  };

  const species: PetSpecFormData = currentProfile?.petSpec ?? 0;
  const gender: PetGenderFormData["gender"] =
    currentProfile?.petGender?.gender ?? null;
  const name = currentProfile?.petname ?? "댕댕이";

  return (
    <>
      {(isProcessing || !hasHydrated) && <LoadingOverlay isLoading />}
      <div className={styles.container}>
        {/* 프로필 이미지 */}
        <Image
          src={`/images/register/select-sp/${
            species === 0 ? "dog" : "cat"
          }.png`}
          fill
          alt="반려동물 프로필 이미지"
        />

        {/* 넘김 버튼 */}
        <div className={styles.arrowContainer}>
          <InnerBox direction="row" justify="space-between">
            <div
              className={styles.arrowBox}
              onClick={() => {
                if (hasMultipleProfiles) {
                  handleClickArrow(true);
                } else {
                  setIsAddModalOpen(true);
                }
              }}
            >
              <Image
                src="/images/primary-bracket.png"
                alt="이전으로"
                width={7}
                height={12}
                style={{ objectFit: "cover" }}
                sizes="100%"
              />
            </div>
            <div
              className={styles.arrowBox}
              onClick={() => {
                if (hasMultipleProfiles) {
                  handleClickArrow(false);
                } else {
                  setIsAddModalOpen(true);
                }
              }}
            >
              <Image
                src="/images/primary-bracket.png"
                alt="다음으로"
                width={7}
                height={12}
                style={{ objectFit: "cover", transform: "rotate(180deg)" }}
                sizes="100%"
              />
            </div>
          </InnerBox>
        </div>

        {/* 프로필 라벨 */}
        <div className={styles.labelContainer}>
          <InnerBox direction="row" justify="center" align="center">
            <Text
              text={name}
              color={Colors.brown}
              fontSize="lg"
              fontWeight="bold"
            />
            {gender ? (
              <Male
                color={Colors.male}
                width={16}
                height={16}
                style={{ marginLeft: "6px" }}
              />
            ) : (
              <Female color={Colors.female} width={16} height={16} />
            )}
          </InnerBox>
          <Link href="/profile" className={styles.editButton}>
            <Text text="프로필 수정" color={Colors.brown} fontWeight="bold" />
          </Link>
        </div>
      </div>
      <AddProfileModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
    </>
  );
}
