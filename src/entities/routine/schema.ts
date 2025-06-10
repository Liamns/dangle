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
  name: z
    .string()
    .min(2, "이름은 최소 2자 이상입니다.")
    .max(8, "이름은 최대 8자 입니다."),
});
export type NewRoutineDto = z.infer<typeof NewRoutineDtoSchema>;

export const UpdateRoutineDtoSchema = NewRoutineDtoSchema.extend({
  id: z.number().int().positive("유효한 루틴 ID여야 합니다."),
});
export type UpdateRoutineDto = z.infer<typeof UpdateRoutineDtoSchema>;

// 서버 응답용 모델 스키마 (image URL 검증 포함)
export const RoutineModelSchema = NewRoutineDtoSchema.extend({
  id: z.number().int().positive(),
  createdAt: z.date(),
  updatedAt: z.date(),
  isFavorite: z.boolean(),
});
export type RoutineModel = z.infer<typeof RoutineModelSchema>;

// User ↔ Routine N:M 즐겨찾기 스키마
export const favoriteRoutineSchema = z.object({
  profileId: z.string().uuid("유효한 프로필 ID여야 합니다."),
  routineId: z.number().int().positive("유효한 루틴 ID여야 합니다."),
});
export type FavoriteRoutineFormData = z.infer<typeof favoriteRoutineSchema>;

// 즐겨찾기 모델 스키마 (DB 저장용)
export const favoriteRoutineModelSchema = favoriteRoutineSchema.extend({
  id: z.number().int().positive(),
  addedAt: z.date(),
});
export type FavoriteRoutineModel = z.infer<typeof favoriteRoutineModelSchema>;

// 루틴 콘텐츠 전용 DTO/모델 스키마 (1:N 페이지 구성)
export const NewRoutineContentDtoSchema = z.object({
  title: z
    .string()
    .min(2, "제목은 최소 2자 이상입니다.")
    .max(12, "제목은 최대 12자 입니다."),
  memo: z.string().min(2, "내용은 최소 2자 이상입니다."),
  image: z.string().optional(),
});
export type NewRoutineContentDto = z.infer<typeof NewRoutineContentDtoSchema>;

export const RoutineContentDtoSchema = z.object({
  id: z.number().int().positive("유효한 컨텐츠 ID여야 합니다."),
  routineId: z.number().int().positive("유효한 루틴 ID여야 합니다."),
  title: z
    .string()
    .min(2, "제목은 최소 2자 이상입니다.")
    .max(12, "제목은 최대 12자 입니다."),
  memo: z.string().min(2, "내용은 최소 2자 이상입니다."),
  image: z.string().optional(),
});
export type RoutineContentDto = z.infer<typeof RoutineContentDtoSchema>;

export const UpdateRoutineContentDtoSchema = NewRoutineContentDtoSchema.extend({
  id: z.number().int().positive("유효한 컨텐츠 ID여야 합니다.").optional(),
});
export type UpdateRoutineContentDto = z.infer<
  typeof UpdateRoutineContentDtoSchema
>;

export const RoutineContentModelSchema = RoutineContentDtoSchema.extend({
  createdAt: z.date(),
  updatedAt: z.date(),
});
export type RoutineContentModel = z.infer<typeof RoutineContentModelSchema>;

// 루틴 + 콘텐츠 배열 스키마 (루틴 생성 시)
export const NewRoutineWithContentsSchema = NewRoutineDtoSchema.extend({
  contents: z
    .array(NewRoutineContentDtoSchema)
    .min(1, "최소 한 개 이상의 페이지가 필요합니다."),
});
export type NewRoutineWithContents = z.infer<
  typeof NewRoutineWithContentsSchema
>;

// 루틴 + 콘텐츠 배열 스키마 (루틴 수정 시)
export const UpdateRoutineWithContentsSchema = UpdateRoutineDtoSchema.extend({
  contents: z
    .array(UpdateRoutineContentDtoSchema)
    .min(1, "최소 한 개 이상의 페이지가 필요합니다."),
});
export type UpdateRoutineWithContents = z.infer<
  typeof UpdateRoutineWithContentsSchema
>;

export const RoutineWithContentsModelSchema = RoutineModelSchema.extend({
  contents: z.array(RoutineContentModelSchema),
});
export type RoutineWithContentsModel = z.infer<
  typeof RoutineWithContentsModelSchema
>;
