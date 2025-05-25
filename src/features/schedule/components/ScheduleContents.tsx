"use client";

import React, { memo, useState } from "react";
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
  ScheduleWithItemsModel,
  ScheduleItemWithContentModel,
} from "@/entities/schedule/model";
import {
  ScheduleContentFormData,
  ScheduleItemFormData,
} from "@/entities/schedule/schema";
import modalStyles from "./ScheduleBottomModal.module.scss";
import imgStyles from "@/shared/styles/images.module.scss";
import ScheduleItem from "./ScheduleItem";

interface ScheduleContentsProps {
  schedules: ScheduleWithItemsModel[] | undefined;
  isLoading: boolean;
  error: any;
  openDatePicker?: (initialDate: Date, callback: (date: Date) => void) => void;
  hasAddBtn?: boolean;
  onEmptyAddClick?: () => void;
}

const ScheduleContents = memo(
  ({
    schedules,
    isLoading,
    error,
    openDatePicker,
    hasAddBtn = true,
    onEmptyAddClick,
  }: ScheduleContentsProps) => {
    const [activeItemId, setActiveItemId] = useState<number | null>(null);
    const [isAddMode, setIsAddMode] = useState<boolean>(false);
    const [isEditMode, setIsEditMode] = useState<boolean>(false);
    const [editingItem, setEditingItem] = useState<
      | (ScheduleItemWithContentModel & {
          scheduleId: number;
          profileId: string;
        })
      | null
    >(null);
    const currentUser = useUserStore((state) => state.currentUser);
    const { mutate } = useSWR("todaySchedules");

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
    if (!schedules || schedules.length === 0)
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

    const allScheduleItems = schedules
      .flatMap((schedule) =>
        schedule.scheduleItems.map((item) => ({
          ...item,
          scheduleId: schedule.id,
          profileId: schedule.profileId,
        }))
      )
      .sort(
        (a, b) => new Date(a.startAt).getTime() - new Date(b.startAt).getTime()
      );

    return (
      <InnerBox
        className={modalStyles.scheduleContentContainer}
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
        {currentUser && (
          <AddScheduleModal
            isOpen={isAddMode}
            onClose={() => setIsAddMode(false)}
            scheduleId={schedules[0].id}
            userId={currentUser.id}
            onAddScheduleContent={async (
              scheduleContent: ScheduleContentFormData,
              scheduleItem: Partial<ScheduleItemFormData>,
              isFavorite: boolean,
              userId: string
            ) => {
              console.log("일정 추가:", {
                scheduleContent,
                scheduleItem,
                isFavorite,
                userId,
              });
            }}
            onSuccess={() => {
              mutate();
              setIsAddMode(false);
            }}
            onDatePickerOpen={openDatePicker!}
          />
        )}
        {isEditMode && editingItem && schedules && currentUser && (
          <AddScheduleModal
            isOpen={isEditMode}
            onClose={() => setIsEditMode(false)}
            scheduleId={editingItem.scheduleId}
            userId={currentUser.id}
            isEditMode
            editingItem={editingItem}
            onEditScheduleContent={async (
              itemId: number,
              scheduleContent: ScheduleContentFormData,
              startAt: Date,
              isFavorite: boolean
            ) => {
              console.log("일정 수정:", {
                itemId,
                scheduleContent,
                startAt,
                isFavorite,
              });
            }}
            onSuccess={() => {
              mutate();
              setIsEditMode(false);
            }}
            onDatePickerOpen={openDatePicker!}
          />
        )}
      </InnerBox>
    );
  }
);

ScheduleContents.displayName = "ScheduleContents";

export default ScheduleContents;
