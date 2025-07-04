import { AUTH_ERROR_MESSAGE } from "@/features/auth/consts";
import { COMMON_MESSAGE } from "@/shared/consts/messages";
import { DANGLE_DOMAIN } from "@/shared/consts/strings";
import { createClient } from "@/shared/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { email } = await req.json();
    if (!email) {
      return NextResponse.json(
        { error: AUTH_ERROR_MESSAGE.EMPTY_EMAIL },
        { status: 400 }
      );
    }

    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `http://${DANGLE_DOMAIN}/login/register/pw?forgot=true`,
    });

    if (error) {
      console.error(error);
      return NextResponse.json({ error: error }, { status: 400 });
    }

    return NextResponse.json(
      { message: COMMON_MESSAGE.SUCCESS },
      { status: 200 }
    );
  } catch (e: any) {
    console.error(`password reset request error : ${e.message}`);
    return NextResponse.json(
      { error: COMMON_MESSAGE.UNKNOWN_ERROR },
      { status: 500 }
    );
  }
}
