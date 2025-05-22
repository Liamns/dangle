"use clinet";
import { mainCategories, MainCategory } from "@/shared/types/schedule-category";
import { memo, useState } from "react";
import styles from "./ScheduleAddBox.module.scss";
import cn from "classnames";
import { Text } from "@/shared/components/texts";
import { Colors } from "@/shared/consts/colors";

interface ScheduleAddBoxProps {
  selectedDate: Date;
}

const ScheduleAddBox = memo(({ selectedDate }: ScheduleAddBoxProps) => {
  const [selectedMain, setSelectedMain] = useState<MainCategory>(
    mainCategories[0]
  );

  return (
    <div className={styles.container}>
      <div className={styles.mainGroup}>
        {mainCategories.map((category) => {
          const isActive = selectedMain === category;

          return (
            <div
              key={category}
              className={cn(styles.mainChip, isActive && styles.active)}
              onClick={() => setSelectedMain(category)}
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
    </div>
  );
});

ScheduleAddBox.displayName = "ScheduleAddBox";
export default ScheduleAddBox;
