"use client";
import { ArrowButton } from "@/shared/components/buttons";
import BottomNavBar from "../../shared/components/bottom-nav-bar";
import {
  Card,
  InnerBox,
  InnerWrapper,
  Spacer,
} from "../../shared/components/layout";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import styles from "./page.module.scss";
import { Text } from "@/shared/components/texts";
import { Colors } from "@/shared/consts/colors";
import { useState, useCallback, useEffect } from "react";
import DatePickerModal from "@/shared/components/DatePickerModal";
import WeekCalendar from "@/features/schedule/components/WeekCalendar";
import ScheduleAddBox from "@/features/schedule/components/ScheduleAddBox";
import ScheduleContentBox from "@/features/schedule/components/ScheduleContentBox";
import { useSchedules } from "@/features/schedule/hooks/useSchedules";

export default function Schedule() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isEditMode = searchParams.get("edit") === "true";

  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [datePickerInitialDate, setDatePickerInitialDate] = useState<Date>(
    new Date()
  );
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
  const [datePickerCallback, setDatePickerCallback] = useState<
    ((date: Date) => void) | null
  >(null);

  const {
    schedule,
    revalidateSchedule,
    isProcessing: isLoading,
  } = useSchedules(selectedDate.toLocaleDateString("en-CA"));
  useEffect(() => {
    revalidateSchedule();
  }, [router, selectedDate]);

  // edit mode 변경 시 URL 업데이트
  const handleEditModeChange = useCallback(
    (edit: boolean) => {
      if (edit) router.push("/schedule?edit=true");
      else router.push("/schedule");
    },
    [router]
  );

  // 날짜 선택 시 처리 함수
  const handleDateSelect = useCallback(
    (date: Date | undefined) => {
      if (date) {
        setSelectedDate(date);
        if (datePickerCallback) datePickerCallback(date);
        setShowDatePicker(false);
      }
    },
    [datePickerCallback]
  );

  // openDatePicker: child components trigger date picker
  const openDatePicker = useCallback(
    (initialDate: Date, callback: (date: Date) => void) => {
      // 날짜 선택기의 초기 날짜만 설정하고, selectedDate는 변경하지 않음
      setDatePickerInitialDate(initialDate);
      setDatePickerCallback(() => callback);
      setShowDatePicker(true);
    },
    []
  );

  return (
    <InnerWrapper>
      <Spacer height="40" />

      <InnerBox px="30" direction="row" justify="space-between">
        <ArrowButton
          width="30"
          ml="0"
          onClick={() => {
            isEditMode ? handleEditModeChange(false) : router.back();
          }}
        >
          <Image
            src="/images/white-bracket.png"
            alt="뒤로가기"
            width={5}
            height={8}
            style={{ objectFit: "cover" }}
            sizes="100%"
          />
        </ArrowButton>

        {isEditMode && (
          <div className={styles.importBtn} onClick={() => alert("불러오기")}>
            <Text text="불러오기" color={Colors.white} fontWeight="bold" />
            <Image
              src="/images/schedule/import.png"
              alt="불러오기"
              width={10}
              height={13}
            />
          </div>
        )}
      </InnerBox>

      <Spacer height="8" />

      {/* WeekCalendar 컴포넌트 적용 */}
      <InnerBox>
        <WeekCalendar
          selectedDate={selectedDate}
          onDateChange={setSelectedDate}
          onYearMonthClick={() => setShowDatePicker(true)}
        />
      </InnerBox>

      <Spacer height="18" />

      <Card
        width="324"
        mx="18"
        px="24"
        py={isEditMode ? "16" : "0"}
        height={isEditMode ? "485" : "504"}
        style={{
          paddingBottom: isEditMode ? undefined : "calc(100dvh / 740 * 80)",
        }}
      >
        {isEditMode ? (
          <ScheduleAddBox selectedDate={selectedDate} />
        ) : (
          <ScheduleContentBox
            isEditMode={isEditMode}
            setIsEditMode={handleEditModeChange}
            selectedDate={selectedDate}
            openDatePicker={openDatePicker}
            schedule={schedule}
            isLoading={isLoading}
          />
        )}
      </Card>

      {/* DatePickerModal 컴포넌트 */}
      <DatePickerModal
        isOpen={showDatePicker}
        onClose={() => setShowDatePicker(false)}
        selectedDate={selectedDate}
        onDateSelect={handleDateSelect}
        title="날짜 선택"
      />

      {!isEditMode && <BottomNavBar />}
    </InnerWrapper>
  );
}
