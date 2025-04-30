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

// icon 값에 따른 이미지 파일명 반환 함수
export const getAnniversaryIconByType = (icon: number): string => {
  switch (icon) {
    case 0:
      return "/images/home/anniversary/cake.png";
    case 1:
      return "/images/home/anniversary/conical.png";
    case 2:
      return "/images/home/anniversary/gift.png";
    default:
      return "/images/home/anniversary/gift.png";
  }
};

// 기념일의 D-day 또는 D+day 표시 함수
export const getAnniversaryDday = (anniversaryDate: Date | string): string => {
  // 현재 날짜 (시간 제외)
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  // 기념일 날짜 (시간 제외)
  const targetDate = new Date(anniversaryDate);
  targetDate.setHours(0, 0, 0, 0);
  
  // 날짜 간의 차이 계산 (밀리초)
  const diffTime = targetDate.getTime() - today.getTime();
  
  // 일 단위로 변환 (소수점 버림)
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) {
    // 오늘이 기념일인 경우
    return "D-Day";
  } else if (diffDays > 0) {
    // 기념일이 미래인 경우 (남은 일수)
    return `D-${diffDays}`;
  } else {
    // 기념일이 과거인 경우 (지난 일수)
    return `D+${Math.abs(diffDays)}`;
  }
};

// 기념일 생성 폼 스키마
export const anniversaryFormSchema = z.object({
  content: contentSchema,
  icon: anniversaryIconSchema,
  date: dateSchema,
  isDday: isDdaySchema.optional(),
});

export type AnniversaryFormData = z.infer<typeof anniversaryFormSchema>;
