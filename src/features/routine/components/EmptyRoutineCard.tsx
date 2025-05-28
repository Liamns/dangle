"use client";
import { Text } from "@/shared/components/texts";
import styles from "./EmptyRoutineCard.module.scss";
import { Colors } from "@/shared/consts/colors";
import Image from "next/image";
import PlusSvg from "@/shared/svgs/plus.svg";
import { InnerBox } from "@/shared/components/layout";

interface EmptyRoutineCardProps {
  onAddClick: () => void;
}

const EmptyRoutineCard = ({ onAddClick }: EmptyRoutineCardProps) => {
  return (
    <div className={styles.container} onClick={onAddClick}>
      <InnerBox>
        <Text text="나만의" color={Colors.invalid} />
        <Text text="루틴카드 만들기" color={Colors.invalid} />
      </InnerBox>

      <Image
        src="/images/routine/emptyImage.png"
        alt="빈 루틴 카드 이미지"
        width={100}
        height={100}
      />

      <div className={styles.addBtn}>
        <Text
          text="루틴 추가"
          color={Colors.white}
          fontWeight="bold"
          fontSize="tiny"
        />

        <PlusSvg color={Colors.white} />
      </div>
    </div>
  );
};

EmptyRoutineCard.displayName = "EmptyRoutineCard";
export default EmptyRoutineCard;
