import { FAVORITE_MESSAGE } from "@/features/favorites/consts";
import { NextResponse } from "next/server";
import prisma from "@/shared/lib/prisma";
import { ROUTINE_MESSAGE } from "@/features/routine/consts";
import { COMMON_MESSAGE } from "@/shared/consts/messages";
import { createClient } from "@/shared/lib/supabase/server";
import { AUTH_ERROR_MESSAGE } from "@/features/auth/consts";

export async function POST(req: Request) {
  try {
    const { routineId, profileId } = await req.json();

    if (!routineId || !profileId) {
      console.error(
        "/api/routine/favorite POST",
        FAVORITE_MESSAGE.TOGGLE_ROUTINE
      );
      return NextResponse.json({ error: FAVORITE_MESSAGE.TOGGLE_ROUTINE });
    }

    const fav = await prisma.routine.findUnique({
      where: {
        id: routineId,
        profileId: profileId,
      },
      select: {
        isFavorite: true,
      },
    });

    if (!fav) {
      console.error(
        "/api/routine/favorite POST",
        ROUTINE_MESSAGE.EMPTY_ROUTINE
      );
      return NextResponse.json(
        { error: ROUTINE_MESSAGE.EMPTY_ROUTINE },
        { status: 400 }
      );
    }

    const newFav = !fav.isFavorite;

    await prisma.routine.update({
      where: {
        id: routineId,
        profileId: profileId,
      },
      data: {
        isFavorite: newFav,
      },
    });

    return NextResponse.json(
      { message: COMMON_MESSAGE.SUCCESS, isFavorite: newFav },
      { status: 200 }
    );
  } catch (e: any) {
    console.error("toggle routine favorite error :", e);
    return NextResponse.json({ error: e.meesage }, { status: 500 });
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
        "/api/routine/favorite GET",
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
        "/api/routine/favorite GET",
        FAVORITE_MESSAGE.EMPTY_PROFILEID
      );
      return NextResponse.json({ error: FAVORITE_MESSAGE.EMPTY_PROFILEID });
    }

    const { searchParams } = new URL(req.url);
    const getId = searchParams.get("profileId");

    const profileId = profiles.find((p) => p.id === getId)?.id;

    if (!profileId) {
      console.error(
        "/api/routine/favorite GET",
        FAVORITE_MESSAGE.EMPTY_PROFILEID
      );
      return NextResponse.json({ error: FAVORITE_MESSAGE.EMPTY_PROFILEID });
    }

    const result = await prisma.routine.findMany({
      where: {
        profileId: profileId,
        isFavorite: true,
      },
      include: {
        contents: true,
      },
    });

    return NextResponse.json(result, { status: 200 });
  } catch (e: any) {
    console.error("fetch schedule favorite error", e);
    return NextResponse.json({ error: e }, { status: 500 });
  }
}
