import ScheduleViewerContent from "./content";
import { Text } from "@/shared/components/texts";
import { Center, InnerWrapper } from "@/shared/components/layout";
import { Colors } from "@/shared/consts/colors";
import { COMMON_MESSAGE } from "@/shared/consts/messages";
import { decrypt } from "@/shared/lib/crypto";
import {
  ExtendedCategorySubModel,
  ScheduleWithItemsModel,
} from "@/entities/schedule/model";
import prisma from "@/shared/lib/prisma";

interface FavoriteScheduleViewerPageProps {
  searchParams: Promise<{ ids?: string }>;
}

export default async function FavoriteScheduleViewerPage({
  searchParams,
}: FavoriteScheduleViewerPageProps) {
  const { ids: encryptedId } = await searchParams;

  if (!encryptedId) {
    return (
      <InnerWrapper>
        <Center>
          <Text text={COMMON_MESSAGE.INVALID_URL} color={Colors.red} />
        </Center>
      </InnerWrapper>
    );
  }

  try {
    const decode = decodeURIComponent(encryptedId);
    const decryptedJson = await decrypt(decode);
    const scheduleId = JSON.parse(decryptedJson);

    if (typeof scheduleId !== "object") {
      throw new Error("Invalid ID format after decryption.");
    }

    const scheduleDataFromDb = await prisma.schedule.findMany({
      where: {
        id: {
          in: scheduleId,
        },
      },
      include: {
        items: {
          include: {
            subCategory: true,
          },
        },
      },
    });

    if (!scheduleDataFromDb) {
      return (
        <InnerWrapper>
          <Center>
            <Text text="일정을 찾을 수 없습니다." color={Colors.grey} />
          </Center>
        </InnerWrapper>
      );
    }

    // ScheduleWithItemsModel에 맞게 변환 로직 추가
    const scheduleDataForComponent: ScheduleWithItemsModel[] =
      scheduleDataFromDb.map((schedule) => ({
        ...schedule,
        items: schedule.items.map((item) => ({
          ...item,
          subCategory: item.subCategory as ExtendedCategorySubModel, // 명시적 캐스팅
        })),
      }));

    return (
      <ScheduleViewerContent initialSchedulesData={scheduleDataForComponent} />
    );
  } catch (error) {
    console.error("Failed to load schedule data:", error);
    return (
      <InnerWrapper>
        <Center>
          <Text text={COMMON_MESSAGE.WRONG_ACCESS} color={Colors.red} />
        </Center>
      </InnerWrapper>
    );
  }
}
