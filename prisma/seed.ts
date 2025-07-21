import { PrismaClient } from "@prisma/client";
import {
  mainCategories,
  subCategoriesByMain,
} from "../src/entities/schedule/types";

const prisma = new PrismaClient();
async function main() {
  console.log("Start seeding ...");

  // 기존 데이터 삭제 (선택적)
  
  await prisma.categorySub.deleteMany({});
  await prisma.categoryMain.deleteMany({});
  console.log("Deleted existing data.");

  // CategoryMain, CategorySub, ScheduleContent 생성
  for (const mainCategoryName of mainCategories) {
    const createdMainCategory = await prisma.categoryMain.create({
      data: {
        name: mainCategoryName,
      },
    });
    console.log(`Created main category: ${createdMainCategory.name}`);

    const subCategoryNames = subCategoriesByMain[mainCategoryName];
    if (subCategoryNames) {
      for (const subCategoryName of subCategoryNames) {
        const createdSubCategory = await prisma.categorySub.create({
          data: {
            name: subCategoryName,
            mainId: createdMainCategory.id,
          },
        });
        console.log(
          `  Created sub category: ${createdSubCategory.name} for ${createdMainCategory.name}`
        );

        
      }
    }
  }

  console.log("Seeding finished.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
