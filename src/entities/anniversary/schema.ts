// filepath: /Users/JWP/dangle/src/entities/anniversary/schema.ts
import { z } from "zod";

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

// 기념일 생성 폼 스키마
export const anniversaryFormSchema = z.object({
  content: contentSchema,
  icon: anniversaryIconSchema,
  date: dateSchema,
});

export type AnniversaryFormData = z.infer<typeof anniversaryFormSchema>;
