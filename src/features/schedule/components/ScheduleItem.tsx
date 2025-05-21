"use client";

import React, { memo, useState, useEffect } from "react";
import { InnerBox } from "@/shared/components/layout";
import { Colors } from "@/shared/consts/colors";
import Image from "next/image";
import { ScheduleItemWithContentModel } from "@/entities/schedule/model";
import {
  getSubCategoryImagePath,
  SubCategory,
} from "@/shared/types/schedule-category";
import modalStyles from "./ScheduleBottomModal.module.scss";
import { Text } from "@/shared/components/texts";
import EditSvg from "@/shared/svgs/edit.svg";
import DeleteSvg from "@/shared/svgs/delete.svg";

export interface ScheduleItemProps {
  item: ScheduleItemWithContentModel & {
    scheduleId: number;
    profileId: string;
  };
  isActive: boolean;
  onActivate: () => void;
  onEdit?: (
    item: ScheduleItemWithContentModel & {
      scheduleId: number;
      profileId: string;
    }
  ) => void;
}

const ScheduleItem = memo(
  ({ item, isActive, onActivate, onEdit }: ScheduleItemProps) => {
    const wasActive = React.useRef(isActive);
    const isMounted = React.useRef(false);
    const [animationClass, setAnimationClass] = useState("");

    useEffect(() => {
      isMounted.current = true;
      setAnimationClass(isActive ? "active" : "");
      return () => {
        isMounted.current = false;
      };
    }, []);

    useEffect(() => {
      if (isMounted.current) {
        if (isActive) {
          setAnimationClass("active");
        } else if (wasActive.current) {
          setAnimationClass("inactive");
        }
      }
      wasActive.current = isActive;
    }, [isActive]);

    const formatTime = (date: Date) => {
      const hours = date.getHours();
      const minutes = date.getMinutes();
      const formattedHours = hours < 10 ? `0${hours}` : hours;
      const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
      return `${formattedHours}:${formattedMinutes}`;
    };

    return (
      <div style={{ width: "100%", position: "relative", marginBottom: "8px" }}>
        <InnerBox direction="row" className={modalStyles.scheduleItem}>
          <InnerBox className={modalStyles.itemContent}>
            <div className={modalStyles.itemPrefixSection}>
              <div className={modalStyles.iconContainer}>
                <Image
                  src={getSubCategoryImagePath(
                    item.content.sub.name as SubCategory
                  )}
                  fill
                  sizes="100%"
                  alt={item.content.sub.name}
                />
              </div>
              <div className={modalStyles.itemDivider}></div>
              <Text
                text={item.content.sub.name}
                fontWeight="bold"
                color={Colors.black}
              />
            </div>
            <div className={modalStyles.itemSuffixSection}>
              <Text text="시작시간" color={Colors.black} />
              <Text
                text={formatTime(new Date(item.startAt))}
                color={Colors.black}
              />
              <EditSvg
                width={14}
                height={14}
                color={Colors.brown}
                onClick={onActivate}
              />
            </div>
          </InnerBox>
        </InnerBox>
        <div
          className={`${modalStyles.buttonContainer} ${
            animationClass ? modalStyles[animationClass] : ""
          }`}
          onAnimationEnd={(e) => {
            if (
              e.animationName.includes("hide-buttons") &&
              animationClass === "inactive"
            ) {
              setAnimationClass("");
            }
          }}
        >
          <div
            onClick={() => alert("삭제 클릭")}
            className={modalStyles.deleteButton}
          >
            <DeleteSvg width={14} height={14} color={Colors.brown} />
          </div>
          <div
            className={modalStyles.editButton}
            onClick={() => (onEdit ? onEdit(item) : alert("수정 준비 중"))}
          >
            <EditSvg width={14} height={14} color={Colors.white} />
          </div>
        </div>
      </div>
    );
  }
);

ScheduleItem.displayName = "ScheduleItem";
export default ScheduleItem;
