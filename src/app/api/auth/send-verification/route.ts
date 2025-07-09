import { NextResponse } from "next/server";
import { Resend } from "resend";
import bcrypt from "bcrypt";
import prisma from "@/shared/lib/prisma";
import { AUTH_ERROR_MESSAGE } from "@/features/auth/consts";
import { COMMON_MESSAGE } from "@/shared/consts/messages";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { email, forgot } = await req.json();

    if (!email) {
      return NextResponse.json(
        { error: AUTH_ERROR_MESSAGE.EMPTY_EMAIL },
        { status: 400 }
      );
    }

    const user = await prisma.user.findFirst({
      where: {
        email: email,
      },
    });
    if (forgot) {
      if (!user) {
        return NextResponse.json(
          { error: AUTH_ERROR_MESSAGE.UNKNOWN_EMAIL },
          { status: 400 }
        );
      }
    } else {
      if (user) {
        return NextResponse.json(
          { error: AUTH_ERROR_MESSAGE.DUPLICATED },
          { status: 400 }
        );
      }
    }

    const verificationCode: number = Math.floor(
      100000 + Math.random() * 900000
    );

    // 2. 인증번호 해싱
    const saltRounds = 11;
    const hashedCode = await bcrypt.hash(
      verificationCode.toString(),
      saltRounds
    );

    // 3. 토큰 만료 시간 설정 (예: 10분 후)
    const expires = new Date(new Date().getTime() + 10 * 60 * 1000);

    await prisma.verificationToken.deleteMany({
      where: { identifier: email },
    });
    await prisma.verificationToken.create({
      data: {
        identifier: email,
        token: hashedCode,
        expires,
      },
    });

    await resend.emails.send({
      from: "Dangle <onboarding@resend.dev>",
      to: email,
      subject: "댕글 이메일 인증번호 입니다.",
      html: `<p>인증번호 : <strong>${verificationCode}</strong></p><p>10분 안에 번호를 입력해주세요.</p>`,
    });

    return NextResponse.json({ message: "인증번호 발송완료" }, { status: 200 });
  } catch (e: any) {
    console.error(`이메일 발송 오류 : ${e.message}`);
    return NextResponse.json(
      { error: COMMON_MESSAGE.UNKNOWN_ERROR },
      { status: 500 }
    );
  }
}
