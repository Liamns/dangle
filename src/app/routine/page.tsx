"use client";
import { ArrowButton } from "@/shared/components/buttons";
import BottomNavBar from "../../shared/components/bottom-nav-bar";
import {
  Center,
  InnerBox,
  InnerWrapper,
  Spacer,
} from "../../shared/components/layout";
import Image from "next/image";
import { useRouter } from "next/navigation";
import styles from "./page.module.scss";
import { memo, useCallback, useState } from "react";
import { Text } from "@/shared/components/texts";
import { Colors } from "@/shared/consts/colors";
import EditSvg from "@/shared/svgs/edit2.svg";
import SaveSvg from "@/shared/svgs/check.svg";
import MainTitle from "@/features/routine/components/MainTitle";
import UpperBtn from "@/features/routine/components/UpperBtn";

export default function Routine() {
  const router = useRouter();
  const [isEditMode, setIsEditMode] = useState(false);

  const handleBackBtn = useCallback(() => {
    router.back();
  }, [router]);

  const handleUtilBtn = useCallback(() => {
    if (isEditMode) {
    } else {
    }
    setIsEditMode(!isEditMode);
  }, [isEditMode]);

  return (
    <InnerWrapper>
      <div className={styles.container}>
        <UpperBtn
          isEditMode={isEditMode}
          onBackClick={handleBackBtn}
          onUtilClick={handleUtilBtn}
        />
        <MainTitle isEditMode={isEditMode} />
      </div>

      <div className={styles.content}></div>
      <BottomNavBar />
    </InnerWrapper>
  );
}
