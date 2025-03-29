"use client";
import { Button } from "@/shared/components/buttons";
import { Card, Center, Spacer, TextField } from "@/shared/components/layout";
import { Text } from "@/shared/components/texts";
import { Colors } from "@/shared/consts/colors";
import { EmailFormData, emailFormSchema } from "@/shared/schemas/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

export default function ForgotPassword() {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<EmailFormData>({
    resolver: zodResolver(emailFormSchema),
    mode: "onChange",
  });

  const onSubmit = (data: EmailFormData) => {
    alert("비밀번호 재설정 이메일 전송");
  };

  return (
    <>
      <Card>
        <Text
          text="비밀번호 찾기"
          color={Colors.brown}
          fontSize="20px"
          fontWeight="700"
        />
        <Text
          text="가입하신 이메일 주소를 입력해 주세요."
          color={Colors.brown}
        />
        <Spacer height="30" />
        <form onSubmit={handleSubmit(onSubmit)}>
          <TextField
            {...register("email")}
            placeholder="이메일 주소를 입력해 주세요."
            error={errors.email?.message}
            type="email"
          />
          <Spacer height="50" />
          <Button color={isValid ? Colors.brown : Colors.invalid}>
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
