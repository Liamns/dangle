"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, InnerBox, Spacer, TextField } from "@/shared/components/layout";
import { Text } from "@/shared/components/texts";
import { Colors } from "@/shared/consts/colors";
import { Button } from "@/shared/components/buttons";
import Image from "next/image";
import layoutStyles from "../layout.module.scss";
import {
  PetWeightFormData,
  petWeightFormSchema,
} from "@/entities/profile/schema";
import { classifyDogSize, dogSizeTitles } from "@/shared/types/pet";

export default function InputPetWeight() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm<PetWeightFormData>({
    resolver: zodResolver(petWeightFormSchema),
    mode: "onChange",
  });

  const onSubmit = (data: PetWeightFormData) => {
    alert("제출된 데이터: " + JSON.stringify(data));
    alert("다음 페이지로 이동");
  };

  const watchData = watch();
  const previewWeight = watchData.weight;
  const previewLabel = isValid
    ? dogSizeTitles[classifyDogSize(previewWeight)]
    : "";

  return (
    <div className={layoutStyles.container}>
      <div className={layoutStyles.imgContainer}>
        <Image
          src="/images/register/petage/upper.png"
          fill
          sizes="100%"
          alt="반려동물 몸무게 입력"
          objectFit="contain"
        />
      </div>
      <Card align="center" height="450">
        <Spacer height="53" />
        <Text
          text={`댕댕이\n현재 몸무게는?`}
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
            placeholder="몸무게를 입력해 주세요"
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
