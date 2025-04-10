import { petType } from "../../shared/types/pet";

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

// Added petname schema with identical validation conditions.
export const petnameSchema = z
  .string()
  .min(2, { message: "반려동물 이름은 최소 2자 이상이어야 합니다." })
  .max(8, { message: "반려동물 이름은 최대 8자까지 가능합니다." })
  .regex(/^[a-zA-Z0-9가-힣]+$/, {
    message: "반려동물 이름은 한글, 영어, 숫자만 포함되어야 합니다.",
  });

export const petnameFormSchema = z.object({
  petname: petnameSchema,
});
export type PetnameFormData = z.infer<typeof petnameFormSchema>;

export const petAgeFormSchema = z.object({
  age: z.preprocess(
    (val) => Number(val),
    z
      .number({ invalid_type_error: "숫자를 입력해주세요." })
      .min(1, "최소 1 이상이어야 합니다.")
  ),
  isMonth: z.boolean(),
});
export type PetAgeFormData = z.infer<typeof petAgeFormSchema>;

export const petWeightFormSchema = z.object({
  weight: z.preprocess(
    (val) => Number(val),
    z
      .number({ invalid_type_error: "숫자를 입력해주세요." })
      .min(0.1, "몸무게는 최소 0.1kg 이상이어야 합니다.")
  ),
});
export type PetWeightFormData = z.infer<typeof petWeightFormSchema>;
