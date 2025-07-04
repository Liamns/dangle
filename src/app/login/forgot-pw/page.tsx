"use client";
import { Button } from "../../../shared/components/buttons";
import { Card, Center, Spacer } from "../../../shared/components/layout";
import { Text } from "../../../shared/components/texts";
import { Colors } from "../../../shared/consts/colors";
import { useState } from "react";
import { EmailInput } from "@/features/auth/components/EmailInput";
import LoadingOverlay from "@/shared/components/LoadingOverlay";
import {
  useSendVerificationMutation,
  useConfirmVerificationMutation,
} from "@/features/auth/mutations/useVerificationMutations";
import AuthCodeModal from "@/features/auth/components/AuthCodeModal"; // AuthCodeModal import
import { useRouter } from "next/navigation";

export default function ForgotPassword() {
  const router = useRouter();
  const [email, setEmail] = useState("");
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
        await sendVerification({ email, forgot: true });
        setIsOpen(true);
      } catch (e: any) {
        console.log(`error of send verification fetcher : ${e}`);
        alert(e.message);
        // router.replace("/login/register/email");
      }
    }
  };

  const handleVerifyCode = async (code: string) => {
    try {
      await confirmVerification({ email, code });
      alert("인증번호 확인 성공! 비밀번호 재설정 페이지로 이동"); // TODO: 비밀번호 재설정 페이지로 이동 로직 추가
      setIsOpen(false);
    } catch (e: any) {
      alert(e.message);
    }
  };

  const handleResendCode = async () => {
    await handleSendVerification();
  };

  return (
    <>
      {(isSending || isConfirming) && (
        <LoadingOverlay isLoading={isSending || isConfirming} />
      )}
      <Card height="570">
        <Text
          text="비밀번호 찾기"
          color={Colors.brown}
          fontSize="title"
          fontWeight="bold"
        />
        <Text
          text="가입하신 이메일 주소를 입력해 주세요."
          color={Colors.brown}
        />
        <Spacer height="30" />
        <form onSubmit={(e) => e.preventDefault()} style={{ width: "100%" }}>
          <EmailInput
            value={email}
            onChange={(value) => {
              setEmail(value);
            }}
            onValidate={(valid) => {
              setIsEmailValid(valid);
            }}
          />
          <Spacer height="30" />
          <Button
            valid={isEmailValid}
            onClick={handleSendVerification}
            width="244"
          >
            인증번호 요청
          </Button>
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
