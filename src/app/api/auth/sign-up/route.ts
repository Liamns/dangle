import { createClient } from "@/shared/lib/supabase/server"; // 서버용 클라이언트 생성
import { NextResponse } from "next/server";
import prisma from "@/shared/lib/prisma";
import { COMMON_MESSAGE } from "@/shared/consts/messages";

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { email, password } = await req.json();

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    if (data.user) {
      // Supabase Auth에 생성된 user.id와 동일한 id로 Public User 테이블에 데이터 추가
      await prisma.user.create({
        data: {
          id: data.user.id,
          email: data.user.email!,
        },
      });
    }

    return NextResponse.json({ user: data.user, session: data.session });
  } catch (e: any) {
    console.error(`sign-up error : ${e.message}`);
    return NextResponse.json(
      { error: COMMON_MESSAGE.UNKNOWN_ERROR },
      { status: 500 }
    );
  }
}
