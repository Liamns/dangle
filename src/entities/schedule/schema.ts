import { z } from "zod";
import {
  MainCategory,
  SubCategory,
  mainCategories,
  mainCategoryIds,
  getAllSubCategoriesByMain,
  getSubCategoryNameById,
} from "@/shared/types/schedule-category";

// 대분류 카테고리 스키마
export const categoryMainSchema = z.object({
  name: z.enum(mainCategories, {
    errorMap: () => ({ message: "유효한 메인 카테고리를 선택해주세요." }),
  }),
});

export type CategoryMainFormData = z.infer<typeof categoryMainSchema>;

// 소분류 카테고리 스키마
export const categorySubSchema = z.object({
  name: z
    .string()
    .min(1, "서브 카테고리명은 필수입니다.")
    .max(50, "서브 카테고리명은 최대 50자까지 입력할 수 있습니다."),
  mainId: z.number().int().positive("유효한 메인 카테고리를 선택해주세요."),
});

export type CategorySubFormData = z.infer<typeof categorySubSchema>;

// 메인 카테고리 선택 후 서브 카테고리 선택을 위한 스키마
export const categorySelectionSchema = z
  .object({
    mainCategory: z.enum(mainCategories, {
      errorMap: () => ({ message: "유효한 메인 카테고리를 선택해주세요." }),
    }),
    subCategoryId: z
      .number()
      .int()
      .min(0, "유효한 서브 카테고리를 선택해주세요."),
  })
  .refine(
    (data) => {
      // 메인 카테고리가 없으면 검증 실패
      if (!data.mainCategory) return false;

      // 서브 카테고리가 메인 카테고리에 속하는지 확인
      const subCategories = getAllSubCategoriesByMain(data.mainCategory);
      return subCategories.some((sub) => sub.id === data.subCategoryId);
    },
    {
      message: "선택한 메인 카테고리에 유효한 서브 카테고리를 선택해주세요.",
      path: ["subCategoryId"], // 오류 표시할 필드
    }
  );

export type CategorySelectionFormData = z.infer<typeof categorySelectionSchema>;

// 일정 컨텐츠 스키마
export const scheduleContentSchema = z
  .object({
    title: z
      .string()
      .min(1, "일정 제목은 필수입니다.")
      .max(100, "일정 제목은 최대 100자까지 입력할 수 있습니다."),
    mainId: z.number().int().positive("유효한 메인 카테고리를 선택해주세요."),
    subId: z.number().int().positive("유효한 서브 카테고리를 선택해주세요."),
    description: z
      .string()
      .max(500, "설명은 최대 500자까지 입력할 수 있습니다.")
      .optional()
      .nullable(),
  })
  .refine(
    (data) => {
      // 메인 카테고리가 없으면 검증 실패
      if (!data.mainId) return false;

      // 메인 카테고리가 유효한지 확인
      const mainCategory = mainCategories[data.mainId];
      if (!mainCategory) return false;

      // 서브 카테고리가 메인 카테고리에 속하는지 확인
      const subCategories = getAllSubCategoriesByMain(mainCategory);
      return subCategories.some((sub) => sub.id === data.subId);
    },
    {
      message: "선택한 메인 카테고리에 유효한 서브 카테고리를 선택해주세요.",
      path: ["subId"], // 오류 표시할 필드
    }
  );

export type ScheduleContentFormData = z.infer<typeof scheduleContentSchema>;

// 일정 인스턴스 스키마
export const scheduleSchema = z.object({
  userId: z.number().int().positive("유효한 사용자를 선택해주세요."),
});

export type ScheduleFormData = z.infer<typeof scheduleSchema>;

// 일정 아이템 스키마
export const scheduleItemSchema = z.object({
  scheduleId: z.number().int().positive("유효한 일정을 선택해주세요."),
  contentId: z.number().int().positive("유효한 컨텐츠를 선택해주세요."),
  startAt: z
    .string()
    .or(z.date())
    .pipe(
      z.coerce.date({
        errorMap: () => ({
          message: "유효한 날짜와 시간을 입력해주세요.",
        }),
      })
    ),
});

export type ScheduleItemFormData = z.infer<typeof scheduleItemSchema>;

// 즐겨찾기 일정 컨텐츠 스키마
export const favoriteContentSchema = z.object({
  userId: z.number().int().positive("유효한 사용자를 선택해주세요."),
  contentId: z.number().int().positive("유효한 컨텐츠를 선택해주세요."),
});

export type FavoriteContentFormData = z.infer<typeof favoriteContentSchema>;

// 일정 생성 시 사용할 확장 스키마 (여러 아이템을 한 번에 등록)
export const createScheduleSchema = scheduleSchema.extend({
  items: z
    .array(
      z.object({
        contentId: z.number().int().positive("유효한 컨텐츠를 선택해주세요."),
        startAt: z
          .string()
          .or(z.date())
          .pipe(
            z.coerce.date({
              errorMap: () => ({
                message: "유효한 날짜와 시간을 입력해주세요.",
              }),
            })
          ),
      })
    )
    .nonempty("최소 하나 이상의 일정 아이템이 필요합니다."),
});

export type CreateScheduleFormData = z.infer<typeof createScheduleSchema>;

// 일정 검색 스키마
export const scheduleSearchSchema = z
  .object({
    from: z.string().or(z.date()).pipe(z.coerce.date()).optional(),
    to: z.string().or(z.date()).pipe(z.coerce.date()).optional(),
    mainCategoryId: z.number().int().positive().optional(),
    subCategoryId: z.number().int().positive().optional(),
    keyword: z.string().optional(),
  })
  .refine(
    (data) => {
      // 서브 카테고리가 선택되지 않았으면 검증 통과
      if (!data.subCategoryId) return true;

      // 메인 카테고리 없이 서브 카테고리만 선택된 경우 검증 실패
      if (!data.mainCategoryId) return false;

      // 메인 카테고리가 유효한지 확인
      const mainCategory = mainCategories[data.mainCategoryId];
      if (!mainCategory) return false;

      // 서브 카테고리가 메인 카테고리에 속하는지 확인
      const subCategories = getAllSubCategoriesByMain(mainCategory);
      return subCategories.some((sub) => sub.id === data.subCategoryId);
    },
    {
      message: "선택한 메인 카테고리에 유효한 서브 카테고리를 선택해주세요.",
      path: ["subCategoryId"], // 오류 표시할 필드
    }
  );

export type ScheduleSearchParams = z.infer<typeof scheduleSearchSchema>;
