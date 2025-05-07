import { z } from "zod";
import {
  categoryMainSchema,
  categorySubSchema,
  scheduleContentSchema,
  scheduleSchema,
  scheduleItemSchema,
  favoriteContentSchema,
} from "./schema";
import { uuidSchema } from "@/entities/user/model";
import {
  MainCategory,
  SubCategory,
  mainCategories,
  mainCategoryIds,
  subCategoriesByMain,
  getSubCategoryNameById,
  getAllSubCategoriesByMain,
} from "@/shared/types/schedule-category";

// 대분류 카테고리 모델
export const categoryMainModelSchema = z.object({
  id: z.number().int().positive(),
  name: z.enum(mainCategories),
});

export type CategoryMainModel = z.infer<typeof categoryMainModelSchema>;

// 소분류 카테고리 모델
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

// 템플릿(일정 컨텐츠) 모델 - title 속성 제거
export const scheduleContentModelSchema = z.object({
  id: z.number().int().positive(),
  mainId: z.number().int().positive(),
  subId: z.number().int().positive(),
  description: z.string().nullable().optional(),
});

export type ScheduleContentModel = z.infer<typeof scheduleContentModelSchema>;

// 유저가 만든 일정 인스턴스 모델
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

// 템플릿 즐겨찾기 모델
export const favoriteContentModelSchema = z.object({
  id: z.number().int().positive(),
  userId: uuidSchema,
  contentId: z.number().int().positive(),
  addedAt: z.date(),
});

export type FavoriteContentModel = z.infer<typeof favoriteContentModelSchema>;

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
});

export type ScheduleWithItemsModel = z.infer<
  typeof scheduleWithItemsModelSchema
>;

/**
 * 일정을 시간 순으로 정렬하는 함수
 * @param schedule 일정 모델 (아이템 포함)
 * @returns 시간 순으로 정렬된 일정 아이템
 */
export function sortScheduleItemsByTime(
  schedule: ScheduleWithItemsModel
): ScheduleItemWithContentModel[] {
  if (!schedule.scheduleItems || schedule.scheduleItems.length === 0) {
    return [];
  }

  return [...schedule.scheduleItems].sort((a, b) => {
    return new Date(a.startAt).getTime() - new Date(b.startAt).getTime();
  });
}

/**
 * 특정 일정이 오늘인지 확인하는 함수
 * @param date 확인할 날짜
 * @returns 오늘 날짜인지 여부
 */
export function isToday(date: Date): boolean {
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
}

/**
 * 특정 카테고리에 속한 일정 컨텐츠만 필터링하는 함수
 * @param contents 일정 컨텐츠 배열
 * @param mainId 대분류 카테고리 ID
 * @param subId 소분류 카테고리 ID (선택적)
 * @returns 필터링된 일정 컨텐츠 배열
 */
export function filterContentsByCategory(
  contents: ScheduleContentModel[],
  mainId: number,
  subId?: number
): ScheduleContentModel[] {
  if (!contents || contents.length === 0) {
    return [];
  }

  if (subId) {
    return contents.filter(
      (content) => content.mainId === mainId && content.subId === subId
    );
  }

  return contents.filter((content) => content.mainId === mainId);
}

/**
 * 메인 카테고리 이름으로부터 ID를 가져오는 함수
 * @param mainCategory 메인 카테고리 이름
 * @returns 메인 카테고리 ID
 */
export function getMainCategoryId(mainCategory: MainCategory): number {
  return mainCategoryIds[mainCategory];
}

/**
 * 메인 카테고리 ID와 서브 카테고리 ID로 확장된 카테고리 정보를 가져오는 함수
 * @param mainCategoryId 메인 카테고리 ID
 * @param subCategoryId 서브 카테고리 ID
 * @returns 카테고리 정보 객체
 */
export function getCategoryInfo(
  mainCategoryId: number,
  subCategoryId: number
): {
  mainName: MainCategory | null;
  subName: string | null;
} {
  const mainName = (mainCategories[mainCategoryId] as MainCategory) || null;
  if (!mainName) {
    return { mainName: null, subName: null };
  }

  const subName = getSubCategoryNameById(mainCategoryId, subCategoryId);
  return { mainName, subName };
}

/**
 * CategoryMain[] 배열을 CategoryWithSubs[] 형태로 변환하는 함수
 * 메인 카테고리별로 서브 카테고리 목록을 포함하도록 변환
 */
export function transformToMainWithSubs(
  mainCategories: CategoryMainModel[],
  subCategories: CategorySubModel[]
): CategoryWithSubsModel[] {
  return mainCategories.map((main) => {
    const subs = subCategories.filter((sub) => sub.mainId === main.id);
    return {
      ...main,
      subs,
    };
  });
}

/**
 * 메인 카테고리 이름으로 서브 카테고리 목록을 가져오는 함수
 * @param mainCategory 메인 카테고리 이름
 * @returns 서브 카테고리 목록 (id와 name으로 구성된 객체 배열)
 */
export function getSubCategoriesForUI(
  mainCategory: MainCategory
): { id: number; name: string }[] {
  return getAllSubCategoriesByMain(mainCategory);
}

/**
 * 일정 컨텐츠에 카테고리 정보를 추가하여 확장된 모델로 변환하는 함수
 * @param content 일정 컨텐츠 모델
 * @param mainCategories 메인 카테고리 모델 배열
 * @param subCategories 서브 카테고리 모델 배열
 * @returns 확장된 일정 컨텐츠 모델 또는 null (카테고리를 찾지 못한 경우)
 */
export function enrichContentWithCategories(
  content: ScheduleContentModel,
  mainCategories: CategoryMainModel[],
  subCategories: CategorySubModel[]
): ExtendedScheduleContentModel | null {
  const main = mainCategories.find((m) => m.id === content.mainId);
  const sub = subCategories.find(
    (s) => s.id === content.subId && s.mainId === content.mainId
  );

  if (!main || !sub) {
    return null;
  }

  return {
    ...content,
    main,
    sub,
  };
}

/**
 * 일정 아이템 배열을 일정별로 그룹화하는 함수
 * @param items 일정 아이템 배열
 * @returns 일정 ID를 키로 하는 아이템 배열 맵
 */
export function groupItemsBySchedule(
  items: ScheduleItemModel[]
): Record<number, ScheduleItemModel[]> {
  return items.reduce((acc, item) => {
    const { scheduleId } = item;
    if (!acc[scheduleId]) {
      acc[scheduleId] = [];
    }
    acc[scheduleId].push(item);
    return acc;
  }, {} as Record<number, ScheduleItemModel[]>);
}
