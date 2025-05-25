"use client";
import { MainCategory } from "@/shared/types/schedule-category";
import styles from "./ScheduleMainCategoryRow.module.scss";
import cn from "classnames";
import { Text } from "@/shared/components/texts";
import { Colors } from "@/shared/consts/colors";
import { mainCategories } from "@/shared/types/schedule-category";
import { memo } from "react";

interface ScheduleMainCategoryRowProps {
  selected: MainCategory;
  onSelect: (category: MainCategory) => void;
}

const ScheduleMainCategoryRow = memo(
  ({ selected, onSelect }: ScheduleMainCategoryRowProps) => {
    return (
      <div className={styles.container}>
        {mainCategories.map((category) => {
          const isActive = selected === category;

          return (
            <div
              key={category}
              className={cn(styles.chip, { [styles.active]: isActive })}
              onClick={() => onSelect(category)}
            >
              <Text
                text={category}
                fontWeight="bold"
                color={isActive ? Colors.brown : Colors.white}
              />
            </div>
          );
        })}
      </div>
    );
  }
);

ScheduleMainCategoryRow.displayName = "ScheduleMainCategoryRow";
export default ScheduleMainCategoryRow;
