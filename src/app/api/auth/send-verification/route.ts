import { NextResponse } from "next/server";
import { Resend } from "resend";
import bcrypt from "bcrypt";
import prisma from "@/shared/lib/prisma";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    console.log(email);

    if (!email) {
      return NextResponse.json(
        { error: "이메일을 입력해주세요." },
        { status: 400 }
      );
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
  } catch (e) {
    console.error(`이메일 발송 오류 : ${e}`);
    return NextResponse.json(
      { error: "에러가 발생했습니다." },
      { status: 500 }
    );
  }
}
