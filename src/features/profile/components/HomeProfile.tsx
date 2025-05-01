import Image from "next/image";
import styles from "./HomeProfile.module.scss";
import { useProfileStore } from "@/entities/profile/store";
import { InnerBox, Spacer } from "@/shared/components/layout";
import { ArrowButton } from "@/shared/components/buttons";
import { Colors } from "@/shared/consts/colors";
import { Text } from "@/shared/components/texts";
import Male from "@/shared/svgs/male.svg";
import Female from "@/shared/svgs/female.svg";
import { PetGenderFormData, PetSpecFormData } from "@/entities/profile/schema";

export default function HomeProfile() {
  const currentProfile = useProfileStore((state) => state.currentProfile);
  const species: PetSpecFormData = currentProfile?.petSpec ?? null;
  const gender: PetGenderFormData["gender"] =
    currentProfile?.petGender?.gender ?? null;

  return (
    <div className={styles.container}>
      {/* 프로필 이미지 */}
      <Image
        src={`/images/register/select-sp/${species === 0 ? "dog" : "cat"}.png`}
        fill
        alt="반려동물 프로필 이미지"
      />

      {/* 넘김 버튼 */}
      <div className={styles.arrowContainer}>
        <InnerBox direction="row" justify="space-between">
          <div
            className={styles.arrowBox}
            onClick={() => {
              alert("개발 예정");
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
              alert("개발 예정");
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
        <InnerBox direction="row" justify="end" align="center">
          <Text
            text="댕글이랑딩그이랑"
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
        <div
          className={styles.editButton}
          onClick={() => {
            alert("프로필 수정 기능추가");
          }}
        >
          <Text text="프로필 수정" color={Colors.brown} fontWeight="bold" />
        </div>
      </div>
    </div>
  );
}
