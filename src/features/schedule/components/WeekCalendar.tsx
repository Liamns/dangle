"use client";
import { useState, useEffect } from "react";
import { format, setDay, addWeeks, subWeeks } from "date-fns";
import { ko } from "date-fns/locale";
import { Text } from "@/shared/components/texts";
import { Colors } from "@/shared/consts/colors";
import { DAYS_OF_WEEK, getDayOfWeekIndex } from "@/shared/lib/date";
import styles from "./WeekCalendar.module.scss";

interface WeekCalendarProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
  onYearMonthClick?: () => void;
}

/**
 * 주간 캘린더 컴포넌트
 * 요일 및 날짜 선택, 주 단위 이동 기능 제공
 */
export default function WeekCalendar({
  selectedDate,
  onDateChange,
  onYearMonthClick,
}: WeekCalendarProps) {
  // 애니메이션 관련 상태
  const [slideDirection, setSlideDirection] = useState<"left" | "right" | null>(
    null
  );
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const [nextWeekDates, setNextWeekDates] = useState<Date | null>(null);

  // 현재 선택된 날짜의 요일 인덱스
  const selectedDayIndex = getDayOfWeekIndex(selectedDate);

  // 요일 선택 처리 함수
  const handleDaySelect = (dayIndex: number) => {
    // 현재 날짜에서 선택한 요일로 변경
    const newDate = setDay(selectedDate, dayIndex, { weekStartsOn: 0 });
    onDateChange(newDate);
  };

  // 주 이동 처리 함수
  const handleWeekChange = (direction: "prev" | "next") => {
    if (isAnimating) return; // 애니메이션 중복 방지

    setIsAnimating(true);

    // 애니메이션 방향 설정
    setSlideDirection(direction === "prev" ? "right" : "left");

    // 다음 주 날짜 미리 계산
    const newDate =
      direction === "prev"
        ? subWeeks(selectedDate, 1)
        : addWeeks(selectedDate, 1);

    // 다음 주 날짜를 state에 저장 (렌더링용)
    setNextWeekDates(newDate);

    // 애니메이션 완료 후 실제 날짜 변경
    setTimeout(() => {
      onDateChange(newDate);
      setNextWeekDates(null);
      setSlideDirection(null);
      setIsAnimating(false);
    }, 300); // 애니메이션 지속 시간과 동일하게 설정
  };

  // 현재 선택된 날짜의 연월 표시 문자열
  const formattedYearMonth = format(selectedDate, "yyyy년 MM월", {
    locale: ko,
  });

  // 애니메이션 방향에 따라 새로운 요소가 들어오는 방향 결정
  const getSlideInDirection = () => {
    if (!slideDirection) return null;
    return slideDirection === "left" ? "right" : "left";
  };

  return (
    <div className={styles.weekCalendarContainer}>
      {/* 연월 표시 부분 */}
      <div className={styles.yearMonthSection}>
        <div
          className={styles.yearMonthSelectContainer}
          onClick={onYearMonthClick}
        >
          <Text
            text={formattedYearMonth}
            fontSize="md"
            color={Colors.brown}
            fontWeight="bold"
          />
          <div className={styles.dropdownArrow}></div>
        </div>
      </div>

      {/* 요일 표시 부분 */}
      <div className={styles.dayLabelContainer}>
        <div
          className={`${styles.weekArrow} ${styles.left}`}
          style={{ visibility: "hidden" }}
        >
          <div className={styles.leftTriangle}></div>
        </div>

        <div className={styles.dayLabelScroller}>
          {DAYS_OF_WEEK.map((day, index) => {
            const isSelectedDay = selectedDayIndex === index;

            return (
              <div
                key={day}
                className={`${styles.dayLabelBox} ${
                  isSelectedDay ? styles.selectedDay : ""
                }`}
                onClick={() => handleDaySelect(index)}
              >
                <Text
                  text={day}
                  fontSize="lg"
                  color={isSelectedDay ? Colors.brown : Colors.white}
                  fontWeight="bold"
                />
              </div>
            );
          })}
        </div>

        <div
          className={`${styles.weekArrow} ${styles.right}`}
          style={{ visibility: "hidden" }}
        >
          <div className={styles.rightTriangle}></div>
        </div>
      </div>

      {/* 날짜 선택 부분 */}
      <div className={styles.dayContainer}>
        <div
          className={`${styles.weekArrow} ${styles.left}`}
          onClick={() => handleWeekChange("prev")}
        >
          <div className={styles.leftTriangle}></div>
        </div>

        {/* 현재 주 날짜 */}
        <div
          className={`${styles.dayScroller} ${
            slideDirection ? styles[`slide-${slideDirection}`] : ""
          }`}
        >
          {DAYS_OF_WEEK.map((_, index) => {
            const currentDate = setDay(selectedDate, index, {
              weekStartsOn: 0,
            });
            const day = format(currentDate, "d"); // 'dd'에서 'd'로 변경하여 앞의 0 제거
            const isSelectedDay = selectedDayIndex === index;

            return (
              <div
                key={`day-${index}`}
                className={styles.dayBox}
                onClick={() => handleDaySelect(index)}
              >
                {isSelectedDay ? (
                  <div className={styles.selectedDayBox}>
                    <Text
                      text={day}
                      fontSize="lg"
                      color={Colors.white}
                      fontWeight="bold"
                    />
                  </div>
                ) : (
                  <Text
                    text={day}
                    fontSize="lg"
                    color={Colors.black}
                    fontWeight="bold"
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* 다음 주 날짜 (애니메이션 중일 때만 표시) */}
        {nextWeekDates && (
          <div
            className={`${styles.dayScroller} ${
              styles[`slide-in-${getSlideInDirection()}`]
            }`}
            style={{ position: "absolute", left: "40px" }}
          >
            {DAYS_OF_WEEK.map((_, index) => {
              const currentDate = setDay(nextWeekDates, index, {
                weekStartsOn: 0,
              });
              const day = format(currentDate, "d");
              const isSelectedDay = getDayOfWeekIndex(nextWeekDates) === index;

              return (
                <div key={`next-day-${index}`} className={styles.dayBox}>
                  {isSelectedDay ? (
                    <div className={styles.selectedDayBox}>
                      <Text
                        text={day}
                        fontSize="lg"
                        color={Colors.white}
                        fontWeight="bold"
                      />
                    </div>
                  ) : (
                    <Text
                      text={day}
                      fontSize="lg"
                      color={Colors.black}
                      fontWeight="bold"
                    />
                  )}
                </div>
              );
            })}
          </div>
        )}

        <div
          className={`${styles.weekArrow} ${styles.right}`}
          onClick={() => handleWeekChange("next")}
        >
          <div className={styles.rightTriangle}></div>
        </div>
      </div>
    </div>
  );
}
