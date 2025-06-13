/**
 * 이 파일은 백엔드에서 받아온 데이터의 타입을 정의합니다.
 * 주로 서버 응답 데이터 구조에 대한 모델 스키마를 포함합니다.
 */

import { z } from "zod";
import { uuidSchema } from "@/entities/user/model";
import { MainCategory, mainCategories } from "@/entities/schedule/types";
import { favoriteScheduleSchema } from "./schema";

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

// 템플릿(일정 컨텐츠) 모델 (서버에서 불러온 데이터)
export const scheduleContentModelSchema = z.object({
  id: z.number().int().positive(),
  mainId: z.number().int().positive(),
  subId: z.number().int().positive(),
  description: z.string().nullable().optional(),
});

export type ScheduleContentModel = z.infer<typeof scheduleContentModelSchema>;

// 유저가 만든 일정 인스턴스 모델 (서버에서 불러온 데이터)
export const scheduleModelSchema = z.object({
  id: z.number().int().positive(),
  profileId: uuidSchema,
  createdAt: z.date(),
});

export type ScheduleModel = z.infer<typeof scheduleModelSchema>;

// 일정 ↔ 템플릿 연결 모델 (각 항목별 시작 시간 포함)
export const scheduleItemModelSchema = z.object({
  id: z.number().int().positive(),
  scheduleId: z.number().int().positive(),
  contentId: z.number().int().positive(),
  startAt: z.date(),
});

export type ScheduleItemModel = z.infer<typeof scheduleItemModelSchema>;

// ===== 즐겨찾기 관련 모델 스키마 =====

// 템플릿 즐겨찾기 모델 (서버에서 불러온 데이터)
export const favoriteScheduleModelSchema = favoriteScheduleSchema.extend({
  id: z.number().int().positive(),
  addedAt: z.date(),
});
export type FavoriteScheduleModel = z.infer<typeof favoriteScheduleModelSchema>;

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

// 카테고리와 함께 확장된 일정 컨텐츠 모델
export const extendedScheduleContentModelSchema =
  scheduleContentModelSchema.extend({
    main: categoryMainModelSchema,
    sub: categorySubModelSchema,
  });

export type ExtendedScheduleContentModel = z.infer<
  typeof extendedScheduleContentModelSchema
>;

// 컨텐츠가 포함된 일정 아이템 모델
export const scheduleItemWithContentModelSchema =
  scheduleItemModelSchema.extend({
    content: extendedScheduleContentModelSchema,
  });

export type ScheduleItemWithContentModel = z.infer<
  typeof scheduleItemWithContentModelSchema
>;

// 아이템이 포함된 일정 모델
export const scheduleWithItemsModelSchema = scheduleModelSchema.extend({
  scheduleItems: z.array(scheduleItemWithContentModelSchema),
  isFavorite: z.boolean().optional(),
});

export type ScheduleWithItemsModel = z.infer<
  typeof scheduleWithItemsModelSchema
>;

// ===== 신규 생성 전용 DTO 타입 =====

// 생성 전용 일정 아이템 타입
export type NewScheduleItem = {
  // 사용자가 설정 전까지 startAt은 optional 또는 null일 수 있음
  startAt?: Date | null;
  content: Omit<ScheduleItemWithContentModel["content"], "id">;
};
