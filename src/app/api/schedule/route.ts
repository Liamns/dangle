import { PROFILE_ERROR_MESSAGE } from "@/features/profile/consts";
import { COMMON_MESSAGE } from "@/shared/consts/messages";
import { NextResponse } from "next/server";
import prisma from "@/shared/lib/prisma";
import { SubCategory } from "@/entities/schedule/types";
import {
  NewScheduleItem,
  ScheduleItemWithSubCategoryModel,
} from "@/entities/schedule/model";
import { SCHEDULE_MESSAGE } from "@/features/schedule/consts";

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
    console.log(`input data : ${inputData}`);
    console.log(`profile id : ${profileId}`);
    console.log(`date: ${date}`);
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

    for (const [key, value] of Object.entries(typedData)) {
      if (!Boolean(value.startAt)) {
        return NextResponse.json(
          { error: SCHEDULE_MESSAGE.EMPTY_START_AT },
          { status: 400 }
        );
      }
      if (value.subCategory === null || value.subCategory.id === undefined) {
        return NextResponse.json(
          { error: COMMON_MESSAGE.WRONG_ACCESS },
          { status: 400 }
        );
      }
    }

    await prisma.$transaction(async (tx) => {
      const schedule = await tx.schedule.create({
        data: {
          profileId: profileId,
          date: new Date(date),
        },
      });

      for (const [key, value] of Object.entries(typedData)) {
        console.log(`${key} 진행 중`);

        await tx.scheduleItem.create({
          data: {
            subCategoryId: value.subCategory.id,
            scheduleId: schedule.id,
            startAt: new Date(value.startAt!),
          },
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
