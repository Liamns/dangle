"use client";
import { BottomModal } from "@/shared/components/modals";
import Modal from "@/shared/components/modals";
import { InnerBox, Spacer } from "@/shared/components/layout";
import { Text } from "@/shared/components/texts";
import { Colors } from "@/shared/consts/colors";
import { formatDateToKorean, getShortKoreanDayOfWeek } from "@/shared/lib/date";
import styles from "@/app/home/page.module.scss";
import imgStyles from "@/shared/styles/images.module.scss";
import modalStyles from "./ScheduleBottomModal.module.scss";
import Share from "@/shared/svgs/share.svg";
import Image from "next/image";
import { Button } from "@/shared/components/buttons";
import Plus from "@/shared/svgs/plus.svg";
import React, { useEffect, useState, useCallback, memo, useRef } from "react";
import cn from "classnames";
import useSWR from "swr";
import Edit from "@/shared/svgs/edit.svg";
import Delete from "@/shared/svgs/delete.svg";
import { getTodaySchedules } from "../apis";
import {
  ScheduleWithItemsModel,
  ScheduleItemWithContentModel,
} from "@/entities/schedule/model";
import {
  ScheduleContentFormData,
  ScheduleItemFormData,
} from "@/entities/schedule/schema";
import LoadingOverlay from "@/shared/components/LoadingOverlay";
import {
  getSubCategoryImagePath,
  SubCategory,
} from "@/shared/types/schedule-category";
import AddScheduleModal from "./AddScheduleModal";
import DatePickerModal from "@/shared/components/DatePickerModal";
import ScheduleContents from "./ScheduleContents";
import { useUserStore } from "@/entities/user/store";
import { useRouter } from "next/navigation";

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
  const [datePickerCallback, setDatePickerCallback] = useState<
    ((date: Date) => void) | null
  >(null);

  const router = useRouter();

  // 날짜 선택 핸들러 함수들
  const openDatePicker = useCallback(
    (initialDate: Date, callback: (date: Date) => void) => {
      setSelectedDate(initialDate);
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

  // useSWR을 사용하여 오늘의 일정 데이터 페칭
  const {
    data: schedules,
    error,
    isLoading,
  } = useSWR("todaySchedules", () => getTodaySchedules());

  // empty 상태 체크
  const isEmpty =
    !isLoading && !error && (!schedules || schedules.length === 0);

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
        <ScheduleContents
          schedules={schedules}
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
        selectedDate={selectedDate}
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
