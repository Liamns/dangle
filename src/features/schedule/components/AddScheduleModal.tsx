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
import {
  MainCategory,
  SubCategory,
  mainCategoryIds,
  getSubCategoryId,
  mainCategories,
  getSubCategoryNameById,
} from "@/shared/types/schedule-category";
import {
  ScheduleContentFormData,
  ScheduleItemFormData,
} from "@/entities/schedule/schema";
import { ScheduleItemWithContentModel } from "@/entities/schedule/model";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { Text } from "@/shared/components/texts";
import Picker from "react-mobile-picker";
import { div } from "framer-motion/client";

/**
 * 일정 추가 모달 컴포넌트 Props
 */
interface AddScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  scheduleId: number; // 모달을 열 때 필요한 schedule ID
  userId: string; // 현재 로그인한 사용자 ID
  onAddScheduleContent?: (
    scheduleContent: ScheduleContentFormData,
    scheduleItem: Partial<ScheduleItemFormData>,
    isFavorite: boolean,
    userId: string
  ) => Promise<void>;
  onSuccess?: () => void; // 성공 시 호출할 콜백 (예: mutate)

  // 수정 모드 프로퍼티
  isEditMode?: boolean;
  editingItem?:
    | (ScheduleItemWithContentModel & {
        scheduleId: number;
        profileId: string;
      })
    | null;
  onEditScheduleContent?: (
    itemId: number,
    scheduleContent: ScheduleContentFormData,
    startAt: Date,
    isFavorite: boolean
  ) => Promise<void>;

  // 날짜 선택 관련 속성 추가
  onDatePickerOpen: (initialDate: Date, callback: (date: Date) => void) => void;
}

/**
 * 일정 추가/수정 모달 컴포넌트
 * 특정 schedule에 새로운 scheduleContent를 추가하거나 기존 일정을 수정하기 위한 모달입니다.
 */

const AddScheduleModal: React.FC<AddScheduleModalProps> = ({
  isOpen,
  onClose,
  scheduleId,
  userId,
  onAddScheduleContent,
  onSuccess,
  isEditMode = false,
  editingItem = null,
  onEditScheduleContent,
  onDatePickerOpen,
}) => {
  // 선택된 카테고리 상태 관리
  const [mainCategory, setMainCategory] = useState<MainCategory>(
    isEditMode &&
      editingItem &&
      editingItem.content &&
      editingItem.content.mainId !== undefined
      ? (mainCategories[editingItem.content.mainId] as MainCategory) || "일상"
      : "일상"
  );
  const [subCategory, setSubCategory] = useState<SubCategory>(
    isEditMode &&
      editingItem &&
      editingItem.content &&
      editingItem.content.mainId !== undefined &&
      editingItem.content.subId !== undefined
      ? (getSubCategoryNameById(
          editingItem.content.mainId,
          editingItem.content.subId
        ) as SubCategory) || "산책"
      : "산책"
  );

  // 일정 내용 상태 관리
  const [scheduleContent, setScheduleContent] =
    useState<ScheduleContentFormData>({
      mainId:
        isEditMode &&
        editingItem &&
        editingItem.content &&
        editingItem.content.mainId !== undefined
          ? editingItem.content.mainId
          : mainCategoryIds[mainCategory],
      subId:
        isEditMode &&
        editingItem &&
        editingItem.content &&
        editingItem.content.subId !== undefined
          ? editingItem.content.subId
          : getSubCategoryId(mainCategory, subCategory),
      description:
        isEditMode &&
        editingItem &&
        editingItem.content &&
        editingItem.content.description
          ? editingItem.content.description
          : "",
    });

  // 일정 시작 날짜/시간 관리
  const [startDate, setStartDate] = useState<Date>(
    isEditMode && editingItem && editingItem.startAt
      ? new Date(editingItem.startAt)
      : new Date()
  );

  // 시간 선택기 관련 상태
  const generateHours = () =>
    Array.from({ length: 24 }, (_, i) => String(i).padStart(2, "0"));
  const generateMinutes = () =>
    Array.from({ length: 60 }, (_, i) => String(i).padStart(2, "0"));

  const [pickerValue, setPickerValue] = useState({
    hour: String(startDate.getHours()).padStart(2, "0"),
    minute: String(startDate.getMinutes()).padStart(2, "0"),
  });

  type PickerOptions = {
    hour: string[];
    minute: string[];
  };

  const [pickerOptions] = useState<PickerOptions>({
    hour: generateHours(),
    minute: generateMinutes(),
  });

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

    // 카테고리 변경 시 scheduleContent 상태 업데이트
    const mainId = mainCategoryIds[main];
    const subId = getSubCategoryId(main, sub);

    setScheduleContent((prev) => ({
      ...prev,
      mainId,
      subId,
    }));
  };

  // 설명 변경 핸들러
  const handleDescriptionChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setScheduleContent((prev) => ({
      ...prev,
      description: e.target.value,
    }));
  };

  // 날짜 변경 핸들러
  const handleDateChange = (date: Date) => {
    setStartDate(date);
  };

  // 날짜 선택 모달 열기 핸들러
  const handleOpenDatePicker = () => {
    onDatePickerOpen(startDate, (selectedDate: Date) => {
      // 기존 시간 정보 유지
      const newDate = new Date(selectedDate);
      const hours = parseInt(pickerValue.hour);
      const minutes = parseInt(pickerValue.minute);

      newDate.setHours(hours);
      newDate.setMinutes(minutes);

      setStartDate(newDate);
    });
  };

  // 시간 변경 핸들러
  const handleTimeChange = (newValue: any) => {
    setPickerValue(newValue);

    // 날짜 객체에 선택된 시간 적용
    const newDate = new Date(startDate);
    newDate.setHours(parseInt(newValue.hour));
    newDate.setMinutes(parseInt(newValue.minute));
    setStartDate(newDate);
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
        onEditScheduleContent &&
        editingItem &&
        editingItem.id
      ) {
        // 수정 모드: 기존 일정 아이템 수정
        await onEditScheduleContent(
          editingItem.id,
          scheduleContent,
          startDate,
          isFavorite
        );
      } else if (onAddScheduleContent) {
        // 추가 모드: 새 일정 추가
        const scheduleItem: Partial<ScheduleItemFormData> = {
          scheduleId,
          startAt: startDate,
        };

        await onAddScheduleContent(
          scheduleContent,
          scheduleItem,
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
        <div className={styles.timePickerWrapper}>
          <div className={styles.timeSelected}></div>
          <div className={styles.timePickerLabel}>
            <Text
              text="시작시간"
              color={Colors.black}
              fontWeight="bold"
              fontSize="md"
            />
          </div>
          <Spacer width="40" />
          <div className={styles.timePickerContainer}>
            <Picker
              value={pickerValue}
              onChange={handleTimeChange}
              height={90}
              itemHeight={30}
              wheelMode="natural"
            >
              {Object.keys(pickerOptions).map((key) => (
                <Picker.Column key={key} name={key}>
                  {pickerOptions[key as keyof PickerOptions].map(
                    (option: string) => (
                      <Picker.Item key={option} value={option}>
                        {({ selected }) => (
                          <Text
                            text={option}
                            color={selected ? Colors.black : Colors.invalid}
                            fontWeight={selected ? "bold" : "normal"}
                            fontSize="md"
                          />
                        )}
                      </Picker.Item>
                    )
                  )}
                </Picker.Column>
              ))}
            </Picker>
          </div>
        </div>

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
