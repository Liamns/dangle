"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useWatch } from "react-hook-form";
import { Card, InnerBox, Spacer } from "../../../../shared/components/layout";
import { Text } from "../../../../shared/components/texts";
import { Button } from "../../../../shared/components/buttons";
import { Colors } from "../../../../shared/consts/colors";
import { useProfileStore } from "@/entities/profile/store";
import {
  petVaccinationFormSchema,
  PetVaccinationFormData,
} from "@/entities/profile/schema";
import {
  vaccineListBySpec,
  noVaccine,
  VaccinationFieldPath,
} from "../../../../shared/types/pet";
import layoutStyles from "../layout.module.scss";
import styles from "./page.module.scss";
import Image from "next/image";
import chkbox from "@/shared/styles/buttons.module.scss";

export default function InputPetVaccines() {
  const router = useRouter();
  const petSpec = useProfileStore((s) => s.registeringProfile?.petSpec ?? 0);
  const name = useProfileStore(
    (state) => state.registeringProfile?.petname ?? ""
  );

  const registeringProfile = useProfileStore((s) => s.registeringProfile);
  const updateRegisteringProfile = useProfileStore(
    (s) => s.updateRegisteringProfile
  );
  const labels = vaccineListBySpec[petSpec];

  // dropdown open state
  const [open, setOpen] = useState(false);
  const [clicked, setClicked] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { isValid },
    watch,
  } = useForm<PetVaccinationFormData>({
    resolver: zodResolver(petVaccinationFormSchema),
    mode: "onChange",
    defaultValues: {
      vaccinations: labels.reduce(
        (acc, key) => ({ ...acc, [key]: false }),
        {} as Record<(typeof labels)[number], boolean>
      ),
    },
  });

  // subscribe to vaccinations changes for immediate updates
  const vaccinations = useWatch({ control, name: "vaccinations" });

  useEffect(() => {
    if (registeringProfile.vaccinations) {
      setValue("vaccinations", registeringProfile.vaccinations, {
        shouldValidate: true,
      });
    }
  }, [registeringProfile]);

  // 미접종 체크 여부 확인
  const isNoVaccineChecked = vaccinations?.[noVaccine] || false;

  // 실제 접종된 백신 개수 (미접종 제외)
  const selectedCount = vaccinations
    ? Object.entries(vaccinations).filter(([key, v]) => v && key !== noVaccine)
        .length
    : 0;

  const selected = vaccinations
    ? Object.entries(vaccinations)
        .filter(([, v]) => v)
        .map(([k]) => k)
    : [];

  // 미접종과 다른 백신 선택 간의 상호작용 처리
  useEffect(() => {
    if (!vaccinations) return;

    // 이전 상태를 기억하기 위한 플래그
    const lastNoVaccineState = isNoVaccineChecked;
    const lastSelectedCount = selectedCount;

    // 미접종이 체크되었고 이전 상태와 다를 때만 업데이트
    if (isNoVaccineChecked && lastSelectedCount > 0) {
      Object.keys(vaccinations).forEach((key) => {
        if (key !== noVaccine) {
          setValue(`vaccinations.${key}` as VaccinationFieldPath, false);
        }
      });
    }
    // 다른 백신이 하나라도 체크되었고 미접종도 체크되어 있을 때만 업데이트
    else if (selectedCount > 0 && lastNoVaccineState) {
      setValue(`vaccinations.${noVaccine}` as VaccinationFieldPath, false, {
        shouldValidate: true,
      });
    }
  }, [vaccinations, isNoVaccineChecked, setValue]);

  const hasUserMadeSelection = isNoVaccineChecked || selectedCount > 0;

  const onSubmit = (data: PetVaccinationFormData) => {
    if (hasUserMadeSelection) {
      updateRegisteringProfile({ vaccinations: data.vaccinations });
      router.push("/profile/input/pet-personality");
    }
  };

  return (
    <div className={layoutStyles.container}>
      <div className={layoutStyles.imgContainer}>
        <Image
          src="/images/register/petvaccine/upper.png"
          fill
          sizes="100%"
          alt="반려동물 예방접종 확인"
          objectFit="contain"
        />
      </div>
      <Card align="center" height="450">
        <Spacer height="53" />
        <Text
          text={`${name} 예방접종`}
          fontWeight="bold"
          fontSize="title"
          color={Colors.brown}
        />
        <Spacer height="10" />
        <Text
          text={`접종한 목록을 골라주세요!\n( 중복선택 가능 )`}
          color={Colors.brown}
        />
        <Spacer height="30" />
        <form
          onSubmit={handleSubmit(onSubmit)}
          className={styles.formContainer}
        >
          {/* Custom dropdown for multi-select checkboxes */}
          <div className={styles.dropdownWrapper}>
            <div
              className={styles.dropdownHeader}
              onClick={() => {
                setOpen(!open);
                setClicked(true);
              }}
            >
              <span className={styles.dropdownLabel}>예방접종 목록 보기</span>

              <Image
                src="/images/register/petvaccine/drop-arrow.png"
                width={15}
                height={12}
                alt="드랍다운 열기"
                sizes="100%"
              />
            </div>
            {open && (
              <div className={styles.dropdownList}>
                {/* 미접종 옵션을 먼저 표시 */}
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
                    {...register(
                      `vaccinations.${noVaccine}` as VaccinationFieldPath
                    )}
                    style={
                      {
                        "--box-color": Colors.primary,
                      } as React.CSSProperties
                    }
                  />
                </InnerBox>

                {/* 기존 백신 목록 */}
                {labels
                  .filter((label) => label !== noVaccine)
                  .map((label) => (
                    <InnerBox
                      key={label}
                      direction="row"
                      align="center"
                      justify="space-between"
                    >
                      <Text
                        text={label}
                        color={
                          isNoVaccineChecked ? Colors.invalid : Colors.brown
                        }
                      />
                      <input
                        type="checkbox"
                        className={chkbox.chkbox}
                        {...register(
                          `vaccinations.${label}` as VaccinationFieldPath
                        )}
                        disabled={isNoVaccineChecked}
                        style={
                          {
                            "--box-color": isNoVaccineChecked
                              ? Colors.invalid
                              : Colors.primary,
                            cursor: isNoVaccineChecked
                              ? "not-allowed"
                              : "pointer",
                          } as React.CSSProperties
                        }
                      />
                    </InnerBox>
                  ))}
              </div>
            )}
          </div>
        </form>
        <InnerBox
          justify="start"
          direction="column"
          align="start"
          style={{
            position: "absolute",
            bottom: "30px",
            width: "calc(100% - 60px)",
          }}
        >
          <Text
            text="Vaccine Title"
            fontWeight="bold"
            color={hasUserMadeSelection ? Colors.primary : Colors.invalid}
          />
          <Spacer height="6" />
          <div
            className={layoutStyles.labelContainer}
            style={
              {
                "--label-bg-color": hasUserMadeSelection
                  ? Colors.primary
                  : Colors.invalid,
              } as React.CSSProperties
            }
          >
            <Text
              text={
                hasUserMadeSelection
                  ? `${selectedCount}개 접종 완료${
                      isNoVaccineChecked ? " (미접종)" : ""
                    }`
                  : `목록을 선택해 주세요`
              }
              fontSize="md"
              fontWeight="bold"
              color={Colors.white}
            />
          </div>
        </InnerBox>
      </Card>
      <Spacer height="30" />
      <Button
        valid={hasUserMadeSelection}
        ml="30"
        mr="30"
        onClick={handleSubmit(onSubmit)}
      >
        다음 단계로
      </Button>
    </div>
  );
}
