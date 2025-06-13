import { z } from "zod";
import { RoutineModelSchema, NewRoutineDtoSchema } from "./schema";
import { favoriteIcon } from "@/shared/types/icon";

/** 앱 내부 사용 모델 타입 */
export type RoutineModel = z.infer<typeof RoutineModelSchema>;

/** 백엔드 전송용 DTO 타입 */
export type NewRoutineDto = z.infer<typeof NewRoutineDtoSchema>;

// ...필요 시 헬퍼 함수 추가 가능
// icon 값에 따른 이미지 파일명 반환 함수
export const getFavoriteIconByType = (icon: number): string => {
  if (icon < 0 || icon >= favoriteIcon.length) {
    console.warn(`Invalid icon index: ${icon}. Returning default icon.`);
    return "/images/favorites/star.png"; // 기본 아이콘 경로
  } else {
    return `/images/favorites/${favoriteIcon[icon]}.png`;
  }
};
