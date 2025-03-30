"use client";
import { Button } from "@/shared/components/buttons";
import { Card, Center, Spacer, TextField } from "@/shared/components/layout";
import { Text } from "@/shared/components/texts";
import { Colors } from "@/shared/consts/colors";
import { EmailFormData, emailFormSchema } from "@/entities/user/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { EmailInput } from "@/features/auth/components/EmailInput";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isEmailValid, setIsEmailValid] = useState(false);
  const emailhandleSubmit = () => {
    if (isEmailValid) {
      // 유효한 이메일일 때만 실행
      alert(`인증번호 요청: ${email}`);
    }
  };

  return (
    <>
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
        <form onSubmit={(e) => e.preventDefault()}>
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
          <Button valid={isEmailValid} onClick={emailhandleSubmit}>
            링크 요청
          </Button>
          <Spacer height="12" />
          <Center>
            <Text
              text="입력한 이메일주소로 재설정 링크가 발송됩니다."
              color={Colors.grey}
            />
          </Center>
        </form>
      </Card>
    </>
  );
}
