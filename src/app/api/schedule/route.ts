import { COMMON_MESSAGE } from "@/shared/consts/messages";
import { NextResponse } from "next/server";
import prisma from "@/shared/lib/prisma";
import { getSubIdByName, SubCategory } from "@/entities/schedule/types";
import { NewScheduleItem } from "@/entities/schedule/model";
import { SCHEDULE_MESSAGE } from "@/features/schedule/consts";
import { ScheduleItemFormData } from "@/entities/schedule/schema";
import { createClient } from "@/shared/lib/supabase/server";
import { AUTH_ERROR_MESSAGE } from "@/features/auth/consts";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const profileId = searchParams.get("profileId");
    const date = searchParams.get("date");

    if (!profileId || !date) {
      return NextResponse.json(
        { error: COMMON_MESSAGE.WRONG_ACCESS },
        { status: 400 }
      );
    }

    const schedule = await prisma.schedule.findFirst({
      where: {
        profileId: profileId,
        date: new Date(date),
      },
      include: {
        items: {
          include: {
            subCategory: true,
          },
          orderBy: {
            startAt: "asc",
          },
        },
      },
    });

    if (!schedule) {
      return NextResponse.json({}, { status: 200 });
    }

    return NextResponse.json(schedule, { status: 200 });
  } catch (e: any) {
    console.error(`schedule fetch error : ${e}`);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { inputData, profileId, date } = await req.json();

    if (
      !profileId ||
      !date ||
      !inputData ||
      Object.keys(inputData).length === 0
    ) {
      return NextResponse.json(
        { error: COMMON_MESSAGE.WRONG_ACCESS },
        { status: 400 }
      );
    }

    type InputDataItem = NewScheduleItem & { isFavorite?: boolean };
    const typedData = inputData as Record<SubCategory, InputDataItem>;

    await prisma.$transaction(async (tx) => {
      const schedule = await tx.schedule.upsert({
        where: {
          profileId_date: {
            profileId: profileId,
            date: new Date(date),
          },
        },
        create: {
          profileId: profileId,
          date: new Date(date),
        },
        update: {},
      });

      for (const [key, value] of Object.entries(typedData)) {
        if (value.startAt === null) {
          console.log(key, "제거");
          const subId = getSubIdByName(key as SubCategory);
          if (!subId) {
            return NextResponse.json(
              { error: COMMON_MESSAGE.WRONG_ACCESS },
              { status: 400 }
            );
          }

          await tx.scheduleItem.deleteMany({
            where: {
              scheduleId: schedule.id,
              subCategoryId: subId,
            },
          });
        } else {
          console.log(key, "추가 및 수정");
          console.log("대상 : ", value);
          await tx.scheduleItem.upsert({
            where: {
              scheduleId_subCategoryId: {
                scheduleId: schedule.id,
                subCategoryId: value.subCategory.id,
              },
            },
            create: {
              subCategoryId: value.subCategory.id,
              scheduleId: schedule.id,
              startAt: new Date(value.startAt!),
            },
            update: {},
          });

          if (value.isFavorite) {
            await tx.favoriteSubCategory.upsert({
              where: {
                profileId_subCategoryId: {
                  profileId: profileId,
                  subCategoryId: value.subCategory.id,
                },
              },
              create: {
                profileId: profileId,
                subCategoryId: value.subCategory.id,
              },
              update: {},
            });
          } else {
            await tx.favoriteSubCategory.deleteMany({
              where: {
                profileId: profileId,
                subCategoryId: value.subCategory.id,
              },
            });
          }
        }
      }
    });

    return NextResponse.json(
      { message: COMMON_MESSAGE.SUCCESS },
      { status: 200 }
    );
  } catch (e: any) {
    console.error(`add schedule error : ${e}`);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const { itemId, isFavorite, item } = await req.json();

    if (!itemId || isFavorite === undefined || !item) {
      return NextResponse.json(
        { error: COMMON_MESSAGE.WRONG_ACCESS },
        { status: 400 }
      );
    }

    const typedItem = item as Omit<ScheduleItemFormData, "scheduleId">;

    const findItem = await prisma.scheduleItem.findUnique({
      where: {
        id: itemId,
      },
      select: {
        schedule: {
          select: {
            profileId: true,
          },
        },
      },
    });

    if (!findItem || !findItem.schedule) {
      return NextResponse.json(
        { error: SCHEDULE_MESSAGE.UNKNOWN_SCHEDULE_ITEM },
        { status: 400 }
      );
    }

    await prisma.$transaction(async (tx) => {
      await tx.scheduleItem.update({
        where: {
          id: itemId,
        },
        data: {
          startAt: new Date(typedItem.startAt),
          subCategoryId: typedItem.subCategoryId,
        },
      });

      if (isFavorite) {
        await tx.favoriteSubCategory.upsert({
          where: {
            profileId_subCategoryId: {
              profileId: findItem.schedule.profileId,
              subCategoryId: typedItem.subCategoryId,
            },
          },
          update: {},
          create: {
            profileId: findItem.schedule.profileId,
            subCategoryId: typedItem.subCategoryId,
          },
        });
      } else {
        await tx.favoriteSubCategory.deleteMany({
          where: {
            profileId: findItem.schedule.profileId,
            subCategoryId: typedItem.subCategoryId,
          },
        });
      }
    });

    return NextResponse.json(
      { message: COMMON_MESSAGE.SUCCESS },
      { status: 200 }
    );
  } catch (e: any) {
    console.error("update schedule error - ", e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const supabase = await createClient();
  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json(
        { error: AUTH_ERROR_MESSAGE.FAIL_AUTH },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const scheduleId = searchParams.get("scheduleId");
    const subId = searchParams.get("subId");

    if (!scheduleId || !subId) {
      return NextResponse.json(
        { error: COMMON_MESSAGE.WRONG_ACCESS },
        { status: 400 }
      );
    }

    // 스케줄 아이템의 소유권 검증
    const scheduleItemToDelete = await prisma.scheduleItem.findUnique({
      where: {
        scheduleId_subCategoryId: {
          scheduleId: Number(scheduleId),
          subCategoryId: Number(subId),
        },
      },
      include: {
        schedule: {
          include: {
            profile: true,
          },
        },
      },
    });

    if (!scheduleItemToDelete) {
      return NextResponse.json(
        { error: SCHEDULE_MESSAGE.UNKNOWN_SCHEDULE_ITEM },
        { status: 404 }
      );
    }

    // 현재 세션 사용자의 ID와 스케줄 아이템의 프로필 소유자 ID를 비교
    if (scheduleItemToDelete.schedule.profile.userId !== session.user.id) {
      return NextResponse.json(
        { error: AUTH_ERROR_MESSAGE.FAIL_AUTH },
        { status: 403 }
      );
    }

    await prisma.scheduleItem.delete({
      where: {
        scheduleId_subCategoryId: {
          scheduleId: Number(scheduleId),
          subCategoryId: Number(subId),
        },
      },
    });

    return NextResponse.json(
      { message: COMMON_MESSAGE.SUCCESS },
      { status: 200 }
    );
  } catch (e: any) {
    console.error("delete schedule item error :", e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
