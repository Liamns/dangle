import { format } from "date-fns";
import { ko } from "date-fns/locale";

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
