"use client";
import { Button } from "../../../../shared/components/buttons";
import { Card, Center, Spacer } from "../../../../shared/components/layout";
import { Text } from "../../../../shared/components/texts";
import { Colors } from "../../../../shared/consts/colors";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { EmailInput } from "@/features/auth/components/EmailInput";
import { useUserStore } from "@/entities/user/store";
import LoadingOverlay from "@/shared/components/LoadingOverlay";
import {
  useSendVerificationMutation,
  useConfirmVerificationMutation,
} from "@/features/auth/mutations/useVerificationMutations";
import AuthCodeModal from "@/features/auth/components/AuthCodeModal"; // AuthCodeModal import
import { AUTH_ERROR_MESSAGE } from "@/features/auth/consts";

export default function RegisterEmail() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const updateCurrentUser = useUserStore((state) => state.updateCurrentUser);
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const {
    trigger: sendVerification,
    isMutating: isSending,
    error: sendError,
  } = useSendVerificationMutation();
  const {
    trigger: confirmVerification,
    isMutating: isConfirming,
    error: confirmError,
  } = useConfirmVerificationMutation();

  const handleSendVerification = async () => {
    if (isEmailValid) {
      try {
        await sendVerification({ email });
        setIsOpen(true);
      } catch (e: any) {
        alert(e.message);
        if (e.message === AUTH_ERROR_MESSAGE.DUPLICATED) {
          router.replace("/login/forgot-pw");
        }
      }
    }
  };

  const handleVerifyCode = async (code: string) => {
    try {
      await confirmVerification({ email, code });
      updateCurrentUser({ email });
      router.push("/login/register/pw");
    } catch (e: any) {
      alert(e.message);
    }
  };

  const handleResendCode = async () => {
    await handleSendVerification();
  };

  return (
    <>
      {isSending && <LoadingOverlay isLoading={isSending} />}
      <Card align="center" height="570">
        <Image
          src="/images/login/register/email/title_icon.png"
          alt="로그인 아이콘"
          width={46}
          height={46}
        />
        <Spacer height="12" />
        <Text
          text={`사용하실 메일주소를\n입력해 주세요!`}
          fontSize="title"
          fontWeight="bold"
          color={Colors.brown}
        />
        <Spacer height="24" />
        <Text
          text={`인증받은 이메일로 로그인이 가능합니다.`}
          color={Colors.brown}
        />
        <Spacer height="24" />
        <form
          onSubmit={(e) => {
            e.preventDefault();
          }}
          style={{ width: "100%" }}
        >
          <EmailInput
            value={email}
            onChange={(value) => setEmail(value)}
            onValidate={(valid) => setIsEmailValid(valid)}
          />
          <Spacer height="13" />
          <Button
            width="240"
            valid={isEmailValid}
            onClick={handleSendVerification}
          >
            인증번호 요청
          </Button>
          <Spacer height="13" />
          <Center>
            <Text
              text="입력한 이메일주소로 인증번호가 발송됩니다."
              color={Colors.grey}
            />
          </Center>
        </form>
      </Card>

      <AuthCodeModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        email={email}
        onVerify={handleVerifyCode}
        onResendRequest={handleResendCode}
        isVerifying={isConfirming}
        isResending={isSending}
      />
    </>
  );
}
