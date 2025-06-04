"use client";
import {
  Card,
  Spacer,
  TextError,
  TextField,
  TextInput,
} from "../../../../shared/components/layout";
import styles from "./page.module.scss";
import layoutStyles from "../layout.module.scss";
import Image from "next/image";
import { Text } from "../../../../shared/components/texts";
import { Colors } from "../../../../shared/consts/colors";
import { Button } from "../../../../shared/components/buttons";
import {
  UsernameFormData,
  usernameFormSchema,
} from "@/entities/profile/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { getRandomNickname } from "@/features/profile/input/username/api";
import { useRouter } from "next/navigation";
import { useProfileStore } from "@/entities/profile/store";
import { useUserStore } from "@/entities/user/store";

export default function InputUsername() {
  const router = useRouter();
  const updateRegisteringProfile = useProfileStore(
    (state) => state.updateRegisteringProfile
  );
  const updateCurrentUser = useUserStore((state) => state.updateCurrentUser);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
    setValue,
  } = useForm<UsernameFormData>({
    resolver: zodResolver(usernameFormSchema),
    mode: "onChange",
  });

  const usernameSubmit = (data: UsernameFormData) => {
    updateRegisteringProfile({ username: data.username });
    updateCurrentUser({ username: data.username });
    router.push("/profile/input/pet-name");
  };

  const getRandomUsername = async () => {
    try {
      const nickname = await getRandomNickname();
      setValue("username", nickname, {
        shouldValidate: true,
        shouldDirty: true,
      });
    } catch (error) {
      console.error("네트워크 오류:", error);
    }
  };

  const [rendered, setRendered] = useState(false);
  useEffect(() => {
    setRendered(true);
  }, []);

  return (
    <div className={layoutStyles.container}>
      <div className={layoutStyles.imgContainer}>
        <Image
          src="/images/register/username/upper.png"
          fill
          sizes="100%"
          alt="유저 닉네임 입력"
          objectFit="contain"
        />
      </div>
      <Card align="center" height="450">
        <Spacer height="53" />
        <Text
          text={`사용하실 유저 닉네임을\n입력해 주세요!`}
          fontWeight="bold"
          fontSize="title"
          color={Colors.brown}
        />
        <Spacer height="40" />
        <form onSubmit={handleSubmit(usernameSubmit)} style={{ width: "100%" }}>
          <div className={styles.inputWrapper}>
            <TextInput
              {...register("username")}
              placeholder="댕댕이집사가나다"
              error={errors.username?.message}
              maxLength={8}
              minLength={2}
            />
            {rendered && (
              <Button
                color={Colors.primary}
                width="80"
                height="25"
                fontSize="tiny"
                textColor={Colors.brown}
                style={{
                  position: "absolute",
                  top: "50%",
                  transform: "translateY(-50%)",
                  right: "calc(100dvw / 36)",
                  zIndex: 3,
                }}
                onClick={(e) => {
                  e.preventDefault();
                  getRandomUsername();
                }}
              >
                자동완성 만들기
              </Button>
            )}
          </div>

          <TextError error={errors.username?.message} />
        </form>
      </Card>
      <Spacer height="30" />
      <Button
        valid={isValid}
        ml="30"
        mr="30"
        onClick={handleSubmit(usernameSubmit)}
      >
        다음 단계로
      </Button>
    </div>
  );
}
