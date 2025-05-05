"use client";
import { BottomModal } from "@/shared/components/modals";
import { InnerBox, Spacer } from "@/shared/components/layout";
import { Text } from "@/shared/components/texts";
import { Colors } from "@/shared/consts/colors";
import { formatDateToKorean, getShortKoreanDayOfWeek } from "@/shared/lib/date";
import styles from "@/app/home/page.module.scss";
import imgStyles from "@/shared/styles/images.module.scss";
import Share from "@/shared/svgs/share.svg";
import Image from "next/image";
import { Button } from "@/shared/components/buttons";
import Plus from "@/shared/svgs/plus.svg";
import { useEffect, useState, useCallback, memo } from "react";

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

  /**
   * 공유 버튼 클릭 핸들러
   */
  const handleShareClick = useCallback(() => {
    alert("공유하기");
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
    >
      <ScheduleHeader
        formattedDate={formattedDate}
        dayOfWeek={todayDayOfWeek}
        onShareClick={handleShareClick}
      />

      <Spacer height="16" />

      <ScheduleContent />
      <Spacer height="80" />
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
    );
  }
);

ScheduleHeader.displayName = "ScheduleHeader";

/**
 * 스케줄 콘텐츠 컴포넌트
 * 스케줄 내용과 버튼을 표시합니다.
 */
const ScheduleContent = memo(() => {
  return (
    <InnerBox style={{ flex: 1 }}>
      <div className={imgStyles.square}>
        <Image src={"/images/shared/empty.png"} alt="empty" fill sizes="100%" />
      </div>
      <Button color={Colors.primary} width="250" height="40">
        <InnerBox direction="row">
          <Text
            text={`일정을 추가해주세요\u00a0`}
            fontWeight="bold"
            color={Colors.brown}
          />
          <Plus color={Colors.brown} />
        </InnerBox>
      </Button>
    </InnerBox>
  );
});

ScheduleContent.displayName = "ScheduleContent";
