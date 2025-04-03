import { z } from "zod";

export const usernameSchema = z
  .string()
  .min(2, { message: "닉네임은 최소 2자 이상이어야 합니다." })
  .max(8, { message: "닉네임은 최대 8자까지 가능합니다." })
  .regex(/^[a-zA-Z0-9가-힣]+$/, {
    message: "닉네임은 한글, 영어, 숫자만 포함되어야 합니다.",
  });

export const usernameFormSchema = z.object({
  username: usernameSchema,
});
export type UsernameFormData = z.infer<typeof usernameFormSchema>;
