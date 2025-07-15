"use client";
import { BottomModal } from "@/shared/components/modals";
import { InnerBox, Spacer } from "@/shared/components/layout";
import { Text } from "@/shared/components/texts";
import { Colors } from "@/shared/consts/colors";
import { formatDateToKorean, getShortKoreanDayOfWeek } from "@/shared/lib/date";
import styles from "@/app/home/page.module.scss";
import modalStyles from "./ScheduleBottomModal.module.scss";
import Share from "@/shared/svgs/share.svg";
import React, { useEffect, useState, useCallback, memo } from "react";
import cn from "classnames";
import DatePickerModal from "@/shared/components/DatePickerModal";
import { useRouter } from "next/navigation";
import { useSchedules } from "../hooks/useSchedules";
import { useScheduleStore } from "@/entities/schedule/store";
import ScheduleItemList from "./ScheduleItemList";

/**
 * ScheduleBottomModal Props 인터페이스
 */
interface ScheduleBottomModalProps {
  initialHeight?: number;
}

/**
 * 스케줄 바텀 모달 컴포넌트
 * 홈 화면에서 사용되는 스케줄 정보를 표시하는 모달입니다.
 */
export default function ScheduleBottomModal({
  initialHeight = 0,
}: ScheduleBottomModalProps) {
  const formattedDate = formatDateToKorean();
  const todayDayOfWeek = getShortKoreanDayOfWeek();
  const [innerBoxHeight, setInnerBoxHeight] = useState(initialHeight);

  // 날짜 선택기 모달 상태 관리
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [datePickerInitialDate, setDatePickerInitialDate] = useState<Date>(
    new Date()
  );
  const [datePickerCallback, setDatePickerCallback] = useState<
    ((date: Date) => void) | null
  >(null);

  const router = useRouter();

  // 날짜 선택 핸들러 함수들
  const openDatePicker = useCallback(
    (initialDate: Date, callback: (date: Date) => void) => {
      // 날짜 선택기의 초기 날짜만 설정하고, selectedDate는 변경하지 않음
      setDatePickerInitialDate(initialDate);
      setDatePickerCallback(() => callback);
      setShowDatePicker(true);
    },
    []
  );

  const closeDatePicker = useCallback(() => {
    setShowDatePicker(false);
  }, []);

  const handleDateSelect = useCallback(
    (date: Date | undefined) => {
      if (date && datePickerCallback) {
        datePickerCallback(date);
      }
      closeDatePicker();
    },
    [datePickerCallback, closeDatePicker]
  );

  const { currentSchedule: schedule } = useScheduleStore();
  const { fetchError: error, isProcessing: isLoading } = useSchedules();

  // empty 상태 체크: scheduleItems가 없으면 빈 상태
  const isEmpty =
    !isLoading && !error && (!schedule?.items || schedule.items.length === 0);

  /**
   * 공유 버튼 클릭 핸들러
   */
  const handleShareClick = useCallback(() => {
    router.push("/schedule");
  }, []);

  // initialHeight가 변경되면 innerBoxHeight 업데이트
  useEffect(() => {
    setInnerBoxHeight(initialHeight);
  }, [initialHeight]);

  return (
    <BottomModal
      draggable
      width="90%"
      py="20"
      px="24"
      justify="start"
      align="center"
      minHeight={innerBoxHeight}
      style={{ paddingBottom: "calc(100dvh / 740 * 60)" }}
    >
      <ScheduleHeader
        formattedDate={formattedDate}
        dayOfWeek={todayDayOfWeek}
        onShareClick={handleShareClick}
      />
      <div className={cn(modalStyles.scrollable, isEmpty && modalStyles.empty)}>
        <ScheduleItemList
          schedule={schedule}
          isLoading={isLoading}
          error={error}
          openDatePicker={openDatePicker}
          onEmptyAddClick={() => {
            router.push("/schedule?edit=true");
          }}
        />
      </div>

      {/* DatePickerModal은 컴포넌트의 최상위 레벨에서 렌더링하여 중첩 모달 문제 방지 */}
      <DatePickerModal
        isOpen={showDatePicker}
        onClose={closeDatePicker}
        onBack={closeDatePicker}
        title="날짜 선택"
        selectedDate={datePickerInitialDate}
        onDateSelect={handleDateSelect}
      />
    </BottomModal>
  );
}

/**
 * 스케줄 헤더 컴포넌트 Props
 */
interface ScheduleHeaderProps {
  formattedDate: string;
  dayOfWeek: string;
  onShareClick: () => void;
}

/**
 * 스케줄 헤더 컴포넌트
 * 날짜와 공유 버튼을 표시합니다.
 */
const ScheduleHeader = memo(
  ({ formattedDate, dayOfWeek, onShareClick }: ScheduleHeaderProps) => {
    return (
      <div className={modalStyles.scheduleHeader}>
        <InnerBox direction="row">
          <Text
            text={`${formattedDate} [ ${dayOfWeek}요일 ]`}
            fontWeight="bold"
            fontSize="title"
            color={Colors.brown}
          />
          <Spacer width="12" />
          <div className={styles.share} onClick={onShareClick}>
            <Share />
          </div>
        </InnerBox>
      </div>
    );
  }
);

ScheduleHeader.displayName = "ScheduleHeader";
