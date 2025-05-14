import { differenceInYears, format } from "date-fns";
import { ko } from "date-fns/locale";
import { PetType } from "../types/pet";

export const DATE_PLACEHOLDER_EXAMPLE = "예) 20201212";

/**
 * 날짜를 받아 짧은 형식의 한국어 요일을 반환하는 함수
 * @param date 요일을 확인할 날짜 (기본값: 오늘)
 * @returns 짧은 한국어 요일 (예: '월', '화', etc.)
 */
export const getShortKoreanDayOfWeek = (date: Date = new Date()): string => {
  return format(date, "E", { locale: ko });
};

/**
 * 날짜를 MM월 dd일 형식으로 변환하는 함수
 * @param date 변환할 날짜 (기본값: 오늘)
 * @returns MM월 dd일 형식의 문자열
 */
export const formatDateToKorean = (date: Date = new Date()): string => {
  return format(date, "MM월 dd일", { locale: ko });
};

/**
 * yyyymmdd 형식의 문자열을 yyyy-mm-dd 형식으로 변환하는 함수
 * @param input 변환할 yyyymmdd 형식의 문자열 (DATE_PLACEHOLDER_EXAMPLE)
 * @returns yyyy-mm-dd 형식의 문자열 또는 null (유효하지 않은 경우)
 */
export const transformToDateFormat = (input: string): string | null => {
  if (!/^[0-9]{8}$/.test(input)) {
    return null; // 입력값이 8자리 숫자가 아니면 null 반환
  }

  const year = input.substring(0, 4);
  const month = input.substring(4, 6);
  const day = input.substring(6, 8);

  // 유효한 날짜인지 확인
  const date = new Date(`${year}-${month}-${day}`);
  if (
    date.getFullYear() === parseInt(year, 10) &&
    date.getMonth() + 1 === parseInt(month, 10) &&
    date.getDate() === parseInt(day, 10)
  ) {
    return `${year}-${month}-${day}`;
  }

  return null; // 유효하지 않은 날짜인 경우 null 반환
};

// yyyy-mm-dd 형식의 날짜 문자열에서 나이를 계산하는 함수
export const calculateAgeFromDateString = (
  dateString: string | undefined
): number => {
  if (!dateString || !dateString.match(/^\d{4}-\d{2}-\d{2}$/)) {
    return 0;
  }

  const birthDate = new Date(dateString);
  const today = new Date();

  let age = today.getFullYear() - birthDate.getFullYear();

  // 생일이 아직 지나지 않았다면 나이에서 1을 빼줌
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }

  return Math.max(0, age); // 음수가 나오지 않도록 최소값 0 설정
};

export function getPetAgeLabel(petType: PetType, birthDate: string): string {
  const today = new Date();
  const birth = new Date(birthDate);
  const ageYears = differenceInYears(today, birth);

  if (petType === "dog") {
    if (ageYears < 2) return "애기강아지";
    if (ageYears < 5) return "나는야개린이";
    if (ageYears < 8) return "뛰어놀나이";
    if (ageYears < 12) return "으른강아지";
    if (ageYears < 15) return "아직도귀여워";
    return "오래행복하자";
  } else if (petType === "cat") {
    if (ageYears < 1) return "애기냥";
    if (ageYears < 3) return "꼬마냥";
    if (ageYears < 5) return "활발냥";
    if (ageYears < 7) return "으른냥";
    if (ageYears < 10) return "아직도깜찍해";
    return "오래행복하자";
  }
  return "";
}
