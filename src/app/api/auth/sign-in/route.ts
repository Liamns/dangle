import prisma from "@/shared/lib/prisma";
import { AUTH_ERROR_MESSAGE } from "@/features/auth/consts";
import { createClient } from "@/shared/lib/supabase/server";
import { NextResponse } from "next/server";
import { error } from "console";
import { COMMON_MESSAGE } from "@/shared/consts/messages";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    if (!email) {
      console.error("/api/auth/sign-in POST", AUTH_ERROR_MESSAGE.EMPTY_EMAIL);
      return NextResponse.json(
        { error: AUTH_ERROR_MESSAGE.EMPTY_EMAIL },
        { status: 400 }
      );
    }
    if (!password) {
      console.error("/api/auth/sign-in POST", AUTH_ERROR_MESSAGE.EMPTY_PW);
      return NextResponse.json(
        { error: AUTH_ERROR_MESSAGE.EMPTY_PW },
        { status: 400 }
      );
    }

    const supabase = await createClient();
    const { data: signIn, error: signInError } =
      await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

    if (signInError) {
      console.error("sign in error :", signInError);
      return NextResponse.json(
        { error: signInError.message },
        { status: signInError.status || 400 }
      );
    }

    const user = await prisma.user.findFirst({
      where: {
        id: signIn.user.id,
      },
    });

    if (!user) {
      console.error("/api/auth/sign-in POST", COMMON_MESSAGE.WRONG_ACCESS);
      return NextResponse.json(
        { error: COMMON_MESSAGE.WRONG_ACCESS },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: COMMON_MESSAGE.SUCCESS, user: user },
      { status: 200 }
    );
  } catch (e: any) {
    console.error(`sign in error : ${e}`);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
