"use client";
import styles from "./ScheduleItemInEdit.module.scss";
import { memo } from "react";
import cn from "classnames";
import {
  getSubCategoryImagePath,
  SubCategory,
} from "@/shared/types/schedule-category";
import Image from "next/image";
import { Text } from "@/shared/components/texts";
import { Colors } from "@/shared/consts/colors";
import { formatTime } from "@/shared/lib/date";

interface ScheduleItemInEditProps {
  isActive: boolean;
  sub: SubCategory;
  // startAt이 설정되지 않은 경우 null 또는 undefined일 수 있습니다.
  startAt?: Date | null;
  onClick?: () => void;
}

const ScheduleItemInEdit = memo(
  ({ isActive, sub, startAt, onClick }: ScheduleItemInEditProps) => {
    if (isActive && !startAt) return null;

    const url = getSubCategoryImagePath(sub);

    return (
      <div
        key={sub}
        className={cn(styles.container, { [styles.active]: isActive })}
        onClick={onClick}
      >
        <div className={styles.affix}>
          <Image src={url} alt={sub} width={24} height={24} />
          <div className={styles.divider}></div>
          <Text text={sub} fontWeight="bold" color={Colors.black} />
        </div>

        <div className={styles.suffix}>
          {isActive && startAt && (
            <>
              <Text text="시작시간" color={Colors.black} />
              <Text text={formatTime(startAt)} color={Colors.black} />
            </>
          )}
          {!isActive && <Text text="설정하기" color={Colors.invalid} />}
        </div>
      </div>
    );
  }
);
ScheduleItemInEdit.displayName = "ScheduleItemInEdit";
export default ScheduleItemInEdit;
