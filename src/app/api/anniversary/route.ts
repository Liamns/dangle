import { COMMON_MESSAGE } from "@/shared/consts/messages";
import { NextResponse } from "next/server";
import prisma from "@/shared/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      console.error("/api/anniversary GET", COMMON_MESSAGE.UNKNOWN_USER);
      return NextResponse.json(
        { error: COMMON_MESSAGE.UNKNOWN_USER },
        { status: 400 }
      );
    }

    const annivsaries = await prisma.anniversary.findMany({
      where: { userId: userId },
    });

    if (!annivsaries || annivsaries.length === 0) {
      return NextResponse.json([], { status: 200 });
    }

    return NextResponse.json(annivsaries, { status: 200 });
  } catch (e: any) {
    console.error(`fetch anniv error: ${e}`);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { inputData } = await req.json();

    if (!inputData || !inputData.userId) {
      console.error("/api/anniversary POST", COMMON_MESSAGE.WRONG_ACCESS);
      return NextResponse.json(
        { error: COMMON_MESSAGE.WRONG_ACCESS },
        { status: 400 }
      );
    }

    const result = await prisma.anniversary.create({
      data: {
        userId: inputData.userId,
        content: inputData.content,
        icon: inputData.icon,
        date: inputData.date,
      },
    });

    return NextResponse.json(
      { message: COMMON_MESSAGE.SUCCESS, result: result },
      { status: 200 }
    );
  } catch (e: any) {
    console.error(`register anniv error : ${e}`);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const { inputData } = await req.json();

    if (!inputData || !inputData.id) {
      console.error("/api/anniversary PATCH", COMMON_MESSAGE.WRONG_ACCESS);
      return NextResponse.json(
        { error: COMMON_MESSAGE.WRONG_ACCESS },
        { status: 400 }
      );
    }

    const result = await prisma.anniversary.update({
      where: { id: inputData.id },
      data: {
        content: inputData.content,
        icon: inputData.icon,
        date: inputData.date,
      },
    });

    return NextResponse.json(
      { message: COMMON_MESSAGE.SUCCESS, result: result },
      { status: 200 }
    );
  } catch (e: any) {
    console.error(`update anniv error: ${e}`);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
