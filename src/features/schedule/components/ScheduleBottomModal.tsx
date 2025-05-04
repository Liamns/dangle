"use client";
import { BottomModal } from "@/shared/components/modals";
import { InnerBox, Spacer } from "@/shared/components/layout";
import { Text } from "@/shared/components/texts";
import { Colors } from "@/shared/consts/colors";
import { formatDateToKorean, getShortKoreanDayOfWeek } from "@/shared/lib/date";
import styles from "@/app/home/page.module.scss";
import imgStyles from "@/shared/styles/images.module.scss";
import Share from "@/shared/svgs/share.svg";
import Image from "next/image";
import { Button } from "@/shared/components/buttons";
import Plus from "@/shared/svgs/plus.svg";

export default function ScheduleBottomModal() {
  const formattedDate = formatDateToKorean();
  const todayDayOfWeek = getShortKoreanDayOfWeek();

  return (
    <BottomModal
      draggable
      width="90%"
      py="20"
      px="24"
      justify="start"
      align="center"
    >
      <InnerBox direction="row">
        <Text
          text={`${formattedDate} [ ${todayDayOfWeek}요일 ]`}
          fontWeight="bold"
          fontSize="title"
          color={Colors.brown}
        />
        <Spacer width="12" />
        <div className={styles.share} onClick={() => alert("공유하기")}>
          <Share />
        </div>
      </InnerBox>

      <Spacer height="16" />

      <InnerBox>
        <div className={imgStyles.square}>
          <Image
            src={"/images/shared/empty.png"}
            alt="empty"
            fill
            sizes="100%"
          />
        </div>
        <Button color={Colors.primary} width="250" height="40">
          <InnerBox direction="row">
            <Text
              text={`일정을 추가해주세요\u00a0`}
              fontWeight="bold"
              color={Colors.brown}
            />
            <Plus color={Colors.brown} />
          </InnerBox>
        </Button>
      </InnerBox>

      <Spacer height="160" />
    </BottomModal>
  );
}
