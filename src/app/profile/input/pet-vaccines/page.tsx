"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useWatch } from "react-hook-form";
import { Card, InnerBox, Spacer } from "@/shared/components/layout";
import { Text } from "@/shared/components/texts";
import { Button } from "@/shared/components/buttons";
import { Colors } from "@/shared/consts/colors";
import { useProfileStore } from "@/entities/profile/store";
import {
  petVaccinationFormSchema,
  PetVaccinationFormData,
} from "@/entities/profile/schema";
import { vaccineListBySpec } from "@/shared/types/pet";
import layoutStyles from "../layout.module.scss";
import styles from "./page.module.scss";
import Image from "next/image";
import chkbox from "@/shared/styles/buttons.module.scss";

export default function InputPetVaccines() {
  const router = useRouter();
  const petSpec = useProfileStore((s) => s.currentProfile?.petSpec ?? 0);
  const name = useProfileStore((state) => state.currentProfile?.petname ?? "");
  if (name === "") {
    router.push("/profile/input/pet-name");
    return null;
  }
  const updateCurrentProfile = useProfileStore((s) => s.updateCurrentProfile);
  const labels = vaccineListBySpec[petSpec];

  // dropdown open state
  const [open, setOpen] = useState(false);
  const [clicked, setClicked] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { isValid },
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
  const selectedCount = vaccinations
    ? Object.values(vaccinations).filter(Boolean).length
    : 0;
  const selected = vaccinations
    ? Object.entries(vaccinations)
        .filter(([, v]) => v)
        .map(([k]) => k)
    : [];
  const currentProfile = useProfileStore((s) => s.currentProfile);

  const onSubmit = (data: PetVaccinationFormData) => {
    updateCurrentProfile({ vaccinations: data.vaccinations });
    router.push("/profile/input/pet-personality");
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
                {labels.map((label) => (
                  <InnerBox
                    key={label}
                    direction="row"
                    align="center"
                    justify="space-between"
                  >
                    <Text text={label} />
                    <input
                      type="checkbox"
                      className={chkbox.chkbox}
                      {...register(`vaccinations.${label}` as const)}
                      style={
                        {
                          "--box-color": Colors.primary,
                        } as React.CSSProperties
                      }
                      onClick={(e) => {
                        console.log(vaccinations);
                      }}
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
            color={clicked ? Colors.primary : Colors.invalid}
          />
          <Spacer height="6" />
          <div
            className={layoutStyles.labelContainer}
            style={
              {
                "--label-bg-color": clicked ? Colors.primary : Colors.invalid,
              } as React.CSSProperties
            }
          >
            <Text
              text={
                clicked
                  ? `${selectedCount}개 접종 완료`
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
      <Button valid={clicked} ml="30" mr="30" onClick={handleSubmit(onSubmit)}>
        다음 단계로
      </Button>
    </div>
  );
}
