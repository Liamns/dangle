import { petType, allVaccines, personalityTags } from "../../shared/types/pet";

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

export const petWeightSchema = z.preprocess(
  (val) => Number(val),
  z
    .number({ invalid_type_error: "숫자를 입력해주세요." })
    .min(0.1, "몸무게는 최소 0.1kg 이상이어야 합니다.")
);
export const petWeightFormSchema = z.object({
  weight: petWeightSchema,
});
export type PetWeightFormData = z.infer<typeof petWeightFormSchema>;

export const petGenderFormSchema = z.object({
  gender: z.boolean({
    invalid_type_error: "성별을 선택해 주세요.",
  }).nullable(),
  isNeutered: z.boolean({
    invalid_type_error: "중성화 여부를 입력해주세요.",
  }),
});
export type PetGenderFormData = z.infer<typeof petGenderFormSchema>;

// Species index: 0 = dog (default), 1 = cat
export const petSpecSchema = z.number().int().min(0).nullable().default(null);
export type PetSpecFormData = z.infer<typeof petSpecSchema>;

// Vaccination selection schema: direct boolean record for each vaccine key
export const petVaccinationFormSchema = z.object({
  vaccinations: z.record(z.enum(allVaccines), z.boolean()),
});
export type PetVaccinationFormData = z.infer<typeof petVaccinationFormSchema>;

// Personality selection schema: user picks up to 5 tags
export const petPersonalityFormSchema = z.object({
  tags: z
    .array(z.enum(personalityTags))
    .min(1, "최소 1개의 성격 태그를 선택해주세요.")
    .max(5, "최대 5개의 성격 태그만 선택할 수 있습니다."),
});
export type PetPersonalityFormData = z.infer<typeof petPersonalityFormSchema>;
