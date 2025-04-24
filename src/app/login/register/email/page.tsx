"use client";
import { Button } from "../../../../shared/components/buttons";
import {
  Card,
  Center,
  Spacer,
  TextField,
} from "../../../../shared/components/layout";
import Modal from "../../../../shared/components/modals";
import { Text } from "../../../../shared/components/texts";
import { Colors } from "../../../../shared/consts/colors";
import {
  AuthNumberFormData,
  authNumberFormSchema,
  EmailFormData,
  emailFormSchema,
} from "@/entities/user/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { EmailInput } from "@/features/auth/components/EmailInput";
import { useUserStore } from "@/entities/user/store";

export default function RegisterEmail() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const updateCurrentUser = useUserStore((state) => state.updateCurrentUser);
  const [isEmailValid, setIsEmailValid] = useState(false);
  const handleSubmit = () => {
    if (isEmailValid) {
      // 유효한 이메일일 때만 실행
      window.alert(`인증번호 요청: ${email}`);
      setIsOpen(true);
    }
  };

  const [isOpen, setIsOpen] = useState(false);

  const {
    register: authRegister,
    handleSubmit: handleAuthSubmit,
    formState: { errors: authErrors, isValid: authIsValid },
  } = useForm<AuthNumberFormData>({
    resolver: zodResolver(authNumberFormSchema),
    mode: "onChange",
  });

  const onAuthSubmit = (data: AuthNumberFormData) => {
    updateCurrentUser({ email });
    router.push("/login/register/pw");
  };

  const onAuthRequest = (e: React.MouseEvent) => {
    e.preventDefault();
    window.alert("인증번호 재요청");
  };

  return (
    <>
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
          <Button width="240" valid={isEmailValid} onClick={handleSubmit}>
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
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} variant="bottom">
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
        <form onSubmit={handleAuthSubmit(onAuthSubmit)}>
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
          <Button width="240" color={Colors.primary} onClick={onAuthRequest}>
            인증번호 재요청
          </Button>
          <Spacer height="12" />
        </form>
      </Modal>
    </>
  );
}
