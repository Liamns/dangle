import { FavoriteScheduleFormData } from "@/entities/schedule/schema";
import { COMMON_MESSAGE } from "@/shared/consts/messages";
import { NextResponse } from "next/server";
import prisma from "@/shared/lib/prisma";
import { ROUTINE_MESSAGE } from "@/features/routine/consts";
import { FAVORITE_MESSAGE } from "@/features/favorites/consts";
import { createClient } from "@/shared/lib/supabase/server";
import { AUTH_ERROR_MESSAGE } from "@/features/auth/consts";
import { SCHEDULE_MESSAGE } from "@/features/schedule/consts";

export async function POST(req: Request) {
  try {
    const data: FavoriteScheduleFormData = await req.json();
    const { id, alias, icon } = data;

    if (!data) {
      console.error(
        "/api/schedule/favorite POST",
        COMMON_MESSAGE.WRONG_ACCESS
      );
      return NextResponse.json(
        { error: COMMON_MESSAGE.WRONG_ACCESS },
        { status: 400 }
      );
    }

    const existingSchedule = await prisma.schedule.findUnique({
      where: {
        id: id,
      },
      select: {
        isFavorite: true,
      },
    });

    if (!existingSchedule) {
      console.error(
        "/api/schedule/favorite POST",
        ROUTINE_MESSAGE.EMPTY_ROUTINE
      );
      return NextResponse.json(
        { error: ROUTINE_MESSAGE.EMPTY_ROUTINE },
        { status: 404 }
      );
    }

    const currentFavorite = existingSchedule.isFavorite;
    let updateData;

    if (currentFavorite) {
      updateData = {
        isFavorite: false,
        alias: null,
        icon: null,
      };
    } else {
      if (!alias || !icon) {
        console.error(
          "/api/schedule/favorite POST",
          FAVORITE_MESSAGE.EMPTY_SCHEDULE_DATA
        );
        return NextResponse.json(
          { error: FAVORITE_MESSAGE.EMPTY_SCHEDULE_DATA },
          { status: 400 }
        );
      }
      updateData = {
        isFavorite: true,
        alias: alias,
        icon: icon,
      };
    }
    const updateSchedule = await prisma.schedule.update({
      where: { id: id },
      data: updateData,
    });

    return NextResponse.json(updateSchedule, { status: 200 });
  } catch (e: any) {
    console.error("toggle schedule favorite error :", e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function GET(req: Request) {
  const supabase = await createClient();
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      console.error(
        "/api/schedule/favorite GET",
        AUTH_ERROR_MESSAGE.FAIL_AUTH
      );
      return NextResponse.json(
        { error: AUTH_ERROR_MESSAGE.FAIL_AUTH },
        { status: 401 }
      );
    }

    const profiles = await prisma.profile.findMany({
      where: {
        userId: user.id,
      },
      select: {
        id: true,
      },
    });

    if (!profiles) {
      console.error(
        "/api/schedule/favorite GET",
        FAVORITE_MESSAGE.EMPTY_PROFILEID
      );
      return NextResponse.json({ error: FAVORITE_MESSAGE.EMPTY_PROFILEID });
    }

    const { searchParams } = new URL(req.url);
    const getId = searchParams.get("profileId");

    const profileId = profiles.find((p) => p.id === getId)?.id;

    if (!profileId) {
      console.error(
        "/api/schedule/favorite GET",
        FAVORITE_MESSAGE.EMPTY_PROFILEID
      );
      return NextResponse.json({ error: FAVORITE_MESSAGE.EMPTY_PROFILEID });
    }

    const result = await prisma.schedule.findMany({
      where: {
        profileId: profileId,
        isFavorite: true,
      },
      include: {
        items: true,
      },
    });

    return NextResponse.json(result, { status: 200 });
  } catch (e: any) {
    console.error("fetch schedule favorite error", e);
    return NextResponse.json({ error: e }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const { id, alias, icon }: { id: number; alias: string; icon: number } =
      await req.json();

    if (isNaN(id) || !alias || isNaN(icon)) {
      console.error(
        "/api/schedule/favorite PATCH",
        FAVORITE_MESSAGE.EMPTY_SCHEDULE_DATA
      );
      return NextResponse.json(
        { error: FAVORITE_MESSAGE.EMPTY_SCHEDULE_DATA },
        { status: 400 }
      );
    }

    const update = await prisma.schedule.update({
      where: {
        id: id,
      },
      data: {
        alias: alias,
        icon: icon,
      },
    });

    return NextResponse.json(update, { status: 200 });
  } catch (e: any) {
    console.error("patch schedule favorite error", e);
    return NextResponse.json({ error: e }, { status: 500 });
  }
}
