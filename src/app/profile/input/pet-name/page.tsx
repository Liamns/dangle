"use client";
import {
  Card,
  Spacer,
  TextError,
  TextInput,
} from "../../../../shared/components/layout";

import layoutStyles from "../layout.module.scss";
import Image from "next/image";
import { Text } from "../../../../shared/components/texts";
import { Colors } from "../../../../shared/consts/colors";
import { Button } from "../../../../shared/components/buttons";
import { PetnameFormData, petnameFormSchema } from "@/entities/profile/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useProfileStore } from "@/entities/profile/store";

export default function InputPetname() {
  const router = useRouter();
  const updateCurrentProfile = useProfileStore(
    (state) => state.updateCurrentProfile
  );

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<PetnameFormData>({
    resolver: zodResolver(petnameFormSchema),
    mode: "onChange",
  });

  const petnameSubmit = (data: PetnameFormData) => {
    updateCurrentProfile({ petname: data.petname });
    router.push("/profile/input/pet-age");
  };

  return (
    <div className={layoutStyles.container}>
      <div className={layoutStyles.imgContainer}>
        <Image
          src="/images/register/petname/upper.png"
          fill
          sizes="100%"
          alt="반려동물 이름 입력"
          objectFit="contain"
        />
      </div>
      <Card align="center" height="450">
        <Spacer height="53" />
        <Text
          text={`소중한 반려동물\n이름은 무엇인가요?`}
          fontWeight="bold"
          fontSize="title"
          color={Colors.brown}
        />
        <Spacer height="40" />
        <form onSubmit={handleSubmit(petnameSubmit)} style={{ width: "100%" }}>
          <TextInput
            {...register("petname")}
            placeholder="댕댕이"
            error={errors.petname?.message}
            maxLength={8}
            minLength={2}
          />
          <TextError error={errors.petname?.message} />
        </form>
      </Card>
      <Spacer height="30" />
      <Button
        valid={isValid}
        ml="30"
        mr="30"
        onClick={handleSubmit(petnameSubmit)}
      >
        다음 단계로
      </Button>
    </div>
  );
}
