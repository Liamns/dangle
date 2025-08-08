"use client";
import { Card, Center, InnerWrapper, Spacer } from "@/shared/components/layout";
import { useState } from "react";
import styles from "./page.module.scss";
import { Text } from "@/shared/components/texts";
import { Colors } from "@/shared/consts/colors";
import Image from "next/image";
import MaleSvg from "@/shared/svgs/male.svg";
import FemaleSvg from "@/shared/svgs/female.svg";
import { formatTime, getShortKoreanDayOfWeek } from "@/shared/lib/date";
import {
  getSubCategoryImagePath,
  SubCategory,
} from "@/entities/schedule/types";
import { COMMON_MESSAGE } from "@/shared/consts/messages";
import { ScheduleWithItemsAndProfileModel } from "@/entities/schedule/model";

interface ScheduleViewerContentProps {
  initialScheduleData: ScheduleWithItemsAndProfileModel;
}

function ScheduleViewerContent({
  initialScheduleData,
}: ScheduleViewerContentProps) {
  const [scheduleData] = useState<ScheduleWithItemsAndProfileModel | null>(
    initialScheduleData
  );

  if (!scheduleData) {
    return (
      <InnerWrapper>
        <Center>
          <Text
            text="일정 데이터를 불러오는 중입니다…"
            color={Colors.brown}
            fontSize="lg"
            fontWeight="bold"
          />
        </Center>
      </InnerWrapper>
    );
  }

  const { profile, items, createdAt } = scheduleData;

  return (
    <InnerWrapper>
      <div className={styles.container}>
        <div className={styles.title}>
          <Text text="슬기로운 반려생활," color={Colors.brown} fontSize="lg" />
          <Text
            text="댕글"
            color={Colors.brown}
            fontSize="title"
            fontWeight="bold"
            fontFamily="jalnan"
          />
          <div className={styles.image}>
            <Image
              fill
              src={"/images/onboarding/profile/shareModal.png"}
              alt="배지 이미지"
              sizes="25%"
            />
          </div>
        </div>

        <div className={styles.subTitle}>
          <Text
            text={`따듯하고 편리한\u00a0`}
            color={Colors.brown}
            fontWeight="bold"
            fontSize="tiny"
          />
          <Text text="반려생활을 위하여" color={Colors.brown} fontSize="tiny" />
        </div>

        <div className={styles.profileImage}>
          <Image
            fill
            src={`/images/register/select-sp/${
              profile.petSpec === 0 ? "dog" : "cat"
            }.png`}
            alt="반려동물 프로필 이미지"
          />
          <div className={styles.profileTitle}>
            <Text
              text={profile.petname}
              color={Colors.brown}
              fontSize="lg"
              fontWeight="bold"
            />
            {profile.petGender ? (
              <MaleSvg width={15} height={15} color={Colors.male} />
            ) : (
              <FemaleSvg width={10} height={15} color={Colors.female} />
            )}
          </div>
        </div>

        <Card
          width="300"
          py="12"
          px="25"
          align="center"
          outStyle={{ flex: "1", marginBottom: "calc(100dvh / 740 * 16)" }}
        >
          <Text
            text={`${getShortKoreanDayOfWeek(createdAt)}요일 일정`}
            fontSize="title"
            fontWeight="bold"
            color={Colors.brown}
          />
          <Spacer height="12" />
          <div className={styles.scheduleContainer}>
            {items.length > 0 ? (
              items.map((item) => {
                const url = getSubCategoryImagePath(
                  item.subCategory.name as SubCategory
                );

                const time = formatTime(new Date(item.startAt));

                return (
                  <div key={item.id} className={styles.scheduleItem}>
                    <div className={styles.itemAffix}>
                      <Image
                        width={26}
                        height={26}
                        src={url}
                        alt="스케쥴 활동 아이콘"
                      />
                      <div className={styles.divider}></div>
                      <Text
                        text={item.subCategory.name}
                        fontWeight="bold"
                        color={Colors.black}
                      />
                    </div>

                    <div className={styles.itemSuffix}>
                      <Text text="시작 시간" color={Colors.black} />
                      <Text color={Colors.black} text={time} />
                    </div>
                  </div>
                );
              })
            ) : (
              <Text
                text={COMMON_MESSAGE.WRONG_ACCESS}
                color={Colors.grey}
                fontSize="md"
              />
            )}
          </div>
        </Card>
      </div>
    </InnerWrapper>
  );
}

ScheduleViewerContent.displayName = "ScheduleViewerContent";
export default ScheduleViewerContent;
