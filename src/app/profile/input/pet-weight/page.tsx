"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  InnerBox,
  Spacer,
  TextField,
} from "../../../../shared/components/layout";
import { Text } from "../../../../shared/components/texts";
import { Colors } from "../../../../shared/consts/colors";
import { Button } from "../../../../shared/components/buttons";
import Image from "next/image";
import layoutStyles from "../layout.module.scss";
import chkbox from "@/shared/styles/buttons.module.scss";
import {
  PetWeightFormData,
  petWeightFormSchema,
} from "@/entities/profile/schema";
import { classifyPetSize, getPetSizeTitle } from "../../../../shared/types/pet";
import { useProfileStore } from "@/entities/profile/store";

export default function InputPetWeight() {
  const router = useRouter();
  const updateRegisteringProfile = useProfileStore(
    (state) => state.updateRegisteringProfile
  );
  const name = useProfileStore(
    (state) => state.registeringProfile?.petname ?? ""
  );

  const registeringProfile = useProfileStore(
    (state) => state.registeringProfile
  );
  const petSpec = registeringProfile?.petSpec ?? 0; // 반려동물 종류 정보 가져오기 (0: 개, 1: 고양이)
  const [previewLabel, setPreviewLabel] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
    setValue,
  } = useForm<PetWeightFormData>({
    resolver: zodResolver(petWeightFormSchema),
    mode: "onChange",
    defaultValues: {
      // 기존 값이 있으면 불러오기
      weight: registeringProfile?.petWeight || undefined,
    },
  });

  useEffect(() => {
    if (registeringProfile.petWeight) {
      setValue("weight", registeringProfile.petWeight, {
        shouldValidate: true,
      });
    }
  }, [registeringProfile]);

  const weight = watch("weight");

  useEffect(() => {
    if (weight && !isNaN(weight)) {
      // 반려동물 종류에 따라 크기 분류 및 라벨 설정
      const petSize = classifyPetSize(petSpec, weight);
      setPreviewLabel(getPetSizeTitle(petSpec, petSize));
    } else {
      setPreviewLabel("");
    }
  }, [weight, petSpec]);

  const onSubmit = (data: PetWeightFormData) => {
    if (isValid) {
      // 직접 숫자 값으로 저장 (객체 형태 대신)
      updateRegisteringProfile({ petWeight: data.weight });
      router.push("/profile/input/pet-gender");
    }
  };

  return (
    <div className={layoutStyles.container}>
      <div className={layoutStyles.imgContainer}>
        <Image
          src="/images/register/petweight/upper.png"
          fill
          sizes="100%"
          alt="반려동물 몸무게 입력"
          objectFit="contain"
        />
      </div>
      <Card align="center" height="450">
        <Spacer height="53" />
        <Text
          text={`${name}\n현재 몸무게는?`}
          fontWeight="bold"
          fontSize="title"
          color={Colors.brown}
        />
        <Spacer height="20" />
        <form onSubmit={handleSubmit(onSubmit)} style={{ width: "100%" }}>
          <TextField
            {...register("weight")}
            type="number"
            step="0.1"
            placeholder="숫자만 입력해 주세요"
            error={errors.weight?.message}
            suffix="kg"
            suffixColor={Colors.brown}
          />
        </form>
        <Spacer height="40" />
        <InnerBox justify="start" direction="column" align="start">
          <Text
            text="Weight Title"
            fontWeight="bold"
            color={
              weight
                ? isValid
                  ? Colors.primary
                  : Colors.invalid
                : Colors.invalid
            }
          />
          <Spacer height="6" />
          <div
            className={layoutStyles.labelContainer}
            style={
              {
                "--label-bg-color": weight
                  ? isValid
                    ? Colors.primary
                    : Colors.invalid
                  : Colors.invalid,
              } as React.CSSProperties
            }
          >
            <Text
              text={
                weight
                  ? isValid
                    ? previewLabel
                    : errors.weight?.message || "유효하지 않은 값"
                  : "빈칸을 입력해 주세요"
              }
              fontSize="md"
              fontWeight="bold"
              color={Colors.white}
            />
          </div>
        </InnerBox>
      </Card>
      <Spacer height="30" />
      <Button valid={isValid} ml="30" mr="30" onClick={handleSubmit(onSubmit)}>
        다음 단계로
      </Button>
    </div>
  );
}
