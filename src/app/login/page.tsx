"use client";
import {
  Card,
  Center,
  InnerBox,
  Spacer,
  TextField,
} from "../../shared/components/layout";
import styles from "./page.module.scss";
import { Button } from "../../shared/components/buttons";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginFormData, loginFormSchema } from "@/entities/user/schema";
import { Colors } from "../../shared/consts/colors";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { EmailInput } from "@/features/auth/components/EmailInput";
import { useUserStore } from "@/entities/user/store";
import { setupMockData } from "@/shared/mocks/setupMocks";
import { useSignInMutation } from "@/features/auth/mutations/useAuthMutation";
import LoadingOverlay from "@/shared/components/LoadingOverlay";
import { AUTH_ERROR_MESSAGE } from "@/features/auth/consts";
import { COMMON_MESSAGE } from "@/shared/consts/messages";

export default function Login() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { trigger: signIn, isMutating } = useSignInMutation();

  const clearUser = useUserStore((state) => state.clearUser);
  const updateCurrentUser = useUserStore((state) => state.updateCurrentUser);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginFormSchema),
    mode: "onChange",
  });

  const onSubmit = async (data: LoginFormData) => {
    setError(null);

    try {
      const { user, message } = await signIn({
        email: email,
        password: data.password,
      });
      updateCurrentUser({ id: user.id, username: user.username });
      router.replace("/home");
    } catch (e: any) {
      setError(e.message);
      if (e.message === "Invalid login credentials") {
        alert(AUTH_ERROR_MESSAGE.UNKNOWN_EMAIL);
      } else {
        alert(COMMON_MESSAGE.WRONG_ACCESS);
      }
    }
  };

  if (isMutating) return <LoadingOverlay isLoading={isMutating} />;

  return (
    <>
      <Card height="570" justify="space-between">
        <span className={styles.title}>이메일 로그인</span>
        <InnerBox>
          <form onSubmit={handleSubmit(onSubmit)} style={{ width: "100%" }}>
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
            <Button width="240" valid={isValid && isEmailValid}>
              로그인 하기
            </Button>
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
        </InnerBox>

        <InnerBox>
          <InnerBox justify="space-between" direction="row">
            <div className={styles.line}></div>
            <span className={styles.register}>댕글 회원가입하기</span>
            <div className={styles.line}></div>
          </InnerBox>
          <Spacer height="27" />
          <Button
            width="240"
            color={Colors.primary}
            onClick={() => {
              clearUser();
              router.push("/login/register/email");
            }}
          >
            회원가입 하러가기
          </Button>
        </InnerBox>

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
