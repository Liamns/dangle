import { ProfileModel } from "@/entities/profile/model";
import { PROFILE_ERROR_MESSAGE } from "@/features/profile/consts";
import { COMMON_MESSAGE } from "@/shared/consts/messages";
import prisma from "@/shared/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: PROFILE_ERROR_MESSAGE.UNKNOWN_USER },
        { status: 400 }
      );
    }

    const profiles = await prisma.profile.findMany({
      where: { userId: userId },
    });

    if (!profiles || profiles.length === 0) {
      return NextResponse.json([], { status: 200 });
    }

    return NextResponse.json(profiles, { status: 200 });
  } catch (e: any) {
    console.error(`fetch profile error: ${e}`);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { profileData } = await req.json();

    if (!profileData.userId) {
      return NextResponse.json(
        { error: COMMON_MESSAGE.WRONG_ACCESS },
        { status: 400 }
      );
    }

    console.log(profileData);

    const newProfile = await prisma.profile.create({
      data: {
        userId: profileData.userId,
        petname: profileData.petname,
        petAge: new Date(profileData.petAge),
        petWeight: profileData.petWeight,
        petSpec: profileData.petSpec,
        petGender: profileData.petGender,
        vaccinations: profileData.vaccinations,
        personalityScores: profileData.personalityScores,
      },
    });

    await prisma.user.update({
      data: { username: profileData.username },
      where: { id: profileData.userId, username: null },
    });

    return NextResponse.json(
      { message: COMMON_MESSAGE.SUCCESS, result: newProfile },
      { status: 200 }
    );
  } catch (e: any) {
    console.error(`register profile error : ${e}`);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
