// filepath: /Users/JWP/dangle/src/entities/anniversary/schema.ts
import { z } from "zod";
import { uuidSchema } from "../user/model";

// 기념일 아이콘 타입 (0, 1, 2)
export const anniversaryIconSchema = z.number().int().min(0).max(2);

// 기념일 콘텐츠 스키마
export const contentSchema = z
  .string()
  .min(1, {
    message: "기념일 내용을 입력해주세요.",
  })
  .max(8, { message: "기념일 내용은 8자 이내로 입력해주세요." });

// 기념일 날짜 스키마
export const dateSchema = z.coerce.date({
  invalid_type_error: "유효한 날짜를 입력해주세요.",
});

// 기념일 D-day 여부 스키마
export const isDdaySchema = z
  .boolean()
  .refine((val) => val === true || val === false, {
    message: "D-day 값은 true 또는 false 중 하나여야 합니다.",
  })
  .describe("true: D-day 카운트다운, false: 지난 날짜 카운트업");

// 기념일 스키마
export const anniversarySchema = z.object({
  id: z.number().positive(),
  userId: uuidSchema,
  content: contentSchema,
  icon: anniversaryIconSchema,
  date: dateSchema,
  isDday: isDdaySchema,
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type AnniversaryModel = z.infer<typeof anniversarySchema>;

// 기념일 생성 폼 스키마
export const anniversaryFormSchema = z.object({
  content: contentSchema,
  icon: anniversaryIconSchema,
  date: dateSchema,
  isDday: isDdaySchema,
});

export type AnniversaryFormData = z.infer<typeof anniversaryFormSchema>;
