import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import prisma from "@/shared/lib/prisma";
import { AUTH_ERROR_MESSAGE } from "@/features/auth/consts";
import { COMMON_MESSAGE } from "@/shared/consts/messages";

export async function POST(req: Request) {
  try {
    const { email, code } = await req.json();

    if (!email || !code) {
      console.error(
        "comfirm-verification error",
        AUTH_ERROR_MESSAGE.EMPTY_CODE
      );
      return NextResponse.json(
        { error: AUTH_ERROR_MESSAGE.EMPTY_CODE },
        { status: 400 }
      );
    }

    const verificationToken = await prisma.verificationToken.findFirst({
      where: {
        identifier: email,
      },
      orderBy: {
        expires: "desc",
      },
    });

    if (!verificationToken || new Date() > verificationToken.expires) {
      console.error(
        "/api/auth/confirm-verification POST",
        AUTH_ERROR_MESSAGE.EMPTY_CODE
      );
      return NextResponse.json(
        { error: AUTH_ERROR_MESSAGE.EMPTY_CODE },
        { status: 400 }
      );
    }

    const isCodeValid = await bcrypt.compare(code, verificationToken.token);

    if (!isCodeValid) {
      console.error(
        "/api/auth/confirm-verification POST",
        AUTH_ERROR_MESSAGE.WRONG_CODE
      );
      return NextResponse.json(
        { error: AUTH_ERROR_MESSAGE.WRONG_CODE },
        { status: 400 }
      );
    }

    await prisma.verificationToken.delete({
      where: {
        id: verificationToken.id,
      },
    });

    return NextResponse.json(
      { message: COMMON_MESSAGE.SUCCESS },
      { status: 200 }
    );
  } catch (e) {
    console.error(`인증번호 확인 오류 : ${e}`);
    return NextResponse.json(
      { error: COMMON_MESSAGE.UNKNOWN_ERROR },
      { status: 500 }
    );
  }
}
