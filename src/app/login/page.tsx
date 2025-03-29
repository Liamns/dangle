"use client";
import { Card, Center, Spacer, TextField } from "@/shared/components/layout";
import styles from "./page.module.scss";
import { Button } from "@/shared/components/buttons";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginFormData, loginFormSchema } from "@/entities/user/schema";
import { Colors } from "@/shared/consts/colors";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { EmailInput } from "@/features/auth/components/EmailInput";

export default function Login() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [isEmailValid, setIsEmailValid] = useState(false);
  const emailhandleSubmit = () => {
    if (isEmailValid) {
      // 유효한 이메일일 때만 실행
      alert(`인증번호 요청: ${email}`);
    }
  };

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginFormSchema),
    mode: "onChange",
  });

  const onSubmit = (data: LoginFormData) => {
    if (isEmailValid) {
      alert(`이메일: ${email}, 비밀번호: ${data.password}`);
    }
  };

  return (
    <>
      <Card>
        <span className={styles.title}>이메일 로그인</span>
        <Spacer height="25" />
        <form onSubmit={handleSubmit(onSubmit)}>
          <EmailInput
            value={email}
            onChange={(value) => setEmail(value)}
            onValidate={(valid) => setIsEmailValid(valid)}
          />
          <TextField
            {...register("password")}
            placeholder="비밀번호를 입력해 주세요."
            type="password"
            error={errors.password?.message}
          />
          <Spacer height="30" />
          <Button valid={isValid && isEmailValid}>로그인 하기</Button>
        </form>
        <Spacer height="15" />
        <Center>
          <a
            className={styles.forget}
            onClick={() => router.push("/login/forgot-pw")}
          >
            비밀번호를 잊어버리셨나요?
          </a>
        </Center>
        <Spacer height="30" />
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
          }}
        >
          <div className={styles.line}></div>
          <span className={styles.register}>댕글 회원가입하기</span>
          <div className={styles.line}></div>
        </div>
        <Spacer height="27" />
        <Button
          color={Colors.primary}
          onClick={() => router.push("/login/register/email")}
        >
          회원가입 하러가기
        </Button>

        <Spacer height="22" />
        <Center>
          <div className={styles.dangleIcon}>
            <Image
              src="/images/login/dangle.png"
              alt="댕글 아이콘"
              fill
              sizes="100%"
              style={{ objectFit: "contain" }}
            />
          </div>
        </Center>
      </Card>
    </>
  );
}
