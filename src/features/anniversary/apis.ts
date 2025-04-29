import { AnniversaryModel } from "@/entities/anniversary/schema";

export async function getAnniversaryList(): Promise<AnniversaryModel[]> {
  try {
    const data = await new Promise<AnniversaryModel[]>((resolve, reject) => {
      setTimeout(() => {
        resolve([]);
      }, 1000);
    });

    return data;
  } catch (e) {
    console.error("Error fetching anniversary list:", e);
    throw e;
  }
}
