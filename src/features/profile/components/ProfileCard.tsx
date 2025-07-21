"use client";
import { Card, Center, InnerBox, Spacer } from "@/shared/components/layout";
import { Text } from "@/shared/components/texts";
import { Colors } from "@/shared/consts/colors";
import { motion } from "framer-motion";
import styles from "./ProfileCard.module.scss";
import { useProfileStore } from "@/entities/profile/store";
import {
  determinePersonalityType,
  ProfileModel,
  transformPersonalityToRadarData,
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
  etcFormSchema,
  EtcFormData,
} from "@/entities/profile/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import RadarChartComponent from "@/app/profile/complete/components/RadarChartComponent";
import { COMMON_MESSAGE } from "@/shared/consts/messages";
import { useProfile } from "../hooks/useProfiles";

interface ProfileCardProps {
  isFlipped: boolean;
  onFlip: (isFlipped: boolean) => void;
}

export default function ProfileCard({ isFlipped, onFlip }: ProfileCardProps) {
  const router = useRouter();
  const currentProfile = useProfileStore((state) => state.currentProfile);
  const isProfileValid = currentProfile !== null;
  const isLoaded = useProfileStore((state) => state._hasHydrated);
  const [loading, setLoading] = useState(true);
  const [isVaccineSelectOpen, setIsVaccineSelectOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isBackEditMode, setIsBackEditMode] = useState(false); // 뒷면 편집 모드 상태 추가
  const [resetRadar, setResetRadar] = useState(false);
  const [filteredVaccinations, setFilteredVaccinations] = useState<string[]>(
    []
  );
  const { revalidateProfile, updateProfile, updateError, isProcessing } =
    useProfile();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    setFocus,
    reset,
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

  const {
    register: registerEtc,
    handleSubmit: handleSubmitEtc,
    setValue: setValueEtc,
    watch: watchEtc,
    setFocus: setFocusEtc,
    formState: { errors: errorsEtc },
    reset: resetEtc,
  } = useForm<EtcFormData>({
    resolver: zodResolver(etcFormSchema),
    defaultValues: {
      etc1: currentProfile?.etc1 || null,
      etc2: currentProfile?.etc2 || null,
      etc3: currentProfile?.etc3 || null,
    },
  });

  const onSubmit = async (data: EditProfileFormData) => {
    if (!currentProfile || currentProfile.petGender.gender === undefined) {
      alert(COMMON_MESSAGE.WRONG_ACCESS);
      return;
    }
    const inputData: ProfileModel = {
      ...currentProfile,
      petAge: data.petAge,
      petGender: {
        gender: currentProfile.petGender.gender,
        isNeutered: data.petGender.isNeutered,
      },
      petWeight: parseFloat(data.petWeight.toString()),
      vaccinations: data.vaccinations,
    };

    await updateProfile({ inputData: inputData });

    setIsEditMode(false);
    revalidateProfile();
  };

  const onSubmitEtc = async (data: EtcFormData) => {
    if (!currentProfile) {
      alert(COMMON_MESSAGE.WRONG_ACCESS);
      return;
    }
    const inputData: ProfileModel = {
      ...currentProfile,
      etc1: data.etc1 === "" ? null : data.etc1,
      etc2: data.etc2 === "" ? null : data.etc2,
      etc3: data.etc3 === "" ? null : data.etc3,
    };

    await updateProfile({ inputData: inputData });
    setIsBackEditMode(false);
    revalidateProfile();
  };

  useEffect(() => {
    if (isFlipped) {
      setResetRadar((prev) => !prev);
      // 앞면에서 뒷면으로 넘어갈 때 편집 모드 초기화
      setIsBackEditMode(false);
    } else {
      // 뒷면에서 앞면으로 넘어갈 때 편집 모드 초기화
      setIsEditMode(false);
    }
  }, [isFlipped]);

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
      if (!isProfileValid) {
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

  useEffect(() => {
    if (isEditMode) {
      setFocus("petAge");
    }
  }, [isEditMode, setFocus]);

  useEffect(() => {
    if (isBackEditMode) {
      setFocusEtc("etc1");
    }
  }, [isBackEditMode, setFocusEtc]);

  useEffect(() => {
    if (currentProfile) {
      // vaccinations 필드 업데이트
      setValue("vaccinations", currentProfile.vaccinations || {});
      // 다른 필드들도 필요하다면 여기서 업데이트
      setValue(
        "petAge",
        new Date(currentProfile.petAge).toLocaleDateString("en-CA") || ""
      );
      setValue("petWeight", currentProfile.petWeight || 0);
      setValue(
        "petGender.isNeutered",
        currentProfile.petGender?.isNeutered || false
      );
      setValueEtc("etc1", currentProfile.etc1 || null);
      setValueEtc("etc2", currentProfile.etc2 || null);
      setValueEtc("etc3", currentProfile.etc3 || null);
    }
  }, [currentProfile, setValue, setValueEtc]); // 의존성 배열에 currentProfile, setValue, setValueEtc 추가

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

  const data = transformPersonalityToRadarData(
    currentProfile?.personalityScores
  );
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
                {petGender?.gender ? (
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
            <form style={{ width: "100%" }}>
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
            </form>
          </Card>
        </div>

        {/* 뒷면 카드 */}
        <div className={`${styles.cardFace} ${styles.cardBack}`}>
          <Card>
            <Spacer height="49" />
            {/* 타이틀 영역 */}
            <div className={styles.backTitle}>
              <InnerBox direction="row" justify="start" align="center">
                <Text text="Name" color={Colors.brown} fontSize="tiny" />
                <Spacer width="3" />
                <Text
                  text={petName!}
                  color={Colors.brown}
                  fontSize="md"
                  fontWeight="bold"
                />
                <Spacer width="6" />
                {petGender ? (
                  <Male color={Colors.male} width={12} height={12} />
                ) : (
                  <Female color={Colors.female} width={12} height={12} />
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

            {/* 성격 */}
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

            {/* 성격 이미지 */}
            <RadarChartComponent data={data} resetKey={resetRadar} />

            {/* 상세정보 */}
            <div className={styles.profileDetail}>
              <div className={styles.detailTitle}>
                <Text
                  text="Profile"
                  fontSize="sm"
                  color={Colors.primary}
                  fontWeight="bold"
                />
                <div
                  className={styles.editDetail}
                  onClick={() => {
                    if (isBackEditMode) {
                      onSubmitEtc(watchEtc());
                    } else {
                      setIsBackEditMode(true);
                    }
                  }}
                >
                  <Text
                    text={isBackEditMode ? "저장하기" : "입력하기"}
                    fontSize="tiny"
                    fontWeight="bold"
                    color={Colors.brown}
                  />
                </div>
              </div>

              {/* ETC 필드 */}
              {isBackEditMode ? (
                <form className={styles.editForm}>
                  <div className={styles.etcContainer}>
                    <input
                      {...registerEtc("etc1")}
                      className={styles.editInput}
                      placeholder="2-12글자 입력 가능"
                      maxLength={12}
                    />
                    {errorsEtc.etc1 && (
                      <Text
                        text={errorsEtc.etc1.message || ""}
                        color={Colors.invalid}
                      />
                    )}
                  </div>
                  <div className={styles.etcContainer}>
                    <input
                      {...registerEtc("etc2")}
                      className={styles.editInput}
                      placeholder="2-12글자 입력 가능"
                      maxLength={12}
                    />
                    {errorsEtc.etc2 && (
                      <Text
                        text={errorsEtc.etc2.message || ""}
                        color={Colors.invalid}
                      />
                    )}
                  </div>
                  <div className={styles.etcContainer}>
                    <input
                      {...registerEtc("etc3")}
                      className={styles.editInput}
                      placeholder="2-12글자 입력 가능"
                      maxLength={12}
                    />
                    {errorsEtc.etc3 && (
                      <Text
                        text={errorsEtc.etc3.message || ""}
                        color={Colors.invalid}
                      />
                    )}
                  </div>
                </form>
              ) : (
                <>
                  <div className={styles.etcContainer}>
                    {currentProfile.etc1 ? (
                      <Text
                        text={currentProfile.etc1}
                        fontSize="sm"
                        fontWeight="bold"
                        color={Colors.black}
                      />
                    ) : (
                      <Text
                        text="외모 특징"
                        color={Colors.invalid}
                        fontWeight="bold"
                      />
                    )}
                  </div>
                  <div className={styles.etcContainer}>
                    {currentProfile.etc2 ? (
                      <Text
                        text={currentProfile.etc2}
                        fontSize="sm"
                        fontWeight="bold"
                        color={Colors.black}
                      />
                    ) : (
                      <Text
                        text="견/묘 종류"
                        color={Colors.invalid}
                        fontWeight="bold"
                      />
                    )}
                  </div>
                  <div className={styles.etcContainer}>
                    {currentProfile.etc3 ? (
                      <Text
                        text={currentProfile.etc3}
                        fontSize="sm"
                        fontWeight="bold"
                        color={Colors.black}
                      />
                    ) : (
                      <Text
                        text="특이사항"
                        color={Colors.invalid}
                        fontWeight="bold"
                      />
                    )}
                  </div>
                </>
              )}
            </div>
          </Card>
        </div>
      </motion.div>
    </div>
  );
}
