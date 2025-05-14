"use client";
import { Card, Center, InnerBox, Spacer } from "@/shared/components/layout";
import { Text } from "@/shared/components/texts";
import { Colors } from "@/shared/consts/colors";
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
import {
  classifyCatSize,
  classifyDogSize,
  personalityTypeMap,
  petSizeTitles,
  petType,
} from "@/shared/types/pet";
import { useRouter } from "next/navigation";
import Male from "@/shared/svgs/male.svg";
import Female from "@/shared/svgs/female.svg";
import { useEffect, useState } from "react";
import Image from "next/image";
import {
  calculateAgeFromDateString,
  DATE_PLACEHOLDER_EXAMPLE,
  getPetAgeLabel,
  transformToDateFormat,
} from "@/shared/lib/date";
import { dogVaccines, catVaccines, noVaccine } from "@/shared/types/pet";
import chkbox from "@/shared/styles/buttons.module.scss";
import { useForm } from "react-hook-form";
import {
  editProfileFormSchema,
  EditProfileFormData,
} from "@/entities/profile/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { TextInput } from "@/shared/components/layout";

interface ProfileCardProps {
  isFlipped: boolean;
  onFlip: (isFlipped: boolean) => void;
}

export default function ProfileCard({ isFlipped, onFlip }: ProfileCardProps) {
  const router = useRouter();
  const currentProfile = useProfileStore((state) => state.getCurrentProfile());
  const isProfileValid = useProfileStore((state) => state.isProfileValid);
  const isLoaded = useProfileStore((state) => state.isLoaded);
  const updateCurrentProfile = useProfileStore(
    (state) => state.updateCurrentProfile
  );
  const [loading, setLoading] = useState(true);
  const [isVaccineSelectOpen, setIsVaccineSelectOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [filteredVaccinations, setFilteredVaccinations] = useState<string[]>(
    []
  );

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<EditProfileFormData>({
    resolver: zodResolver(editProfileFormSchema),
    defaultValues: {
      petAge: currentProfile?.petAge || "",
      petGender: { isNeutered: currentProfile?.petGender?.isNeutered || false },
      petWeight: currentProfile?.petWeight || 0,
      vaccinations: currentProfile?.vaccinations || {},
    },
  });

  const onSubmit = (data: EditProfileFormData) => {
    updateCurrentProfile({
      ...data,
      petGender: {
        ...data.petGender,
        gender: currentProfile?.petGender?.gender || null,
      },
    });
    setIsEditMode(false);
  };

  // 프로필 데이터 준비
  const activeVaccinations = Object.keys(
    currentProfile?.vaccinations || {}
  ).filter(
    (key) =>
      currentProfile?.vaccinations[
        key as keyof typeof currentProfile.vaccinations
      ]
  );

  useEffect(() => {
    if (isLoaded) {
      setLoading(false);
      if (!isProfileValid(currentProfile)) {
        if (typeof window !== "undefined") {
          alert("프로필 정보가 부족합니다. 모든 정보를 입력해주세요.");
        }
        router.replace("/home");
      }
    }
  }, [currentProfile, isProfileValid, isLoaded, router]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const dropdown = document.querySelector(`.${styles.vaccinationSelect}`);
      const customSelect = document.querySelector(`.${styles.customSelect}`);
      if (
        dropdown &&
        !dropdown.contains(event.target as Node) &&
        customSelect &&
        !customSelect.contains(event.target as Node)
      ) {
        setIsVaccineSelectOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isVaccineSelectOpen]);

  if (loading) {
    return (
      <Card>
        <InnerBox
          justify="center"
          align="center"
          style={{ minHeight: "200px" }}
        >
          <Text text="로딩 중..." color={Colors.grey} />
        </InnerBox>
      </Card>
    );
  }

  const personalityType = currentProfile?.personalityScores
    ? "Example Type"
    : null; // Replace with actual logic
  const personalityImageUrl = null; // Replace with actual logic
  const radarChartData = null; // Replace with actual logic
  const petName = currentProfile?.petname;
  const petAge = calculateAgeFromDateString(currentProfile?.petAge);
  const petWeight = currentProfile?.petWeight;
  const petGender = currentProfile?.petGender;
  const petSpec = currentProfile?.petSpec;
  const personality = determinePersonalityType(currentProfile);

  const petTypeName =
    petSpec !== null && petSpec !== undefined ? petType[petSpec] : undefined;

  const findWeightTitleFn =
    currentProfile?.petSpec === 0 ? classifyDogSize : classifyCatSize;
  const weightTitle = petSizeTitles[findWeightTitleFn(petWeight!)];

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

  const handleFlip = () => {
    onFlip(!isFlipped);
  };

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
  const url = petTypeName
    ? getPublicImageUrl(`profile/personality/${petTypeName}/${tag}.gif`)
    : getPublicImageUrl("profile/personality/default.gif");

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className={styles.cardFlipContainer}>
        <motion.div
          animate={isFlipped ? "back" : "front"}
          variants={flipCardVariants}
          className={styles.flipCard}
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
                <div
                  className={styles.editButton}
                  onClick={() => {
                    if (isEditMode) {
                      onSubmit(watch());
                    } else {
                      setIsEditMode(true);
                    }
                  }}
                >
                  <Text
                    text={isEditMode ? "저장하기" : "수정하기"}
                    color={Colors.brown}
                    fontSize="tiny"
                    fontWeight="bold"
                  />
                </div>
              </InnerBox>
              <Spacer height="14" />

              <InnerBox px="20" align="start">
                {/* 나이 */}
                <div className={styles.infoBox}>
                  <Text
                    text="Age Title"
                    fontWeight="bold"
                    color={Colors.brown}
                  />
                  <div className={styles.infoContainer}>
                    <div className={styles.ageTitle}>
                      <Text
                        text={`${petAge} 살`}
                        color={Colors.white}
                        fontWeight="bold"
                      />
                    </div>
                    <div className={styles.ageContent}>
                      {isEditMode ? (
                        <input
                          {...register("petAge")}
                          className={styles.editInput}
                          placeholder={DATE_PLACEHOLDER_EXAMPLE}
                          onChange={(e) => {
                            const inputValue = e.target.value;
                            const transformedDate =
                              transformToDateFormat(inputValue);
                            setValue(
                              "petAge",
                              transformedDate !== null
                                ? transformedDate
                                : inputValue
                            );
                          }}
                          maxLength={10}
                        />
                      ) : (
                        <Text
                          text={getPetAgeLabel(
                            petSpec === 0 ? "dog" : "cat",
                            currentProfile?.petAge || ""
                          )}
                          fontWeight="bold"
                          color={Colors.black}
                        />
                      )}
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
                      {isEditMode ? (
                        <input
                          {...register("petWeight")}
                          type="number"
                          className={styles.editInput}
                          placeholder={currentProfile?.petWeight.toString()}
                        />
                      ) : (
                        <Text
                          text={`${petWeight} kg`}
                          fontWeight="bold"
                          color={Colors.black}
                        />
                      )}
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
                      onClick={(event) => {
                        setIsVaccineSelectOpen((prev) => {
                          const newState = !prev;
                          return newState;
                        });
                        const selectedVaccines = Object.entries(
                          watch("vaccinations")
                        )
                          .filter(([_, value]) => value === true)
                          .map(([key]) => key);
                        setFilteredVaccinations(selectedVaccines);
                      }}
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
                      {isEditMode ? (
                        <>
                          <InnerBox
                            key={noVaccine}
                            direction="row"
                            align="center"
                            justify="space-between"
                          >
                            <Text text={noVaccine} />
                            <input
                              type="checkbox"
                              className={chkbox.chkbox}
                              {...register(`vaccinations.${noVaccine}`)}
                              style={
                                {
                                  "--box-color": Colors.primary,
                                } as React.CSSProperties
                              }
                              onChange={(e) => {
                                const isChecked = e.target.checked;
                                setValue(
                                  `vaccinations.${noVaccine}`,
                                  isChecked
                                );
                                if (isChecked) {
                                  [...dogVaccines, ...catVaccines].forEach(
                                    (vaccine) => {
                                      setValue(
                                        `vaccinations.${vaccine}`,
                                        false
                                      );
                                    }
                                  );
                                }
                              }}
                            />
                          </InnerBox>
                          {petSpec === 0
                            ? dogVaccines.map((vaccine) => (
                                <InnerBox
                                  key={vaccine}
                                  direction="row"
                                  align="center"
                                  justify="space-between"
                                >
                                  <Text text={vaccine} />
                                  <input
                                    type="checkbox"
                                    className={chkbox.chkbox}
                                    {...register(`vaccinations.${vaccine}`)}
                                    style={
                                      {
                                        "--box-color": Colors.primary,
                                      } as React.CSSProperties
                                    }
                                    disabled={watch(
                                      `vaccinations.${noVaccine}`
                                    )}
                                  />
                                </InnerBox>
                              ))
                            : catVaccines.map((vaccine) => (
                                <InnerBox
                                  key={vaccine}
                                  direction="row"
                                  align="center"
                                  justify="space-between"
                                >
                                  <Text text={vaccine} />
                                  <input
                                    type="checkbox"
                                    className={chkbox.chkbox}
                                    {...register(`vaccinations.${vaccine}`)}
                                    style={
                                      {
                                        "--box-color": Colors.primary,
                                      } as React.CSSProperties
                                    }
                                    disabled={watch(
                                      `vaccinations.${noVaccine}`
                                    )}
                                  />
                                </InnerBox>
                              ))}
                        </>
                      ) : (
                        Object.entries(watch("vaccinations"))
                          .filter(([_, value]) => value === true)
                          .map(([key]) => (
                            <InnerBox
                              key={key}
                              direction="row"
                              align="center"
                              justify="space-between"
                            >
                              <Text text={key} />
                            </InnerBox>
                          ))
                      )}
                    </div>
                  </div>
                  <Spacer height="5" />

                  {/* 중성화 */}
                  <InnerBox direction="row" align="center" justify="end">
                    <input
                      {...register("petGender.isNeutered")}
                      id="neuteredCheckbox"
                      type="checkbox"
                      className={chkbox.chkbox}
                      style={
                        { "--box-color": Colors.primary } as React.CSSProperties
                      }
                      checked={
                        isEditMode
                          ? watch("petGender.isNeutered")
                          : petGender?.isNeutered
                      }
                      onChange={(e) => {
                        if (isEditMode) {
                          setValue("petGender.isNeutered", e.target.checked);
                        }
                      }}
                      disabled={!isEditMode}
                    />
                    <Spacer width="5" />
                    <label htmlFor="neuteredCheckbox">
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
                  <Text
                    text="기본 정보"
                    fontWeight="bold"
                    color={Colors.brown}
                  />
                  <Spacer height="10" />
                  <Text text={`이름: ${petName}`} />
                  <Text text={`나이: ${petAge}살`} />
                  <Text text={`체중: ${petWeight}kg`} />
                  <Text text={`성별: ${petGender?.gender ? "남아" : "여아"}`} />
                  <Text text={`중성화: ${petGender?.isNeutered ? "O" : "X"}`} />
                </InnerBox>

                <Spacer height="20" />

                {/* 예방접종 정보 */}
                <InnerBox direction="column" align="start">
                  <Text
                    text="예방접종"
                    fontWeight="bold"
                    color={Colors.brown}
                  />
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
    </form>
  );
}
