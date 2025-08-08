import ProfileViewerContent from "./content";
import { Text } from "@/shared/components/texts";
import { Center, InnerWrapper } from "@/shared/components/layout";
import { Colors } from "@/shared/consts/colors";
import { COMMON_MESSAGE } from "@/shared/consts/messages";
import prisma from "@/shared/lib/prisma";
import { decrypt } from "@/shared/lib/crypto";
import { ProfileModel } from "@/entities/profile/model"; // ProfileModel import

export const dynamic = 'force-dynamic'; // 페이지를 동적으로 렌더링하도록 강제

interface ProfileViewerPageProps {
  params: {}; // 동적 라우트가 없으므로 빈 객체
  searchParams: { id?: string };
}

// 서버 컴포넌트는 async 함수가 될 수 있습니다.
export default async function ProfileViewerPage({
  searchParams,
}: ProfileViewerPageProps) {
  const encryptedId = searchParams.id;

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
    const decryptedJson = await decrypt(encryptedId);
    const profileId = JSON.parse(decryptedJson);

    if (typeof profileId !== "string") {
      throw new Error("Invalid ID format after decryption.");
    }

    const profileDataFromDb = await prisma.profile.findUnique({
      where: { id: profileId },
      // 필요한 관계를 여기에 include
      // 예: include: { user: true, schedules: true }
    });

    if (!profileDataFromDb) {
      return (
        <InnerWrapper>
          <Center>
            <Text text="프로필을 찾을 수 없습니다." color={Colors.grey} />
          </Center>
        </InnerWrapper>
      );
    }

    // 데이터 변환: DB 타입을 Zod 스키마 타입으로 맞춤
    // ProfileModel에 맞게 변환 로직 추가
    const profileDataForComponent: ProfileModel = {
      ...profileDataFromDb,
      petAge: new Date(profileDataFromDb.petAge).toISOString().split('T')[0],
      petGender: profileDataFromDb.petGender as any, // JsonValue를 적절한 타입으로 캐스팅
      vaccinations: profileDataFromDb.vaccinations as any, // JsonValue를 적절한 타입으로 캐스팅
      personalityScores: profileDataFromDb.personalityScores as any, // JsonValue를 적절한 타입으로 캐스팅
    };

    return (
      <ProfileViewerContent initialProfileData={profileDataForComponent} />
    );
  } catch (error) {
    console.error("Failed to load profile data:", error);
    return (
      <InnerWrapper>
        <Center>
          <Text text={COMMON_MESSAGE.WRONG_ACCESS} color={Colors.red} />
        </Center>
      </InnerWrapper>
    );
  }
}