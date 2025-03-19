"use client";
import { Card, Center, Spacer, TextField } from "@/shared/components/layout";
import styles from "./page.module.scss";
import { Button } from "@/shared/components/buttons";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginFormData, loginFormSchema } from "@/shared/schemas/auth";
import { Colors } from "@/shared/consts/colors";
import Image from "next/image";
import classNames from "classnames";

export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginFormSchema),
    mode: "onChange",
  });

  const onSubmit = (data: LoginFormData) => {
    console.log("입력값:", data);
  };

  return (
    <Card>
      <span className={styles.title}>이메일 로그인</span>
      <Spacer height="25" />
      <form onSubmit={handleSubmit(onSubmit)}>
        <TextField
          {...register("email")}
          placeholder="이메일주소를 입력해 주세요."
          type="email"
          error={errors.email?.message}
          mb="3"
        />
        <TextField
          {...register("password")}
          placeholder="비밀번호를 입력해 주세요."
          type="password"
          error={errors.password?.message}
        />
        <Spacer height="33" />
        <Button valid={isValid}>로그인 하기</Button>
      </form>
      <Spacer height="15" />
      <Center>
        <a className={styles.forget}>비밀번호를 잊어버리셨나요?</a>
      </Center>
      <Spacer height="30" />
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div className={styles.line}></div>
        <a className={styles.register}>댕글 회원가입하기</a>
        <div className={styles.line}></div>
      </div>
      <Spacer height="27" />
      <Button color={Colors.primary}>회원가입 하러가기</Button>
      <Spacer height="22" />
      <Center>
        <div className={styles.dangleIcon}>
          <Image
            src="/images/login/dangle.png"
            alt="댕글 아이콘"
            fill
            style={{ objectFit: "contain" }}
          />
        </div>
      </Center>
      <Spacer height="25" />
      <Center>
        <span className={styles.slogan}>
          슬기로운 반려생활,{" "}
          <span
            className={classNames(styles.slogan, "jalnan")}
            style={
              {
                "--font-weight": "700",
              } as React.CSSProperties
            }
          >
            댕글
          </span>
        </span>
      </Center>
    </Card>
  );
}
