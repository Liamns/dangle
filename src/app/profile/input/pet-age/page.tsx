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
import { PetAgeFormData, petAgeFormSchema } from "@/entities/profile/schema";
import { useProfileStore } from "@/entities/profile/store";
import { getPetSpecies } from "@/entities/profile/model";
import { PetType } from "../../../../shared/types/pet";
import {
  DATE_PLACEHOLDER_EXAMPLE,
  getPetAgeLabel,
} from "../../../../shared/lib/date";

export default function InputPetage() {
  const router = useRouter();
  const updateRegisteringProfile = useProfileStore(
    (state) => state.updateRegisteringProfile
  );
  const name = useProfileStore(
    (state) => state.registeringProfile?.petname ?? ""
  );

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm<PetAgeFormData>({
    resolver: zodResolver(petAgeFormSchema),
    mode: "onChange",
  });

  const onSubmit = (data: PetAgeFormData) => {
    updateRegisteringProfile({ petAge: data.age }); // Wrap 'age' in an object to match the expected type
    router.push("/profile/input/pet-weight");
  };

  const watchData = watch();
  const previewAge = watchData.age;
  const spec = getPetSpecies(useProfileStore.getState().registeringProfile);

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
            type="text"
            placeholder={DATE_PLACEHOLDER_EXAMPLE}
            error={errors.age?.message}
            maxLength={10}
          />
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
