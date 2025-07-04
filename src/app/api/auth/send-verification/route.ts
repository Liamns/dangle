import { NextResponse } from "next/server";
import { Resend } from "resend";
import bcrypt from "bcrypt";
import prisma from "@/shared/lib/prisma";
import { AUTH_ERROR_MESSAGE } from "@/features/auth/consts";
import { COMMON_MESSAGE } from "@/shared/consts/messages";
import { createClient as createSupabaseClient } from "@supabase/supabase-js"; //일반 Supabase 클라이언트
import { createClient as createSSRClient } from "@/shared/lib/supabase/server"; // SSR용 클라이언트 import
import { cookies } from "next/headers";

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
    const supabase = await createSSRClient(); // SSR용 클라이언트 (세션 관리용)

    // 서비스 역할 키를 사용하는 어드민 클라이언트 생성
    const supabaseAdmin = createSupabaseClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY! // ⚠️ 서비스 역할 키 사용
    );

    if (forgot) {
      // 비밀번호 찾기 시: 이메일이 Supabase Auth에 존재하는지 확인 (어드민 권한 사용)
      const { data: userResult, error: userError } = await supabaseAdmin
        .from("User")
        .select("id")
        .eq("email", email)
        .single();

      if (userError || !userResult) {
        return NextResponse.json(
          { error: AUTH_ERROR_MESSAGE.UNKNOWN_EMAIL },
          { status: 400 }
        );
      }
    } else {
      // 회원가입 시: 이메일이 Supabase Auth에 이미 등록되어 있는지 확인
      // signUp 시도 후 에러 메시지를 통해 확인
      const { data, error } = await supabase.auth.signUp({
        email: email,
        password: "temp_password_for_check", // 임시 비밀번호, 실제 사용되지 않음
      });

      if (error) {
        if (error.message === "User already registered") {
          return NextResponse.json(
            { error: AUTH_ERROR_MESSAGE.DUPLICATED },
            { status: 400 }
          );
        } else if (error.code === "over_email_send_rate_limit") {
          return NextResponse.json(
            { error: AUTH_ERROR_MESSAGE.WAIT },
            { status: 400 }
          );
        }
        // 다른 signUp 에러 처리
        return NextResponse.json(
          { error: error.message || COMMON_MESSAGE.UNKNOWN_ERROR },
          { status: 500 }
        );
      }
      // signUp 성공 시, 생성된 유저를 삭제하여 실제 회원가입을 막습니다.
      // 이는 이메일 중복 확인만을 위한 트릭입니다.
      if (data.user) {
        await supabaseAdmin.auth.admin.deleteUser(data.user.id); // 어드민 권한 사용
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
