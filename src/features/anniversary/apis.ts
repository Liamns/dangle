import { AnniversaryModel } from "@/entities/anniversary/schema";
import { TestUUID } from "@/shared/consts/strings";

export async function getAnniversaryList(): Promise<AnniversaryModel[]> {
  try {
    const data = await new Promise<AnniversaryModel[]>((resolve, reject) => {
      setTimeout(() => {
        // reject(new Error("Failed to fetch data"));
        resolve([
          {
            id: 1,
            userId: TestUUID[0],
            content: "결혼기념일",
            icon: 0,
            date: new Date("2023-10-01"),
            isDday: true,
            createdAt: new Date("2023-10-01"),
            updatedAt: new Date("2023-10-03"),
          },
          {
            id: 2,
            userId: TestUUID[0],
            content: "생일",
            icon: 1,
            date: new Date("2023-12-25"),
            isDday: false,
            createdAt: new Date("2023-10-01"),
            updatedAt: new Date("2023-10-05"),
          },
          {
            id: 3,
            userId: TestUUID[0],
            content: "반려동물 입양일",
            icon: 2,
            date: new Date("2024-03-15"),
            isDday: true,
            createdAt: new Date("2024-02-10"),
            updatedAt: new Date("2024-02-15"),
          },
          {
            id: 4,
            userId: TestUUID[0],
            content: "직장 입사일",
            icon: 1,
            date: new Date("2023-07-10"),
            isDday: false,
            createdAt: new Date("2023-07-10"),
            updatedAt: new Date("2023-08-01"),
          },
          {
            id: 5,
            userId: TestUUID[0],
            content: "집들이 기념일",
            icon: 0,
            date: new Date("2024-05-20"),
            isDday: true,
            createdAt: new Date("2024-04-15"),
            updatedAt: new Date("2024-04-15"),
          },
        ]);
        // resolve([]);
      }, 1000);
    });

    return data;
  } catch (e) {
    console.error("Error fetching anniversary list:", e);
    throw e;
  }
}
