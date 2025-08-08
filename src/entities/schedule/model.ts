/**
 * 이 파일은 백엔드에서 받아온 데이터의 타입을 정의합니다.
 * 주로 서버 응답 데이터 구조에 대한 모델 스키마를 포함합니다.
 */

import { z } from "zod";
import { uuidSchema } from "@/entities/user/model";
import { mainCategories } from "@/entities/schedule/types";
import { profileModelSchema } from "@/entities/profile/model";

// ===== 데이터베이스 모델 스키마 =====

// 대분류 카테고리 모델 (서버에서 불러온 데이터)
export const categoryMainModelSchema = z.object({
  id: z.number().int().positive(),
  name: z.enum(mainCategories),
});

export type CategoryMainModel = z.infer<typeof categoryMainModelSchema>;

// 소분류 카테고리 모델 (서버에서 불러온 데이터)
export const categorySubModelSchema = z.object({
  id: z.number().int().positive(),
  name: z.string(),
  mainId: z.number().int().positive(),
});

export type CategorySubModel = z.infer<typeof categorySubModelSchema>;

// 메인 카테고리와 서브 카테고리가 함께 있는 확장 모델 (UI 표시용)
export const categoryWithSubsModelSchema = categoryMainModelSchema.extend({
  subs: z.array(categorySubModelSchema),
});

export type CategoryWithSubsModel = z.infer<typeof categoryWithSubsModelSchema>;

// 유저가 만든 일정 인스턴스 모델 (서버에서 불러온 데이터)
export const scheduleModelSchema = z.object({
  id: z.number().int().positive(),
  profileId: uuidSchema,
  createdAt: z.date(),
  isFavorite: z.boolean().default(false),
  alias: z.string().nullable().optional(),
  icon: z.number().int().nullable().optional(),
  addedAt: z.date().nullable().optional(),
});

export type ScheduleModel = z.infer<typeof scheduleModelSchema>;

// 일정 ↔ 서브 카테고리 연결 모델 (각 항목별 시작 시간 포함)
export const scheduleItemModelSchema = z.object({
  id: z.number().int().positive(),
  scheduleId: z.number().int().positive(),
  subCategoryId: z.number().int().positive(),
  startAt: z.date(),
});

export type ScheduleItemModel = z.infer<typeof scheduleItemModelSchema>;

// ===== 즐겨찾기 관련 모델 스키마 =====

// 즐겨찾기는 이제 스케줄 모델 자체에 통합됨
// 기존 코드와의 호환성을 위해 타입 선언은 유지하되 실제 구현은 스케줄 모델에 통합
export type FavoriteScheduleModel = ScheduleWithItemsModel;

// 사용자-서브 카테고리 즐겨찾기 모델 (profile와 SubCategory N:M 관계)
export const favoriteSubCategoryModelSchema = z.object({
  id: z.number().int().positive(),
  profileId: uuidSchema,
  subCategoryId: z.number().int().positive(),
  addedAt: z.date(),
});

export type FavoriteSubCategoryModel = z.infer<
  typeof favoriteSubCategoryModelSchema
>;

// ===== 확장 모델 스키마 =====

// 메인 카테고리가 포함된 확장 서브 카테고리 모델
export const extendedCategorySubModelSchema = categorySubModelSchema.extend({
  main: categoryMainModelSchema,
});

export type ExtendedCategorySubModel = z.infer<
  typeof extendedCategorySubModelSchema
>;

// 서브 카테고리가 포함된 일정 아이템 모델
export const scheduleItemWithSubCategoryModelSchema =
  scheduleItemModelSchema.extend({
    subCategory: extendedCategorySubModelSchema,
  });

export type ScheduleItemWithSubCategoryModel = z.infer<
  typeof scheduleItemWithSubCategoryModelSchema
>;

// 아이템이 포함된 일정 모델
export const scheduleWithItemsModelSchema = scheduleModelSchema.extend({
  items: z.array(scheduleItemWithSubCategoryModelSchema),
  // isFavorite은 이미 scheduleModelSchema에 포함됨
});

export type ScheduleWithItemsModel = z.infer<
  typeof scheduleWithItemsModelSchema
>;

// 프로필 정보가 포함된 확장 일정 모델
export const scheduleWithItemsAndProfileModelSchema =
  scheduleWithItemsModelSchema.extend({
    profile: profileModelSchema,
  });

export type ScheduleWithItemsAndProfileModel = z.infer<
  typeof scheduleWithItemsAndProfileModelSchema
>;

// ===== 신규 생성 전용 DTO 타입 =====

// 생성 전용 일정 아이템 타입
export type NewScheduleItem = {
  // 사용자가 설정 전까지 startAt은 optional 또는 null일 수 있음
  startAt?: Date | null;
  subCategory: ExtendedCategorySubModel;
};
