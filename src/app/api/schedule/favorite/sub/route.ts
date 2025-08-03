import { COMMON_MESSAGE } from "@/shared/consts/messages";
import { NextResponse } from "next/server";
import prisma from "@/shared/lib/prisma";

export async function POST(req: Request) {
  try {
    const { profileId, subIds } = await req.json();

    if (!profileId || !subIds || !Array.isArray(subIds)) {
      console.error(
        "/api/schedule/favorite/sub POST",
        COMMON_MESSAGE.WRONG_ACCESS
      );
      return NextResponse.json(
        { error: COMMON_MESSAGE.WRONG_ACCESS },
        { status: 400 }
      );
    }

    const favoriteSubCategories = await prisma.favoriteSubCategory.findMany({
      where: {
        profileId: profileId,
        subCategoryId: {
          in: subIds,
        },
      },
      select: {
        subCategoryId: true,
      },
    });

    const favoriteSubCategoryIds = favoriteSubCategories.map(
      (fav) => fav.subCategoryId
    );

    return NextResponse.json(favoriteSubCategoryIds, { status: 200 });
  } catch (e: any) {
    console.error("fetch subcategory is favorite error :", e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
