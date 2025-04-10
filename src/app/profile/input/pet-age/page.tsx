"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, InnerBox, Spacer, TextField } from "@/shared/components/layout";
import { Text } from "@/shared/components/texts";
import { Colors } from "@/shared/consts/colors";
import { Button } from "@/shared/components/buttons";
import Image from "next/image";
import layoutStyles from "../layout.module.scss";
import styles from "./page.module.scss";
import { PetAgeFormData, petAgeFormSchema } from "@/entities/profile/schema";
import { getPetAgeLabel } from "@/features/profile/petAgeLabels";

export default function InputPetage() {
  const router = useRouter();
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

  const [ageLabel, setAgeLabel] = useState<string>("");

  const onSubmit = (data: PetAgeFormData) => {
    alert("제출된 데이터: " + JSON.stringify(data));
    alert("몸무게 페이지 이동");
    router.push("/profile/input/pet-weight");
  };

  // 실시간 미리보기 (옵션)
  const watchData = watch();
  const previewAge = watchData.isMonth ? watchData.age / 12 : watchData.age;
  const previewLabel = getPetAgeLabel("dog", previewAge);

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
          text={`댕댕이\n현재 나이는?`}
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
              className={styles.chkbox}
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
