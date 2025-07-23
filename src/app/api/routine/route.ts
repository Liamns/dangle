import { COMMON_MESSAGE } from "@/shared/consts/messages";
import { NextResponse } from "next/server";
import prisma from "@/shared/lib/prisma";
import { NewRoutineWithContents } from "@/entities/routine/schema";

import { v4 as uuidv4 } from "uuid"; // 고유 ID 생성을 위한 uuid 임포트
import { createClient } from "@/shared/lib/supabase/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const profileId = searchParams.get("profileId");

    if (!profileId) {
      return NextResponse.json(
        { error: COMMON_MESSAGE.WRONG_ACCESS },
        { status: 400 }
      );
    }

    const routines = await prisma.routine.findMany({
      where: {
        profileId: profileId,
      },
      include: {
        contents: true,
      },
    });

    if (!routines) {
      return NextResponse.json([], { status: 200 });
    }

    return NextResponse.json(routines, { status: 200 });
  } catch (e: any) {
    console.error("fetch routine error :", e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const supabase = await createClient();
  try {
    const inputData = await req.json();

    if (!inputData) {
      return NextResponse.json(
        { error: COMMON_MESSAGE.WRONG_ACCESS },
        { status: 400 }
      );
    }

    const typed = inputData as NewRoutineWithContents;

    // 각 루틴 콘텐츠의 이미지를 Supabase Storage에 업로드
    const contentsWithUploadedImages = await Promise.all(
      typed.contents.map(async (content) => {
        if (content.image && content.image.startsWith("data:image")) {
          // Base64 데이터 파싱
          const base64Data = content.image.split(",")[1];
          const mimeType = content.image.split(";")[0].split(":")[1];
          const fileExtension = mimeType.split("/")[1];
          console.log("input data", fileExtension);

          const buffer = Buffer.from(base64Data, "base64");
          const fileName = `${uuidv4()}.${fileExtension}`;
          const filePath = `routine/${typed.profileId}/${fileName}`; // Supabase 버킷 내 경로

          const { data, error } = await supabase.storage
            .from("dangle-assets") // 버킷 이름
            .upload(filePath, buffer, {
              contentType: mimeType,
              upsert: false, // 파일이 이미 존재하면 덮어쓰지 않음
            });

          if (error) {
            console.error("Supabase 이미지 업로드 에러:", error);
            throw new Error("이미지 업로드에 실패했습니다.");
          }

          // 업로드된 이미지의 공개 URL 가져오기
          const { data: publicUrlData } = supabase.storage
            .from("dangle-assets")
            .getPublicUrl(filePath);

          return {
            ...content,
            image: publicUrlData.publicUrl, // Base64 대신 공개 URL로 대체
          };
        }
        return content; // 이미지가 없거나 Base64가 아니면 그대로 반환
      })
    );

    await prisma.routine.create({
      data: {
        profileId: typed.profileId,
        name: typed.name,
        category: typed.category,
        type: typed.type,
        contents: {
          createMany: {
            data: contentsWithUploadedImages.map((content) => ({
              title: content.title,
              memo: content.memo,
              image: content.image ?? "", // image 필드가 String? 이면 ?? "" 제거 가능
            })),
          },
        },
      },
    });

    return NextResponse.json(
      { message: COMMON_MESSAGE.SUCCESS },
      { status: 200 }
    );
  } catch (e: any) {
    console.error("add routine error :", e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
