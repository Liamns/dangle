import { z } from "zod";
import { RoutineCategory } from "./types";
import { RoutineType } from "./types";

// 백엔드 전송용 DTO 스키마 (URL 검증 제외)
export const NewRoutineDtoSchema = z.object({
  profileId: z.string().uuid("유효한 프로필 ID여야 합니다."),
  category: z.nativeEnum(RoutineCategory, {
    errorMap: () => ({ message: "유효한 루틴 카테고리를 선택해주세요." }),
  }),
  type: z.nativeEnum(RoutineType, {
    errorMap: () => ({ message: "유효한 루틴 타입을 선택해주세요." }),
  }),
  title: z
    .string()
    .min(2, "제목은 최소 2자 이상입니다.")
    .max(8, "제목은 최대 8자 입니다."),
  content: z.string().min(2, "내용은 최소 2자 이상입니다."),
  image: z.string().optional(),
});
export type NewRoutineDto = z.infer<typeof NewRoutineDtoSchema>;

// 서버 응답용 모델 스키마 (image URL 검증 포함)
export const RoutineModelSchema = NewRoutineDtoSchema.extend({
  id: z.number().int().positive(),
  image: z.string().url("유효한 이미지 URL이어야 합니다.").optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});
export type RoutineModel = z.infer<typeof RoutineModelSchema>;
