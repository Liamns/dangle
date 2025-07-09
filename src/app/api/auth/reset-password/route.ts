import { createClient as createAdminClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { COMMON_MESSAGE } from "@/shared/consts/messages";
import prisma from "@/shared/lib/prisma";
import { AUTH_ERROR_MESSAGE } from "@/features/auth/consts";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    // Create a dedicated admin client for this operation
    const supabaseAdmin = createAdminClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data, error } = await supabaseAdmin
      .from("User")
      .select("id")
      .eq("email", email)
      .single();

    const user = await prisma.user.findFirst({
      where: {
        email: email,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: AUTH_ERROR_MESSAGE.UNKNOWN_EMAIL },
        { status: 400 }
      );
    }

    // Update the user's password
    const { error: updateError } =
      await supabaseAdmin.auth.admin.updateUserById(user.id, {
        password: password,
      });

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 400 });
    }

    return NextResponse.json(
      { message: COMMON_MESSAGE.SUCCESS },
      { status: 200 }
    );
  } catch (e: any) {
    console.error(`reset-password error: ${e.message}`);
    return NextResponse.json(
      { error: COMMON_MESSAGE.UNKNOWN_ERROR },
      { status: 500 }
    );
  }
}
