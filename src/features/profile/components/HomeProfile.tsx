"use client";
import Image from "next/image";
import Link from "next/link";
import styles from "./HomeProfile.module.scss";
import { useProfileStore } from "@/entities/profile/store";
import { InnerBox, Spacer } from "@/shared/components/layout";
import { ArrowButton } from "@/shared/components/buttons";
import { Colors } from "@/shared/consts/colors";
import { Text } from "@/shared/components/texts";
import Male from "@/shared/svgs/male.svg";
import Female from "@/shared/svgs/female.svg";
import { PetGenderFormData, PetSpecFormData } from "@/entities/profile/schema";
import { useEffect, useState } from "react";
import AddProfileModal from "./AddProfileModal";
import { useUserStore } from "@/entities/user/store";
import { useProfile } from "../hooks/useProfiles";
import LoadingOverlay from "@/shared/components/LoadingOverlay";
import { useRouter } from "next/navigation";
import { PROFILE_ERROR_MESSAGE } from "../consts";
import { COMMON_MESSAGE } from "@/shared/consts/messages";

export default function HomeProfile() {
  const router = useRouter();
  const { profiles, isProcessing, fetchError, revalidateProfile } =
    useProfile();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const currentProfile = useProfileStore((state) => state.currentProfile);

  useEffect(() => {
    // Only trigger when fetch is done and profiles are defined
    if (!isProcessing && profiles !== undefined && profiles.length === 0) {
      alert(PROFILE_ERROR_MESSAGE.EMPTY_PROFILE);
      router.replace("/profile/select-sp");
    }
  }, [isProcessing, profiles, router]);

  if (fetchError) {
    console.error(`HomeProfile 로딩 에러 : ${fetchError}`);
  }

  const hasMultipleProfiles = profiles !== undefined && profiles.length > 1;
  const species: PetSpecFormData = currentProfile?.petSpec ?? 0;
  const gender: PetGenderFormData["gender"] =
    currentProfile?.petGender?.gender ?? null;
  const name = currentProfile?.petname ?? "댕댕이";

  return (
    <>
      {isProcessing && <LoadingOverlay isLoading />}
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
                  alert("다중 프로필 기능 개발 예정");
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
                  alert("다중 프로필 기능 개발 예정");
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
