"use client";
import { InnerBox } from "@/shared/components/layout";
import styles from "./UpperBtn.module.scss";
import { memo } from "react";
import { ArrowButton } from "@/shared/components/buttons";
import Image from "next/image";
import { Text } from "@/shared/components/texts";
import { Colors } from "@/shared/consts/colors";
import EditSvg from "@/shared/svgs/edit2.svg";
import SaveSvg from "@/shared/svgs/check.svg";

interface UpperBtnProps {
  onUtilClick: () => void;
  onBackClick: () => void;
  isEditMode: boolean;
}

const UpperBtn = memo(
  ({ onUtilClick, onBackClick, isEditMode }: UpperBtnProps) => {
    return (
      <InnerBox px="30" direction="row" justify="space-between">
        <ArrowButton width="30" ml="0" onClick={onBackClick}>
          <Image
            src="/images/white-bracket.png"
            alt="뒤로가기"
            width={5}
            height={8}
            style={{ objectFit: "cover" }}
            sizes="100%"
          />
        </ArrowButton>
        <div className={styles.upperBtn} onClick={onUtilClick}>
          <Text
            text={!isEditMode ? "수정" : "저장"}
            color={Colors.white}
            fontWeight="bold"
          />
          {!isEditMode ? (
            <EditSvg color={Colors.white} width={12} height={14} />
          ) : (
            <SaveSvg color={Colors.white} width={12} height={9} />
          )}
        </div>
      </InnerBox>
    );
  }
);

UpperBtn.displayName = "UpperBtn";
export default UpperBtn;
