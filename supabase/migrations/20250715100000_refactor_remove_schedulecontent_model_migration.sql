-- DropForeignKey
ALTER TABLE "ScheduleContent" DROP CONSTRAINT "ScheduleContent_subId_fkey";

-- DropForeignKey
ALTER TABLE "ScheduleItem" DROP CONSTRAINT "ScheduleItem_contentId_fkey";

-- AlterTable
ALTER TABLE "ScheduleItem" DROP COLUMN "contentId",
ADD COLUMN     "subCategoryId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "ScheduleContent";

-- AddForeignKey
ALTER TABLE "ScheduleItem" ADD CONSTRAINT "ScheduleItem_subCategoryId_fkey" FOREIGN KEY ("subCategoryId") REFERENCES "CategorySub"("id") ON DELETE RESTRICT ON UPDATE CASCADE;