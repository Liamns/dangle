import { UserModel } from "@/entities/user/model";
import { useUserStore } from "@/entities/user/store";

// 모킹 사용자 데이터
export const mockUser: UserModel = {
  id: "11111111-1111-1111-1111-111111111111",
  email: "test@gmail.com",
  password: "testest1", // 실제로는 해시된 비밀번호가 저장됨
  username: "테스트유저",
  profileIds: ["22222222-2222-2222-2222-222222222222"],
};

// 다양한 형태의 모킹 사용자 데이터를 추가할 수 있음
export const mockUserWithoutProfile: UserModel = {
  id: "33333333-3333-3333-3333-333333333333",
  email: "newuser@gmail.com",
  password: "testest1",
  username: "신규유저",
  profileIds: null,
};

// 사용자 모킹 데이터 설정 함수
export function setupMockUser(userType: "default" | "new" = "default") {
  const setUser = useUserStore.getState().setCurrentUser;

  if (userType === "default") {
    setUser(mockUser);
  } else if (userType === "new") {
    setUser(mockUserWithoutProfile);
  }

  console.log(`모킹 사용자 데이터(${userType}) 설정 완료`);
}
