import { createClient } from "@supabase/supabase-js";
import { v4 as uuidv4 } from "uuid"; // 고유 ID 생성을 위한 uuid 임포트

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export function getPublicImageUrl(path: string) {
  return supabase.storage.from("dangle-assets").getPublicUrl(path).data
    .publicUrl;
}

export async function uploadRoutineImage(
  supabase: any,
  image: string,
  profileId: string
) {
  const base64Data = image.split(",")[1];
  const mimeType = image.split(";")[0].split(":")[1];
  const fileExtension = mimeType.split("/")[1];
  const buffer = Buffer.from(base64Data, "base64");
  const fileName = `${uuidv4()}.${fileExtension}`;
  const filePath = `routine/${profileId}/${fileName}`;

  const { error } = await supabase.storage
    .from("dangle-assets")
    .upload(filePath, buffer, {
      contentType: mimeType,
      upsert: false,
    });

  if (error) {
    console.error("Supabase image upload error:", error);
    throw new Error("Image upload failed.");
  }

  const { data: publicUrlData } = supabase.storage
    .from("dangle-assets")
    .getPublicUrl(filePath);

  return { publicUrl: publicUrlData.publicUrl };
}
