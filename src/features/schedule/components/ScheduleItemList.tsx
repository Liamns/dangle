"use client";

import React, { memo, useCallback, useState } from "react";
import { InnerBox, Spacer } from "@/shared/components/layout";
import { Text } from "@/shared/components/texts";
import { Colors } from "@/shared/consts/colors";
import LoadingOverlay from "@/shared/components/LoadingOverlay";
import Image from "next/image";
import { Button } from "@/shared/components/buttons";
import Plus from "@/shared/svgs/plus.svg";
import AddScheduleModal from "./AddScheduleModal";
import { useUserStore } from "@/entities/user/store";
import useSWR from "swr";
import {
  NewScheduleItem,
  ScheduleItemWithSubCategoryModel,
  ScheduleWithItemsModel,
} from "@/entities/schedule/model";
import { ScheduleItemFormData } from "@/entities/schedule/schema";
import modalStyles from "./ScheduleBottomModal.module.scss";
import imgStyles from "@/shared/styles/images.module.scss";
import ScheduleItem from "./ScheduleItem";
import { useSchedules } from "../hooks/useSchedules";
import { useProfileStore } from "@/entities/profile/store";
import { getSubCategoryNameById } from "@/entities/schedule/types";
import { COMMON_MESSAGE } from "@/shared/consts/messages";

interface ScheduleItemListProps {
  schedule: ScheduleWithItemsModel;
  isLoading: boolean;
  error: any;
  openDatePicker?: (initialDate: Date, callback: (date: Date) => void) => void;
  hasAddBtn?: boolean;
  onEmptyAddClick?: () => void;
  selectedDate: Date;
}

const ScheduleItemList = memo(
  ({
    schedule,
    isLoading,
    error,
    openDatePicker,
    hasAddBtn = true,
    onEmptyAddClick,
    selectedDate,
  }: ScheduleItemListProps) => {
    const [activeItemId, setActiveItemId] = useState<number | null>(null);
    const [isAddMode, setIsAddMode] = useState<boolean>(false);
    const [isEditMode, setIsEditMode] = useState<boolean>(false);
    const [editingItem, setEditingItem] = useState<
      | (ScheduleItemWithSubCategoryModel & {
          scheduleId: number;
          profileId: string;
        })
      | null
    >(null);
    const { currentProfile } = useProfileStore();
    const {
      revalidateSchedule,
      updateSchedule,
      updateError,
      addSchedule,
      addError,
      deleteError,
      deleteScheduleItem,
    } = useSchedules(selectedDate.toLocaleDateString("en-CA"));

    const handleAdd = useCallback(
      async (
        scheduleItem: NewScheduleItem,
        isFavorite: boolean,
        profileId: string,
        date: Date | string
      ) => {
        const typed = scheduleItem as NewScheduleItem;
        const subName = getSubCategoryNameById(typed.subCategory.id);
        if (!subName) {
          alert(COMMON_MESSAGE.WRONG_ACCESS);
          return;
        }
        const inputData = {
          [subName]: { ...typed, isFavorite: isFavorite },
        };
        await addSchedule({
          inputData: inputData,
          profileId: profileId,
          date: date,
        });
      },
      [currentProfile]
    );

    const handleEdit = useCallback(
      async (
        itemId: number,
        scheduleItem: Partial<ScheduleItemFormData>,
        isFavorite: boolean
      ) => {
        await updateSchedule({
          itemId: itemId,
          item: scheduleItem as Omit<ScheduleItemFormData, "scheduleId">,
          isFavorite: isFavorite,
        });
      },
      [schedule]
    );

    const handleDelete = useCallback(
      async (item: { scheduleId: number; subId: number }) => {
        if (window.confirm("정말로 이 일정을 삭제하시겠습니까?")) {
          await deleteScheduleItem({
            scheduleId: item.scheduleId,
            subId: item.subId,
          });
          revalidateSchedule();
        }
      },
      [schedule]
    );

    if (isLoading) return <LoadingOverlay isLoading={isLoading} />;
    if (error)
      return (
        <InnerBox className={modalStyles.errorContainer}>
          <div className={imgStyles.square}>
            <Image
              src="/images/shared/error.png"
              alt="error"
              fill
              sizes="100%"
            />
          </div>
          <Text text="오류가 발생했습니다." color={Colors.error} />
        </InnerBox>
      );
    if (
      !schedule ||
      !schedule.items ||
      (schedule.items && schedule.items.length === 0)
    )
      return (
        <InnerBox className={modalStyles.emptyContainer}>
          <InnerBox
            direction="row"
            justify="center"
            style={{ alignItems: "baseline" }}
          >
            <Text
              text="댕글"
              fontWeight="bold"
              color={Colors.brown}
              fontSize="lg"
              fontFamily="jalnan"
            />
            <Text text="로" fontSize="lg" color={Colors.brown} />
          </InnerBox>
          <Text
            text="반려생활을 등록해요!"
            fontSize="lg"
            color={Colors.brown}
          />
          <div className={imgStyles.square}>
            <Image
              src="/images/shared/empty.png"
              alt="empty"
              fill
              sizes="100%"
            />
          </div>
          <Button
            color={Colors.primary}
            width="250"
            height="40"
            onClick={onEmptyAddClick}
          >
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

    const allScheduleItems = schedule.items
      .map((item) => ({
        ...item,
        scheduleId: schedule.id,
        profileId: schedule.profileId,
      }))
      .sort(
        (a, b) => new Date(a.startAt).getTime() - new Date(b.startAt).getTime()
      );

    return (
      <InnerBox
        className={modalStyles.scheduleItemListContainer}
        justify="start"
      >
        {allScheduleItems.map((item) => (
          <ScheduleItem
            key={item.id}
            item={item}
            isActive={activeItemId === item.id}
            onActivate={() => setActiveItemId(item.id)}
            onEdit={(it) => {
              setEditingItem(it);
              setIsEditMode(true);
              setActiveItemId(null);
            }}
            onDelete={handleDelete}
          />
        ))}
        {hasAddBtn && (
          <div
            className={modalStyles.addScheduleButton}
            onClick={() => setIsAddMode(true)}
          >
            <InnerBox direction="row" justify="center">
              <Text
                text={`일정 추가하기\u00a0`}
                fontWeight="bold"
                color={Colors.black}
              />
              <Plus color={Colors.black} />
            </InnerBox>
          </div>
        )}
        {currentProfile && (
          <AddScheduleModal
            isOpen={isAddMode}
            onClose={() => setIsAddMode(false)}
            scheduleId={schedule.id}
            profileId={currentProfile.id}
            onAddScheduleItem={handleAdd}
            onSuccess={() => {
              revalidateSchedule();
              setIsAddMode(false);
            }}
            onDatePickerOpen={openDatePicker!}
          />
        )}
        {isEditMode && editingItem && schedule && currentProfile && (
          <AddScheduleModal
            isOpen={isEditMode}
            onClose={() => setIsEditMode(false)}
            scheduleId={editingItem.scheduleId}
            profileId={currentProfile.id}
            isEditMode
            editingItem={editingItem}
            onEditScheduleItem={handleEdit}
            onSuccess={() => {
              revalidateSchedule();
              setIsEditMode(false);
            }}
            onDatePickerOpen={openDatePicker!}
          />
        )}
      </InnerBox>
    );
  }
);

ScheduleItemList.displayName = "ScheduleItemList";

export default ScheduleItemList;
