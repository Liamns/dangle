import { z } from "zod";
import { RoutineModelSchema, NewRoutineDtoSchema } from "./schema";
import { favoriteIcon } from "@/shared/types/icon";

/** 앱 내부 사용 모델 타입 */
export type RoutineModel = z.infer<typeof RoutineModelSchema>;

/** 백엔드 전송용 DTO 타입 */
export type NewRoutineDto = z.infer<typeof NewRoutineDtoSchema>;

// ...필요 시 헬퍼 함수 추가 가능
