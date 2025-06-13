"use client";
import { memo, useMemo } from "react";
import styles from "./EmptyFavorites.module.scss";
import { Text } from "@/shared/components/texts";
import { Colors } from "@/shared/consts/colors";
import Image from "next/image";

interface EmptyFavoritesProps {
  onEmptyClick: () => void;
  activeTab: "routine" | "schedule";
}

const EmptyFavorites = memo(
  ({ onEmptyClick, activeTab }: EmptyFavoritesProps) => {
    const label = useMemo(() => {
      if (activeTab === "routine") {
        return "루틴";
      } else if (activeTab === "schedule") {
        return "일정";
      }
    }, [activeTab]);
    return (
      <div className={styles.container}>
        <Text text="즐겨찾기 목록이 비워져 있어요!" color={Colors.brown} />
        <div className={styles.image}>
          <Image
            src={"/images/login/dangle.png"}
            alt="즐겨찾기 비어있음"
            fill
          />
        </div>
        <div className={styles.button} onClick={onEmptyClick}>
          <Text
            text={`${label} 목록 보러가기`}
            color={Colors.brown}
            fontWeight="bold"
          />
        </div>
      </div>
    );
  }
);

EmptyFavorites.displayName = "EmptyFavorites";
export default EmptyFavorites;
