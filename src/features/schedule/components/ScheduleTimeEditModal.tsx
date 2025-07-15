"use client";
import { memo, useState, useEffect } from "react";
import styles from "./ScheduleTimeEditModal.module.scss";
import {
  NewScheduleItem,
  ScheduleItemWithSubCategoryModel,
} from "@/entities/schedule/model";
import Modal from "@/shared/components/modals";
import CloseSvg from "@/shared/svgs/close.svg";
import {
  getSubCategoryImagePath,
  SubCategory,
} from "@/entities/schedule/types";
import Image from "next/image";
import { Text } from "@/shared/components/texts";
import { Colors } from "@/shared/consts/colors";
import TimePicker from "@/shared/components/TimePicker";
import { Button } from "@/shared/components/buttons";
import { InnerBox, Spacer } from "@/shared/components/layout";
import chkbox from "@/shared/styles/buttons.module.scss";

interface ScheduleTimeEditModalProps {
  schedule?: ScheduleItemWithSubCategoryModel | NewScheduleItem;
  isOpen: boolean;
  onClose: () => void;
  // 전달된 schedule 객체에 isFavorite 플래그를 추가해 전달합니다.
  onChangeStartAt: (
    next: Date,
    updatedSchedule: (ScheduleItemWithSubCategoryModel | NewScheduleItem) & {
      isFavorite?: boolean;
    }
  ) => void;
}

const ScheduleTimeEditModal = memo(
  ({
    schedule,
    isOpen,
    onClose,
    onChangeStartAt,
  }: ScheduleTimeEditModalProps) => {
    // hooks must be called unconditionally
    const [tempStartAt, setTempStartAt] = useState<Date>(
      schedule?.startAt ?? new Date()
    );
    const [isFavChecked, setIsFavChecked] = useState<boolean>(
      Boolean((schedule as any)?.isFavorite)
    );
    useEffect(() => {
      if (schedule) {
        setTempStartAt(schedule.startAt ?? new Date());
      }
    }, [schedule]);
    useEffect(() => {
      // schedule 변경 시 isFavorite 동기화
      setIsFavChecked(Boolean((schedule as any)?.isFavorite));
    }, [schedule]);
    if (!schedule) return null;

    const sub: SubCategory = schedule.subCategory.name as SubCategory;
    if (!sub) {
      alert("잘못된 일정입니다.");
      onClose();
      return null;
    }
    const url = getSubCategoryImagePath(sub);

    return (
      <Modal isOpen={isOpen} onClose={onClose}>
        <div className={styles.container}>
          <div className={styles.title}>
            <div className={styles.titleAffix}>
              <Image src={url} alt={sub} width={24} height={24} />
              <Text text={sub} fontWeight="bold" color={Colors.black} />
            </div>
            <CloseSvg
              width={10}
              height={10}
              color={Colors.brown}
              onClick={onClose}
            />
          </div>
          <TimePicker
            value={tempStartAt}
            onChange={(next) => setTempStartAt(next)}
          />
          <InnerBox direction="row" justify="start">
            <Spacer width="14" />
            <input
              className={chkbox.chkbox}
              type="checkbox"
              checked={isFavChecked}
              onChange={() => setIsFavChecked((prev) => !prev)}
            />
            <Spacer width="6" />
            <Text text="즐겨찾기 등록" color={Colors.brown} />
          </InnerBox>
          <Button
            onClick={() => {
              // 체크된 상태면 isFavorite 플래그 포함
              const updated: typeof schedule & { isFavorite: boolean } = {
                ...schedule!,
                startAt: tempStartAt,
                isFavorite: isFavChecked,
              };
              onChangeStartAt(tempStartAt, updated);
              onClose();
            }}
            className={styles.confirmButton}
            fontSize="md"
            width="227"
            height="37"
          >
            확인
          </Button>
        </div>
      </Modal>
    );
  }
);

ScheduleTimeEditModal.displayName = "ScheduleTimeEditModal";
export default ScheduleTimeEditModal;
