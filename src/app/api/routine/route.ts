import { COMMON_MESSAGE } from "@/shared/consts/messages";
import { NextResponse } from "next/server";
import prisma from "@/shared/lib/prisma";
import {
  NewRoutineWithContents,
  UpdateRoutineWithContents,
} from "@/entities/routine/schema";

import { v4 as uuidv4 } from "uuid"; // 고유 ID 생성을 위한 uuid 임포트
import { createClient } from "@/shared/lib/supabase/server";
import { uploadRoutineImage } from "@/shared/lib/supabase";

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

export async function PATCH(req: Request) {
  const supabase = await createClient();

  try {
    const inputData: UpdateRoutineWithContents = await req.json();
    const {
      id: routineId,
      contents: updatedContents,
      ...routineData
    } = inputData;

    if (!routineId) {
      return NextResponse.json(
        { error: COMMON_MESSAGE.WRONG_ACCESS },
        { status: 400 }
      );
    }

    const result = await prisma.$transaction(async (tx) => {
      // 1. 기존 루틴과 콘텐츠 ID 목록 가져오기
      const existingRoutine = await tx.routine.findUnique({
        where: { id: routineId },
        include: { contents: { select: { id: true, image: true } } },
      });

      if (!existingRoutine) {
        throw new Error("Routine not found");
      }

      const existingContentIds = existingRoutine.contents.map((c) => c.id);
      const updatedContentIds = updatedContents
        .map((c) => c.id)
        .filter(Boolean) as number[];

      // 2. 삭제할 콘텐츠, 수정할 콘텐츠, 생성할 콘텐츠 분류
      const contentsToDeleteIds = existingContentIds.filter(
        (id) => !updatedContentIds.includes(id)
      );
      const contentsToUpdate = updatedContents.filter(
        (c) => c.id && existingContentIds.includes(c.id)
      );
      const contentsToCreate = updatedContents.filter((c) => !c.id);

      // 3. 이미지 처리 및 데이터 준비
      const processedContentsToUpdate = await Promise.all(
        contentsToUpdate.map(async (content) => {
          if (content.image && content.image.startsWith("data:image")) {
            // 기존 이미지 삭제
            const oldImage = existingRoutine.contents.find(
              (c) => c.id === content.id
            )?.image;
            if (oldImage) {
              const oldImagePath = oldImage.split("/").slice(-3).join("/"); // 'routine/profileId/filename.ext'
              await supabase.storage
                .from("dangle-assets")
                .remove([oldImagePath]);
            }

            // 새 이미지 업로드
            const { publicUrl } = await uploadRoutineImage(
              supabase,
              content.image,
              existingRoutine.profileId
            );
            return { ...content, image: publicUrl };
          }
          return content;
        })
      );

      const processedContentsToCreate = await Promise.all(
        contentsToCreate.map(async (content) => {
          if (content.image && content.image.startsWith("data:image")) {
            const { publicUrl } = await uploadRoutineImage(
              supabase,
              content.image,
              existingRoutine.profileId
            );
            return { ...content, image: publicUrl };
          }
          return content;
        })
      );

      // 4. 삭제될 콘텐츠의 이미지들을 스토리지에서 제거
      const imagesToDelete = existingRoutine.contents
        .filter((c) => contentsToDeleteIds.includes(c.id) && c.image)
        .map((c) => c.image!.split("/").slice(-3).join("/"));

      if (imagesToDelete.length > 0) {
        await supabase.storage.from("dangle-assets").remove(imagesToDelete);
      }

      // 5. 데이터베이스 작업 실행
      // 5-1. 기본 루틴 정보 업데이트
      await tx.routine.update({
        where: { id: routineId },
        data: {
          ...routineData,
        },
      });

      // 5-2. 콘텐츠 삭제
      if (contentsToDeleteIds.length > 0) {
        await tx.routineContent.deleteMany({
          where: { id: { in: contentsToDeleteIds } },
        });
      }

      // 5-3. 콘텐츠 수정
      if (processedContentsToUpdate.length > 0) {
        await Promise.all(
          processedContentsToUpdate.map((content) =>
            tx.routineContent.update({
              where: { id: content.id },
              data: {
                title: content.title,
                memo: content.memo,
                image: content.image ?? "",
              },
            })
          )
        );
      }

      // 5-4. 콘텐츠 생성
      if (processedContentsToCreate.length > 0) {
        await tx.routineContent.createMany({
          data: processedContentsToCreate.map((content) => ({
            routineId: routineId,
            title: content.title,
            memo: content.memo,
            image: content.image ?? "",
          })),
        });
      }

      return { message: COMMON_MESSAGE.SUCCESS };
    });

    return NextResponse.json(result, { status: 200 });
  } catch (e: any) {
    console.error("patch routine error :", e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
