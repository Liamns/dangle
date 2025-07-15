"use client";
import React, { useState } from "react";
import Modal from "@/shared/components/modals";
import { Button } from "@/shared/components/buttons";
import { InnerBox, Spacer } from "@/shared/components/layout";
import { Colors } from "@/shared/consts/colors";
import styles from "./AddScheduleModal.module.scss";
import Close from "@/shared/svgs/close.svg";
import EmptySchedule from "@/shared/svgs/empty-schedule.svg";
import CategorySelector from "./CategorySelector";
import { ScheduleItemFormData } from "@/entities/schedule/schema";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { Text } from "@/shared/components/texts";
import TimePicker, { TimePickerOptions } from "@/shared/components/TimePicker";
import {
  getSubCategoryId,
  getSubCategoryNameById,
  mainCategories,
  MainCategory,
  mainCategoryIds,
  SubCategory,
} from "@/entities/schedule/types";
import { ScheduleItemWithSubCategoryModel } from "@/entities/schedule/model";

/**
 * 일정 추가 모달 컴포넌트 Props
 */
interface AddScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  scheduleId: number; // 모달을 열 때 필요한 schedule ID
  userId: string; // 현재 로그인한 사용자 ID
  onAddScheduleItem?: (
    scheduleItem: Partial<ScheduleItemFormData>,
    isFavorite: boolean,
    userId: string
  ) => Promise<void>;
  onSuccess?: () => void; // 성공 시 호출할 콜백 (예: mutate)

  // 수정 모드 프로퍼티
  isEditMode?: boolean;
  editingItem?:
    | (ScheduleItemWithSubCategoryModel & {
        scheduleId: number;
        profileId: string;
      })
    | null;
  onEditScheduleItem?: (
    itemId: number,
    scheduleItem: Partial<ScheduleItemFormData>,
    isFavorite: boolean
  ) => Promise<void>;

  // 날짜 선택 관련 속성 추가
  onDatePickerOpen: (initialDate: Date, callback: (date: Date) => void) => void;
}

/**
 * 일정 추가/수정 모달 컴포넌트
 * 특정 schedule에 새로운 scheduleItem을 추가하거나 기존 일정을 수정하기 위한 모달입니다.
 */

