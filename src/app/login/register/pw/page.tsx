"use client";
import { Button } from "../../../../shared/components/buttons";
import {
  Card,
  Center,
  Spacer,
  TextField,
} from "../../../../shared/components/layout";
import { Text } from "../../../../shared/components/texts";
import { Colors } from "../../../../shared/consts/colors";
import { PasswordFormData, passwordFormSchema } from "@/entities/user/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useUserStore } from "@/entities/user/store";
import { useProfileStore } from "@/entities/profile/store";
import { COMMON_MESSAGE } from "@/shared/consts/messages";
import {
  useSignUpMutation,
  useResetPasswordMutation,
} from "@/features/auth/mutations/useAuthMutation";
import LoadingOverlay from "@/shared/components/LoadingOverlay";

export default function RegisterPW() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const forgot: boolean = searchParams.get("forgot") === "true";

  const { currentUser, updateCurrentUser, _hasHydrated } = useUserStore();
  const clearCurrentProfile = useProfileStore((state) => state.clearProfiles);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordFormSchema),
    mode: "onChange",
  });

  const { trigger: signUp, isMutating: isSigningUp } = useSignUpMutation();
  const { trigger: resetPassword, isMutating: isResetting } =
    useResetPasswordMutation();

  useEffect(() => {
    if (_hasHydrated && !currentUser?.email) {
      alert(COMMON_MESSAGE.WRONG_ACCESS);
      router.replace("/login/register/email");
    }
  }, [_hasHydrated, currentUser?.email, router]);

  const onSubmit = async (data: PasswordFormData) => {
    if (!currentUser?.email) return;

    try {
      if (forgot) {
        await resetPassword({
          email: currentUser.email,
          password: data.password,
        });
        alert("비밀번호가 성공적으로 재설정되었습니다.");
        router.replace("/login");
      } else {
        const { user } = await signUp({
          email: currentUser.email,
          password: data.password,
        });
        clearCurrentProfile();
        updateCurrentUser({
          password: "null",
          id: user.id,
        });

        router.replace("/profile/select-sp");
      }
    } catch (e: any) {
      alert(e.message);
    }
  };

  const isMutating = isSigningUp || isResetting;

  if (!_hasHydrated || !currentUser?.email) {
    return <LoadingOverlay isLoading={true} />;
  }

  return (
    <>
      {isMutating && <LoadingOverlay isLoading={isMutating} />}
      <Card align="center" height="570">
        <Image
          src="/images/login/register/pw/title_icon.png"
          alt="로그인 아이콘"
          width={46}
          height={46}
        />
        <Spacer height="12" />
        <Text
          text={
            forgot
              ? `새로운 비밀번호를\n입력해 주세요!`
              : `사용하실 비밀번호를\n입력해 주세요!`
          }
          fontSize="title"
          fontWeight="bold"
          color={Colors.brown}
        />
        <Spacer height="24" />
        <Text
          text={
            forgot
              ? `새로운 비밀번호를 설정해 주세요.`
              : `댕글에서 사용하실 비밀번호를 설정해 주세요!`
          }
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
          <Button width="240" valid={isValid}>
            {forgot ? "재설정하기" : "다음으로"}
          </Button>
        </form>
      </Card>
    </>
  );
}
