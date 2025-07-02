import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import prisma from "@/shared/lib/prisma";

export async function POST(req: Request) {
  try {
    const { email, code } = await req.json();

    if (!email || !code) {
      return NextResponse.json(
        { error: "인증번호를 입력해주세요." },
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
      return NextResponse.json(
        { error: "틀린 인증번호거나 만료된 인증번호 입니다." },
        { status: 400 }
      );
    }

    const isCodeValid = await bcrypt.compare(code, verificationToken.token);

    if (!isCodeValid) {
      return NextResponse.json(
        { error: "틀린 인증번호 입니다." },
        { status: 400 }
      );
    }

    await prisma.verificationToken.delete({
      where: {
        id: verificationToken.id,
      },
    });

    return NextResponse.json(
      { message: "인증에 성공했습니다." },
      { status: 200 }
    );
  } catch (e) {
    console.error(`인증번호 확인 오류 : ${e}`);
    return NextResponse.json(
      { error: "인증번호 확인에 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
