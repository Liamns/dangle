"use client";
import { memo } from "react";
import styles from "./ScheduleEditConfirmBtns.module.scss";
import DeleteSvg from "@/shared/svgs/delete.svg";
import ConfirmSvg from "@/shared/svgs/save.svg";
import { Text } from "@/shared/components/texts";
import { Colors } from "@/shared/consts/colors";

interface ScheduleEditConfirmBtnsProps {
  onDelete: () => void;
  onConfirm: () => void;
}

const ScheduleEditConfirmBtns = memo(
  ({ onDelete, onConfirm }: ScheduleEditConfirmBtnsProps) => {
    return (
      <div className={styles.container}>
        <div className={styles.deleteBtn} onClick={onDelete}>
          <Text text="비우기" color={Colors.brown} fontWeight="bold" />
          <DeleteSvg width={12} height={12} color={Colors.brown} />
        </div>
        <div className={styles.confirmBtn} onClick={onConfirm}>
          <Text text="저장하기" color={Colors.white} fontWeight="bold" />
          <ConfirmSvg width={12} height={14} color={Colors.white} />
        </div>
      </div>
    );
  }
);

ScheduleEditConfirmBtns.displayName = "ScheduleEditConfirmBtns";
export default ScheduleEditConfirmBtns;
