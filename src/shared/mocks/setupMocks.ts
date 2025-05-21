import { setupMockUser } from "./userMocks";
import { setupMockProfile } from "./profileMocks";

// 모킹 데이터 타입 정의
export type MockDataType = {
  user?: "default" | "new";
  profile?: "dog" | "cat" | "both";
};

/**
 * 모든 모킹 데이터를 한 번에 설정하는 함수
 * @param options 설정할 모킹 데이터 타입
 */
export function setupMockData(
  options: MockDataType = { user: "default", profile: "dog" }
) {
  // 사용자 데이터 설정
  if (options.user) {
    setupMockUser(options.user);
  }

  // 프로필 데이터 설정
  if (options.profile) {
    setupMockProfile(options.profile);
  }

  console.log("모킹 데이터 설정이 완료되었습니다.");
}
