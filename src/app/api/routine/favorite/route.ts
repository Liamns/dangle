import { FAVORITE_MESSAGE } from "@/features/favorites/consts";
import { NextResponse } from "next/server";
import prisma from "@/shared/lib/prisma";
import { ROUTINE_MESSAGE } from "@/features/routine/consts";
import { COMMON_MESSAGE } from "@/shared/consts/messages";

export async function POST(req: Request) {
  try {
    const { routineId, profileId } = await req.json();

    if (!routineId || !profileId) {
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
