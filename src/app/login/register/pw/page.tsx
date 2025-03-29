"use client";
import { Button } from "@/shared/components/buttons";
import { Card, Center, Spacer, TextField } from "@/shared/components/layout";
import Modal from "@/shared/components/modals";
import { Text } from "@/shared/components/texts";
import { Colors } from "@/shared/consts/colors";
import {
  AuthNumberFormData,
  authNumberFormSchema,
  PasswordFormData,
  passwordFormSchema,
} from "@/entities/user/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

export default function RegisterPW() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors: errors, isValid: isValid },
  } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordFormSchema),
    mode: "onChange",
  });

  const onSubmit = (data: PasswordFormData) => {
    alert("비밀번호 설정 완료");
  };

  return (
    <>
      <Card align="center">
        <Image
          src="/images/login/register/pw/title_icon.png"
          alt="로그인 아이콘"
          width={46}
          height={46}
        />
        <Spacer height="12" />
        <Text
          text={`사용하실 비밀번호를\n입력해 주세요!`}
          fontSize="title"
          fontWeight="bold"
          color={Colors.brown}
        />
        <Spacer height="24" />
        <Text
          text={`댕글에서 사용하실 비밀번호를 설정해 주세요!`}
          color={Colors.brown}
        />
        <Spacer height="24" />
        <form onSubmit={handleSubmit(onSubmit)}>
          <TextField
            {...register("password")}
            type="password"
            placeholder="비밀번호를 입력해 주세요."
            error={errors.password?.message}
          />
          <TextField
            {...register("confirmPassword")}
            type="password"
            placeholder="비밀번호를 다시 입력해 주세요."
            error={errors.confirmPassword?.message}
          />
          <Spacer height="60" />
          <Button valid={isValid}>다음으로</Button>
        </form>
      </Card>
    </>
  );
}
