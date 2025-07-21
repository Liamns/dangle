"use client";

import { Button } from "@/shared/components/buttons";
import {
  Center,
  Spacer,
  TextField,
} from "@/shared/components/layout";
import Modal from "@/shared/components/modals";
import { Text } from "@/shared/components/texts";
import { Colors } from "@/shared/consts/colors";
import { AuthNumberFormData, authNumberFormSchema } from "@/entities/user/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import LoadingOverlay from "@/shared/components/LoadingOverlay";
import Footer from "@/app/login/footer";

interface AuthCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  email: string;
  onVerify: (code: string) => Promise<void>;
  onResendRequest: () => Promise<void>;
  isVerifying: boolean;
  isResending: boolean;
}

export default function AuthCodeModal({
  isOpen,
  onClose,
  email,
  onVerify,
  onResendRequest,
  isVerifying,
  isResending,
}: AuthCodeModalProps) {
  const {
    register: authRegister,
    handleSubmit: handleAuthSubmit,
    formState: { errors: authErrors, isValid: authIsValid },
    reset,
  } = useForm<AuthNumberFormData>({
    resolver: zodResolver(authNumberFormSchema),
    mode: "onChange",
  });

  // 모달이 닫힐 때 폼 상태 초기화
  const handleClose = () => {
    reset();
    onClose();
  };

  const onSubmit = async (data: AuthNumberFormData) => {
    await onVerify(data.authNumber);
  };

  const handleResend = (e: React.MouseEvent) => {
    e.preventDefault();
    onResendRequest();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      variant="bottom"
      footer={<Footer />}
    >
      {(isVerifying || isResending) && (
        <LoadingOverlay isLoading={isVerifying || isResending} />
      )}
      <Spacer height="37" />
      <Center>
        <Text fontSize="lg" color={Colors.brown} text={`인증번호\u00a0`} />
        <Text
          fontSize="lg"
          color={Colors.brown}
          fontWeight="bold"
          text={`6자리`}
        />
        <Text fontSize="lg" color={Colors.brown} text={`를 입력해 주세요!`} />
      </Center>
      <Spacer height="24" />
      <form onSubmit={handleAuthSubmit(onSubmit)}>
        <TextField
          {...authRegister("authNumber")}
          type="text"
          placeholder="인증번호를 입력해 주세요."
          error={authErrors.authNumber?.message}
          maxLength={6}
          mb="5"
        />
        <Button width="240" valid={authIsValid}>
          확인
        </Button>
        <Spacer height="14" />
        <Button width="240" color={Colors.primary} onClick={handleResend}>
          인증번호 재요청
        </Button>
        <Spacer height="12" />
      </form>
    </Modal>
  );
}
