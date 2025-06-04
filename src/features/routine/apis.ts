import { RoutineModel } from "@/entities/routine/schema";
import { getMockRoutines } from "./mocks/routineMocks";

/**
 * profileId 기반으로 루틴 목록을 가져오는 API (모의데이터 사용)
 */
export async function getRoutinesByProfile(
  profileId: string
): Promise<RoutineModel[]> {
  return new Promise((resolve) => {
    // resolve([]);
    setTimeout(() => resolve(getMockRoutines(profileId)), 500);
  });
}
