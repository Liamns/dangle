"use client";
import { Card, InnerBox, Spacer } from "@/shared/components/layout";
import { Text } from "@/shared/components/texts";
import { Colors } from "@/shared/consts/colors";
import { motion } from "framer-motion";
import styles from "./ProfileCard.module.scss";
import chkbox from "@/shared/styles/buttons.module.scss";
import {
  transformPersonalityToRadarData,
  ProfileModel,
} from "@/entities/profile/model";
import Male from "@/shared/svgs/male.svg";
import Female from "@/shared/svgs/female.svg";
import { determinePersonalityType } from "@/entities/profile/model";
import { getPublicImageUrl } from "@/shared/lib/supabase";
import {
  classifyCatSize,
  classifyDogSize,
  personalityTypeMap,
  petSizeTitles,
  petType,
} from "@/shared/types/pet";
import Image from "next/image";
import { calculateAgeFromDateString, getPetAgeLabel } from "@/shared/lib/date";
import RadarChartComponent from "@/app/profile/complete/components/RadarChartComponent";
import { useState } from "react";

interface ProfileViewerProps {
  profile: ProfileModel;
  isFlipped: boolean;
  onFlip: (next: boolean) => void;
}

export default function ProfileViewer({
  profile,
  isFlipped,
  onFlip,
}: ProfileViewerProps) {
  const [isVaccineSelectOpen, setIsVaccineSelectOpen] = useState(false);
  const data = transformPersonalityToRadarData(profile.personalityScores);
  const petName = profile.petname;
  const petAgeLabel = getPetAgeLabel(
    profile.petSpec === 0 ? "dog" : "cat",
    profile.petAge
  );
  const petAge = calculateAgeFromDateString(profile.petAge);
  const petWeight = profile.petWeight;
  const petGender = profile.petGender;
  const petSpec = profile.petSpec;
  const personality = determinePersonalityType(profile);
  const petTypeName = petSpec != null ? petType[petSpec] : undefined;
  const findWeightTitleFn = petSpec === 0 ? classifyDogSize : classifyCatSize;
  const weightTitle = petSizeTitles[findWeightTitleFn(petWeight)];

  const activeVaccinations = Object.entries(profile.vaccinations || {})
    .filter(([, v]) => v)
    .map(([key]) => key);

  const flipVariants = {
    front: { rotateY: 0, transition: { duration: 0.8, ease: "easeInOut" } },
    back: { rotateY: 180, transition: { duration: 0.8, ease: "easeInOut" } },
  };

  const tag = personality ? personalityTypeMap[personality]?.tag : "default";
  const url = petTypeName
    ? getPublicImageUrl(`profile/personality/${petTypeName}/${tag}.gif`)
    : getPublicImageUrl("profile/personality/default.gif");

  return (
    <div className={styles.cardFlipContainer}>
      <motion.div
        animate={isFlipped ? "back" : "front"}
        variants={flipVariants}
        className={styles.flipCard}
      >
        {/* 앞면 */}
        <div className={`${styles.cardFace} ${styles.cardFront}`}>
          <Card>
            <div className={styles.gifContainer}>
              <Image src={url} alt="성격 이미지" fill />
            </div>
            <Spacer height="20" />
            <InnerBox direction="row">
              <div className={styles.nameContainer}>
                <Text
                  text={petName || "이름 없음"}
                  color={Colors.brown}
                  fontWeight="bold"
                  fontSize="lg"
                />
                <Spacer width="6" />
                {petGender?.gender ? (
                  <Male color={Colors.male} width={16} height={16} />
                ) : (
                  <Female color={Colors.female} width={16} height={16} />
                )}
              </div>
            </InnerBox>
            <Spacer height="14" />
            <InnerBox px="20" align="start">
              {/* 나이 */}
              <div className={styles.infoBox}>
                <Text text="Age Title" fontWeight="bold" color={Colors.brown} />
                <div className={styles.infoContainer}>
                  <div className={styles.ageTitle}>
                    <Text
                      text={`${petAge} 살`}
                      color={Colors.white}
                      fontWeight="bold"
                    />
                  </div>
                  <div className={styles.ageContent}>
                    <Text
                      text={petAgeLabel}
                      fontWeight="bold"
                      color={Colors.black}
                    />
                  </div>
                </div>
              </div>
              {/* 무게 */}
              <div className={styles.infoBox}>
                <Text
                  text="Weight Title"
                  fontWeight="bold"
                  color={Colors.brown}
                />
                <div className={styles.infoContainer}>
                  <div className={styles.weightTitle}>
                    <Text
                      text={weightTitle}
                      color={Colors.white}
                      fontWeight="bold"
                    />
                  </div>
                  <div className={styles.weightContent}>
                    <Text
                      text={`${petWeight} kg`}
                      fontWeight="bold"
                      color={Colors.black}
                    />
                  </div>
                </div>
              </div>
              {/* 백신 */}
              <InnerBox direction="column" align="start" px="0">
                <Text
                  text="Vaccination Title"
                  fontWeight="bold"
                  color={Colors.primary}
                />
                <Spacer height="5" />
                <div className={styles.vaccinationSelect}>
                  <div
                    className={styles.customSelect}
                    onClick={() => setIsVaccineSelectOpen((prev) => !prev)}
                  >
                    <span className={styles.selectText}>
                      예방접종 목록 보기
                    </span>
                    <Image
                      src="/images/white-triangle.png"
                      alt="드롭다운 화살표"
                      width={14}
                      height={14}
                    />
                  </div>
                  <div
                    className={`${styles.dropdownList} ${
                      isVaccineSelectOpen ? styles.isOpen : ""
                    }`}
                  >
                    {activeVaccinations.map((key) => (
                      <InnerBox
                        key={key}
                        direction="row"
                        align="center"
                        justify="space-between"
                      >
                        <Text text={key} />
                      </InnerBox>
                    ))}
                  </div>
                </div>
                <Spacer height="5" />
                {/* 중성화 */}
                <InnerBox direction="row" align="center" justify="end">
                  <input
                    type="checkbox"
                    checked={profile.petGender.isNeutered}
                    disabled
                    className={chkbox.chkbox}
                    style={
                      { "--box-color": Colors.primary } as React.CSSProperties
                    }
                  />
                  <Spacer width="5" />
                  <label>
                    <Text
                      text="중성화 여부"
                      color={Colors.primary}
                      fontWeight="bold"
                    />
                  </label>
                </InnerBox>
              </InnerBox>
            </InnerBox>
          </Card>
        </div>

        {/* 뒷면 */}
        <div className={`${styles.cardFace} ${styles.cardBack}`}>
          <Card>
            <Spacer height="49" />
            <div className={styles.backTitle}>
              <InnerBox direction="row" justify="start" align="center">
                <Text text="Name" color={Colors.brown} fontSize="sm" />
                <Spacer width="3" />
                <Text
                  text={petName!}
                  color={Colors.brown}
                  fontSize="md"
                  fontWeight="bold"
                />
                <Spacer width="6" />
                {petGender?.gender ? (
                  <Male color={Colors.male} width={16} height={16} />
                ) : (
                  <Female color={Colors.female} width={16} height={16} />
                )}
              </InnerBox>
              <Text
                text={`#${personality!}`}
                color={Colors.brown}
                fontWeight="bold"
                style={{ whiteSpace: "nowrap" }}
              />
            </div>
            <Spacer height="20" />
            <InnerBox>
              <Text
                text="Personality"
                color={Colors.brown}
                fontSize="sm"
                fontWeight="bold"
              />
              <Spacer height="6" />
              <div className={styles.backPersonality}>
                <Text
                  text={personality!}
                  color={Colors.white}
                  fontSize="lg"
                  fontWeight="bold"
                />
              </div>
            </InnerBox>
            <Spacer height="14" />
            <RadarChartComponent data={data} resetKey={isFlipped} />
            <div className={styles.profileDetail}>
              <div className={styles.detailTitle}>
                <Text
                  text="Profile"
                  fontSize="sm"
                  color={Colors.primary}
                  fontWeight="bold"
                />
              </div>
              {/* ETC fields */}
              <div className={styles.etcContainer}>
                <Text
                  text={profile.etc1 || "외모 특징 없음"}
                  color={Colors.black}
                  fontWeight="bold"
                  fontSize="sm"
                />
              </div>
              <div className={styles.etcContainer}>
                <Text
                  text={profile.etc2 || "종류 정보 없음"}
                  color={Colors.black}
                  fontWeight="bold"
                  fontSize="sm"
                />
              </div>
              <div className={styles.etcContainer}>
                <Text
                  text={profile.etc3 || "특이사항 없음"}
                  color={Colors.black}
                  fontWeight="bold"
                  fontSize="sm"
                />
              </div>
            </div>
          </Card>
        </div>
      </motion.div>
    </div>
  );
}
