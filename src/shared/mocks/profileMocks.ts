import { ProfileModel } from "@/entities/profile/model";
import { useProfileStore } from "@/entities/profile/store";

// 모킹 프로필 데이터 - 강아지
export const mockDogProfile: ProfileModel = {
  id: "22222222-2222-2222-2222-222222222222",
  userId: "11111111-1111-1111-1111-111111111111",
  username: "테스트유저",
  petname: "댕댕이",
  petAge: "2023-05-15", // yyyy-mm-dd 형식
  petWeight: 5.5,
  petGender: {
    gender: false, // true: 수컷, false: 암컷, null: 선택 안함
    isNeutered: true,
  },
  petSpec: 0, // 0: 강아지, 1: 고양이 (null도 가능)
  etc1: "좋아하는 음식: 닭가슴살",
  etc2: "좋아하는 장난감: 공",
  etc3: "특이사항: 산책을 매우 좋아함",
  vaccinations: {
    혼합예방주사: true,
    코로나바이러스성장염: true,
    "기관·기관지염": true,
    광견병: true,
    고양이백혈병: false,
    전염성복막염: false,
    관경병: false,
    미접종: false,
  },
  personalityScores: {
    활발: 10,
    차분: 4,
    사교: 8,
    영리: 6,
    독립: 9,
  },
};

// 모킹 프로필 데이터 - 고양이
export const mockCatProfile: ProfileModel = {
  id: "44444444-4444-4444-4444-444444444444",
  userId: "11111111-1111-1111-1111-111111111111",
  username: "테스트유저",
  petname: "냥냥이",
  petAge: "2022-03-10", // yyyy-mm-dd 형식
  petWeight: 3.2,
  petGender: {
    gender: false, // true: 수컷, false: 암컷, null: 선택 안함
    isNeutered: true,
  },
  petSpec: 1, // 0: 강아지, 1: 고양이 (null도 가능)
  etc1: "좋아하는 음식: 참치",
  etc2: "좋아하는 장난감: 낚시대",
  etc3: "특이사항: 높은 곳을 좋아함",
  vaccinations: {
    혼합예방주사: false,
    코로나바이러스성장염: false,
    "기관·기관지염": false,
    광견병: false,
    고양이백혈병: true,
    전염성복막염: true,
    관경병: true,
    미접종: false,
  },
  personalityScores: {
    활발: 5,
    차분: 9,
    사교: 3,
    영리: 10,
    독립: 8,
  },
};

// 프로필 모킹 데이터 설정 함수
export function setupMockProfile(profileType: "dog" | "cat" | "both" = "dog") {
  const { setCurrentProfile, addProfile } = useProfileStore.getState();

  if (profileType === "dog" || profileType === "both") {
    addProfile(mockDogProfile);
    if (profileType === "dog") {
      setCurrentProfile(mockDogProfile);
    }
  }

  if (profileType === "cat" || profileType === "both") {
    addProfile(mockCatProfile);
    if (profileType === "cat") {
      setCurrentProfile(mockCatProfile);
    }
  }

  // both인 경우 강아지 프로필을 현재 프로필로 설정
  if (profileType === "both") {
    setCurrentProfile(mockDogProfile);
  }

  console.log(`모킹 프로필 데이터(${profileType}) 설정 완료`);
}
