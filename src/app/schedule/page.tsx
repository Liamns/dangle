"use client";
import { ArrowButton } from "@/shared/components/buttons";
import BottomNavBar from "../../shared/components/bottom-nav-bar";
import {
  Card,
  InnerBox,
  InnerWrapper,
  Spacer,
} from "../../shared/components/layout";
import { useRouter } from "next/navigation";
import Image from "next/image";
import styles from "./page.module.scss";
import { Text } from "@/shared/components/texts";
import { Colors } from "@/shared/consts/colors";
import { useState } from "react";
import DatePickerModal from "@/shared/components/DatePickerModal";
import WeekCalendar from "@/features/schedule/components/WeekCalendar";
import ScheduleContent from "@/features/schedule/components/ScheduleContent";

export default function Schedule() {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);

  // 날짜 선택 시 처리 함수
  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
      setShowDatePicker(false);
    }
  };

  return (
    <InnerWrapper>
      <Spacer height="40" />

      <InnerBox px="30" direction="row" justify="space-between">
        <ArrowButton width="30" ml="0" onClick={() => router.back()}>
          <Image
            src="/images/white-bracket.png"
            alt="뒤로가기"
            width={5}
            height={8}
            style={{ objectFit: "cover" }}
            sizes="100%"
          />
        </ArrowButton>

        <div className={styles.importBtn}>
          <Text text="불러오기" color={Colors.white} fontWeight="bold" />
          <Image
            src="/images/schedule/import.png"
            alt="불러오기"
            width={10}
            height={13}
          />
        </div>
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

      <Card mx="30" px="24" py="0" height="504">
        <Spacer height="16" />

        <ScheduleContent
          isEditMode={isEditMode}
          setIsEditMode={setIsEditMode}
          isFavorite={false}
        />
      </Card>

      {/* DatePickerModal 컴포넌트 */}
      <DatePickerModal
        isOpen={showDatePicker}
        onClose={() => setShowDatePicker(false)}
        selectedDate={selectedDate}
        onDateSelect={handleDateSelect}
        title="날짜 선택"
      />

      <BottomNavBar />
    </InnerWrapper>
  );
}
