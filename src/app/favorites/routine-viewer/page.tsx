import RoutineViewerContent from "./content";
import { Text } from "@/shared/components/texts";
import { Center, InnerWrapper } from "@/shared/components/layout";
import { Colors } from "@/shared/consts/colors";
import { COMMON_MESSAGE } from "@/shared/consts/messages";
import { decrypt } from "@/shared/lib/crypto";
import {
  RoutineContentModel,
  RoutineWithContentsModel,
} from "@/entities/routine/schema";
import prisma from "@/shared/lib/prisma";
import { RoutineCategory, RoutineType } from "@/entities/routine/types";

export const dynamic = "force-dynamic";

interface FavoriteRoutineViewerPageProps {
  params: {};
  searchParams: { ids?: string };
}

export default async function FavoriteRoutineViewerPage({
  searchParams,
}: FavoriteRoutineViewerPageProps) {
  const encryptedIds = searchParams.ids;

  if (!encryptedIds) {
    return (
      <InnerWrapper>
        <Center>
          <Text text={COMMON_MESSAGE.INVALID_URL} color={Colors.red} />
        </Center>
      </InnerWrapper>
    );
  }

  try {
    const decode = decodeURIComponent(encryptedIds);
    const decryptedJson = await decrypt(decode);
    const routineIds = JSON.parse(decryptedJson);

    if (typeof routineIds !== "object" || !Array.isArray(routineIds)) {
      throw new Error("Invalid ID format after decryption.");
    }

    const routineDataFromDb = await prisma.routine.findMany({
      where: {
        id: {
          in: routineIds,
        },
      },
      include: {
        contents: true, // 루틴의 내용을 포함
      },
    });

    if (!routineDataFromDb || routineDataFromDb.length === 0) {
      return (
        <InnerWrapper>
          <Center>
            <Text text="루틴을 찾을 수 없습니다." color={Colors.grey} />
          </Center>
        </InnerWrapper>
      );
    }

    // RoutineWithContentsModel에 맞게 변환 로직 추가
    const routinesForComponent: RoutineWithContentsModel[] =
      routineDataFromDb.map((routine) => ({
        ...routine,
        category: routine.category as RoutineCategory,
        type: routine.type as RoutineType, // 명시적 캐스팅 추가
        contents: routine.contents as RoutineContentModel[],
      }));

    return <RoutineViewerContent initialRoutinesData={routinesForComponent} />;
  } catch (error) {
    console.error("Failed to load routine data:", error);
    return (
      <InnerWrapper>
        <Center>
          <Text text={COMMON_MESSAGE.WRONG_ACCESS} color={Colors.red} />
        </Center>
      </InnerWrapper>
    );
  }
}
