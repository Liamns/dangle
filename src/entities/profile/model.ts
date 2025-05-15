import { z } from "zod";
import { useForm } from "react-hook-form";
import {
  usernameSchema,
  petnameSchema,
  petGenderFormSchema,
  petSpecSchema,
  petWeightSchema,
  etcFieldSchema,
} from "./schema";
import { uuidSchema } from "@/entities/user/model";
import {
  allVaccines,
  personalityTraits,
  PersonalityTrait,
  personalityTypeMap,
} from "../../shared/types/pet";

export const profileModelSchema = z.object({
  id: uuidSchema,
  userId: uuidSchema,
  username: usernameSchema,
  petname: petnameSchema,
  petAge: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "날짜는 yyyy-mm-dd 형식이어야 합니다."),
  petWeight: petWeightSchema,
  petGender: petGenderFormSchema,
  petSpec: petSpecSchema,
  // 추가 정보 필드 (etc1, etc2, etc3)
  etc1: etcFieldSchema,
  etc2: etcFieldSchema,
  etc3: etcFieldSchema,
  // vaccinations: map vaccine key to boolean flag
  vaccinations: z.record(z.enum(allVaccines), z.boolean()),
  // aggregated personality trait scores
  personalityScores: z.record(z.enum(personalityTraits), z.number()),
});

// Profile model type derived from the schema
export type ProfileModel = z.infer<typeof profileModelSchema>;

export type EditProfileFormData = {
  petAge: string;
  petGender: {
    isNeutered: boolean;
  };
  petWeight: number;
  vaccinations: Record<string, boolean>;
};

export type EtcFormData = {
  etc1: string | null;
  etc2: string | null;
  etc3: string | null;
};

/**
 * 프로필의 petSpec 값을 기반으로 반려동물 종류를 반환합니다.
 * @param profile 사용자 프로필 모델
 * @returns 반려동물 종류 (dog 또는 cat) 또는 프로필이 null일 경우 null
 */
export function getPetSpecies(profile: ProfileModel | null): string | null {
  if (profile === null) return null;
  const spec = profile.petSpec;
  if (spec === null || spec === undefined) return null;
  return spec === 0 ? "dog" : "cat";
}

/**
 * 프로필의 personalityScores를 기반으로 가장 적합한 personalityType을 도출합니다.
 * @param profile 사용자 프로필 모델
 * @returns 가장 적합한 personalityType 이름 또는 점수가 부족할 경우 null
 */
export function determinePersonalityType(
  profile: ProfileModel | null
): string | null {
  if (profile === null) {
    return null;
  }

  const scores = profile.personalityScores;

  // 점수가 있는지만 확인
  if (!scores || Object.keys(scores).length === 0) {
    return null;
  }

  // 상위 두 개의 특성 찾기
  const sortedTraits = Object.entries(scores)
    .sort((a, b) => b[1] - a[1]) // 점수 내림차순 정렬
    .map(([trait]) => trait as PersonalityTrait);

  const primary = sortedTraits[0];
  const secondary = sortedTraits.length > 1 ? sortedTraits[1] : null;

  // 두 번째 특성이 없는 경우, 주 특성만 사용
  if (!secondary) {
    for (const [typeName, typeDef] of Object.entries(personalityTypeMap)) {
      if (typeDef.primary === primary && typeDef.priority === primary) {
        return typeName;
      }
    }
    // 우선순위가 주 특성인 것이 없으면, 주 특성만 일치하는 것 중 첫 번째
    for (const [typeName, typeDef] of Object.entries(personalityTypeMap)) {
      if (typeDef.primary === primary) {
        return typeName;
      }
    }
    return Object.keys(personalityTypeMap)[0]; // 기본값
  }

  // 두 번째 특성이 있는 경우, 기존 로직 적용
  // 최적의 성격 유형 찾기
  for (const [typeName, typeDef] of Object.entries(personalityTypeMap)) {
    // 주 특성과 부 특성이 일치하는 경우
    if (typeDef.primary === primary && typeDef.secondary === secondary) {
      return typeName;
    }
  }

  // 주 특성만 일치하는 경우 중에서 우선순위가 있는 것 찾기
  for (const [typeName, typeDef] of Object.entries(personalityTypeMap)) {
    if (typeDef.primary === primary && typeDef.priority === primary) {
      return typeName;
    }
  }

  // 부 특성만 일치하는 경우 중에서 우선순위가 있는 것 찾기
  for (const [typeName, typeDef] of Object.entries(personalityTypeMap)) {
    if (typeDef.secondary === secondary && typeDef.priority === secondary) {
      return typeName;
    }
  }

  // 주 특성만 일치하는 경우
  for (const [typeName, typeDef] of Object.entries(personalityTypeMap)) {
    if (typeDef.primary === primary) {
      return typeName;
    }
  }

  // 일치하는 유형이 없는 경우, 기본값 반환
  return Object.keys(personalityTypeMap)[0];
}

// Recharts Radar 차트용 데이터 변환 함수 추가
export const transformPersonalityToRadarData = (
  personalityScores:
    | Record<string, number>
    | Partial<Record<string, number>>
    | null
    | undefined
): Array<{ subject: string; A: number; fullMark: number }> => {
  if (!personalityScores) {
    return [];
  }

  // personalityScores 객체를 Recharts Radar 차트 형식으로 변환
  return Object.entries(personalityScores).map(([key, value]) => ({
    subject: key, // '활발', '차분', '사교' 등의 키 값
    A: value ?? 0, // 점수 값 (10, 3, 10 등)
    fullMark: 12, // 최대 점수 (12으로 설정)
  }));
};
