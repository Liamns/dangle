"use client";
import {
  mainCategories,
  MainCategory,
  SubCategory,
} from "@/shared/types/schedule-category";
import { memo, useCallback, useState } from "react";
import styles from "./ScheduleAddBox.module.scss";
import cn from "classnames";
import { Text } from "@/shared/components/texts";
import { Colors } from "@/shared/consts/colors";
import ScheduleMainCategoryRow from "./ScheduleMainCategoryRow";
import ScheduleSubCategoryCol from "./ScheduleSubCategoryCol";
import ScheduleEditConfirmBtns from "./ScheduleEditConfirmBtns";
import {
  ScheduleItemWithContentModel,
  NewScheduleItem,
} from "@/entities/schedule/model";

interface ScheduleAddBoxProps {
  selectedDate: Date;
}

const ScheduleAddBox = memo(({ selectedDate }: ScheduleAddBoxProps) => {
  const [selectedMain, setSelectedMain] = useState<MainCategory>(
    mainCategories[0]
  );
  const [modifications, setModifications] = useState<
    Partial<
      Record<
        SubCategory,
        (ScheduleItemWithContentModel | NewScheduleItem) & {
          isFavorite?: boolean;
        }
      >
    >
  >({});

  const handleMainSelect = useCallback((category: MainCategory) => {
    setSelectedMain(category);
  }, []);

  const handleModify = useCallback(
    (
      sub: SubCategory,
      updated: (ScheduleItemWithContentModel | NewScheduleItem) & {
        isFavorite?: boolean;
      }
    ) => {
      setModifications((prev) => ({ ...prev, [sub]: updated }));
    },
    []
  );

  const handleConfirm = useCallback(() => {
    // TODO: integrate persistence API
    alert("수정사항 서버에 반영 후 mutate 호출");
    console.log("Confirm modifications:", modifications);
  }, [modifications]);

  const handleDelete = useCallback(() => {
    // clear all scheduled modifications
    setModifications({});
  }, []);

  return (
    <div className={styles.container}>
      <ScheduleMainCategoryRow
        selected={selectedMain}
        onSelect={handleMainSelect}
      />

      <ScheduleSubCategoryCol
        mainCategory={selectedMain}
        selectedDate={selectedDate}
        modifications={modifications}
        onModify={handleModify}
      />

      <ScheduleEditConfirmBtns
        onConfirm={handleConfirm}
        onDelete={handleDelete}
      />
    </div>
  );
});

ScheduleAddBox.displayName = "ScheduleAddBox";
export default ScheduleAddBox;
