"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import {
  Card,
  Center,
  InnerBox,
  InnerWrapper,
  Spacer,
  TextField,
  TextInput,
} from "../../../../shared/components/layout";
import { Text } from "../../../../shared/components/texts";
import { Colors } from "../../../../shared/consts/colors";
import { Button } from "../../../../shared/components/buttons";
import layoutStyles from "../layout.module.scss";
import {
  PetGenderFormData,
  petGenderFormSchema,
} from "@/entities/profile/schema";
import Image from "next/image";
import chkbox from "@/shared/styles/buttons.module.scss";
import { useProfileStore } from "@/entities/profile/store";
import { useEffect } from "react";

export default function InputPetGender() {
  const router = useRouter();
  const registeringProfile = useProfileStore(
    (state) => state.registeringProfile
  );
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
    setValue,
    formState: { errors, isValid },
  } = useForm<PetGenderFormData>({
    resolver: zodResolver(petGenderFormSchema),
    mode: "onChange",
  });

  useEffect(() => {
    if (registeringProfile.petGender) {
      setValue("gender", registeringProfile.petGender.gender, {
        shouldValidate: true,
      });
      setValue("isNeutered", registeringProfile.petGender.isNeutered, {
        shouldValidate: true,
      });
    }
  }, [registeringProfile]);

  const onSubmit = (data: PetGenderFormData) => {
    updateRegisteringProfile({ petGender: data });
    router.push("/profile/input/pet-vaccines");
  };

  const watchData = watch();

  return (
    <div className={layoutStyles.container}>
      <div className={layoutStyles.imgContainer}>
        <Image
          src="/images/register/petgender/upper.png"
          fill
          sizes="100%"
          alt="반려동물 성별 선택"
          objectFit="contain"
        />
      </div>
      <Card align="center" height="450">
        <Spacer height="53" />
        <Text
          text={`${name}\n성별은?`}
          fontWeight="bold"
          fontSize="title"
          color={Colors.brown}
        />
        <Spacer height="20" />
        <form onSubmit={handleSubmit(onSubmit)} style={{ width: "100%" }}>
          <TextField
            {...register("gender")}
            type="checkbox"
            label="성별 (체크: Male, 해제: Female)"
            style={{ display: "none" }}
          />
          <InnerBox
            direction="row"
            justify="space-between"
            align="center"
            px="10"
          >
            <Image
              src={`/images/register/petgender/${
                watchData.gender ? "dis" : "en"
              }able-female.png`}
              alt="비선택-암컷"
              sizes="100px"
              width={100}
              height={100}
              onClick={() => {
                setValue("gender", false);
              }}
            />
            <Image
              src={`/images/register/petgender/${
                watchData.gender ? "en" : "dis"
              }able-male.png`}
              alt="비선택-암컷"
              sizes="100px"
              width={100}
              height={100}
              onClick={() => {
                setValue("gender", true);
              }}
            />
          </InnerBox>
          <Spacer height="20" />
          <Center>
            <Text text="성별을 선택해 주세요." color={Colors.invalid} />
          </Center>
          <Spacer height="30" />
          <InnerBox direction="row" justify="start" align="center" px="10">
            <input
              type="checkbox"
              {...register("isNeutered")}
              className={chkbox.chkbox}
            />
            <Spacer width="6" />
            <Text
              text={`중성화 여부`}
              color={Colors.brown}
              fontWeight="bold"
              fontSize="md"
            />
          </InnerBox>
        </form>
      </Card>
      <Spacer height="30" />
      <Button valid={isValid} ml="30" mr="30" onClick={handleSubmit(onSubmit)}>
        다음 단계로
      </Button>
    </div>
  );
}