const AddScheduleModal: React.FC<AddScheduleModalProps> = ({
  isOpen,
  onClose,
  scheduleId,
  userId,
  onAddScheduleItem,
  onSuccess,
  isEditMode = false,
  editingItem = null,
  onEditScheduleItem,
  onDatePickerOpen,
}) => {
  // 선택된 카테고리 상태 관리
  const [mainCategory, setMainCategory] = useState<MainCategory>(
    isEditMode &&
      editingItem &&
      editingItem.subCategory &&
      editingItem.subCategory.mainId !== undefined
      ? (mainCategories[editingItem.subCategory.mainId] as MainCategory) ||
          "일상"
      : "일상"
  );
  const [subCategory, setSubCategory] = useState<SubCategory>(
    isEditMode &&
      editingItem &&
      editingItem.subCategory &&
      editingItem.subCategory.mainId !== undefined &&
      editingItem.subCategory.id !== undefined
      ? (getSubCategoryNameById(
          editingItem.subCategory.mainId,
          editingItem.subCategory.id
        ) as SubCategory) || "산책"
      : "산책"
  );

  // 일정 내용 상태 관리
  const [scheduleItemData, setScheduleItemData] = useState<Partial<ScheduleItemFormData>>({
    subCategoryId:
      isEditMode &&
      editingItem &&
      editingItem.subCategory &&
      editingItem.subCategory.id !== undefined
        ? editingItem.subCategory.id
        : getSubCategoryId(mainCategory, subCategory),
  });

  // 일정 시작 날짜/시간 관리
  const [startDate, setStartDate] = useState<Date>(
    isEditMode && editingItem && editingItem.startAt
      ? new Date(editingItem.startAt)
      : new Date()
  );

  // 날짜 형식 지정
  const formattedDate = format(startDate, "yyyy년 MM월 dd일", {
    locale: ko,
  });

  // 즐겨찾기 여부 상태 (수정 모드에서는 현재 상태를 유지하기 위한 로직)
  const [isFavorite, setIsFavorite] = useState<boolean>(
    isEditMode && editingItem && "isFavorite" in editingItem
      ? !!editingItem.isFavorite
      : false
  );

  // 로딩 상태
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // 카테고리 변경 핸들러
  const handleCategoryChange = (main: MainCategory, sub: SubCategory) => {
    setMainCategory(main);
    setSubCategory(sub);

    // 카테고리 변경 시 scheduleItemData 상태 업데이트
    const subId = getSubCategoryId(main, sub);

    setScheduleItemData((prev) => ({
      ...prev,
      subCategoryId: subId,
    }));
  };

  // 날짜 선택 모달 열기 핸들러
  const handleOpenDatePicker = () => {
    onDatePickerOpen(startDate, (selectedDate: Date) => {
      // 선택된 날짜 부분만 교체하고, 시간은 기존 startDate 유지
      const newDate = new Date(startDate);
      newDate.setFullYear(
        selectedDate.getFullYear(),
        selectedDate.getMonth(),
        selectedDate.getDate()
      );
      setStartDate(newDate);
    });
  };

  // 즐겨찾기 변경 핸들러 (단순히 상태만 변경)
  const handleFavoriteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsFavorite(e.target.checked);
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);

      if (
        isEditMode &&
        onEditScheduleItem &&
        editingItem &&
        editingItem.id
      ) {
        // 수정 모드: 기존 일정 아이템 수정
        await onEditScheduleItem(
          editingItem.id,
          { ...scheduleItemData, startAt: startDate },
          isFavorite
        );
      } else if (onAddScheduleItem) {
        // 추가 모드: 새 일정 추가
        await onAddScheduleItem(
          { ...scheduleItemData, scheduleId, startAt: startDate },
          isFavorite,
          userId
        );
      } else {
        // 콜백이 없는 경우
        console.error(
          isEditMode ? "수정 콜백이 없습니다" : "추가 콜백이 없습니다"
        );
        return;
      }

      // 성공 콜백 호출 (mutate 등)
      if (onSuccess) {
        onSuccess();
      }

      // 모달 닫기
      onClose();
    } catch (error) {
      console.error(isEditMode ? "일정 수정 오류:" : "일정 추가 오류:", error);
      // 오류 처리 로직 (예: 토스트 메시지 표시)
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} variant="center">
      <div className={styles.container}>
        <InnerBox direction="row" justify="end" align="center">
          <Close
            color={Colors.brown}
            width={10}
            height={10}
            onClick={onClose}
          />
        </InnerBox>

        <Spacer height="20" />

        {/* 카테고리 선택 */}
        <CategorySelector
          mainCategory={mainCategory}
          subCategory={subCategory}
          onCategoryChange={handleCategoryChange}
        />

        <Spacer height="10" />

        {/* 즐겨찾기 설정 UI */}
        <InnerBox
          direction="row"
          align="center"
          justify="start"
          className={styles.favoriteContainer}
        >
          <label className={styles.favoriteCheckbox}>
            <input
              type="checkbox"
              checked={isFavorite}
              onChange={handleFavoriteChange}
            />
            <span className={styles.checkmark}></span>
          </label>
          <Text text="즐겨찾기 등록" color={Colors.brown}></Text>
        </InnerBox>

        <Spacer height="16" />
        <div className={styles.divider}></div>
        <Spacer height="16" />

        {/* 날짜 선택 UI */}
        <InnerBox
          direction="row"
          align="center"
          justify="space-between"
          className={styles.datePickerContainer}
        >
          <Text
            text={formattedDate}
            color={Colors.brown}
            fontWeight="bold"
            fontSize="md"
          />
          <div
            onClick={handleOpenDatePicker}
            className={styles.datePickerButton}
          >
            <EmptySchedule />
          </div>
        </InnerBox>

        <Spacer height="16" />
        <div className={styles.divider}></div>

        {/* 시간 선택 UI */}
        <TimePicker value={startDate} onChange={setStartDate} />

        <Spacer height="10" />

        {/* 여기에 일정 설명 입력 UI 추가 예정 */}

        {/* 등록/수정 버튼 */}
        <Button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className={styles.submitButton}
          fontSize="md"
          width="210"
          height="37"
        >
          {isSubmitting
            ? isEditMode
              ? "수정 중..."
              : "등록 중..."
            : isEditMode
              ? "일정 수정"
              : "일정 추가"}
        </Button>
      </div>
    </Modal>
  );
};

export default AddScheduleModal;
