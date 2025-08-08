import ScheduleViewerContent from "./content";
import { Text } from "@/shared/components/texts";
import { Center, InnerWrapper } from "@/shared/components/layout";
import { Colors } from "@/shared/consts/colors";
import { COMMON_MESSAGE } from "@/shared/consts/messages";
import prisma from "@/shared/lib/prisma";
import { decrypt } from "@/shared/lib/crypto";
import { ScheduleWithItemsAndProfileModel } from "@/entities/schedule/model";
import { allVaccines, personalityTraits } from "@/shared/types/pet";
import { MainCategory } from "@/entities/schedule/types";

// 서버 컴포넌트는 async 함수가 될 수 있습니다.
export default async function ScheduleViewerPage({
  searchParams,
}: {
  searchParams: Promise<{ id: string }>;
}) {
  const { id: encryptedId } = await searchParams;

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
    const decoded = decodeURIComponent(encryptedId);
    const decryptedJson = await decrypt(decoded);
    console.log(decryptedJson);
    const scheduleId = JSON.parse(decryptedJson);

    if (typeof scheduleId !== "number") {
      throw new Error("Invalid ID format after decryption.");
    }

    const scheduleDataFromDb = await prisma.schedule.findUnique({
      where: { id: scheduleId },
      include: {
        items: {
          orderBy: { startAt: "asc" },
          include: {
            subCategory: {
              include: {
                main: true,
              },
            },
          },
        },
        profile: true,
      },
    });

    console.log(scheduleDataFromDb);

    if (!scheduleDataFromDb || !scheduleDataFromDb.profile) {
      return (
        <InnerWrapper>
          <Center>
            <Text text="일정을 찾을 수 없습니다." color={Colors.grey} />
          </Center>
        </InnerWrapper>
      );
    }

    // 데이터 변환: DB 타입을 Zod 스키마 타입으로 맞춤
    const scheduleDataForComponent: ScheduleWithItemsAndProfileModel = {
      ...scheduleDataFromDb,
      icon: scheduleDataFromDb.icon ?? undefined,
      addedAt: scheduleDataFromDb.addedAt ?? undefined,
      alias: scheduleDataFromDb.alias ?? undefined,
      items: scheduleDataFromDb.items.map((item) => ({
        ...item,
        subCategory: {
          ...item.subCategory,
          main: {
            id: item.subCategory.main.id,
            name: item.subCategory.main.name as MainCategory,
          },
        },
      })),
      profile: {
        ...scheduleDataFromDb.profile,
        petAge: new Date(scheduleDataFromDb.profile.petAge)
          .toISOString()
          .split("T")[0],
        petGender: scheduleDataFromDb.profile.petGender as {
          gender: boolean | null;
          isNeutered: boolean;
        },
        vaccinations: (scheduleDataFromDb.profile.vaccinations || {}) as Record<
          (typeof allVaccines)[number],
          boolean
        >,
        personalityScores: (scheduleDataFromDb.profile.personalityScores ||
          {}) as Record<(typeof personalityTraits)[number], number>,
      },
    };

    return (
      <ScheduleViewerContent initialScheduleData={scheduleDataForComponent} />
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
