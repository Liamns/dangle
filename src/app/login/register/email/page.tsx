"use client";
import { Button } from "@/shared/components/buttons";
import { Card, Center, Spacer, TextField } from "@/shared/components/layout";
import { Text } from "@/shared/components/texts";
import { Colors } from "@/shared/consts/colors";
import { EmailFormData, emailFormSchema } from "@/shared/schemas/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useForm } from "react-hook-form";

export default function RegisterEmail() {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<EmailFormData>({
    resolver: zodResolver(emailFormSchema),
    mode: "onChange",
  });

  const onSubmit = (data: EmailFormData) => {
    console.log("입력값:", data);
  };

  return (
    <Card align="center">
      <Image
        src="/images/login/register/email/title_icon.png"
        alt="로그인 아이콘"
        width={46}
        height={46}
      />
      <Spacer height="12" />
      <Text
        text={`사용하실 메일주소를\n입력해 주세요!`}
        fontSize="20px"
        fontWeight="700"
        color={Colors.brown}
      />
      <Spacer height="24" />
      <Text
        text={`인증받은 이메일로 로그인이 가능합니다.`}
        color={Colors.brown}
      />
      <Spacer height="24" />
      <form onSubmit={handleSubmit(onSubmit)}>
        <TextField
          {...register("email")}
          type="email"
          placeholder="이메일주소를 입력해 주세요."
          error={errors.email?.message}
        />
        <Spacer height="60" />
        <Button color={isValid ? Colors.brown : Colors.invalid}>
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
  );
}
