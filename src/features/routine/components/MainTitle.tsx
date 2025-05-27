"use client";
import { Text } from "@/shared/components/texts";
import styles from "./MainTitle.module.scss";

import { memo } from "react";
import { Colors } from "@/shared/consts/colors";

interface MainTitleProps {
  isEditMode: boolean;
}

const MainTitle = memo(({ isEditMode }: MainTitleProps) => {
  return (
    <div className={styles.container}>
      <Text
        text="댕글"
        fontSize="lg"
        fontWeight="bold"
        color={!isEditMode ? Colors.brown : Colors.transparnet}
        fontFamily="jalnan"
      />
      <Text
        text={
          !isEditMode ? "나만의 루틴을 등록해요!" : "수정할 카드를 선택하세요!"
        }
        color={Colors.brown}
        fontSize="lg"
      />
    </div>
  );
});

MainTitle.displayName = "MainTitle";
export default MainTitle;
