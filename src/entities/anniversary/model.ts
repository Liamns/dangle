import { z } from "zod";
import { uuidSchema } from "../user/model";
import { anniversaryIconSchema, contentSchema, dateSchema } from "./schema";
import { annivIcon, favoriteIcon } from "@/shared/types/icon";

// 기념일 스키마
export const anniversaryModelSchema = z.object({
  id: z.number().positive(),
  userId: uuidSchema,
  content: contentSchema,
  icon: anniversaryIconSchema,
  date: dateSchema,
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type AnniversaryModel = z.infer<typeof anniversaryModelSchema>;

// icon 값에 따른 이미지 파일명 반환 함수
export const getAnniversaryIconByType = (icon: number): string => {
  if (icon < 0 || icon >= annivIcon.length) {
    console.warn(`Invalid icon index: ${icon}. Returning default icon.`);
    return "/images/home/anniversary/cake.png"; // 기본 아이콘 경로
  } else {
    return `/images/home/anniversary/${annivIcon[icon]}.png`;
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
