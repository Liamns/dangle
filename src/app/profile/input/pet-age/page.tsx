"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect, useState } from "react";
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
import { PetAgeFormData, petAgeFormSchema } from "@/entities/profile/schema";
import { getPetAgeLabel } from "@/features/profile/petAgeLabels";
import { useProfileStore } from "@/entities/profile/store";
import { getPetSpecies } from "@/entities/profile/model";
import { PetType } from "../../../../shared/types/pet";

export default function InputPetage() {
  const router = useRouter();
  const updateCurrentProfile = useProfileStore(
    (state) => state.updateCurrentProfile
  );
  const name = useProfileStore((state) => state.currentProfile?.petname ?? "");

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm<PetAgeFormData>({
    resolver: zodResolver(petAgeFormSchema),
    mode: "onChange",
    defaultValues: {
      isMonth: false,
    },
  });

  const onSubmit = (data: PetAgeFormData) => {
    updateCurrentProfile({ petAge: data });
    router.push("/profile/input/pet-weight");
  };

  // 실시간 미리보기 (옵션)
  const watchData = watch();
  const previewAge = watchData.isMonth ? watchData.age / 12 : watchData.age;
  const spec = getPetSpecies(useProfileStore.getState().currentProfile);

  useEffect(() => {
    if (spec === null) {
      if (typeof window !== "undefined") {
        alert("잘못된 접근입니다.");
      }
      router.push("/profile/select-sp");
    }
  }, [spec, router]);

  const previewLabel =
    spec !== null ? getPetAgeLabel(spec as PetType, previewAge) : "";

  return (
    <div className={layoutStyles.container}>
      <div className={layoutStyles.imgContainer}>
        <Image
          src="/images/register/petage/upper.png"
          fill
          sizes="100%"
          alt="반려동물 나이 입력"
          objectFit="contain"
        />
      </div>
      <Card align="center" height="450">
        <Spacer height="53" />
        <Text
          text={`${name}\n현재 나이는?`}
          fontWeight="bold"
          fontSize="title"
          color={Colors.brown}
        />
        <Spacer height="20" />
        <form onSubmit={handleSubmit(onSubmit)} style={{ width: "100%" }}>
          <TextField
            {...register("age")}
            type="number"
            placeholder="숫자만 입력해 주세요"
            error={errors.age?.message}
          />
          <InnerBox justify="end" direction="row">
            <input
              type="checkbox"
              {...register("isMonth")}
              className={chkbox.chkbox}
            />
            <Text
              text={`\u00a0개월수 표기`}
              color={Colors.brown}
              fontWeight="bold"
            />
          </InnerBox>
        </form>
        <Spacer height="40" />
        <InnerBox justify="start" direction="column" align="start">
          <Text
            text="Age Title"
            fontWeight="bold"
            color={isValid ? Colors.primary : Colors.invalid}
          />
          <Spacer height="6" />
          <div
            className={layoutStyles.labelContainer}
            style={
              {
                "--label-bg-color": isValid ? Colors.primary : Colors.invalid,
              } as React.CSSProperties
            }
          >
            <Text
              text={isValid ? previewLabel : `빈칸을 입력해 주세요`}
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
