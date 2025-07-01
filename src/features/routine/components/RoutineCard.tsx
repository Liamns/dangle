"use client";
import { RoutineModel } from "@/entities/routine/schema";
import styles from "./RoutineCard.module.scss";
import { memo } from "react";
import { RoutineCategoryColors } from "@/entities/routine/types";
import Edit2Svg from "@/shared/svgs/edit2.svg";
import ClickSvg from "@/shared/svgs/click.svg";
import { Text } from "@/shared/components/texts";
import { Colors } from "@/shared/consts/colors";
import { InnerBox } from "@/shared/components/layout";
import Image from "next/image";
import FavoriteSvg from "@/shared/svgs/favorites.svg";
import EditSvg from "@/shared/svgs/edit.svg";

interface RoutineCardProps {
  routine: RoutineModel;
  isEditMode: boolean;
  onClick: () => void;
  onFavoriteToggle: (id: number) => void;
}

const RoutineCard = memo(
  ({ routine, isEditMode, onClick, onFavoriteToggle }: RoutineCardProps) => {
    const isTips = routine.type === "Tips";
    return (
      <div
        className={styles.container}
        style={
          {
            "--routine-card-bg": RoutineCategoryColors[routine.category],
          } as React.CSSProperties
        }
        onClick={onClick}
      >
        <InnerBox justify="start" align="start">
          <div className={styles.category}>
            <Text
              text={routine.category}
              color={Colors.white}
              fontWeight="bold"
              fontSize="lg"
            />
            {isEditMode ? (
              <Edit2Svg color={Colors.white} width={16} height={16} />
            ) : (
              <ClickSvg color={Colors.white} width={16} height={16} />
            )}
          </div>
          <Text text={routine.name} color={Colors.black} />
        </InnerBox>

        <Image
          src={`/images/routine/${routine.category}.png`}
          alt="루틴 카테고리 이미지"
          width={100}
          height={100}
        />

        <div
          className={styles.type}
          style={
            {
              "--routine-type-bg": isTips ? Colors.white : Colors.brown,
            } as React.CSSProperties
          }
        >
          <Text
            text={routine.type}
            color={isTips ? Colors.brown : Colors.white}
            fontSize="tiny"
          />

          {isEditMode ? (
            <EditSvg
              width={12}
              height={12}
              color={isTips ? Colors.brown : Colors.white}
            />
          ) : (
            <FavoriteSvg
              width={12}
              height={12}
              color={routine.isFavorite ? Colors.primary : Colors.invalid}
              onClick={(e) => {
                e.stopPropagation();
                onFavoriteToggle(routine.id);
              }}
            />
          )}
        </div>
      </div>
    );
  }
);
RoutineCard.displayName = "RoutineCard";
export default RoutineCard;
