"use client";
import { Card, InnerWrapper, Spacer } from "@/shared/components/layout";
import { decrypt } from "@/shared/lib/crypto";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import styles from "./page.module.scss";
import { Text } from "@/shared/components/texts";
import { Colors } from "@/shared/consts/colors";
import Image from "next/image";
import {
  ScheduleWithItemsModel,
  ScheduleItemWithContentModel,
} from "@/entities/schedule/model";
import MaleSvg from "@/shared/svgs/male.svg";
import FemaleSvg from "@/shared/svgs/female.svg";
import { formatTime, getShortKoreanDayOfWeek } from "@/shared/lib/date";
import { text } from "stream/consumers";
import {
  getSubCategoryImagePath,
  SubCategory,
} from "@/shared/types/schedule-category";

interface SharedScheduleData {
  petName: string;
  petType: number;
  petGender: { gender: string; isNeutered: boolean };
  schedule: Omit<ScheduleWithItemsModel, "profileId">;
}

function ScheduleViewer() {
  const searchParams = useSearchParams();
  const dataParam = searchParams.get("data");
  const [scheduleData, setScheduleData] = useState<SharedScheduleData | null>(
    null
  );

  useEffect(() => {
    if (!dataParam) return;
    (async () => {
      try {
        let decryptedText: string;
        try {
          decryptedText = await decrypt(dataParam);
        } catch (_e) {
          const decoded = decodeURIComponent(dataParam);
          decryptedText = await decrypt(decoded);
        }
        const parsed = JSON.parse(decryptedText) as SharedScheduleData;
        setScheduleData(parsed);
        // scheduleItems date consistency check (Asia/Seoul 기준)
        const ymds = parsed.schedule.scheduleItems.map(
          (item: ScheduleItemWithContentModel) =>
            new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Seoul" }).format(
              new Date(item.startAt)
            )
        );
        const firstYMD = ymds[0];
        if (!ymds.every((date: string) => date === firstYMD)) {
          console.warn(
            "scheduleItems의 startAt 연·월·일이 일치하지 않습니다:",
            ymds
          );
        }
        console.log("Decrypted schedule data:", parsed);
      } catch (err) {
        console.error("Invalid schedule data", err);
      }
    })();
  }, [dataParam]);

  if (!scheduleData) {
    return (
      <InnerWrapper>
        <Text text="일정 데이터를 불러오는 중입니다…" color={Colors.brown} />
      </InnerWrapper>
    );
  }

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
              scheduleData.petType === 0 ? "dog" : "cat"
            }.png`}
            alt="반려동물 프로필 이미지"
          />
          <div className={styles.profileTitle}>
            <Text
              text={scheduleData.petName}
              color={Colors.brown}
              fontSize="lg"
              fontWeight="bold"
            />
            {scheduleData.petGender.gender ? (
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
          style={{
            height: "calc((100dvh / 740 * 634.5) - (100dvw / 360 * 260))",
          }}
        >
          <Text
            text={`${getShortKoreanDayOfWeek(
              scheduleData.schedule.createdAt
            )}요일 일정`}
            fontSize="title"
            fontWeight="bold"
            color={Colors.brown}
          />
          <Spacer height="12" />
          <div className={styles.scheduleContainer}>
            {scheduleData.schedule.scheduleItems.length > 0 ? (
              scheduleData.schedule.scheduleItems.map((item) => {
                const url = getSubCategoryImagePath(
                  item.content.sub.name as SubCategory
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
                        text={item.content.sub.name}
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
                text="잘못된 접근입니다."
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

ScheduleViewer.displayName = "ScheduleViewer";
export default ScheduleViewer;
