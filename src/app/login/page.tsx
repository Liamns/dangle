"use client";
import { Card, Center, Spacer, TextField } from "@/shared/components/layout";
import styles from "./page.module.scss";
import { Button } from "@/shared/components/buttons";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginFormData, loginFormSchema } from "@/shared/schemas/auth";
import { Colors } from "@/shared/consts/colors";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Login() {
  const router = useRouter();
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
    <>
      <Card>
        <span className={styles.title}>이메일 로그인</span>
        <Spacer height="25" />
        <form onSubmit={handleSubmit(onSubmit)}>
          <TextField
            {...register("email")}
            placeholder="이메일주소를 입력해 주세요."
            type="email"
            error={errors.email?.message}
          />
          <TextField
            {...register("password")}
            placeholder="비밀번호를 입력해 주세요."
            type="password"
            error={errors.password?.message}
          />
          <Spacer height="30" />
          <Button valid={isValid}>로그인 하기</Button>
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
